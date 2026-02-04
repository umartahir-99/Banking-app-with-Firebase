import { auth, firestore } from "../config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

const Auth = createContext();

const initialState = { isAuth: false, user: {} };
const AuthContext = ({ children }) => {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [state, setState] = useState(initialState);
  const readProfile = () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setState({ isAuth: true, user });
        const docSnap = await getDoc(doc(firestore, "users", user.uid));

        if (docSnap.exists()) {
          const user = { ...docSnap.data(), id: docSnap.id };
          setState({ isAuth: true, user });
        } else {
          // Create basic profile if not found
          const userData = {
            uid: user.uid,
            email: user.email,
            name: user.displayName || user.email.split('@')[0], // Use part of email as name
            status: "active",
            role: "Customer",
            createdAt: new Date().getTime()
          };
          await setDoc(doc(firestore, "users", user.uid), userData);
          const userProfile = { ...userData, id: user.uid };
          setState({ isAuth: true, user: userProfile });
        }

        setIsAppLoading(false);
      } else {
        setIsAppLoading(false
          
        );
      }
    });
  };

  useEffect(() => {
    readProfile();
  }, []);
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setState(initialState);
        window.toastify("Logout Successfully", "success");
        // Navigate will be handled by the component that calls this
      })
      .catch((error) => {
        console.error(error);
        window.toastify("Please try again", "info");
      });
  };
  return (
    //<Auth.Provider value ={{ isAuth: state.isAuth, user: state.user , isAppLoading}} >    another way to write ...state
    <Auth.Provider
      value={{ ...state, isAppLoading, handleLogout, dispatch: setState }}
    >
      {children}
    </Auth.Provider>
  );
};

export default AuthContext;

export const useAuth = () => useContext(Auth);
