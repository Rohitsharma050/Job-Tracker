import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login({ email, password });
      loginUser(res.data.token, res.data.user);
      navigate('/board');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-[360px]">
        <div className="mb-10">
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Sign in to your SkillGraph+ account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-status-rejected bg-red-50 px-3 py-2 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-xs font-medium text-text-secondary mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-surface text-text-primary placeholder:text-text-tertiary focus-ring transition-base"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-text-secondary mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-surface text-text-primary placeholder:text-text-tertiary focus-ring transition-base"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-md transition-base disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Signing in...' : (
              <>
                Sign in
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-text-primary font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
