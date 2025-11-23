import React, { useState, useCallback, useEffect } from 'react';
import PolicyList from './components/PolicyList';
import PolicyDetail from './components/PolicyDetail';
import AddPolicyModal from './components/AddPolicyModal';
import LiveSyncModal from './components/LiveSyncModal';
import LoginModal from './components/LoginModal';
import DeletePolicyModal from './components/DeletePolicyModal';
import { type Policy, type SyncStatus } from './types';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [editedContentCache, setEditedContentCache] = useState<Map<number, string>>(new Map());

  const [appStatus, setAppStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [appError, setAppError] = useState<string | null>(null);

  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [policyContent, setPolicyContent] = useState<string>('');
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(false);
  
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showAddPolicyModal, setShowAddPolicyModal] = useState<boolean>(false);
  const [showLiveSyncModal, setShowLiveSyncModal] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [policyToDelete, setPolicyToDelete] = useState<Policy | null>(null);
  const [loginError, setLoginError] = useState<string>('');
  
  const [isExportingJson, setIsExportingJson] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [isExportingSingleJson, setIsExportingSingleJson] = useState<number | null>(null);

  const [syncStatus, setSyncStatus] = useState<SyncStatus>('not-connected');
  const [syncUrl, setSyncUrl] = useState<string>('');

  useEffect(() => {
    const fetchPolicies = async () => {
        try {
            const response = await fetch('/policies.json');
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            const data = await response.json();
            
            if (!Array.isArray(data) || !data.every(item => 'id' in item && 'name' in item && 'content' in item)) {
              throw new Error('Invalid JSON format for policies.');
            }

            const loadedPolicies = data.map(({ id, name }) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
            setPolicies(loadedPolicies);

            const contentCache = new Map<number, string>();
            data.forEach(({ id, content }) => {
                contentCache.set(id, content);
            });
            setEditedContentCache(contentCache);
            
            if (window.innerWidth >= 768 && loadedPolicies.length > 0) {
              const firstPolicy = loadedPolicies[0];
              setSelectedPolicy(firstPolicy);
              setPolicyContent(contentCache.get(firstPolicy.id) || '');
            }

            setAppStatus('ready');
        } catch (e) {
            console.error("Failed to load policies:", e);
            setAppError("Failed to fetch policies.json. Make sure the file exists in the public directory.");
            setAppStatus('error');
        }
    };

    fetchPolicies();
  }, []);

  const getPolicyContent = useCallback(async (policy: Policy): Promise<string> => {
    return editedContentCache.get(policy.id) || '';
  }, [editedContentCache]);

  const handleSelectPolicy = useCallback(async (policy: Policy) => {
    if (selectedPolicy?.id === policy.id) {
      return;
    }

    setSelectedPolicy(policy);
    setIsLoadingContent(true);
    setPolicyContent('');

    const content = await getPolicyContent(policy);
    setPolicyContent(content);
    setIsLoadingContent(false);
  }, [selectedPolicy, getPolicyContent]);

  const handleMobileBack = () => {
    setSelectedPolicy(null);
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  const handleLogin = (username: string, password: string) => {
    if (username === 'admin' && password === 'password') {
        setIsAdmin(true);
        setShowLoginModal(false);
        setLoginError('');
    } else {
        setLoginError('Invalid username or password.');
    }
  };

  const handleAddNewPolicy = (policyName: string) => {
    if (policyName.trim()) {
        const newPolicy: Policy = {
            id: policies.length > 0 ? Math.max(...policies.map(p => p.id)) + 1 : 1,
            name: policyName.trim(),
        };
        const newPolicies = [...policies, newPolicy].sort((a, b) => a.name.localeCompare(b.name));
        setPolicies(newPolicies);
        
        const newCache = new Map(editedContentCache);
        newCache.set(newPolicy.id, '');
        setEditedContentCache(newCache);
        
        setShowAddPolicyModal(false);
        handleSelectPolicy(newPolicy);
    }
  };

  const handleUpdatePolicyName = (policyId: number, newName: string) => {
    const trimmedName = newName.trim();
    if (!trimmedName) return;

    const updatedPolicies = policies.map(p => 
        p.id === policyId ? { ...p, name: trimmedName } : p
    ).sort((a, b) => a.name.localeCompare(b.name));
    
    setPolicies(updatedPolicies);

    if (selectedPolicy?.id === policyId) {
        setSelectedPolicy(prev => prev ? { ...prev, name: trimmedName } : null);
    }
  };

  const handleDeletePolicy = (policyId: number) => {
    if (!policyToDelete || policyToDelete.id !== policyId) return;

    const originalPolicies = [...policies];
    const newPolicies = policies.filter(p => p.id !== policyId);
    setPolicies(newPolicies);

    const newCache = new Map(editedContentCache);
    newCache.delete(policyId);
    setEditedContentCache(newCache);

    if (selectedPolicy?.id === policyId) {
        const currentIndex = originalPolicies.findIndex(p => p.id === policyId);
        if (newPolicies.length === 0) {
            setSelectedPolicy(null);
        } else if (currentIndex >= newPolicies.length) {
            handleSelectPolicy(newPolicies[newPolicies.length - 1]);
        } else {
            handleSelectPolicy(newPolicies[currentIndex]);
        }
    }
    setPolicyToDelete(null);
  };

  const handleSavePolicyContent = (policyId: number, newContent: string) => {
    const newCache = new Map(editedContentCache);
    newCache.set(policyId, newContent);
    setEditedContentCache(newCache);
    setPolicyContent(newContent);
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
        exportData.push({ id: policy.id, name: policy.name, content: content });
    }

    triggerDownload('it_policies_export.json', JSON.stringify(exportData, null, 2), 'application/json');
    setIsExportingJson(false);
  };

  const handleExportSingleJson = async (policyId: number) => {
    const policy = policies.find(p => p.id === policyId);
    if (!policy) return;

    setIsExportingSingleJson(policy.id);
    try {
        const content = await getPolicyContent(policy);
        const exportData = { id: policy.id, name: policy.name, content: content };
        const filename = `${policy.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_policy.json`;
        triggerDownload(filename, JSON.stringify(exportData, null, 2), 'application/json');
    } catch (e) {
        alert(e instanceof Error ? e.message : 'An unknown error occurred during export.');
    } finally {
        setIsExportingSingleJson(null);
    }
  };

  const handleImportJsonFile = (file: File) => {
    if (!file) return;
    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const text = event.target?.result as string;
            if (!text) throw new Error("File is empty.");
            
            const data = JSON.parse(text);
            if (!Array.isArray(data) || !data.every(item => 'id' in item && 'name' in item && 'content' in item)) {
              throw new Error('Invalid JSON format. Expected an array of objects with id, name, and content.');
            }
            
            const importedPolicies: (Policy & { content: string })[] = data;
            const newCache = new Map(editedContentCache);
            let updatedPolicies = [...policies];
            let maxId = updatedPolicies.length > 0 ? Math.max(...updatedPolicies.map(p => p.id)) : 0;

            importedPolicies.forEach(importedPolicy => {
                const policyToProcess = { ...importedPolicy };
                const existingPolicyIndex = updatedPolicies.findIndex(p => p.id === policyToProcess.id);

                if (existingPolicyIndex > -1) {
                    updatedPolicies[existingPolicyIndex] = { id: policyToProcess.id, name: policyToProcess.name };
                } else {
                    if (updatedPolicies.some(p => p.id === policyToProcess.id)) {
                        policyToProcess.id = ++maxId;
                    }
                    updatedPolicies.push({ id: policyToProcess.id, name: policyToProcess.name });
                    if (policyToProcess.id > maxId) maxId = policyToProcess.id;
                }
                newCache.set(policyToProcess.id, policyToProcess.content);
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
        if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);
        
        const data = await response.json();
        if (!Array.isArray(data) || !data.every(item => 'id' in item && 'name' in item && 'content' in item)) {
          throw new Error('Invalid JSON format. Expected an array of objects with id, name, and content.');
        }

        const newPolicies: Policy[] = data.map(item => ({ id: item.id, name: item.name }));
        const newCache = new Map<number, string>();
        data.forEach(item => newCache.set(item.id, item.content));

        setPolicies(newPolicies.sort((a, b) => a.name.localeCompare(b.name)));
        setEditedContentCache(newCache);
        setSelectedPolicy(null);
        setPolicyContent('');
        setSyncStatus('connected');
        setShowLiveSyncModal(false);
    } catch (error) {
        console.error('Sync failed:', error);
        setSyncStatus('failed');
        throw error;
    }
  };

  const handleDisconnect = () => {
    setSyncUrl('');
    setSyncStatus('not-connected');
  };

  if (appStatus === 'loading') {
    return (
        <div className="flex h-screen items-center justify-center bg-background">
            <div className="text-center">
                <LoadingSpinner />
                <p className="mt-4 text-primary font-medium tracking-wide animate-pulse">Loading Portal...</p>
            </div>
        </div>
    );
  }

  if (appStatus === 'error') {
      return (
          <div className="flex h-screen items-center justify-center p-4 bg-background">
              <div className="bg-white border border-red-200 text-slate-800 p-8 rounded-2xl max-w-lg text-center shadow-xl" role="alert">
                <div className="bg-red-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl mb-2">System Error</h3>
                <p className="text-sm text-slate-500">{appError}</p>
              </div>
          </div>
      );
  }

  return (
    <>
      {/* Main Layout Container */}
      <div className="flex h-screen w-screen overflow-hidden bg-background text-textPrimary md:p-6 md:gap-6 selection:bg-primary/20 selection:text-primary-dark font-sans">
        
        {/* Sidebar */}
        <aside 
          className={`
            fixed inset-0 z-30 flex flex-col transition-all duration-300 md:relative md:inset-auto md:translate-x-0 md:w-80 lg:w-[24rem] flex-shrink-0
            ${selectedPolicy ? 'translate-x-[-100%] md:translate-x-0' : 'translate-x-0'}
            bg-surface border border-white/50 md:rounded-3xl shadow-soft overflow-hidden
          `}
        >
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

        {/* Main Content Area */}
        <main 
          className={`
            fixed inset-0 z-20 flex flex-col transition-all duration-300 md:relative md:inset-auto md:translate-x-0 flex-1
            ${selectedPolicy ? 'translate-x-0' : 'translate-x-[100%] md:translate-x-0'}
            bg-surface border border-white/50 md:rounded-3xl shadow-soft overflow-hidden
          `}
        >
          <PolicyDetail
            policy={selectedPolicy}
            content={policyContent}
            isLoading={isLoadingContent}
            error={null}
            isAdmin={isAdmin}
            onSave={handleSavePolicyContent}
            onExportSingleJson={handleExportSingleJson}
            isExportingSingleJson={isExportingSingleJson === selectedPolicy?.id}
            onLogout={handleLogout}
            onLoginClick={() => setShowLoginModal(true)}
            onBackClick={handleMobileBack}
            onUpdateName={handleUpdatePolicyName}
            onDeleteClick={(policy) => setPolicyToDelete(policy)}
          />
        </main>
      </div>

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
      {showLoginModal && (
        <LoginModal
            onClose={() => { setShowLoginModal(false); setLoginError(''); }}
            onLogin={handleLogin}
            error={loginError}
        />
      )}
      {policyToDelete && (
        <DeletePolicyModal
            policy={policyToDelete}
            onClose={() => setPolicyToDelete(null)}
            onConfirm={() => handleDeletePolicy(policyToDelete.id)}
        />
      )}
    </>
  );
};

export default App;