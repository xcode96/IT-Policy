import React, { useRef } from 'react';
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
    const baseClasses = "absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full border-2 border-surface";
    switch (syncStatus) {
      case 'connected':
        return <span className={`${baseClasses} bg-green-500`} title="Sync Connected"></span>;
      case 'connecting':
        return <span className={`${baseClasses} bg-yellow-400 animate-pulse`} title="Sync Connecting..."></span>;
       case 'failed':
         return <span className={`${baseClasses} bg-red-500`} title="Sync Failed"></span>;
      case 'not-connected':
      default:
        return <span className={`${baseClasses} bg-gray-400`} title="Sync Not Connected"></span>;
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
                className={`w-full text-left p-3 my-1 text-sm rounded-lg font-medium transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary-dark relative ${
                  selectedPolicyId === policy.id
                    ? 'bg-amber-50 text-amber-800 font-semibold'
                    : 'text-textSecondary hover:bg-gray-100 hover:text-textPrimary'
                }`}
              >
                {selectedPolicyId === policy.id && <span className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full"></span>}
                {policy.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      {isAdmin && (
        <div className="px-4 py-4 mt-auto border-t border-border flex-shrink-0 space-y-3">
           <div className="p-3 mb-3 text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-md">
            <p className="font-semibold">Workflow Reminder:</p>
            <p className="mt-1">
              Exported JSON files are saved to your computer's **Downloads folder**. Manually upload that file to your GitHub or server.
            </p>
           </div>
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
              disabled={isActionInProgress}
              title={'Add a new policy'}
              className="w-full flex items-center justify-center gap-2 p-3 text-sm rounded-lg font-semibold transition-colors duration-200 ease-in-out bg-primary text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary-dark disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>Add New</span>
            </button>
             <button
              onClick={onLiveSyncClick}
              disabled={isActionInProgress}
              className="w-full relative flex items-center justify-center gap-2 p-3 text-sm rounded-lg font-semibold transition-colors duration-200 ease-in-out bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-gray-400 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
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
              className="w-full flex items-center justify-center gap-2 p-3 text-sm rounded-lg font-semibold transition-colors duration-200 ease-in-out bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-gray-400 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
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
              className="w-full flex items-center justify-center gap-2 p-3 text-sm rounded-lg font-semibold transition-colors duration-200 ease-in-out bg-textPrimary text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-gray-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
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
                    <path fillRule="evenodd" d="M10.125 2.188a.75.75 0 00-1.25 0l-3.375 4.5a.75.75 0 00.625 1.125h2.25V12.5h-1.5a.75.75 0 000 1.5h1.5v.625a.75.75 0 001.5 0V14h1.5a.75.75 0 000-1.5h-1.5V7.813h2.25a.75.75 0 00.625-1.125l-3.375-4.5z" clipRule="evenodd" /><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM2 10a8 8 0 1116 0 8 8 0 01-16 0z" />
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