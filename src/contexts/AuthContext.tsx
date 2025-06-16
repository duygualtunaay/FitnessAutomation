import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  onAuthStateChanged,
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider, // Google sağlayıcısını import et
  signInWithPopup     // Popup ile giriş için import et
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

// Projemizdeki kullanıcı modelini tanımlıyoruz
interface User {
  id: string; // Firebase UID
  name: string;
  email: string;
  role: 'member' | 'admin';
  membershipPlan: 'basic' | 'premium' | 'ai-plus';
  membershipExpiry: Date;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  loginWithGoogle: () => Promise<boolean>; // YENİ: Google ile giriş fonksiyonu tipi
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const userDocRef = doc(db, 'users', fbUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            id: fbUser.uid,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            membershipPlan: userData.membershipPlan,
            membershipExpiry: userData.membershipExpiry.toDate(),
          });
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error("Giriş hatası:", error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      const userData: Omit<User, 'id'> = {
        name,
        email,
        role: 'member',
        membershipPlan: 'basic',
        membershipExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };
      await setDoc(doc(db, 'users', newUser.uid), userData);
      return true;
    } catch (error) {
      console.error("Kayıt hatası:", error);
      return false;
    }
  };

  // YENİ FONKSİYON: Google ile giriş
  const loginWithGoogle = async (): Promise<boolean> => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;

      // Firestore'da bu kullanıcı var mı diye kontrol et
      const userDocRef = doc(db, 'users', googleUser.uid);
      const userDoc = await getDoc(userDocRef);

      // Eğer kullanıcı veritabanında yoksa (ilk kez giriş yapıyorsa),
      // onun için yeni bir profil oluşturalım.
      if (!userDoc.exists()) {
        const newUserProfile: Omit<User, 'id'> = {
          name: googleUser.displayName || 'Google Kullanıcısı',
          email: googleUser.email!,
          role: 'member',
          membershipPlan: 'basic', // Yeni kullanıcılar için 7 günlük deneme
          membershipExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        };
        await setDoc(userDocRef, newUserProfile);
      }
      return true;
    } catch (error) {
      console.error("Google ile giriş hatası:", error);
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    firebaseUser,
    login,
    register,
    logout,
    isLoading,
    loginWithGoogle, // YENİ: Değeri context'e ekle
  };

  return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>;
};