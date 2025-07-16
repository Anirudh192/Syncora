import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';

export default function OAuthSuccess() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      // Fetch user data from protected route
      fetch('http://localhost:3000/api/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((userData) => {
          const authData = { ...userData, token };
          setAuth(authData); 
          navigate('/dashboard'); 
        })
        .catch((error) => {
          console.error('OAuth Success - Error fetching user data:', error);
          navigate('/login');
        });
    } else {
      console.error('OAuth Success - No token found in URL');
      navigate('/login');
    }
  }, [token, navigate, setAuth]);

  return <div>Logging you in via Google...</div>;
}
