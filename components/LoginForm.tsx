
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../services/supabase.ts';

interface LoginFormProps {
  onLogin: (user: User) => void;
  onCancel: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timer: number;
    if (loading) {
      timer = window.setTimeout(() => {
        if (loading) {
          setLoading(false);
          setError('সার্ভার রেসপন্স করছে না। দয়া করে ইন্টারনেট চেক করে রিফ্রেশ দিন।');
        }
      }, 15000);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  const translateError = (msg: string) => {
    const lowMsg = msg.toLowerCase();
    if (lowMsg.includes('invalid login')) return 'ভুল ইমেইল বা পাসওয়ার্ড দেওয়া হয়েছে। শুধুমাত্র অ্যাডমিন প্রবেশ করতে পারবেন।';
    if (lowMsg.includes('email not confirmed')) return 'ইমেইল ভেরিফাই করা হয়নি।';
    return 'প্রবেশ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile && profile.role === 'admin') {
          onLogin({ id: data.user.id, email: data.user.email!, ...profile } as User);
        } else {
          await supabase.auth.signOut();
          setError('দুঃখিত, শুধুমাত্র অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করতে পারবেন।');
          setLoading(false);
        }
      }
    } catch (err: any) {
      console.error("Auth process error:", err);
      setError(translateError(err.message));
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-gray-50 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#2da65e]/20 border-t-[#2da65e] rounded-full animate-spin mb-4"></div>
            <p className="font-black text-[#2da65e] animate-pulse">যাচাই করা হচ্ছে...</p>
          </div>
        )}

        <div className="flex justify-center mb-6">
           <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] text-white flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
           </div>
        </div>
        
        <h2 className="text-3xl font-black text-gray-900 text-center mb-2">
          অ্যাডমিন লগইন
        </h2>
        
        <p className="text-center text-gray-400 text-sm font-medium mb-8">
          ড্যাশবোর্ড অ্যাক্সেস করতে আপনার তথ্য দিন
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-2xl border border-red-100">
             <p className="text-xs text-red-600 font-black text-center leading-relaxed">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required type="email" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#2da65e]/20 font-bold" placeholder="অ্যাডমিন ইমেইল" value={email} onChange={e => setEmail(e.target.value)} />
          <input required type="password" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#2da65e]/20 font-bold" placeholder="পাসওয়ার্ড" value={password} onChange={e => setPassword(e.target.value)} />
          
          <button disabled={loading} type="submit" className="w-full py-4 bg-[#1a1a1a] hover:bg-black text-white font-black rounded-2xl shadow-xl transition-all active:scale-95">
            লগইন করুন
          </button>
        </form>

        <button type="button" onClick={onCancel} className="w-full mt-8 py-2 text-gray-400 font-bold text-xs hover:text-[#2da65e] transition-colors">
          ফিরে যান
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
