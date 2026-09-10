import React from 'react';
import { createPortal } from 'react-dom';
import { useWorkspace } from '../context/WorkspaceContext';
import { PanelLeft, Sparkles, Play, Pause, Compass, CheckSquare, FileText, BarChart3, Sliders, Camera, Bell, X } from 'lucide-react';
import { ViewMode } from '../types';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    isFocusActive,
    toggleFocusSession,
    focusSecondsLeft,
    toggleSidebar
    , notifications, dismissNotification, clearNotifications
  } = useWorkspace();
  const { user, signOut, deleteAccount, updateProfile } = useAuth();
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [profileName, setProfileName] = React.useState(user?.name || '');
  const [profileStatus, setProfileStatus] = React.useState('');

  const handleDeleteAccount = async () => {
    if (!window.confirm('Delete your account and all workspace data permanently? This cannot be undone.')) return;
    try {
      await deleteAccount();
    } catch {
      window.alert('Unable to delete the account. Please try again.');
    }
  };
  const saveProfile = async () => {
    try { await updateProfile({ name: profileName }); setProfileStatus('Profile saved'); }
    catch (error) { setProfileStatus(error instanceof Error ? error.message : 'Unable to save profile'); }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const navLinks: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'desk', label: 'Desk', icon: <Compass className="w-4 h-4" /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'vision', label: 'Vision', icon: <Camera className="w-4 h-4" /> },
    { id: 'documents', label: 'Documents', icon: <FileText className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'automations', label: 'Automations', icon: <Sliders className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#EAE7DF] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left branding & sidebar toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl text-[#73716B] hover:text-[#242426] hover:bg-[#F2EFE8] transition-colors"
            title="Toggle Sidebar Navigation"
            aria-label="Toggle Sidebar"
          >
            <PanelLeft className="w-5 h-5" />
          </button>

          <div
            onClick={() => setCurrentView('desk')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#769A7A] to-[#C8E6C9] p-0.5 shadow-sm flex items-center justify-center text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-white shadow-inner animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-base text-[#242426] tracking-tight leading-none group-hover:text-[#44664A] transition-colors">
                Adaptive Workspace
              </span>
              <span className="text-xs text-[#73716B] mt-1 leading-none">
                Your calm, adaptive work environment
              </span>
            </div>
          </div>
        </div>

        {/* Center / Right Links */}
        <div className="flex items-center gap-3 sm:gap-6">
          <nav className="hidden lg:flex items-center gap-1.5 bg-[#F2EFE8]/70 p-1 rounded-full border border-[#EAE7DF]">
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentView(link.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white text-[#242426] shadow-sm font-semibold'
                      : 'text-[#73716B] hover:text-[#242426] hover:bg-white/50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Hero button: Start Focus Session */}
          <button
            onClick={toggleFocusSession}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-tight transition-all duration-200 shadow-sm cursor-pointer ${
              isFocusActive
                ? 'bg-[#FFE0B2] text-[#865221] hover:bg-[#FDB87E] ring-2 ring-[#FFE0B2]/50'
                : 'bg-[#C8E6C9] text-[#1C331F] hover:bg-[#A8DAB0]'
            }`}
          >
            {isFocusActive ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#865221] animate-ping" />
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Session Active • {formatTimer(focusSecondsLeft)}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Focus Session</span>
              </>
            )}
          </button>
          <button onClick={() => setProfileOpen(true)} className="hidden sm:block text-[11px] text-[#73716B] hover:text-[#242426]" title="Open profile">
            {user?.name || 'Account'}
          </button>
          <div className="relative hidden sm:block group" title={notifications[0] || 'No recent notifications'}>
            <Bell className="w-4 h-4 text-[#73716B]" />
            {notifications.length > 0 && <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 rounded-full bg-[#865221] text-white text-[9px] flex items-center justify-center">{notifications.length}</span>}
            {notifications.length > 0 && <div className="hidden group-hover:block absolute right-0 top-6 w-72 bg-white border border-[#EAE7DF] rounded-2xl shadow-xl p-3 z-50">
              <div className="flex justify-between items-center mb-2"><span className="text-xs font-semibold">Notifications</span><button onClick={clearNotifications} className="text-[10px] text-[#44664A]">Clear all</button></div>
              {notifications.map((notification, index) => <div key={`${notification}-${index}`} className="flex gap-2 items-start py-2 border-t border-[#F2EFE8] text-[11px]"><span className="flex-1">{notification}</span><button onClick={() => dismissNotification(index)} aria-label="Dismiss notification"><X className="w-3 h-3 text-[#8F8D86]" /></button></div>)}
            </div>}
          </div>
        </div>
      </div>
      {profileOpen && createPortal(
        <div className="fixed inset-0 z-[100] bg-[#242426]/25 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setProfileOpen(false)}>
          <section className="bg-[#FAF9F5] border border-[#EAE7DF] rounded-3xl w-full max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto p-6 shadow-xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between border-b border-[#EAE7DF] pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#865221] font-semibold">Profile</p>
                <h2 className="text-xl font-semibold text-[#242426] mt-1">{user?.name || 'Account'}</h2>
                <p className="text-sm text-[#73716B] mt-1">{user?.email}</p>
                <input value={profileName} onChange={(event) => setProfileName(event.target.value)} className="mt-3 w-full rounded-xl border border-[#EAE7DF] bg-white px-3 py-2 text-sm" aria-label="Display name" />
                <button onClick={saveProfile} className="mt-2 rounded-xl bg-[#44664A] px-3 py-2 text-xs font-semibold text-white">Save profile</button>
                {profileStatus && <p className="text-[11px] text-[#44664A] mt-2">{profileStatus}</p>}
              </div>
              <button onClick={() => setProfileOpen(false)} className="p-2 rounded-full hover:bg-[#F2EFE8]" aria-label="Close profile">
                <X className="w-4 h-4 text-[#73716B]" />
              </button>
            </div>
            <div className="py-5">
              <p className="text-xs text-[#73716B]">Manage your workspace session and account settings here.</p>
              <button onClick={signOut} className="mt-4 w-full rounded-xl border border-[#EAE7DF] py-2.5 text-sm font-semibold text-[#44664A] hover:bg-white">
                Sign out
              </button>
            </div>
            <div className="border-t border-[#EAE7DF] pt-4">
              <p className="text-[11px] text-[#8F8D86] mb-3">Danger zone</p>
              <button onClick={handleDeleteAccount} className="w-full rounded-xl border border-[#FFDAD6] bg-[#FFF5F3] py-2.5 text-sm font-semibold text-[#93000A] hover:bg-[#FFDAD6]">
                Delete account permanently
              </button>
            </div>
          </section>
        </div>,
        document.body
      )}
    </header>
  );
};
