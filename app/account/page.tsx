'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/I18nContext';
import Link from 'next/link';

export default function AccountPage() {
  const { currentUser, login, register, logout } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const success = await login(email, password);
      if (success) {
        router.push('/collection');
      } else {
        setError(t('message.invalid_credentials'));
      }
    } else {
      if (password !== confirmPassword) {
        setError(t('message.passwords_dont_match'));
        return;
      }
      const success = await register(username, email, password);
      if (success) {
        router.push('/collection');
      } else {
        setError(t('message.user_exists'));
      }
    }
  };

  if (currentUser) {
    const collection = currentUser.collection || [];
    const totalCards = collection.reduce((sum, card) => sum + card.quantity, 0);
    const uniqueCards = collection.length;
    const estimatedValue = collection.reduce((sum, card) => sum + (card.estimatedValue * card.quantity), 0);

    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-[800px] mx-auto">
          <div className="glass-card p-8">
            <h1 className="text-3xl font-bold text-charcoal mb-2">{t('account.welcome')}, {currentUser.username}!</h1>
            <p className="text-gray-600 mb-6">{currentUser.email}</p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">{t('account.total_cards')}</p>
                <p className="text-2xl font-bold text-poke-blue">{totalCards}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">{t('account.unique_cards')}</p>
                <p className="text-2xl font-bold text-poke-yellow">{uniqueCards}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">{t('account.est_value')}</p>
                <p className="text-2xl font-bold text-charcoal">${estimatedValue}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Link href="/collection" className="flex-1 bg-poke-blue hover:bg-poke-blue-hover text-white text-center px-6 py-3 rounded-lg">
                {t('account.view_collection')}
              </Link>
              <button
                onClick={logout}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                {t('account.logout')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="glass-card p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-charcoal mb-6 text-center">
          {isLogin ? t('account.signin') : t('account.signup')}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('account.username')}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-poke-blue"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('account.email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-poke-blue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('account.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-poke-blue"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('account.confirm_password')}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-poke-blue"
                required={!isLogin}
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-poke-blue hover:bg-poke-blue-hover text-white py-3 rounded-lg font-semibold"
          >
            {isLogin ? t('account.signin_button') : t('account.signup_button')}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-poke-blue hover:underline text-sm"
          >
            {isLogin ? t('account.no_account') : t('account.have_account')}{' '}
            {isLogin ? t('account.signup_link') : t('account.signin_link')}
          </button>
        </div>
      </div>
    </div>
  );
}
