import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  Globe2,
  Bell,
  Menu,
  X,
  FileText,
  Bookmark,
  HelpCircle,
  BarChart3,
  LogOut,
  FolderOpen,
  Compass,
  Home,
  CheckCircle,
} from 'lucide-react';

interface NavbarProps {
  onOpenLanguageModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLanguageModal }) => {
  const { currentLanguage, t } = useLanguage();
  const { currentUser, logout } = useAuth();
  const {
    activeTab,
    setActiveTab,
    applicationJourneys,
    savedServiceIds,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Action Required: Income Proof Missing',
      desc: 'Upload income certificate to complete Post-Matric Scholarship journey.',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Status Updated: Income Certificate',
      desc: 'Application pending with Revenue Tehsildar (UP/2026/EDIST/88921).',
      time: 'Yesterday',
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Subtle National Tricolor Accent Bar */}
      <div className="w-full h-1 flex">
        <div className="flex-1 bg-amber-600"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-emerald-700"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2 text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-blue-950 transition">
                CA
              </div>
              <div>
                <span className="font-extrabold text-lg text-blue-950 tracking-tight flex items-center gap-1.5">
                  CivicAssist <span className="text-amber-600 font-black">AI</span>
                </span>
                <span className="block text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                  Public Service Navigator
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{t('home')}</span>
            </button>

            <button
              onClick={() => setActiveTab('find_service')}
              className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'find_service'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>{t('find_service')}</span>
            </button>

            <button
              onClick={() => setActiveTab('my_applications')}
              className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer relative ${
                activeTab === 'my_applications'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{t('my_applications')}</span>
              {applicationJourneys.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'my_applications' ? 'bg-amber-500 text-slate-950' : 'bg-blue-100 text-blue-900'
                }`}>
                  {applicationJourneys.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'documents'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              <span>{t('documents')}</span>
            </button>

            <button
              onClick={() => setActiveTab('saved_services')}
              className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer relative ${
                activeTab === 'saved_services'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>{t('saved_services')}</span>
              {savedServiceIds.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('help')}
              className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'help'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>{t('help')}</span>
            </button>

            {/* Admin Insights Button */}
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-1 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'text-slate-600 hover:text-slate-900 border-slate-300 hover:bg-slate-50'
              }`}
              title="View Anonymous Public Service Insights"
            >
              <BarChart3 className="w-3.5 h-3.5 text-blue-700" />
              <span>Admin / Analytics</span>
            </button>
          </nav>

          {/* Right Section: Language, Notifications, User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher Button */}
            <button
              onClick={onOpenLanguageModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-semibold transition shadow-2xs cursor-pointer"
              title="Change Language (23 Indian Languages)"
            >
              <Globe2 className="w-4 h-4 text-blue-800" />
              <span className="hidden sm:inline font-bold text-blue-950">
                {currentLanguage.nativeName}
              </span>
              <span className="text-[10px] text-slate-500 uppercase">
                ({currentLanguage.code})
              </span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg text-slate-600 hover:text-blue-950 hover:bg-slate-100 relative transition cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-600 ring-2 ring-white"></span>
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                      Citizen Alerts & Reminders
                    </span>
                    <span className="text-[11px] text-blue-800 font-medium">2 Active</span>
                  </div>
                  <div className="space-y-2">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-lg text-xs border ${
                          n.unread ? 'bg-amber-50/70 border-amber-200' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="font-semibold text-slate-900">{n.title}</div>
                        <div className="text-slate-600 mt-0.5 leading-snug">{n.desc}</div>
                        <div className="text-[10px] text-slate-400 mt-1">{n.time}</div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      setActiveTab('my_applications');
                    }}
                    className="w-full mt-2.5 py-1 text-center text-xs font-semibold text-blue-900 hover:underline"
                  >
                    View All in My Applications →
                  </button>
                </div>
              )}
            </div>

            {/* User Profile / Logout Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs">
                  {currentUser?.fullName ? currentUser.fullName[0].toUpperCase() : 'C'}
                </div>
                <div className="hidden lg:block text-left text-xs">
                  <div className="font-bold text-slate-900 truncate max-w-[110px]">
                    {currentUser?.fullName || 'Citizen'}
                  </div>
                  <div className="text-[10px] text-slate-500">Verified Profile</div>
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {currentUser?.fullName}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      Session Active
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenLanguageModal();
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Globe2 className="w-3.5 h-3.5 text-blue-800" />
                    <span>Change Language</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setActiveTab('admin');
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-slate-600" />
                    <span>Admin Analytics Dashboard</span>
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1">
          <button
            onClick={() => {
              setActiveTab('home');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold ${
              activeTab === 'home' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>{t('home')}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('find_service');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold ${
              activeTab === 'find_service' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{t('find_service')}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('my_applications');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold ${
              activeTab === 'my_applications' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4" />
              <span>{t('my_applications')}</span>
            </div>
            {applicationJourneys.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950">
                {applicationJourneys.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('documents');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold ${
              activeTab === 'documents' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>{t('documents')}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('saved_services');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold ${
              activeTab === 'saved_services' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Bookmark className="w-4 h-4" />
              <span>{t('saved_services')}</span>
            </div>
            <span className="text-xs text-slate-500">{savedServiceIds.length}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('admin');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold ${
              activeTab === 'admin' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Admin Analytics Dashboard</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('help');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold ${
              activeTab === 'help' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>{t('help')}</span>
          </button>

          <div className="pt-2 border-t border-slate-200">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('logout')}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
