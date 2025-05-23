import "server-only";

import { cert, getApps, initializeApp, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const app = !getApps().length
  ? initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      // storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    })
  : getApp();

const db = getFirestore(app);
// const storage = getStorage(app).bucket();

export { db };
