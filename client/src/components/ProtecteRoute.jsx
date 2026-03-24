import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const userId = localStorage.getItem('userId');

    // 🔒 Agar localStorage mein userId nahi hai, to wapis Login page pe bhej do
    if (!userId) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;