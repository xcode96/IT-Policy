import React, { useRef } from 'react';
import { type Policy, type SyncStatus } from '../types';

interface PolicyListProps {
  policies: Policy[];
  selectedPolicyId: number | undefined;
  onSelectPolicy: (policy: Policy) => void;
  isAdmin: boolean;
  isAiInitialized: boolean;
  onAddPolicyClick: () => void;
  onImportJsonFile: (file: File) => void;
  isImporting: boolean;
  onExportAllJson: () => void;
  isExportingJson: boolean;
  onLiveSyncClick: () => void;
  syncStatus: SyncStatus;
}

const PolicyList: React.FC<PolicyListProps> = ({ policies, selectedPolicyId, onSelectPolicy, isAdmin, isAiInitialized, onAddPolicyClick, onImportJsonFile, isImporting, onExportAllJson, isExportingJson, onLiveSyncClick, syncStatus }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
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
  
  const getSyncStatusIndicator = () => {
    switch (syncStatus) {
      case 'connected':
        return <span className="absolute top-2 right-2 h-3 w-3 rounded-full bg-green-500 border-2 border-surface" title="Sync Connected"></span>;
      case 'connecting':
        return <span className="absolute top-2 right-2 h-3 w-3 rounded-full bg-yellow-500 border-2 border-surface animate-pulse" title="Sync Connecting..."></span>;
       case 'failed':
         return <span className="absolute top-2 right-2 h-3 w-3 rounded-full bg-red-500 border-2 border-surface" title="Sync Failed"></span>;
      case 'not-connected':
      default:
        return <span className="absolute top-2 right-2 h-3 w-3 rounded-full bg-red-500 border-2 border-surface" title="Sync Not Connected"></span>;
    }
  };

  return (
    <div className="h-full bg-surface text-textPrimary flex flex-col rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="p-6 flex-shrink-0 border-b border-border">
        <h2 className="text-xl font-bold text-textPrimary">All Policies</h2>
        <p className="text-sm text-textSecondary mt-1">Select a policy to view details</p>
      </div>
      <nav className="px-3 py-3 flex-grow overflow-y-auto">
        <ul>
          {policies.map((policy) => (
            <li key={policy.id}>
              <button
                onClick={() => onSelectPolicy(policy)}
                className={`w-full text-left p-3 my-1 text-sm rounded-md font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary ${
                  selectedPolicyId === policy.id
                    ? 'bg-primary text-white font-semibold shadow-sm'
                    : 'text-textSecondary hover:bg-blue-50 hover:text-textPrimary'
                }`}
              >
                {policy.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      {isAdmin && (
        <div className="px-4 py-4 mt-auto border-t border-border flex-shrink-0 space-y-3">
           <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/json"
            className="hidden"
          />
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onAddPolicyClick}
              disabled={isActionInProgress || !isAiInitialized}
              title={!isAiInitialized ? 'Please set your API key in Settings to add a policy' : 'Add a new policy'}
              className="w-full flex items-center justify-center gap-2 p-3 text-sm rounded-md font-semibold transition-all duration-300 ease-in-out bg-primary text-white hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary shadow-sm disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>Add New</span>
            </button>
             <button
              onClick={onLiveSyncClick}
              disabled={isActionInProgress}
              className="w-full relative flex items-center justify-center gap-2 p-3 text-sm rounded-md font-semibold transition-all duration-300 ease-in-out bg-slate-100 text-slate-700 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-slate-400 shadow-sm disabled:bg-slate-300 disabled:cursor-wait"
            >
              {getSyncStatusIndicator()}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M15.55 5.55a8 8 0 10-11.1 0 1 1 0 011.41-1.41 6 6 0 018.28 0 1 1 0 11-1.41 1.41zM10 3a1 1 0 011 1v2a1 1 0 11-2 0V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>Live Sync</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleImportClick}
              disabled={isActionInProgress}
              className="w-full flex items-center justify-center gap-2 p-3 text-sm rounded-md font-semibold transition-all duration-300 ease-in-out bg-slate-100 text-slate-700 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-slate-400 shadow-sm disabled:bg-slate-300 disabled:cursor-wait"
            >
              {isImporting ? (
                 <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>
                  <span>Import JSON</span>
                </>
              )}
            </button>
            <button
              onClick={onExportAllJson}
              disabled={isActionInProgress}
              className="w-full flex items-center justify-center gap-2 p-3 text-sm rounded-md font-semibold transition-all duration-300 ease-in-out bg-slate-800 text-white hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-slate-600 shadow-sm disabled:bg-slate-400 disabled:cursor-wait"
            >
              {isExportingJson ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM4 8h5v2H4V8zm0 3h5v2H4v-2z" clipRule="evenodd" />
                  </svg>
                  <span>Export All JSON</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyList;