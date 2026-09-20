import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Firebase 앱 인스턴스 초기화 (싱글톤)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firestore 데이터베이스 인스턴스 (지정된 firestoreDatabaseId 사용)
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);
