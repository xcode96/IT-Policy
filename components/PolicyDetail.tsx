import React, { useState, useEffect } from 'react';
import { type Policy } from '../types';
import LoadingSpinner from './LoadingSpinner';

// Use the global 'marked' object from the script tag in index.html
declare const marked: {
  parse: (markdown: string) => string;
};

interface PolicyDetailProps {
  policy: Policy | null;
  content: string;
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;
  onSave: (policyId: number, newContent: string) => void;
  onExportSingleJson: (policyId: number) => void;
  isExportingSingleJson: boolean;
  onLogout: () => void;
  onLoginClick: () => void;
  onBackClick: () => void;
}

const SecurityShieldIcon: React.FC<{ className?: string }> = ({ className = "h-8 w-8 text-primary" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
    </svg>
);


const PolicyDetail: React.FC<PolicyDetailProps> = ({ 
    policy, 
    content, 
    isLoading, 
    error, 
    isAdmin, 
    onSave, 
    onExportSingleJson,
    isExportingSingleJson,
    onLogout,
    onLoginClick,
    onBackClick
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    setIsEditing(false);
  }, [content, policy]);

  const handleEditClick = () => {
    setEditedContent(content);
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    if (policy) {
      onSave(policy.id, editedContent);
      setIsEditing(false);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedContent('');
  };

  const headerContent = (
     <header className="flex-shrink-0 border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-6 md:px-8 lg:px-10">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <button
                onClick={onBackClick}
                className="mr-2 p-2 rounded-full text-textSecondary hover:bg-slate-700 md:hidden"
                aria-label="Back to policy list"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
             <SecurityShieldIcon />
            <h1 className="ml-4 text-2xl font-bold text-textPrimary tracking-wider">
              POLICY<span className="font-light text-primary">PORTAL</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <button 
                onClick={onLogout} 
                className="px-5 py-2 text-sm font-semibold rounded-lg border border-border text-textSecondary bg-surface hover:bg-slate-700 hover:text-textPrimary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary-dark"
              >
                Logout
              </button>
            ) : (
              <button 
                onClick={onLoginClick} 
                className="px-5 py-2 text-sm font-semibold rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary-dark"
              >
                Admin Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );

  const mainContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <LoadingSpinner />
          <p className="mt-4 text-textPrimary font-semibold">Loading policies...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <div className="bg-red-900/20 border border-red-500/30 text-red-300 p-6 rounded-lg max-w-lg shadow-lg" role="alert">
            <h3 className="font-bold text-lg text-red-200">An Error Occurred</h3>
            <p className="mt-2 text-sm">{error}</p>
          </div>
        </div>
      );
    }
    
    if (!policy) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="p-5 bg-emerald-900/30 rounded-full text-primary-light">
                 <SecurityShieldIcon className="h-16 w-16" />
              </div>
              <h3 className="mt-8 text-2xl font-semibold text-textPrimary">Organization IT Security & Compliance Policies</h3>
              <p className="mt-2 max-w-md text-textSecondary">Our policies are based on recognized security standards to protect company data, ensure compliance, and maintain a safe IT environment for all users.</p>
            </div>
          );
    }

    if (isEditing) {
      return (
        <div className="h-full flex flex-col p-6 md:p-8 lg:p-10">
          <h2 className="text-2xl font-bold text-textPrimary mb-4 flex-shrink-0">Editing: <span className="text-primary-light">{policy.name}</span></h2>
          <textarea
            className="w-full flex-grow p-4 font-mono text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition bg-background text-textPrimary"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            aria-label={`Edit content for ${policy.name}`}
          />
          <div className="flex justify-end gap-3 mt-4 flex-shrink-0">
            <button 
              onClick={handleCancelClick}
              className="px-5 py-2 text-sm font-semibold rounded-lg border border-border text-textSecondary bg-surface hover:bg-slate-700 hover:text-textPrimary transition-colors duration-200"
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveClick}
              className="px-5 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary-dark transition-all duration-200"
            >
              Save Changes
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="mx-auto px-6 md:px-8 lg:px-10 py-8">
          <div className="flex justify-between items-start mb-8">
              <h1 className="text-3xl font-bold text-textPrimary tracking-tight">{policy.name}</h1>
              {isAdmin && (
                  <div className="flex items-center gap-3 flex-shrink-0 pl-4">
                      <button
                          onClick={() => onExportSingleJson(policy.id)}
                          disabled={isExportingSingleJson}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border border-border text-textSecondary bg-surface hover:bg-slate-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary-dark disabled:opacity-50 disabled:cursor-wait"
                      >
                          {isExportingSingleJson ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Exporting...
                              </>
                          ) : (
                              <>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.125 2.188a.75.75 0 00-1.25 0l-3.375 4.5a.75.75 0 00.625 1.125h2.25V12.5h-1.5a.75.75 0 000 1.5h1.5v.625a.75.75 0 001.5 0V14h1.5a.75.75 0 000-1.5h-1.5V7.813h2.25a.75.75 0 00.625-1.125l-3.375-4.5z" clipRule="evenodd" /><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM2 10a8 8 0 1116 0 8 8 0 01-16 0z" />
                                  </svg>
                                  Export JSON
                              </>
                          )}
                      </button>
                       <button 
                          onClick={handleEditClick}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary-light bg-emerald-500/10 rounded-lg hover:bg-emerald-500/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary-dark"
                      >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                          </svg>
                          Edit Policy
                      </button>
                  </div>
              )}
          </div>
          {content ? (
              <article 
                className="prose prose-base lg:prose-lg prose-invert max-w-none prose-p:leading-relaxed prose-a:text-primary-light hover:prose-a:text-primary prose-blockquote:border-primary-light prose-code:text-primary-light prose-li:marker:text-primary-light prose-table:border prose-table:border-border prose-thead:border-b-2 prose-thead:border-border prose-th:p-2 prose-th:font-semibold prose-td:border-border prose-td:p-2" 
                dangerouslySetInnerHTML={{ __html: marked.parse(content) }} 
              />
          ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-lg bg-background mt-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <h3 className="mt-4 font-semibold text-lg text-textPrimary">This policy has no content.</h3>
                  {isAdmin ? (
                      <p className="mt-1 max-w-md text-textSecondary text-sm">Click the "Edit Policy" button to add content.</p>
                  ) : (
                      <p className="mt-1 max-w-md text-textSecondary text-sm">Content has not yet been defined for this policy.</p>
                  )}
              </div>
          )}
      </div>
    );
  }

  return (
    <>
      {headerContent}
      <div className="flex-grow overflow-y-auto">
        {mainContent()}
      </div>
    </>
  );
};

export default PolicyDetail;