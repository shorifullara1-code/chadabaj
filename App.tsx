
import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    // Initial data fetch
    fetchReports();
    fetchUsers();

    // 1. Initial Session Check
    const checkInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchUserProfile(session.user.id, session.user.email!);
      }
      setIsLoading(false);
    };

    checkInitialSession();

    // 2. Listen for Auth State Changes (Login, Logout, Refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserProfile(session.user.id, session.user.email!);
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setCurrentView('home');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string, email: string) => {
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
  };

  const fetchReports = async () => {
    const { data } = await supabase
      .from('reports')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (data) setReports(data as Report[]);
  };

  const fetchUsers = async () => {
    const { data } = await supabase.from('profiles').select('*');
    if (data) setUsers(data as User[]);
  };

  const handleRegister = async (name: string, email: string, phone: string, pass: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password: pass });
    if (error) {
      alert(error.message);
      return;
    }
    if (data.user) {
      const profileData = { id: data.user.id, name, phone, role: 'user', createdAt: Date.now() };
      const { error: profileError } = await supabase.from('profiles').insert([profileData]);
      
      if (profileError) {
        console.error("Profile creation error:", profileError);
        alert("অ্যাকাউন্ট তৈরি হয়েছে কিন্তু প্রোফাইল সেটআপে সমস্যা হয়েছে। দয়া করে আবার লগইন করুন।");
        return;
      }

      setCurrentUser({ ...profileData, email } as User);
      setCurrentView('home');
    }
  };

  const handleLogin = async (user: User) => {
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
      alert("Error submitting report: " + error.message);
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
    if (window.confirm('Are you sure you want to delete this report?')) {
      const { error } = await supabase.from('reports').delete().eq('id', id);
      if (!error) fetchReports();
    }
  };

  const approvedReports = reports.filter(r => r.status === 'Investigating' || r.status === 'Resolved');
  const myReports = reports.filter(r => r.userId === currentUser?.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2da65e]"></div>
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
                    <div className="p-10 rounded-3xl bg-white shadow-sm border border-gray-100">
                      <div className="text-6xl font-black text-[#2da65e] mb-4">{reports.length + 371}</div>
                      <div className="text-gray-500 font-bold uppercase tracking-widest text-sm">মোট রিপোর্ট জমা</div>
                    </div>
                    <div className="p-10 rounded-3xl bg-white shadow-sm border border-gray-100">
                      <div className="text-6xl font-black text-[#2da65e] mb-4">{reports.filter(r => r.status === 'Resolved').length + 124}</div>
                      <div className="text-gray-500 font-bold uppercase tracking-widest text-sm">সফল অভিযান</div>
                    </div>
                    <div className="p-10 rounded-3xl bg-white shadow-sm border border-gray-100">
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
        <div className="fixed bottom-10 right-10 bg-[#1a1a1a] text-white p-5 rounded-3xl shadow-2xl z-[100] animate-bounce">
          <div className="font-black">রিপোর্ট সফল!</div>
          <div className="text-green-400 font-mono">টিকেট: {lastSubmittedTicket}</div>
        </div>
      )}

      <footer className="bg-white border-t border-gray-100 py-10 text-center">
        <p className="text-gray-400 text-xs font-black tracking-widest">© {new Date().getFullYear()} চান্দাবাজ ডট কম</p>
      </footer>
    </div>
  );
};

export default App;
