import { useContext, createContext } from "react";

// It's common practice to use null as the default value here
export const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    
    // 🛑 CRITICAL SAFETY CHECK ADDED HERE
    if (context === null) {
        // This throws a clear error if useAuth is called outside of the provider.
        throw new Error('useAuth must be used within an AuthProvider. Check your component tree!');
    }
    
    return context;
};
