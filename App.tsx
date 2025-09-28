import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import PolicyList from './components/PolicyList';
import PolicyDetail from './components/PolicyDetail';
import LoginModal from './components/LoginModal';
import AddPolicyModal from './components/AddPolicyModal';
import LiveSyncModal from './components/LiveSyncModal';
import { INITIAL_POLICIES } from './constants';
import { STATIC_POLICIES } from './staticPolicies';
import { type Policy, type SyncStatus } from './types';
import { generatePolicyContent } from './services/geminiService';

const App: React.FC = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [policyContent, setPolicyContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStaticContent, setIsStaticContent] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showAddPolicyModal, setShowAddPolicyModal] = useState<boolean>(false);
  const [showLiveSyncModal, setShowLiveSyncModal] = useState<boolean>(false);
  
  const [editedContentCache, setEditedContentCache] = useState<Map<number, string>>(new Map());
  const [isExportingJson, setIsExportingJson] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [isExportingSingleJson, setIsExportingSingleJson] = useState<number | null>(null);

  const [syncStatus, setSyncStatus] = useState<SyncStatus>('not-connected');
  const [syncUrl, setSyncUrl] = useState<string>('');


  useEffect(() => {
    // Initialize policies with an ID
    const policiesWithIds = INITIAL_POLICIES.map((name, index) => ({
      id: index + 1,
      name: name,
    }));
    setPolicies(policiesWithIds.sort((a, b) => a.name.localeCompare(b.name)));
  }, []);

  const getPolicyContent = useCallback(async (policy: Policy): Promise<string> => {
    if (editedContentCache.has(policy.id)) {
        return editedContentCache.get(policy.id)!;
    }
    if (STATIC_POLICIES.has(policy.name)) {
        return STATIC_POLICIES.get(policy.name)!;
    }
    try {
        return await generatePolicyContent(policy.name);
    } catch (err) {
        console.error(`Failed to generate content for ${policy.name}`, err);
        return `Error: Could not generate content for this policy.`;
    }
  }, [editedContentCache]);

  const handleSelectPolicy = useCallback(async (policy: Policy) => {
    if (selectedPolicy?.id === policy.id && policyContent && !editedContentCache.has(policy.id)) {
      return;
    }

    setSelectedPolicy(policy);
    setIsLoading(true);
    setError(null);
    setPolicyContent('');

    // 1. Check for user-edited content first
    if (editedContentCache.has(policy.id)) {
        setPolicyContent(editedContentCache.get(policy.id)!);
        setIsStaticContent(false); // Treat edited content as dynamic markdown
        setIsLoading(false);
        return;
    }

    // 2. Check for hardcoded static policies
    const staticContent = STATIC_POLICIES.get(policy.name);
    if (staticContent) {
      setPolicyContent(staticContent);
      setIsStaticContent(true);
      setIsLoading(false);
      return;
    }
    
    // 3. Fallback to generating content via AI
    setIsStaticContent(false);
    try {
      const content = await generatePolicyContent(policy.name);
      setPolicyContent(content);
    } catch (err) {
      console.error(err);
      setError('Failed to generate policy content. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedPolicy, policyContent, editedContentCache]);

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAdmin(true);
    }
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  const handleAddNewPolicy = (policyName: string) => {
    if (policyName.trim()) {
        const newPolicy: Policy = {
            id: policies.length > 0 ? Math.max(...policies.map(p => p.id)) + 1 : 1,
            name: policyName.trim(),
        };
        setPolicies(prevPolicies => [...prevPolicies, newPolicy].sort((a, b) => a.name.localeCompare(b.name)));
        setShowAddPolicyModal(false);
        // Automatically select and generate the new policy
        handleSelectPolicy(newPolicy);
    }
  };

  const handleSavePolicyContent = (policyId: number, newContent: string) => {
    const newCache = new Map(editedContentCache);
    newCache.set(policyId, newContent);
    setEditedContentCache(newCache);
    setPolicyContent(newContent); // Update view immediately
  };

  const triggerDownload = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleExportAllJson = async () => {
    setIsExportingJson(true);
    const sortedPolicies = [...policies].sort((a, b) => a.name.localeCompare(b.name));
    const exportData = [];

    for (const policy of sortedPolicies) {
        const content = await getPolicyContent(policy);
        exportData.push({
            id: policy.id,
            name: policy.name,
            content: content
        });
    }

    triggerDownload('it_policies_export.json', JSON.stringify(exportData, null, 2), 'application/json');
    setIsExportingJson(false);
  };

  const handleExportSingleJson = async (policyId: number) => {
    const policy = policies.find(p => p.id === policyId);
    if (!policy) return;

    setIsExportingSingleJson(policy.id);
    const content = await getPolicyContent(policy);
    const exportData = {
        id: policy.id,
        name: policy.name,
        content: content
    };

    const filename = `${policy.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_policy.json`;
    triggerDownload(filename, JSON.stringify(exportData, null, 2), 'application/json');
    setIsExportingSingleJson(null);
  };


  const handleImportJsonFile = (file: File) => {
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = (event) => {
        try {
            const text = event.target?.result as string;
            if (!text) {
                throw new Error("File is empty.");
            }
            const data = JSON.parse(text);

            if (!Array.isArray(data) || !data.every(item => 'id' in item && 'name' in item && 'content' in item)) {
              throw new Error('Invalid JSON format. Expected an array of objects with id, name, and content.');
            }
            
            const importedPolicies: (Policy & { content: string })[] = data;
            
            const newCache = new Map(editedContentCache);
            let updatedPolicies = [...policies];
            let maxId = updatedPolicies.length > 0 ? Math.max(...updatedPolicies.map(p => p.id)) : 0;

            importedPolicies.forEach(importedPolicy => {
                const existingPolicyIndex = updatedPolicies.findIndex(p => p.id === importedPolicy.id);

                if (existingPolicyIndex > -1) {
                    // Policy exists, update it
                    updatedPolicies[existingPolicyIndex] = {
                        id: importedPolicy.id,
                        name: importedPolicy.name,
                    };
                } else {
                    // New policy, add it, ensuring ID is unique
                    const newId = updatedPolicies.some(p => p.id === importedPolicy.id) ? ++maxId : importedPolicy.id;
                    updatedPolicies.push({ id: newId, name: importedPolicy.name });
                    if (newId > maxId) maxId = newId;
                }
                // Update cache for both new and existing
                newCache.set(importedPolicy.id, importedPolicy.content);
            });

            setPolicies(updatedPolicies.sort((a, b) => a.name.localeCompare(b.name)));
            setEditedContentCache(newCache);
            alert(`Import successful: ${importedPolicies.length} policies were processed.`);

        } catch (e) {
            console.error("Import failed:", e);
            alert(`Import failed: ${e instanceof Error ? e.message : 'An unknown error occurred.'}`);
        } finally {
            setIsImporting(false);
        }
    };

    reader.onerror = () => {
        alert('Error reading the file.');
        setIsImporting(false);
    };

    reader.readAsText(file);
  };

  const handleSync = async (url: string) => {
    setSyncStatus('connecting');
    setSyncUrl(url);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        const data = await response.json();

        if (!Array.isArray(data) || !data.every(item => 'id' in item && 'name' in item && 'content' in item)) {
          throw new Error('Invalid JSON format. Expected an array of objects with id, name, and content.');
        }

        const newPolicies: Policy[] = data.map(item => ({ id: item.id, name: item.name }));
        const newCache = new Map<number, string>();
        data.forEach(item => {
            newCache.set(item.id, item.content);
        });

        setPolicies(newPolicies.sort((a, b) => a.name.localeCompare(b.name)));
        setEditedContentCache(newCache);
        setSelectedPolicy(null); // Deselect current policy
        setPolicyContent(''); // Clear content panel
        setSyncStatus('connected');
        setShowLiveSyncModal(false);

    } catch (error) {
        console.error('Sync failed:', error);
        setSyncStatus('failed');
        // Do not clear the URL, so the user can retry
        throw error; // Rethrow to be caught in the modal
    }
  };

  const handleDisconnect = () => {
    setSyncUrl('');
    setSyncStatus('not-connected');
  };

  return (
    <>
      <div className="flex h-screen text-textPrimary font-sans antialiased overflow-hidden p-4 gap-4">
        <aside className="w-1/3 max-w-sm flex-shrink-0">
          <PolicyList
            policies={policies}
            selectedPolicyId={selectedPolicy?.id}
            onSelectPolicy={handleSelectPolicy}
            isAdmin={isAdmin}
            onAddPolicyClick={() => setShowAddPolicyModal(true)}
            onImportJsonFile={handleImportJsonFile}
            isImporting={isImporting}
            onExportAllJson={handleExportAllJson}
            isExportingJson={isExportingJson}
            onLiveSyncClick={() => setShowLiveSyncModal(true)}
            syncStatus={syncStatus}
          />
        </aside>
        <div className="flex flex-col flex-grow">
          <div className="flex flex-col flex-grow bg-surface rounded-xl overflow-hidden border border-border shadow-sm">
            <Header
              isAdmin={isAdmin}
              onLoginClick={() => setShowLoginModal(true)}
              onLogout={handleLogout}
            />
            <main className="flex-grow p-6 md:p-8 lg:p-10 overflow-y-auto">
              <PolicyDetail
                policy={selectedPolicy}
                content={policyContent}
                isLoading={isLoading}
                isStaticContent={isStaticContent}
                error={error}
                isAdmin={isAdmin}
                onSave={handleSavePolicyContent}
                onExportSingleJson={handleExportSingleJson}
                isExportingSingleJson={isExportingSingleJson === selectedPolicy?.id}
              />
            </main>
            <Footer />
          </div>
        </div>
      </div>
      {showLoginModal && <LoginModal onLogin={handleLogin} onClose={() => setShowLoginModal(false)} />}
      {showAddPolicyModal && <AddPolicyModal onAdd={handleAddNewPolicy} onClose={() => setShowAddPolicyModal(false)} />}
      {showLiveSyncModal && (
        <LiveSyncModal
            onClose={() => setShowLiveSyncModal(false)}
            onSync={handleSync}
            onDisconnect={handleDisconnect}
            syncStatus={syncStatus}
            syncUrl={syncUrl}
        />
      )}
    </>
  );
};

export default App;
