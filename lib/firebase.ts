import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebase가 완전히 구성되었는지 검증
export const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== "dummy-key"
);

let app;
let auth: any;
let db: any;

if (isFirebaseConfigured) {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  // 빌드 및 테스트 방어용 Mock 객체 생성
  app = null;
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback: any) => {
      // 로컬 대시보드 진입을 위해 즉시 비로그인 상태로 콜백 호출
      setTimeout(() => callback(null), 10);
      return () => {};
    },
    signInWithPopup: () => Promise.reject(new Error("Firebase 환경변수가 설정되지 않았습니다.")),
    signOut: () => Promise.resolve(),
  };
  db = {};
}

export { app, auth, db };
