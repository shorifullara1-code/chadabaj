
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import ReportForm from './components/ReportForm.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import LoginForm from './components/LoginForm.tsx';
import ReportList from './components/ReportList.tsx';
import NewsPage from './components/NewsPage.tsx';
import TrackReport from './components/TrackReport.tsx';
import { Report, ReportStatus, User } from './types.ts';
import { supabase } from './services/supabase.ts';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'report' | 'admin' | 'login' | 'chadabaj' | 'my-reports' | 'news' | 'track'>('home');
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [lastSubmittedTicket, setLastSubmittedTicket] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const initializationTriggered = useRef(false);

  const fetchReports = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('timestamp', { ascending: false });
      if (!error && data) setReports(data as Report[]);
    } catch (e) {
      console.error("Fetch reports error:", e);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      if (!error && data) setUsers(data as User[]);
    } catch (e) {
      console.error("Fetch users error:", e);
    }
  }, []);

  const fetchUserProfile = useCallback(async (userId: string, email: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profile) {
        setCurrentUser({
          id: userId,
          email: email,
          ...profile
        } as User);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  }, []);

  useEffect(() => {
    if (initializationTriggered.current) return;
    initializationTriggered.current = true;

    let mounted = true;

    // Faster fail-safe: 3 seconds
    const safetyTimeout = setTimeout(() => {
      if (mounted && isLoading) {
        console.warn("Loading timeout - showing app anyway");
        setIsLoading(false);
      }
    }, 3000);

    const initialize = async () => {
      try {
        // Run essential auth check first
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData?.session;

        if (session?.user && mounted) {
          await fetchUserProfile(session.user.id, session.user.email!);
        }

        // Run non-essential data loading in parallel without blocking UI
        fetchReports();
        fetchUsers();
      } catch (e) {
        console.error("Initialization error:", e);
      } finally {
        if (mounted) {
          clearTimeout(safetyTimeout);
          setIsLoading(false);
        }
      }
    };

    initialize();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserProfile(session.user.id, session.user.email!);
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setCurrentView('home');
      }
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      authListener.subscription.unsubscribe();
    };
  }, [fetchReports, fetchUsers, fetchUserProfile]);

  const handleRegister = async (name: string, email: string, phone: string, pass: string) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password: pass,
      options: {
        data: { full_name: name, phone: phone }
      }
    });
    
    if (error) throw error;

    if (data.user) {
      const profileData = { 
        id: data.user.id, 
        name, 
        phone, 
        role: 'user', 
        createdAt: Date.now() 
      };
      
      const { error: profileError } = await supabase.from('profiles').upsert([profileData]);
      if (profileError) throw new Error(`প্রোফাইল সেভ করা যায়নি: ${profileError.message}`);

      if (data.session) {
        setCurrentUser({ ...profileData, email } as User);
        setCurrentView('home');
      } else {
        alert("অ্যাকাউন্ট তৈরি হয়েছে। দয়া করে আপনার ইমেইল চেক করে ভেরিফাই করুন।");
        setCurrentView('login');
      }
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') setCurrentView('admin');
    else setCurrentView('home');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleReportSubmit = async (newReportData: any) => {
    const ticketNo = `CB-${Math.floor(100000 + Math.random() * 900000)}`;
    const report = {
      ticketNumber: ticketNo,
      userId: currentUser?.id,
      userEmail: currentUser?.email,
      ...newReportData,
      status: 'Pending',
      priority: newReportData.aiAnalysis?.priority || 'Medium',
      aiSummary: newReportData.aiAnalysis?.summary || '',
      timestamp: Date.now()
    };

    const { error } = await supabase.from('reports').insert([report]);
    if (error) {
      alert("রিপোর্ট জমা দিতে সমস্যা হয়েছে: " + error.message);
      return;
    }

    setLastSubmittedTicket(ticketNo);
    setShowToast(true);
    fetchReports();
    setCurrentView('home');
    setTimeout(() => setShowToast(false), 8000);
  };

  const handleUpdateStatus = async (id: string, status: ReportStatus) => {
    const { error } = await supabase.from('reports').update({ status }).eq('id', id);
    if (!error) fetchReports();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই রিপোর্টটি ডিলিট করতে চান?')) {
      const { error } = await supabase.from('reports').delete().eq('id', id);
      if (!error) fetchReports();
    }
  };

  const approvedReports = reports.filter(r => r.status === 'Investigating' || r.status === 'Resolved');
  const myReports = reports.filter(r => r.userId === currentUser?.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#2da65e] mb-4"></div>
          <p className="text-gray-400 font-bold text-sm">লোডিং হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar 
        isAdmin={currentUser?.role === 'admin'} 
        currentUser={currentUser}
        onLogout={handleLogout} 
        onLoginClick={() => setCurrentView('login')}
        setView={setCurrentView} 
        reports={reports}
      />
      
      <main className="flex-grow">
        {currentView === 'login' ? (
          <LoginForm 
            onLogin={handleLogin} 
            onRegister={handleRegister}
            onCancel={() => setCurrentView('home')} 
            existingUsers={users}
          />
        ) : currentUser?.role === 'admin' && currentView === 'admin' ? (
          <AdminDashboard 
            reports={reports} 
            users={users}
            onUpdateStatus={handleUpdateStatus} 
            onDelete={handleDelete}
            onLogout={handleLogout}
          />
        ) : (
          <>
            {currentView === 'home' && (
              <>
                <Hero onStartReport={() => {
                  if (!currentUser) setCurrentView('login');
                  else setCurrentView('report');
                }} />
                <section className="bg-gray-50 py-24 px-4 text-center">
                  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="p-10 rounded-3xl bg-white shadow-sm border border-gray-100 transform hover:-translate-y-2 transition-all">
                      <div className="text-6xl font-black text-[#2da65e] mb-4">{reports.length + 371}</div>
                      <div className="text-gray-500 font-bold uppercase tracking-widest text-sm">মোট রিপোর্ট জমা</div>
                    </div>
                    <div className="p-10 rounded-3xl bg-white shadow-sm border border-gray-100 transform hover:-translate-y-2 transition-all">
                      <div className="text-6xl font-black text-[#2da65e] mb-4">{reports.filter(r => r.status === 'Resolved').length + 124}</div>
                      <div className="text-gray-500 font-bold uppercase tracking-widest text-sm">সফল অভিযান</div>
                    </div>
                    <div className="p-10 rounded-3xl bg-white shadow-sm border border-gray-100 transform hover:-translate-y-2 transition-all">
                      <div className="text-6xl font-black text-[#2da65e] mb-4">{users.length + 500}</div>
                      <div className="text-gray-500 font-bold uppercase tracking-widest text-sm">সক্রিয় ইউজার</div>
                    </div>
                  </div>
                </section>
              </>
            )}
            {currentView === 'report' && (
              currentUser ? <ReportForm onSubmit={handleReportSubmit} /> : setCurrentView('login')
            )}
            {currentView === 'track' && <TrackReport reports={reports} />}
            {currentView === 'chadabaj' && <ReportList reports={approvedReports} title="যাচাইকৃত চাঁদাবাজদের তালিকা" />}
            {currentView === 'my-reports' && (
              currentUser ? <ReportList reports={myReports} title="আমার টিকেটসমূহ" isPrivate /> : setCurrentView('login')
            )}
            {currentView === 'news' && <NewsPage />}
          </>
        )}
      </main>

      {showToast && (
        <div className="fixed bottom-10 right-10 bg-[#1a1a1a] text-white p-6 rounded-3xl shadow-2xl z-[100] animate-bounce border-l-8 border-[#2da65e]">
          <div className="flex items-center space-x-4">
             <div className="w-10 h-10 bg-[#2da65e] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
             </div>
             <div>
                <div className="font-black text-lg">রিপোর্ট সফল!</div>
                <div className="text-green-400 font-mono text-sm">টিকেট: {lastSubmittedTicket}</div>
             </div>
          </div>
        </div>
      )}

      <footer className="bg-white border-t border-gray-100 py-12 text-center">
        <div className="max-w-7xl mx-auto px-4">
           <div className="flex justify-center items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-[#2da65e] rounded-lg"></div>
              <span className="text-xl font-black text-gray-900">চান্দাবাজ</span>
           </div>
           <p className="text-gray-400 text-xs font-black tracking-widest">© {new Date().getFullYear()} চান্দাবাজ ডট কম - দুর্নীতিমুক্ত আগামীর জন্য</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
