import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { auth, database } from "../firebase";

export const AuthContext = createContext({
  currentUser: null,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

//AuthProvider
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    //listen for changes in firebase's auth state
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        //look up full user record in firebase
        const userRef = ref(database, `users/${fbUser.uid}`);
        get(userRef)
          .then((snap) => {
            if (snap.exists()) {
              //merge uid and /users/{uid}
              setCurrentUser({ uid: fbUser.uid, ...snap.val() });
            } else {
              //fallback if no database record yet
              setCurrentUser({
                uid: fbUser.uid,
                email: fbUser.email,
                username: fbUser.displayName,
              });
            }
          })
          .catch((err) => {
            console.error("Error fetching user record:", err);
            //ensure uid is set
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

    return unsubscribe; //clean up listener on unmount
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
