import { createContext, useContext, useState } from 'react';
// import { getMe } from '../services/api'; // AUTH DISABLED

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // ── AUTH DISABLED ─────────────────────────────────────────────────────────
  // Real auth (token storage + /me fetch) is commented out below.
  // A stub guest user is returned so the app works without login.
  const [user] = useState({ id: '000000000000000000000001', name: 'Guest', email: 'guest@local' });
  const loading = false;

  const loginUser  = () => {}; // no-op while auth is disabled
  const logoutUser = () => {}; // no-op while auth is disabled

  // ── Original auth logic (restore to re-enable) ───────────────────────────
  // const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   const token = localStorage.getItem('sg_token');
  //   if (token) {
  //     getMe()
  //       .then((res) => setUser(res.data.user))
  //       .catch(() => { localStorage.removeItem('sg_token'); })
  //       .finally(() => setLoading(false));
  //   } else {
  //     setLoading(false);
  //   }
  // }, []);
  // const loginUser = (token, userData) => { localStorage.setItem('sg_token', token); setUser(userData); };
  // const logoutUser = () => { localStorage.removeItem('sg_token'); setUser(null); };
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
