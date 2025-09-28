import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import PolicyList from './components/PolicyList';
import PolicyDetail from './components/PolicyDetail';
import LoginModal from './components/LoginModal';
import AddPolicyModal from './components/AddPolicyModal';
import { INITIAL_POLICIES } from './constants';
import { STATIC_POLICIES } from './staticPolicies';
import { type Policy } from './types';
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
  const [editedContentCache, setEditedContentCache] = useState<Map<number, string>>(new Map());
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [isExportingSingle, setIsExportingSingle] = useState<number | null>(null);


  useEffect(() => {
    // Initialize policies with an ID
    const policiesWithIds = INITIAL_POLICIES.map((name, index) => ({
      id: index + 1,
      name: name,
    }));
    setPolicies(policiesWithIds.sort((a, b) => a.name.localeCompare(b.name)));
  }, []);

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

  const handleExportAll = async () => {
    setIsExporting(true);
    let fullExportContent = `IT Policies Export - ${new Date().toLocaleString()}\n\n`;

    // Use a sorted list for the export
    const sortedPolicies = [...policies].sort((a, b) => a.name.localeCompare(b.name));

    for (const policy of sortedPolicies) {
        let content = '';
        if (editedContentCache.has(policy.id)) {
            content = editedContentCache.get(policy.id)!;
        } else if (STATIC_POLICIES.has(policy.name)) {
            content = STATIC_POLICIES.get(policy.name)!;
        } else {
            try {
                content = await generatePolicyContent(policy.name);
            } catch (err) {
                console.error(`Failed to generate content for ${policy.name}`, err);
                content = `Error: Could not generate content for this policy.`;
            }
        }
        fullExportContent += `========================================\n`;
        fullExportContent += `POLICY: ${policy.name}\n`;
        fullExportContent += `========================================\n\n`;
        fullExportContent += `${content.trim()}\n\n\n`;
    }

    const blob = new Blob([fullExportContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'it_policies_export.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    
    setIsExporting(false);
  };

   const handleExportSingle = async (policyId: number) => {
    const policy = policies.find(p => p.id === policyId);
    if (!policy) return;

    setIsExportingSingle(policy.id);

    let content = '';
    let fullExportContent = `========================================\n`;
    fullExportContent += `POLICY: ${policy.name}\n`;
    fullExportContent += `========================================\n\n`;

    if (editedContentCache.has(policy.id)) {
        content = editedContentCache.get(policy.id)!;
    } else if (STATIC_POLICIES.has(policy.name)) {
        content = STATIC_POLICIES.get(policy.name)!;
    } else {
        try {
            content = await generatePolicyContent(policy.name);
        } catch (err) {
            console.error(`Failed to generate content for ${policy.name}`, err);
            content = `Error: Could not generate content for this policy.`;
        }
    }
    
    fullExportContent += `${content.trim()}\n\n\n`;

    const blob = new Blob([fullExportContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${policy.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_policy.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    setIsExportingSingle(null);
  };

  const handleImportFile = (file: File) => {
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = (event) => {
        try {
            const text = event.target?.result as string;
            if (!text) {
                throw new Error("File is empty.");
            }

            const newCache = new Map(editedContentCache);
            let currentPolicies = [...policies];
            const newPoliciesToAdd: Policy[] = [];
            let maxId = currentPolicies.length > 0 ? Math.max(...currentPolicies.map(p => p.id)) : 0;

            const policyChunks = text.split('========================================\nPOLICY: ').slice(1);

            if (policyChunks.length === 0) {
              throw new Error("No valid policies found in the file. Make sure the format is correct.");
            }

            policyChunks.forEach(chunk => {
                const parts = chunk.split('\n========================================\n\n');
                if (parts.length < 1) return;

                const policyName = parts[0].trim();
                const policyContent = parts.slice(1).join('\n========================================\n\n').trim();

                if (!policyName) return;

                let policy = currentPolicies.find(p => p.name.toLowerCase() === policyName.toLowerCase());

                if (policy) {
                    newCache.set(policy.id, policyContent);
                } else {
                    maxId++;
                    const newPolicy: Policy = { id: maxId, name: policyName };
                    newPoliciesToAdd.push(newPolicy);
                    currentPolicies.push(newPolicy); // Add to current list to avoid duplicates in the same file
                    newCache.set(newPolicy.id, policyContent);
                }
            });

            if (newPoliciesToAdd.length > 0) {
                setPolicies(prev => [...prev, ...newPoliciesToAdd].sort((a, b) => a.name.localeCompare(b.name)));
            }
            setEditedContentCache(newCache);
            alert(`Import successful: ${policyChunks.length} policies were processed.`);

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
            onExportAll={handleExportAll}
            isExporting={isExporting}
            onImportFile={handleImportFile}
            isImporting={isImporting}
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
                onExportSingle={handleExportSingle}
                isExportingSingle={isExportingSingle === selectedPolicy?.id}
              />
            </main>
            <Footer />
          </div>
        </div>
      </div>
      {showLoginModal && <LoginModal onLogin={handleLogin} onClose={() => setShowLoginModal(false)} />}
      {showAddPolicyModal && <AddPolicyModal onAdd={handleAddNewPolicy} onClose={() => setShowAddPolicyModal(false)} />}
    </>
  );
};

export default App;