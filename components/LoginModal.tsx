import React, { useState } from 'react';

interface LoginModalProps {
  onLogin: (success: boolean) => void;
  onClose: () => void;
}

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
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
            onClick={onClose}
        >
            <div 
                className="bg-surface rounded-xl shadow-xl w-full max-w-md animate-fade-in overflow-hidden" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-8 border-b border-border relative">
                    <h2 className="text-2xl font-bold text-textPrimary">Administrator Login</h2>
                    <p className="text-sm text-textSecondary mt-1">Please enter your credentials to continue.</p>
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors text-3xl">&times;</button>
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
                            className="px-5 py-2 text-sm font-semibold rounded-lg border border-border text-textSecondary bg-surface hover:bg-gray-100 hover:text-textPrimary transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-5 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark shadow-sm hover:shadow-md transition-all duration-200"
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