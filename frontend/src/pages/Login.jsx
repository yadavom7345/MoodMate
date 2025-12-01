import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { BookHeart, Activity } from 'lucide-react';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        let res;
        if (isLogin) {
            res = await login(email, password);
        } else {
            res = await register(name, email, password);
        }

        if (!res.success) {
            setError(res.error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cream p-4 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-light/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary-light/30 rounded-full blur-3xl animate-pulse delay-1000" />

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-xl mb-6 text-primary">
                        <BookHeart size={48} className="fill-current" />
                    </div>
                    <h1 className="text-4xl font-bold text-dark mb-3 tracking-tight">MoodMate</h1>
                    <p className="text-slate-500 text-lg">Your mindful journaling companion.</p>
                </div>

                <div className="glass-card p-8 shadow-2xl">
                    <h2 className="text-2xl font-bold mb-8 text-center text-dark">
                        {isLogin ? 'Welcome Back!' : 'Create Account'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-semibold text-slate-500 mb-2 ml-1">Name</label>
                                <input
                                    type="text"
                                    className="w-full px-6 py-3 glass-input font-medium"
                                    placeholder="Your Name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-semibold text-slate-500 mb-2 ml-1">Email</label>
                            <input
                                type="email"
                                className="w-full px-6 py-3 glass-input font-medium"
                                placeholder="hello@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-500 mb-2 ml-1">Password</label>
                            <input
                                type="password"
                                className="w-full px-6 py-3 glass-input font-medium"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</p>}

                        <button
                            type="submit"
                            className="w-full py-4 rounded-full font-semibold bg-primary text-white hover:bg-primary-dark shadow-lg transition-all flex justify-center"
                            disabled={loading}
                        >
                            {loading ? <Activity className="animate-spin" /> : (isLogin ? "Sign In" : "Sign Up")}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-slate-500 hover:text-primary font-medium text-sm"
                        >
                            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
