import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

const navLinks = [
  { name: 'Garage', path: '#hero' },
  { name: 'Projects', path: '#projects' },
  { name: 'Skills', path: '#skills' },
  { name: 'About', path: '#about' },
  { name: 'Contact', path: '#contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    // Navigate to home FIRST to unmount the ProtectedRoute
    navigate('/');
    // Clear session immediately after
    setTimeout(async () => {
      await signOut();
    }, 50);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-background/80 backdrop-blur-md border-border'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2">
            <div className="w-8 h-8 bg-card border border-border rounded flex items-center justify-center transition-all duration-300 group-hover:border-primary group-hover:shadow-glow-primary">
              <span className="font-display font-bold text-primary">H</span>
            </div>
            <span className="font-display font-bold text-lg tracking-wider hidden sm:block">
              HYPER<span className="text-primary">CAR</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          {!isAdminRoute && (
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  className="relative font-body text-sm uppercase tracking-widest text-muted-foreground hover:text-white transition-colors duration-300 group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
              <Link
                to="/admin"
                className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                <Shield size={14} />
                <span>ADMIN</span>
              </Link>
            </div>
          )}

          {/* Admin Logout Button (Desktop & Mobile) */}
          {isAdminRoute && user && (
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="btn-mechanical flex items-center gap-2 bg-transparent border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-md transition-all duration-300 font-mono text-xs tracking-widest uppercase hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">TERMINATE SESSION</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          {!isAdminRoute && (
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-muted-foreground hover:text-primary transition-colors duration-300 focus:outline-none"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav Accordion */}
      <AnimatePresence>
        {mobileMenuOpen && !isAdminRoute && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-background-secondary border-b border-border"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 font-body text-base uppercase tracking-widest text-muted-foreground hover:text-white hover:bg-card rounded-md transition-colors duration-300"
                >
                  {link.name}
                </a>
              ))}
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 font-mono text-sm text-muted-foreground hover:text-primary hover:bg-card rounded-md transition-colors duration-300 mt-4 border-t border-border pt-4"
              >
                <Shield size={16} />
                <span>ADMIN LOGIN</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
