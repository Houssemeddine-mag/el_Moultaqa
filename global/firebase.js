import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  getDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_FIREBASE_API_KEY",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_FIREBASE_PROJECT_ID",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "YOUR_FIREBASE_STORAGE_BUCKET",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    "YOUR_FIREBASE_MESSAGING_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_FIREBASE_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export function onAuthStateChanged(listener) {
  return firebaseOnAuthStateChanged(auth, listener);
}

export function registerUser(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logoutUser() {
  return signOut(auth);
}

export async function saveConferenceConfig(conference) {
  const conferenceRef = doc(collection(db, "conferences"));
  const slug = conference.shortName
    ? conference.shortName.trim().toLowerCase().replace(/\s+/g, "-")
    : conferenceRef.id;

  const payload = {
    ...conference,
    slug,
    attendeeEmails: (conference.attendees || []).filter(Boolean),
    collaborators: (conference.collaborators || []).filter(Boolean),
    sponsors: (conference.sponsors || []).filter(Boolean),
    ownerId: conference.ownerId,
    ownerEmail: conference.ownerEmail,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    published: true,
  };

  await setDoc(conferenceRef, payload);
  return conferenceRef.id;
}

export async function getConferenceById(conferenceId) {
  const conferenceDoc = await getDoc(doc(db, "conferences", conferenceId));
  if (!conferenceDoc.exists()) return null;
  return { id: conferenceDoc.id, ...conferenceDoc.data() };
}

export async function getConferenceBySlug(slug) {
  const conferenceQuery = query(
    collection(db, "conferences"),
    where("slug", "==", slug),
  );
  const snapshot = await getDocs(conferenceQuery);
  const docResult = snapshot.docs[0];
  return docResult ? { id: docResult.id, ...docResult.data() } : null;
}

export async function addConferenceMember(conferenceId, email) {
  const conferenceRef = doc(db, "conferences", conferenceId);
  await updateDoc(conferenceRef, {
    attendeeEmails: arrayUnion(email),
    updatedAt: serverTimestamp(),
  });
}
