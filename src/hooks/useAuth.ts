import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'; // On importe le contexte

// Le hook est maintenant dans son propre fichier, c'est plus propre.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};