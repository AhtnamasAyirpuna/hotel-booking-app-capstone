import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {

            if (!user) {
                setCurrentUser(null);
                setLoading(false);
                return;
            }

            try {
                const token = await user.getIdToken();

                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/users/me`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const userData = await res.json();

                setCurrentUser({
                    uid: user.uid,
                    email: user.email,
                    profile_image: userData.profile_image,
                });

            } catch (error) {
                console.error("Error fetching profile:", error);

                // fallback to firebase user
                setCurrentUser(user);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}