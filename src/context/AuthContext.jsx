import { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  db, 
  isFirebaseConfigured 
} from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove 
} from 'firebase/firestore';

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myList, setMyList] = useState([]);
  const [currentProfile, setCurrentProfile] = useState({
    name: 'Guest User',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    id: 1
  });

  // Load user profile from localStorage if exists
  useEffect(() => {
    const savedProfile = localStorage.getItem('netflix_active_profile');
    if (savedProfile) {
      try {
        setCurrentProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const changeProfile = (profile) => {
    setCurrentProfile(profile);
    localStorage.setItem('netflix_active_profile', JSON.stringify(profile));
  };

  // Auth Operations
  const signUp = async (email, password) => {
    if (isFirebaseConfigured) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Initialize Firestore document for user's list
      await setDoc(doc(db, 'users', email), {
        savedShows: []
      });
      return userCredential;
    } else {
      // Mock Sign Up
      const mockUsers = JSON.parse(localStorage.getItem('netflix_mock_users') || '[]');
      if (mockUsers.find(u => u.email === email)) {
        throw new Error('Email already in use (Mock Mode)');
      }
      mockUsers.push({ email, password });
      localStorage.setItem('netflix_mock_users', JSON.stringify(mockUsers));
      const mockUser = { email, uid: 'mock_uid_' + Date.now() };
      setUser(mockUser);
      localStorage.setItem('netflix_mock_current_user', JSON.stringify(mockUser));
      return { user: mockUser };
    }
  };

  const logIn = async (email, password) => {
    if (isFirebaseConfigured) {
      return signInWithEmailAndPassword(auth, email, password);
    } else {
      // Mock Login
      const mockUsers = JSON.parse(localStorage.getItem('netflix_mock_users') || '[]');
      const match = mockUsers.find(u => u.email === email && u.password === password);
      if (!match) {
        throw new Error('Invalid email or password (Mock Mode)');
      }
      const mockUser = { email, uid: 'mock_uid_' + Date.now() };
      setUser(mockUser);
      localStorage.setItem('netflix_mock_current_user', JSON.stringify(mockUser));
      return { user: mockUser };
    }
  };

  const logOut = async () => {
    if (isFirebaseConfigured) {
      return signOut(auth);
    } else {
      setUser(null);
      localStorage.removeItem('netflix_mock_current_user');
      setMyList([]);
    }
  };

  // Sync Auth State
  useEffect(() => {
    if (isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      const savedUser = localStorage.getItem('netflix_mock_current_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    }
  }, []);

  // Sync Favorites List (My List)
  useEffect(() => {
    if (!user) {
      setMyList([]);
      return;
    }

    if (isFirebaseConfigured) {
      const docRef = doc(db, 'users', user.email);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setMyList(docSnap.data().savedShows || []);
        } else {
          // Initialize user doc if it doesn't exist
          setDoc(docRef, { savedShows: [] });
        }
      }, (error) => {
        console.error("Firestore loading error:", error);
      });
      return () => unsubscribe();
    } else {
      // Load list from LocalStorage for mock mode
      const saved = localStorage.getItem(`netflix_mock_mylist_${user.email}`);
      if (saved) {
        try {
          setMyList(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      } else {
        setMyList([]);
      }
    }
  }, [user]);

  // Add/Remove from My List
  const toggleMyList = async (movie) => {
    if (!user) {
      alert("Please log in to save titles to your list.");
      return;
    }

    const movieSummary = {
      id: movie.id,
      title: movie.title || movie.name,
      name: movie.name || movie.title,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      overview: movie.overview,
      vote_average: movie.vote_average,
      release_date: movie.release_date || movie.first_air_date,
      media_type: movie.media_type || (movie.title ? 'movie' : 'tv')
    };

    const isAlreadyAdded = myList.some(item => item.id === movie.id);

    if (isFirebaseConfigured) {
      const docRef = doc(db, 'users', user.email);
      if (isAlreadyAdded) {
        await updateDoc(docRef, {
          savedShows: arrayRemove(myList.find(item => item.id === movie.id))
        });
      } else {
        await updateDoc(docRef, {
          savedShows: arrayUnion(movieSummary)
        });
      }
    } else {
      // Mock List toggle
      let updatedList;
      if (isAlreadyAdded) {
        updatedList = myList.filter(item => item.id !== movie.id);
      } else {
        updatedList = [...myList, movieSummary];
      }
      setMyList(updatedList);
      localStorage.setItem(`netflix_mock_mylist_${user.email}`, JSON.stringify(updatedList));
    }
  };

  const isInMyList = (movieId) => {
    return myList.some(item => item.id === movieId);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signUp, 
      logIn, 
      logOut, 
      myList, 
      toggleMyList, 
      isInMyList,
      currentProfile,
      changeProfile
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function UserAuth() {
  return useContext(AuthContext);
}
