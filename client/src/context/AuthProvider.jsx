import { useEffect, useState, useCallback } from "react";
import { auth } from "../firebase";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = useCallback(async (user) => {
        if (!user) return;

        try {
            const token = await user.getIdToken();
            const res = await fetch(`/api/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const userData = await res.json();
                setCurrentUser({
                    uid: user.uid,
                    email: user.email,
                    profile_image: userData.profile_image || user.photoURL,
                });
            } else {
                setCurrentUser({
                    uid: user.uid,
                    email: user.email,
                    profile_image: user.photoURL,
                });
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            setCurrentUser({
                uid: user.uid,
                email: user.email,
                profile_image: user.photoURL,
            });
        }
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                setCurrentUser(null);
                setLoading(false);
                return;
            }

            await fetchUserProfile(user);
            setLoading(false);
        });

        return unsubscribe;
    }, [fetchUserProfile]);

    const refreshUserProfile = async () => {
        if (auth.currentUser) {
            await fetchUserProfile(auth.currentUser);
        }
    };

    return (
        <AuthContext.Provider value={{ currentUser, loading, refreshUserProfile }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}