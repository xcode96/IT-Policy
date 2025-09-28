import React, { useState, useEffect } from 'react';
import { type SyncStatus } from '../types';

interface LiveSyncModalProps {
  onClose: () => void;
  onSync: (url: string) => Promise<void>;
  onDisconnect: () => void;
  syncStatus: SyncStatus;
  syncUrl: string;
}

const LiveSyncModal: React.FC<LiveSyncModalProps> = ({ onClose, onSync, onDisconnect, syncStatus, syncUrl }) => {
    const [url, setUrl] = useState(syncUrl);
    const [error, setError] = useState('');
    const [currentStatus, setCurrentStatus] = useState(syncStatus);

    useEffect(() => {
        setCurrentStatus(syncStatus);
    }, [syncStatus]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await onSync(url);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred during sync.');
        }
    };
    
    const handleDisconnect = () => {
        onDisconnect();
        setUrl('');
        setError('');
    }

    const renderStatus = () => {
        if (currentStatus === 'connected') {
            return <p className="text-sm text-textSecondary truncate">Connected to: <span className="font-medium text-textPrimary">{syncUrl}</span></p>;
        }
         if (currentStatus === 'failed' && error) {
            return <p className="text-sm text-red-600">{error}</p>;
        }
        return <p className="text-sm text-textSecondary mt-1">Connect to a live server to sync policies from a JSON file.</p>;
    }

    return (
        <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
            onClick={onClose}
        >
            <div 
                className="bg-surface rounded-xl shadow-lg w-full max-w-lg animate-fade-in overflow-hidden border border-border" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-8 border-b border-border relative bg-slate-50">
                    <h2 className="text-2xl font-bold text-textPrimary">Live Policy Sync</h2>
                    {renderStatus()}
                    <button onClick={onClose} className="absolute top-4 right-4 text-textMuted hover:text-textPrimary transition-colors text-3xl">&times;</button>
                </div>

                <div className="p-8">
                    <div className="text-sm text-textSecondary bg-slate-100 p-4 rounded-lg border border-border mb-6">
                        <h3 className="font-semibold text-textPrimary mb-2">How It Works:</h3>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Make changes in the app and use the <strong>"Export All JSON"</strong> button.</li>
                            <li>Manually upload the exported file to your server (like a GitHub repository).</li>
                            <li>Get the <strong>"Raw" URL</strong> for the uploaded JSON file.</li>
                            <li>Paste the URL below and click <strong>"Connect & Sync"</strong> to load your policies.</li>
                        </ol>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="syncUrl" className="block text-sm font-medium text-textSecondary mb-2">Server "Raw" URL</label>
                            <input
                                type="url"
                                id="syncUrl"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition bg-background text-textPrimary disabled:bg-slate-100"
                                placeholder="https://raw.githubusercontent.com/..."
                                required
                                disabled={currentStatus === 'connecting' || currentStatus === 'connected'}
                            />
                        </div>
                        
                        <div className="flex justify-between items-center gap-3 mt-8">
                            <div>
                                {currentStatus === 'connected' && (
                                    <button
                                        type="button"
                                        onClick={handleDisconnect}
                                        className="px-5 py-2 text-sm font-semibold text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors duration-200"
                                    >
                                        Disconnect
                                    </button>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    type="button" 
                                    onClick={onClose} 
                                    className="px-5 py-2 text-sm font-semibold rounded-lg border border-border text-textSecondary bg-surface hover:bg-slate-100 hover:text-textPrimary transition-colors duration-200"
                                >
                                    Close
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-5 py-2 w-40 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary-dark shadow-sm hover:shadow-md disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-wait disabled:shadow-none transition-all duration-200"
                                    disabled={!url.trim() || currentStatus === 'connecting' || currentStatus === 'connected'}
                                >
                                    {currentStatus === 'connecting' ? (
                                        <svg className="animate-spin mx-auto h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        'Connect & Sync'
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LiveSyncModal;