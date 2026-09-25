import { useEffect, type ReactNode } from 'react';
import { useAuth } from '@clerk/expo';

import SupabaseService from '../services/supabase';

// Sets SupabaseService.tokenProvider from the Clerk session so every
// org_query carries a valid JWT (raw string — getToken already returns one,
// never an object, so the Flutter `.toString()` PGRST301 bug can't recur).
// Signed out → tokenProvider cleared → anon requests (public RPCs only).
export default function ClerkBridge({ children }: { children: ReactNode }) {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      SupabaseService.tokenProvider = () => getToken({ template: 'supabase' });
    } else {
      SupabaseService.tokenProvider = null;
    }
  }, [getToken, isSignedIn]);

  return <>{children}</>;
}
