// ============================================================================
// AuthContext — Clerk-backed authentication context
// ============================================================================
// Provides { user, loading } to the rest of the app.
// Internally uses Clerk's useUser() hook but maps the user object to the
// shape expected by existing components (uid, email, displayName, photoURL).
//
// Your custom auth UI pages continue to work — Clerk handles the backend,
// you control the UI.
// ============================================================================

import { createContext, useContext, useMemo } from "react";
import { useUser } from "@clerk/clerk-react";

const AuthContext = createContext({
  user: null,
  loading: true,
});

export function AuthProvider({ children }) {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();

  // Map Clerk's user object to the shape the rest of the app expects.
  // This keeps all existing components (ProtectedRoute, ProfilePage, etc.)
  // working without changes.
  const user = useMemo(() => {
    if (!isLoaded || !isSignedIn || !clerkUser) return null;

    return {
      // Core identifiers
      uid: clerkUser.id,
      id: clerkUser.id,

      // Contact info
      email: clerkUser.primaryEmailAddress?.emailAddress || "",

      // Display info (used by topbar, profile page, etc.)
      displayName:
        clerkUser.fullName ||
        clerkUser.firstName ||
        clerkUser.primaryEmailAddress?.emailAddress?.split("@")[0] ||
        "User",
      firstName: clerkUser.firstName || "",
      lastName: clerkUser.lastName || "",
      photoURL: clerkUser.imageUrl || null,
      avatar: clerkUser.imageUrl || null,

      // Metadata (used by some components)
      metadata: {
        creationTime: clerkUser.createdAt?.toISOString() || null,
        lastSignInTime: clerkUser.lastSignInAt?.toISOString() || null,
      },

      // Raw Clerk user for advanced use cases
      _clerk: clerkUser,
    };
  }, [isLoaded, isSignedIn, clerkUser]);

  const loading = !isLoaded;

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

