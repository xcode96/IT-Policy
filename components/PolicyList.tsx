import React, { useRef, useState } from 'react';
import { type Policy, type SyncStatus } from '../types';

interface PolicyListProps {
  policies: Policy[];
  selectedPolicyId: number | undefined;
  onSelectPolicy: (policy: Policy) => void;
  isAdmin: boolean;
  onAddPolicyClick: () => void;
  onImportJsonFile: (file: File) => void;
  isImporting: boolean;
  onExportAllJson: () => void;
  isExportingJson: boolean;
  onLiveSyncClick: () => void;
  syncStatus: SyncStatus;
}

const PolicyList: React.FC<PolicyListProps> = ({ policies, selectedPolicyId, onSelectPolicy, isAdmin, onAddPolicyClick, onImportJsonFile, isImporting, onExportAllJson, isExportingJson, onLiveSyncClick, syncStatus }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const isActionInProgress = isImporting || isExportingJson;

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportJsonFile(file);
    }
    if(event.target) {
      event.target.value = '';
    }
  };

  const filteredPolicies = policies.filter(policy => 
    policy.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getSyncStatusIndicator = () => {
    const baseClasses = "absolute top-2 right-2 h-2 w-2 rounded-full ring-2 ring-slate-800";
    switch (syncStatus) {
      case 'connected':
        return <span className={`${baseClasses} bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]`} title="Sync Connected"></span>;
      case 'connecting':
        return <span className={`${baseClasses} bg-amber-400 animate-pulse`} title="Sync Connecting..."></span>;
       case 'failed':
         return <span className={`${baseClasses} bg-red-500`} title="Sync Failed"></span>;
      case 'not-connected':
      default:
        return <span className={`${baseClasses} bg-slate-600`} title="Sync Not Connected"></span>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header & Search */}
      <div className="p-5 flex-shrink-0 border-b border-border/50 bg-surface/30 backdrop-blur-md z-10">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-textPrimary tracking-tight flex items-center gap-2">
                <span className="bg-primary/10 p-1.5 rounded-lg text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M11.25 4.533A9.707 9.707 0 006 3.75a9.753 9.753 0 00-3.255.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3.75c-2.383 0-4.5.787-6.25 2.118v14.768z" />
                    </svg>
                </span>
                Policies
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-medium text-textSecondary">
                {policies.length}
            </span>
        </div>
        
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                </svg>
            </div>
            <input
                type="text"
                placeholder="Search policies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-background/50 border border-border rounded-lg text-sm text-textPrimary placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
            />
        </div>
      </div>

      {/* List */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {filteredPolicies.length > 0 ? (
            filteredPolicies.map((policy) => (
            <button
                key={policy.id}
                onClick={() => onSelectPolicy(policy)}
                className={`w-full group text-left px-4 py-3 text-sm rounded-xl transition-all duration-200 ease-out border relative overflow-hidden ${
                selectedPolicyId === policy.id
                    ? 'bg-primary/10 border-primary/20 text-primary-light font-medium shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'bg-transparent border-transparent text-textSecondary hover:bg-slate-800/50 hover:text-textPrimary hover:border-border/50'
                }`}
            >
                {selectedPolicyId === policy.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                )}
                <div className="flex items-center justify-between">
                    <span className="truncate pr-2">{policy.name}</span>
                    {selectedPolicyId === policy.id && (
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0 animate-fade-in text-primary">
                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                        </svg>
                    )}
                </div>
            </button>
            ))
        ) : (
            <div className="flex flex-col items-center justify-center py-10 text-textMuted opacity-60">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mb-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <p className="text-sm">No policies found</p>
            </div>
        )}
      </nav>

      {/* Admin Actions Footer */}
      {isAdmin && (
        <div className="p-4 mt-auto border-t border-border/50 bg-surface/50 backdrop-blur-md flex-shrink-0">
           <div className="p-3 mb-4 text-xs bg-emerald-950/30 border border-emerald-500/10 rounded-lg text-emerald-200/80">
                <div className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                    </svg>
                    <p>Remember to export and upload JSON changes to your server.</p>
                </div>
           </div>
           
           <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/json"
            className="hidden"
          />
          
          <div className="space-y-3">
            <button
              onClick={onAddPolicyClick}
              disabled={isActionInProgress}
              className="w-full flex items-center justify-center gap-2 p-3 text-sm rounded-xl font-semibold shadow-lg shadow-emerald-900/20 transition-all duration-200 ease-out bg-primary hover:bg-primary-dark text-white active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              <span>New Policy</span>
            </button>

            <div className="grid grid-cols-3 gap-2">
                <button
                    onClick={onLiveSyncClick}
                    disabled={isActionInProgress}
                    title="Live Sync"
                    className="relative flex flex-col items-center justify-center gap-1 p-2 text-xs rounded-lg transition-colors duration-200 bg-slate-800 border border-border text-textSecondary hover:bg-slate-700 hover:text-textPrimary hover:border-slate-600"
                >
                    {getSyncStatusIndicator()}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    <span>Sync</span>
                </button>
                 <button
                    onClick={handleImportClick}
                    disabled={isActionInProgress}
                    title="Import JSON"
                    className="flex flex-col items-center justify-center gap-1 p-2 text-xs rounded-lg transition-colors duration-200 bg-slate-800 border border-border text-textSecondary hover:bg-slate-700 hover:text-textPrimary hover:border-slate-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                     <span>Import</span>
                </button>
                 <button
                    onClick={onExportAllJson}
                    disabled={isActionInProgress}
                    title="Export All"
                    className="flex flex-col items-center justify-center gap-1 p-2 text-xs rounded-lg transition-colors duration-200 bg-slate-800 border border-border text-textSecondary hover:bg-slate-700 hover:text-textPrimary hover:border-slate-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    <span>Export</span>
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyList;