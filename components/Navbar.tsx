
import React, { useState } from 'react';
import { User, Report } from '../types';

interface NavbarProps {
  isAdmin: boolean;
  currentUser: User | null;
  onLogout: () => void;
  onLoginClick: () => void;
  setView: (view: 'home' | 'report' | 'admin' | 'login' | 'chadabaj' | 'news' | 'track') => void;
  reports: Report[];
}

const Navbar: React.FC<NavbarProps> = ({ isAdmin, currentUser, onLogout, onLoginClick, setView, reports }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileNav = (view: 'home' | 'report' | 'admin' | 'login' | 'chadabaj' | 'news' | 'track') => {
    setView(view);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo Section */}
          <div className="flex items-center cursor-pointer space-x-2 sm:space-x-3" onClick={() => setView('home')}>
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-[#2da65e] rounded-xl shadow-sm">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-xl sm:text-2xl font-black text-[#2da65e] tracking-tight">চান্দাবাজ</span>
          </div>
          
          {/* Desktop Menu Items */}
          <div className="hidden lg:flex items-center space-x-8 text-gray-500 font-bold text-sm uppercase tracking-wider">
            <button onClick={() => setView('home')} className="hover:text-[#2da65e] transition-colors">মূল পাতা</button>
            <button onClick={() => setView('chadabaj')} className="hover:text-[#2da65e] transition-colors">চাঁদাবাজ তালিকা</button>
            <button onClick={() => setView('track')} className="hover:text-[#2da65e] transition-colors">ট্র্যাকিং</button>
            {isAdmin && (
              <button onClick={() => setView('admin')} className="text-red-600 hover:text-red-700 font-black">অ্যাডমিন ড্যাশবোর্ড</button>
            )}
            <button onClick={() => setView('news')} className="hover:text-[#2da65e] transition-colors">নিউজ</button>
          </div>
          
          {/* Actions Section */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Desktop/Tablet Login/Admin Button - Hidden on Mobile */}
            <div className="hidden lg:block">
               {currentUser && isAdmin ? (
                <div className="relative">
                    <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-all"
                    >
                    <div className="w-8 h-8 rounded-full bg-[#2da65e]/10 text-[#2da65e] flex items-center justify-center font-black">
                        A
                    </div>
                    <span className="text-sm font-black text-gray-700 hidden sm:inline">অ্যাডমিন</span>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                    </button>
                    
                    {showDropdown && (
                    <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-fade-in-down">
                        <button 
                        onClick={() => { setView('admin'); setShowDropdown(false); }}
                        className="w-full text-left px-5 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-[#2da65e]"
                        >
                        ড্যাশবোর্ড
                        </button>
                        <button 
                        onClick={() => { onLogout(); setShowDropdown(false); }}
                        className="w-full text-left px-5 py-3 text-sm font-black text-red-500 hover:bg-red-50"
                        >
                        লগআউট (Logout)
                        </button>
                    </div>
                    )}
                </div>
                ) : (
                <button 
                    onClick={onLoginClick}
                    className="text-sm font-black text-gray-700 hover:text-[#2da65e] transition-colors flex items-center px-6 py-2.5 border-2 border-gray-100 rounded-2xl hover:border-[#2da65e]"
                >
                    অ্যাডমিন লগইন
                </button>
                )}
            </div>
            
            {/* Report Button - Always visible but responsive size */}
            <button 
              onClick={() => setView('report')}
              className="bg-[#2da65e] text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl sm:rounded-2xl font-black hover:bg-[#258a4d] transition-all flex items-center shadow-lg shadow-green-100 text-xs sm:text-sm uppercase tracking-widest"
            >
              রিপোর্ট দিন
            </button>

            {/* Mobile Menu Button - Visible only on mobile/tablet */}
            <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
                aria-label="Menu"
            >
                {mobileMenuOpen ? (
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl z-40 animate-fade-in-down overflow-hidden h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="px-4 py-6 space-y-3">
                <button onClick={() => handleMobileNav('home')} className="w-full text-left px-4 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50 hover:text-[#2da65e] transition-colors flex items-center">
                    <span className="bg-gray-100 p-2 rounded-lg mr-3"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg></span>
                    মূল পাতা
                </button>
                <button onClick={() => handleMobileNav('chadabaj')} className="w-full text-left px-4 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50 hover:text-[#2da65e] transition-colors flex items-center">
                    <span className="bg-gray-100 p-2 rounded-lg mr-3"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg></span>
                    চাঁদাবাজ তালিকা
                </button>
                <button onClick={() => handleMobileNav('track')} className="w-full text-left px-4 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50 hover:text-[#2da65e] transition-colors flex items-center">
                    <span className="bg-gray-100 p-2 rounded-lg mr-3"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></span>
                    ট্র্যাকিং
                </button>
                <button onClick={() => handleMobileNav('news')} className="w-full text-left px-4 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50 hover:text-[#2da65e] transition-colors flex items-center">
                     <span className="bg-gray-100 p-2 rounded-lg mr-3"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg></span>
                    নিউজ
                </button>
                
                {isAdmin && (
                    <button onClick={() => handleMobileNav('admin')} className="w-full text-left px-4 py-3 rounded-xl font-black text-red-500 hover:bg-red-50 transition-colors flex items-center">
                        <span className="bg-red-100 p-2 rounded-lg mr-3"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg></span>
                        অ্যাডমিন ড্যাশবোর্ড
                    </button>
                )}

                <div className="border-t border-gray-100 pt-3 mt-2">
                    {currentUser && isAdmin ? (
                        <button onClick={() => { onLogout(); setMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl font-black text-red-500 hover:bg-red-50 flex items-center">
                            <span className="bg-red-100 p-2 rounded-lg mr-3"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg></span>
                            লগআউট
                        </button>
                    ) : (
                        <button onClick={() => { onLoginClick(); setMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl font-bold text-gray-700 hover:bg-gray-50 flex items-center">
                            <span className="bg-gray-100 p-2 rounded-lg mr-3"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg></span>
                            অ্যাডমিন লগইন
                        </button>
                    )}
                </div>
            </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.2s ease-out forwards; }
      `}} />
    </nav>
  );
};

export default Navbar;
