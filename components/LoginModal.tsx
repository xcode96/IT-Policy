import React, { useState } from 'react';

interface LoginModalProps {
  onLogin: (username: string, password: string) => void;
  onClose: () => void;
  error: string;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onClose, error }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(username, password);
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
                    <h2 className="text-2xl font-bold text-textPrimary">Administrator Login</h2>
                    <p className="text-sm text-textSecondary mt-1">Enter credentials to manage policies.</p>
                     <button onClick={onClose} className="absolute top-4 right-4 text-textMuted hover:text-textPrimary transition-colors text-3xl">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8">
                    {error && (
                        <div className="bg-red-900/20 border border-red-500/30 text-red-300 p-3 rounded-md mb-4 text-sm" role="alert">
                            {error}
                        </div>
                    )}
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-textSecondary mb-2">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition bg-background text-textPrimary"
                            placeholder="admin"
                            required
                            autoFocus
                            autoComplete="username"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password"className="block text-sm font-medium text-textSecondary mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition bg-background text-textPrimary"
                            placeholder="password"
                            required
                            autoComplete="current-password"
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
                            disabled={!username.trim() || !password.trim()}
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;