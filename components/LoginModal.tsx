import React, { useState } from 'react';

interface LoginModalProps {
  onLogin: (success: boolean) => void;
  onClose: () => void;
}

const SecurityShieldIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
    </svg>
);


const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        // Hardcoded credentials for demonstration purposes
        if (username === 'admin' && password === 'password') {
            onLogin(true);
        } else {
            setError('Invalid credentials. Hint: admin / password');
            onLogin(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
            onClick={onClose}
        >
            <div 
                className="bg-surface rounded-xl shadow-lg w-full max-w-md animate-fade-in overflow-hidden border border-border" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-8 border-b border-border relative bg-slate-50 flex items-center gap-4">
                    <div className="flex-shrink-0 p-3 bg-amber-100 rounded-full text-primary-dark">
                        <SecurityShieldIcon />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-textPrimary">Administrator Login</h2>
                        <p className="text-sm text-textSecondary mt-1">Please enter your credentials.</p>
                    </div>
                    <button onClick={onClose} className="absolute top-4 right-4 text-textMuted hover:text-textPrimary transition-colors text-3xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="p-8">
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-textSecondary mb-2">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition bg-background text-textPrimary"
                            required
                            autoFocus
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-textSecondary mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition bg-background text-textPrimary"
                            required
                        />
                    </div>
                    
                    {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

                    <div className="flex justify-end gap-3">
                         <button 
                            type="button"
                            onClick={onClose} 
                            className="px-5 py-2 text-sm font-semibold rounded-lg border border-border text-textSecondary bg-surface hover:bg-slate-100 hover:text-textPrimary transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-5 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary-dark shadow-sm hover:shadow-md transition-all duration-200"
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