import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Shield, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    // Check for MFA requirement
    // In a fully robust implementation, we would check data.session?.user?.factors
    // and trigger MFA challenge if required.
    
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 z-0 pointer-events-none"></div>
      
      {/* Back to Home Button */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 md:top-12 md:left-12 z-20 flex items-center gap-2 font-mono text-sm tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft size={18} />
        <span>Return to Base</span>
      </Link>
      
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md z-10"
      >
        <div className="card-metallic glass-panel p-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center mb-8"
          >
            <div className="w-16 h-16 bg-card border border-border rounded-xl flex items-center justify-center mb-4 shadow-glow-primary text-primary">
              <Shield size={32} />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-widest uppercase">Admin Override</h1>
            <p className="font-mono text-xs text-muted-foreground mt-2">SECURE AUTHENTICATION REQUIRED</p>
          </motion.div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Operator ID</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-background-secondary border border-border rounded-md px-4 py-3 text-white font-body focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <label className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Access Key</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-background-secondary border border-border rounded-md px-4 py-3 text-white font-body focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-md text-sm flex items-center gap-2 font-mono"
                >
                  <ShieldAlert size={16} />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-mechanical w-full bg-primary text-background font-bold px-8 py-4 rounded-md shadow-glow-primary hover:shadow-[0_0_30px_hsl(var(--primary-glow))] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'AUTHENTICATE'
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
