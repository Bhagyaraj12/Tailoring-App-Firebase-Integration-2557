// Mock Firebase services - simplified for build compatibility

const mockAuth = {
  currentUser: null,
  onAuthStateChanged: (callback) => {
    setTimeout(() => callback(null), 0);
    return () => {};
  },
  signInWithEmailAndPassword: async () => ({
    user: {
      uid: 'mock-user-' + Math.random().toString(36).substr(2, 9),
      email: 'user@example.com',
      displayName: 'Mock User'
    }
  }),
  createUserWithEmailAndPassword: async () => ({
    user: {
      uid: 'mock-user-' + Math.random().toString(36).substr(2, 9),
      email: 'user@example.com',
      displayName: 'Mock User'
    }
  }),
  signInAnonymously: async () => ({
    user: {
      uid: 'anon-user-' + Math.random().toString(36).substr(2, 9),
      isAnonymous: true
    }
  }),
  signOut: async () => true
};

const mockFirestore = {
  collection: () => ({}),
  doc: () => ({}),
  query: () => ({}),
  where: () => ({}),
  orderBy: () => ({})
};

const mockStorage = {
  ref: () => ({}),
  uploadBytes: async () => ({}),
  getDownloadURL: async () => 'https://example.com/mock-image.jpg'
};

export const auth = mockAuth;
export const db = mockFirestore;
export const storage = mockStorage;

export default { name: 'mock-firebase-app' };