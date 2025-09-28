import React, { useRef } from 'react';
import { type Policy } from '../types';

interface PolicyListProps {
  policies: Policy[];
  selectedPolicyId: number | undefined;
  onSelectPolicy: (policy: Policy) => void;
  isAdmin: boolean;
  onAddPolicyClick: () => void;
  onExportAll: () => void;
  isExporting: boolean;
  onImportFile: (file: File) => void;
  isImporting: boolean;
}

const PolicyList: React.FC<PolicyListProps> = ({ policies, selectedPolicyId, onSelectPolicy, isAdmin, onAddPolicyClick, onExportAll, isExporting, onImportFile, isImporting }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportFile(file);
    }
    // Reset the input value to allow re-uploading the same file
    if(event.target) {
      event.target.value = '';
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
            accept=".txt"
            className="hidden"
          />
          <button
            onClick={onAddPolicyClick}
            disabled={isExporting || isImporting}
            className="w-full flex items-center justify-center gap-2 p-3 text-sm rounded-md font-semibold transition-all duration-300 ease-in-out bg-primary text-white hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary shadow-sm disabled:bg-slate-400 disabled:cursor-wait"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>Add New Policy</span>
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleImportClick}
              disabled={isExporting || isImporting}
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                    <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                  </svg>
                  <span>Import</span>
                </>
              )}
            </button>
            <button
              onClick={onExportAll}
              disabled={isExporting || isImporting}
              className="w-full flex items-center justify-center gap-2 p-3 text-sm rounded-md font-semibold transition-all duration-300 ease-in-out bg-slate-600 text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-slate-500 shadow-sm disabled:bg-slate-400 disabled:cursor-wait"
            >
              {isExporting ? (
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
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Export All</span>
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