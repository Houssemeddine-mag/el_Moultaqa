export function onAuthStateChanged(listener) {
  listener(null);
  return () => {};
}

export async function registerUser(email, password) {
  return { user: { uid: `guest-${Date.now()}`, email } };
}

export async function loginUser(email, password) {
  // Template/testing credentials
  const TEMPLATE_EMAIL = "a@a.a";
  const TEMPLATE_PASSWORD = "aaaaaa";

  if (email === TEMPLATE_EMAIL && password === TEMPLATE_PASSWORD) {
    return { user: { uid: `template-admin`, email } };
  }

  // keep previous behavior for development registration flows by throwing for other credentials
  throw new Error("Invalid email or password (use template credentials)");
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
