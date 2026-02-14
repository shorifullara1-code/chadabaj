
import React, { useState } from 'react';
import { User, Report } from '../types';

interface NavbarProps {
  isAdmin: boolean;
  currentUser: User | null;
  onLogout: () => void;
  onLoginClick: () => void;
  setView: (view: 'home' | 'report' | 'admin' | 'login' | 'chadabaj' | 'my-reports' | 'news' | 'track') => void;
  reports: Report[];
}

const Navbar: React.FC<NavbarProps> = ({ isAdmin, currentUser, onLogout, onLoginClick, setView, reports }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  // Count unreviewed resolved reports for notification
  const notificationCount = currentUser && !isAdmin 
    ? reports.filter(r => r.userId === currentUser.id && r.status === 'Resolved' && !r.review).length 
    : 0;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo Section */}
          <div className="flex items-center cursor-pointer space-x-3" onClick={() => setView('home')}>
            <div className="flex items-center justify-center w-10 h-10 bg-[#2da65e] rounded-xl shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-2xl font-black text-[#2da65e] tracking-tight">চান্দাবাজ</span>
          </div>
          
          {/* Menu Items */}
          <div className="hidden lg:flex items-center space-x-8 text-gray-500 font-bold text-sm uppercase tracking-wider">
            <button onClick={() => setView('home')} className="hover:text-[#2da65e] transition-colors">মূল পাতা</button>
            <button onClick={() => setView('chadabaj')} className="hover:text-[#2da65e] transition-colors">চাঁদাবাজ তালিকা</button>
            <button onClick={() => setView('track')} className="hover:text-[#2da65e] transition-colors">ট্র্যাকিং</button>
            {currentUser && !isAdmin && (
              <button onClick={() => setView('my-reports')} className="hover:text-[#2da65e] transition-colors relative">
                আমার টিকেট
                {notificationCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {notificationCount}
                  </span>
                )}
              </button>
            )}
            {isAdmin && (
              <button onClick={() => setView('admin')} className="text-red-600 hover:text-red-700 font-black">অ্যাডমিন ড্যাশবোর্ড</button>
            )}
            <button onClick={() => setView('news')} className="hover:text-[#2da65e] transition-colors">নিউজ</button>
          </div>
          
          {/* Actions Section */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-[#2da65e]/10 text-[#2da65e] flex items-center justify-center font-black">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="text-sm font-black text-gray-700 hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-fade-in-down">
                    {!isAdmin && (
                      <button 
                        onClick={() => { setView('my-reports'); setShowDropdown(false); }}
                        className="w-full text-left px-5 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-[#2da65e] flex items-center justify-between"
                      >
                        আমার টিকেটসমূহ
                        {notificationCount > 0 && <span className="bg-red-500 w-2 h-2 rounded-full"></span>}
                      </button>
                    )}
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
                লগইন / সাইন-আপ
              </button>
            )}
            
            <button 
              onClick={() => {
                if (!currentUser) onLoginClick();
                else setView('report');
              }}
              className="bg-[#2da65e] text-white px-6 py-2.5 rounded-2xl font-black hover:bg-[#258a4d] transition-all flex items-center shadow-lg shadow-green-100 text-sm uppercase tracking-widest"
            >
              রিপোর্ট দিন
            </button>
          </div>
        </div>
      </div>
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
