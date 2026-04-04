import { Navigate } from "react-router-dom"
import { useAuth } from "../context/useAuth"

const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();

    if (loading) return null

    if (!currentUser) {
        return <Navigate to="/" replace />
    }

    return children
}

export default ProtectedRoute