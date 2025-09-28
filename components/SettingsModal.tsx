import React, { useState } from 'react';

interface SettingsModalProps {
  onSave: (apiKey: string) => void;
  onClose: () => void;
  currentApiKey: string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onSave, onClose, currentApiKey }) => {
    const [apiKey, setApiKey] = useState(currentApiKey);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(apiKey);
    };

    return (
        <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
            onClick={onClose}
        >
            <div 
                className="bg-surface rounded-lg shadow-xl p-8 w-full max-w-lg animate-fade-in" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-textPrimary">Settings</h2>
                        <p className="text-sm text-textSecondary mt-1">Configure your API key for AI features.</p>
                    </div>
                     <button onClick={onClose} className="text-textMuted hover:text-textSecondary transition-colors text-2xl">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="apiKey" className="block text-sm font-medium text-textSecondary mb-2">Google AI API Key</label>
                        <input
                            type="password"
                            id="apiKey"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition bg-background text-textPrimary"
                            placeholder="Enter your API key here"
                            required
                            autoFocus
                        />
                         <p className="text-xs text-textMuted mt-2">
                           Your API key is stored securely in your browser's local storage and is never sent anywhere else. 
                           You can get a key from Google AI Studio.
                        </p>
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
                            disabled={!apiKey.trim()}
                        >
                            Save Settings
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsModal;