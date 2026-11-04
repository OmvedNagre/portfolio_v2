import { createContext, useContext } from 'react';
import type { User, Session } from '@supabase/supabase-js';
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function isOwner(user: User | null) { return user?.app_metadata.portfolio_owner === true; }
