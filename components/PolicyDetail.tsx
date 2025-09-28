
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
}

const PolicyDetail: React.FC<PolicyDetailProps> = ({ 
    policy, 
    content, 
    isLoading, 
    error, 
    isAdmin, 
    onSave, 
    onExportSingleJson,
    isExportingSingleJson,
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
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg max-w-lg" role="alert">
          <h3 className="font-bold text-lg text-red-800">An Error Occurred</h3>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      </div>
    );
  }
  
  if (!policy) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="p-5 bg-blue-100 rounded-full border border-blue-200">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
               </svg>
            </div>
            <h3 className="mt-8 text-2xl font-semibold text-textPrimary">Welcome to the Policy Portal</h3>
            <p className="mt-2 max-w-md text-textSecondary">Select a policy from the list on the left to view its details.</p>
          </div>
        );
  }

  if (isEditing) {
    return (
      <div className="h-full flex flex-col">
        <h2 className="text-2xl font-bold text-textPrimary mb-4 flex-shrink-0">Editing: <span className="text-primary">{policy.name}</span></h2>
        <textarea
          className="w-full flex-grow p-4 font-mono text-sm border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition bg-slate-50 text-slate-800"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          aria-label={`Edit content for ${policy.name}`}
        />
        <div className="flex justify-end gap-3 mt-4 flex-shrink-0">
          <button 
            onClick={handleCancelClick}
            className="px-5 py-2 text-sm font-semibold text-textSecondary bg-slate-100 rounded-md hover:bg-slate-200 hover:text-textPrimary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveClick}
            className="px-5 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-sm transition-all duration-300"
          >
            Save Changes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
        <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-textPrimary tracking-tight">{policy.name}</h1>
            {isAdmin && (
                <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                        onClick={() => onExportSingleJson(policy.id)}
                        disabled={isExportingSingleJson}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 disabled:opacity-50 disabled:cursor-wait"
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
                                    <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM4 8h5v2H4V8zm0 3h5v2H4v-2z" clipRule="evenodd" />
                                </svg>
                                Export JSON
                            </>
                        )}
                    </button>
                     <button 
                        onClick={handleEditClick}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary bg-blue-50 rounded-md hover:bg-blue-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
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
              className="prose prose-sm sm:prose-base max-w-none text-textSecondary prose-headings:text-textPrimary prose-headings:font-semibold prose-a:text-primary hover:prose-a:text-primary-dark prose-strong:text-textPrimary prose-blockquote:border-primary prose-code:text-primary" 
              dangerouslySetInnerHTML={{ __html: marked.parse(content) }} 
            />
        ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-lg bg-slate-50 mt-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
};

export default PolicyDetail;
