import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  isAuthConfigured,
  requireSupabase,
  supabase,
} from "../../lib/supabase";

type AuthContextValue = {
  configured: boolean;
  loading: boolean;
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isAuthConfigured);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await requireSupabase().auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await requireSupabase().auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return !data.session;
  };

  const signOut = async () => {
    const { error } = await requireSupabase().auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        configured: isAuthConfigured,
        loading,
        session,
        user: session?.user ?? null,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider.");
  return value;
}
