import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import { auth, database } from "../firebase";

export const AuthContext = createContext({
  currentUser: null,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  /* useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          email: user.email,
          username: user.displayName,
        });
      } else {
        setCurrentUser(null);
      }

      console.log('user', user) //console.log current user if there is one
    });
  }, []); 

  
  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
*/
useEffect(() => {
  // Listen for Firebase Auth state changes
  const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
    if (fbUser) {
      // Look up the full user record in Realtime Database
      const userRef = ref(database, `users/${fbUser.uid}`);
      get(userRef)
        .then((snap) => {
          if (snap.exists()) {
            // Merge in the uid and everything from your /users/{uid} node
            setCurrentUser({ uid: fbUser.uid, ...snap.val() });
          } else {
            // Fallback if you don’t have a database record yet
            setCurrentUser({
              uid: fbUser.uid,
              email: fbUser.email,
              username: fbUser.displayName,
            });
          }
        })
        .catch((err) => {
          console.error("Error fetching user record:", err);
          // at least ensure uid is set
          setCurrentUser({
            uid: fbUser.uid,
            email: fbUser.email,
            username: fbUser.displayName,
          });
        });
    } else {
      setCurrentUser(null);
    }
  });

  return unsubscribe; // clean up listener on unmount
}, []);

return (
  <AuthContext.Provider value={{ currentUser }}>
    {children}
  </AuthContext.Provider>
);
};