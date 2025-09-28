import React from 'react';
import { type Policy } from '../types';

interface DeletePolicyModalProps {
  policy: Policy;
  onConfirm: () => void;
  onClose: () => void;
}

const DeletePolicyModal: React.FC<DeletePolicyModalProps> = ({ policy, onConfirm, onClose }) => {
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
                    <h2 className="text-2xl font-bold text-red-400">Delete Policy</h2>
                    <p className="text-sm text-textSecondary mt-1">This action cannot be undone.</p>
                     <button onClick={onClose} className="absolute top-4 right-4 text-textMuted hover:text-textPrimary transition-colors text-3xl">&times;</button>
                </div>
                
                <div className="p-8">
                    <p className="text-textPrimary mb-6">
                        Are you sure you want to permanently delete the policy: <strong className="font-semibold text-textPrimary">{policy.name}</strong>?
                    </p>
                    
                    <div className="flex justify-end gap-3">
                         <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-5 py-2 text-sm font-semibold rounded-lg border border-border text-textSecondary bg-surface hover:bg-slate-700 hover:text-textPrimary transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button 
                            type="button" 
                            onClick={onConfirm} 
                            className="px-5 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-red-500 transition-all duration-200"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeletePolicyModal;
