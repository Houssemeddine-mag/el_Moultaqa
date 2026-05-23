export function onAuthStateChanged(listener) {
  listener(null);
  return () => {};
}

export async function registerUser(email, password) {
  return { user: { uid: `guest-${Date.now()}`, email } };
}

export async function loginUser(email, password) {
  return { user: { uid: `guest-${Date.now()}`, email } };
}

export async function signInWithGoogle() {
  return { user: { uid: `guest-${Date.now()}`, email: "guest@example.com" } };
}

export async function logoutUser() {
  return;
}

export async function saveConferenceConfig(conference) {
  return `conf-${Date.now()}`;
}
