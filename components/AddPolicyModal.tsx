import React, { useState } from 'react';

interface AddPolicyModalProps {
  onAdd: (policyName: string) => void;
  onClose: () => void;
}

const AddPolicyModal: React.FC<AddPolicyModalProps> = ({ onAdd, onClose }) => {
    const [policyName, setPolicyName] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (policyName.trim()) {
            onAdd(policyName.trim());
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
            onClick={onClose}
        >
            <div 
                className="bg-surface rounded-xl shadow-lg w-full max-w-md animate-fade-in overflow-hidden border border-border" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-8 border-b border-border relative bg-background">
                    <h2 className="text-2xl font-bold text-textPrimary">Add New Policy</h2>
                    <p className="text-sm text-textSecondary mt-1">A blank policy will be created for you to edit.</p>
                     <button onClick={onClose} className="absolute top-4 right-4 text-textMuted hover:text-textPrimary transition-colors text-3xl">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8">
                    <div className="mb-6">
                        <label htmlFor="policyName" className="block text-sm font-medium text-textSecondary mb-2">Policy Name</label>
                        <input
                            type="text"
                            id="policyName"
                            value={policyName}
                            onChange={(e) => setPolicyName(e.target.value)}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition bg-background text-textPrimary"
                            placeholder="e.g., Cloud Security Policy"
                            required
                            autoFocus
                        />
                    </div>
                    
                    <div className="flex justify-end gap-3">
                         <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-5 py-2 text-sm font-semibold rounded-lg border border-border text-textSecondary bg-surface hover:bg-slate-700 hover:text-textPrimary transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-5 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary-dark disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-200"
                            disabled={!policyName.trim()}
                        >
                            Create Policy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPolicyModal;