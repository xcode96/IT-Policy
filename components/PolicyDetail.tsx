import React, { useState, useEffect } from 'react';
import { type Policy } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { generatePolicyContent } from '../services/geminiService';

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
  onUpdateName: (policyId: number, newName: string) => void;
  onDeleteClick: (policy: Policy) => void;
}

const SecurityShieldIcon: React.FC<{ className?: string }> = ({ className = "h-8 w-8 text-primary" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.352-.272-2.652-.759-3.833a.75.75 0 00-.722-.515A11.208 11.208 0 0112.516 2.17zM12 11.75a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5a.75.75 0 01.75-.75zm0-3a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
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
    onBackClick,
    onUpdateName,
    onDeleteClick,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setIsEditing(false);
    setIsEditingName(false);
    if (policy) {
        setEditedName(policy.name);
    }
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

  const handleSaveName = () => {
    if (policy && editedName.trim()) {
        onUpdateName(policy.id, editedName.trim());
        setIsEditingName(false);
    }
  };

  const handleGenerateContent = async () => {
    if (!policy) return;
    setIsGenerating(true);
    try {
        const generatedContent = await generatePolicyContent(policy.name);
        setEditedContent(generatedContent);
        setIsEditing(true);
    } catch (e) {
        alert(e instanceof Error ? e.message : 'An unknown error occurred during AI content generation.');
    } finally {
        setIsGenerating(false);
    }
  };

  const headerContent = (
     <header className="flex-shrink-0 border-b border-border/50 bg-surface/80 backdrop-blur-md sticky top-0 z-20 transition-all duration-200">
      <div className="container mx-auto px-6 md:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
                onClick={onBackClick}
                className="p-2 -ml-2 rounded-full text-textSecondary hover:bg-slate-800 hover:text-textPrimary md:hidden transition-colors"
                aria-label="Back to policy list"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
             <div className="flex items-center gap-3">
                 <div className="p-2 bg-primary/10 rounded-lg">
                    <SecurityShieldIcon className="h-6 w-6 text-primary" />
                 </div>
                 <div>
                    <h1 className="text-lg font-bold text-textPrimary tracking-wide leading-tight">
                    POLICY<span className="text-primary">PORTAL</span>
                    </h1>
                    <p className="text-[10px] text-textSecondary uppercase tracking-widest font-semibold">Enterprise Security</p>
                 </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-emerald-400 font-medium hidden sm:inline-block px-2 py-1 bg-emerald-950/50 rounded border border-emerald-900">Admin Mode</span>
                <button 
                    onClick={onLogout} 
                    className="text-xs font-medium text-textSecondary hover:text-textPrimary transition-colors hover:underline"
                >
                    Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={onLoginClick} 
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg text-white bg-primary hover:bg-primary-dark shadow-glow transition-all duration-300 hover:scale-105"
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
          <p className="mt-4 text-textSecondary animate-pulse text-sm font-medium">Fetching secure content...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="bg-red-950/40 border border-red-500/20 text-red-200 p-8 rounded-2xl max-w-lg shadow-2xl backdrop-blur-xl" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-red-500 mb-4 opacity-80">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <h3 className="font-bold text-lg text-red-100 mb-2">Error Loading Policy</h3>
            <p className="text-sm text-red-300/70">{error}</p>
          </div>
        </div>
      );
    }
    
    if (!policy) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent opacity-50 pointer-events-none"></div>
              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-sm relative z-10 shadow-2xl">
                 <SecurityShieldIcon className="h-24 w-24 mx-auto text-slate-700 mb-4" />
                 <h3 className="text-2xl font-bold text-textPrimary mb-2">Select a Policy</h3>
                 <p className="max-w-md text-textSecondary text-sm leading-relaxed">
                    Choose a policy from the sidebar to view its details, compliance requirements, and revision history.
                 </p>
              </div>
            </div>
          );
    }

    if (isEditing) {
      return (
        <div className="h-full flex flex-col relative">
          <div className="flex-shrink-0 px-8 py-4 border-b border-border/50 flex justify-between items-center bg-surface/50">
             <h2 className="text-lg font-bold text-textPrimary">Editing: <span className="text-primary font-mono">{policy.name}</span></h2>
             <div className="flex gap-3">
                <button 
                onClick={handleCancelClick}
                className="px-4 py-2 text-sm font-medium rounded-lg text-textSecondary hover:text-textPrimary hover:bg-slate-800 transition-colors"
                >
                Cancel
                </button>
                <button 
                onClick={handleSaveClick}
                className="px-6 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark shadow-glow transition-all"
                >
                Save Changes
                </button>
             </div>
          </div>
          <div className="flex-grow relative">
             <textarea
                className="w-full h-full p-8 font-mono text-sm bg-background/50 text-textPrimary resize-none focus:outline-none leading-relaxed custom-scrollbar"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                placeholder="# Enter markdown content here..."
                autoFocus
             />
          </div>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-4xl px-8 py-10 w-full">
          {/* Policy Header */}
          <div className="mb-10 pb-6 border-b border-border/50">
            <div className="flex justify-between items-start gap-4">
                 {!isEditingName ? (
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight group flex items-baseline gap-4">
                        {policy.name}
                         {isAdmin && (
                            <button
                                onClick={() => setIsEditingName(true)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-slate-500 hover:text-primary hover:bg-slate-800 transition-all"
                                title="Rename Policy"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                                </svg>
                            </button>
                        )}
                    </h1>
                ) : (
                    <div className="flex-grow flex items-center gap-3">
                         <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="w-full text-3xl font-bold bg-transparent border-b-2 border-primary focus:outline-none text-white py-1"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveName();
                                if (e.key === 'Escape') setIsEditingName(false);
                            }}
                        />
                        <button onClick={handleSaveName} className="text-sm bg-primary text-white px-3 py-1 rounded">Save</button>
                         <button onClick={() => setIsEditingName(false)} className="text-sm text-slate-400 hover:text-white px-3 py-1">Cancel</button>
                    </div>
                )}
            </div>
            
            {/* Toolbar */}
             {isAdmin && !isEditingName && (
                <div className="flex flex-wrap items-center gap-2 mt-6">
                    <button 
                        onClick={handleEditClick}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-emerald-900/20"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                             <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                             <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                        </svg>
                        Edit Content
                    </button>
                    <div className="h-6 w-px bg-border mx-2"></div>
                    <button
                        onClick={() => onExportSingleJson(policy.id)}
                        disabled={isExportingSingleJson}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-textSecondary hover:bg-slate-800 hover:text-textPrimary transition-colors"
                    >
                         {isExportingSingleJson ? (
                            <span className="animate-spin">⟳</span>
                         ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm4.75 6.75a.75.75 0 011.5 0v2.546l.943-1.048a.75.75 0 111.114 1.004l-2.25 2.5a.75.75 0 01-1.114 0l-2.25-2.5a.75.75 0 111.114-1.004l.943 1.048V8.75z" clipRule="evenodd" />
                            </svg>
                         )}
                        Export JSON
                    </button>
                    <button 
                        onClick={() => onDeleteClick(policy)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors ml-auto"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                        </svg>
                        Delete
                    </button>
                </div>
             )}
          </div>

          {/* Markdown Content */}
          {content ? (
              <article 
                className="prose prose-invert prose-emerald max-w-none 
                prose-headings:font-bold prose-headings:text-white 
                prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl 
                prose-p:text-slate-300 prose-p:leading-7 
                prose-li:text-slate-300
                prose-strong:text-white prose-strong:font-semibold
                prose-code:text-emerald-300 prose-code:bg-emerald-950/30 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-slate-900/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:text-slate-400
                prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
                prose-th:text-white prose-th:bg-slate-800 prose-th:p-3 prose-td:p-3 prose-tr:border-b prose-tr:border-slate-800" 
                dangerouslySetInnerHTML={{ __html: marked.parse(content) }} 
              />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-slate-700 rounded-2xl bg-slate-900/20">
                <div className="bg-slate-800 p-4 rounded-full mb-4 shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Empty Policy</h3>
                <p className="text-slate-400 text-center max-w-sm mb-8">This policy document is currently empty. You can write it manually or use AI to generate a standard template.</p>
                
                {isAdmin ? (
                   <div className="flex gap-4">
                       <button
                          onClick={handleGenerateContent}
                          disabled={isGenerating}
                          className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-900/40 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-wait disabled:hover:translate-y-0"
                      >
                          {isGenerating ? (
                              <>
                                  <svg className="animate-spin -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  <span>Generating Draft...</span>
                              </>
                          ) : (
                              <>
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                      <path fillRule="evenodd" d="M9.315 2.745a.75.75 0 111.084.982 18.027 18.027 0 00-5.942 9.454.75.75 0 11-1.48-.27A19.53 19.53 0 019.315 2.745zM8 12a4 4 0 108 0 4 4 0 00-8 0z" clipRule="evenodd" />
                                      <path fillRule="evenodd" d="M14.685 2.745a.75.75 0 01-1.084.982 18.027 18.027 0 015.942 9.454.75.75 0 101.48-.27A19.53 19.53 0 0014.685 2.745z" clipRule="evenodd" />
                                  </svg>
                                  <span>Generate with AI</span>
                              </>
                          )}
                      </button>
                      <button 
                          onClick={handleEditClick}
                          className="px-6 py-3 text-sm font-bold text-slate-300 bg-slate-800 rounded-xl hover:bg-slate-700 hover:text-white transition-all duration-200 border border-slate-700"
                      >
                          Write Manually
                      </button>
                   </div>
                ) : (
                   <span className="inline-block px-4 py-2 rounded-lg bg-slate-800 text-slate-400 text-sm">
                        Waiting for administrator input.
                   </span>
                )}
            </div>
        )}
      </div>
    );
  }

  return (
    <>
      {headerContent}
      <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {mainContent()}
      </div>
    </>
  );
};

export default PolicyDetail;