import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Palette, Shield, Globe, LogOut } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/utils/helpers';
import Button from '@/components/common/Button';
import Avatar from '@/components/common/Avatar';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'language', label: 'Language', icon: Globe },
];

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [savedMessage, setSavedMessage] = useState('');
  const [notifications, setNotifications] = useState({ email: true, push: false, sounds: true });

  useEffect(() => {
    if (user) {
      setName(user.name || user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSavedMessage('Profile details updated successfully.');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account and preferences</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-56 shrink-0">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap',
                      activeTab === tab.id
                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                    )}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
              <button
                onClick={logout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors whitespace-nowrap"
              >
                <LogOut size={18} />
                Log out
              </button>
            </nav>
          </div>

          <div className="flex-1 min-w-0">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10"
            >
              {activeTab === 'profile' && (
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {savedMessage && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 text-sm">
                      {savedMessage}
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <Avatar src={user?.avatar} name={name || 'User'} size="lg" />
                    <div>
                      <Button type="button" variant="secondary" size="sm">Change photo</Button>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full name</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-indigo-500 focus:outline-none text-sm text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                      <input
                        value={email}
                        readOnly
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <Button type="submit">Save changes</Button>
                </form>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Theme</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Choose how NexusAI looks to you</p>
                    <div className="grid grid-cols-2 gap-3 max-w-sm">
                      <button
                        onClick={() => theme === 'dark' && toggleTheme()}
                        className={cn('p-4 rounded-xl border-2 transition-colors text-left', theme === 'light' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' : 'border-gray-200 dark:border-white/10')}
                      >
                        <div className="h-16 rounded-lg bg-white border border-gray-200 mb-2" />
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Light</p>
                      </button>
                      <button
                        onClick={() => theme === 'light' && toggleTheme()}
                        className={cn('p-4 rounded-xl border-2 transition-colors text-left', theme === 'dark' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' : 'border-gray-200 dark:border-white/10')}
                      >
                        <div className="h-16 rounded-lg bg-gray-900 mb-2" />
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Dark</p>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-white/5 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{key} notifications</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Receive {key} updates about your chats</p>
                      </div>
                      <button
                        onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))}
                        className={cn('relative w-11 h-6 rounded-full transition-colors', val ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-white/10')}
                      >
                        <span className={cn('absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform', val ? 'translate-x-5' : 'translate-x-0.5')} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Current password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-indigo-500 focus:outline-none text-sm text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-indigo-500 focus:outline-none text-sm text-gray-900 dark:text-white" />
                  </div>
                  <Button type="button">Update password</Button>
                </div>
              )}

              {activeTab === 'language' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Interface language</label>
                    <select className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-indigo-500 focus:outline-none text-sm text-gray-900 dark:text-white">
                      <option>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                      <option>Japanese</option>
                    </select>
                  </div>
                  <Button type="button">Save</Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
