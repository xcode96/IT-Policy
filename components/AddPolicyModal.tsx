
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
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
            onClick={onClose}
        >
            <div 
                className="bg-surface rounded-lg shadow-xl p-8 w-full max-w-md animate-fade-in" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-textPrimary">Add New Policy</h2>
                        <p className="text-sm text-textSecondary mt-1">A blank policy will be created for you to edit.</p>
                    </div>
                     <button onClick={onClose} className="text-textMuted hover:text-textSecondary transition-colors text-2xl">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="policyName" className="block text-sm font-medium text-textSecondary mb-2">Policy Name</label>
                        <input
                            type="text"
                            id="policyName"
                            value={policyName}
                            onChange={(e) => setPolicyName(e.target.value)}
                            className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition bg-background text-textPrimary"
                            placeholder="e.g., Cloud Security Policy"
                            required
                            autoFocus
                        />
                    </div>
                    
                    <div className="flex justify-end gap-3 mt-8">
                         <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-5 py-2 text-sm font-semibold text-textSecondary bg-slate-100 rounded-md hover:bg-slate-200 hover:text-textPrimary transition-all duration-300"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-5 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary disabled:bg-slate-400 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 shadow-sm"
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
