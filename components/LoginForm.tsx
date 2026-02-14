
import React, { useState } from 'react';
import { User } from '../types';
import { supabase } from '../services/supabase.ts';

interface LoginFormProps {
  onLogin: (user: User) => void;
  onRegister: (name: string, email: string, phone: string, pass: string) => Promise<string | void>;
  onCancel: () => void;
  existingUsers: User[];
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onRegister, onCancel, existingUsers }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const translateError = (msg: string) => {
    if (msg.includes('Email rate limit exceeded')) return 'ইমেইল লিমিট শেষ হয়েছে। দয়া করে কিছুক্ষণ পর চেষ্টা করুন।';
    if (msg.includes('User already registered')) return 'এই ইমেইল দিয়ে ইতিপূর্বেই অ্যাকাউন্ট খোলা হয়েছে।';
    if (msg.includes('Invalid login credentials')) return 'ভুল ইমেইল বা পাসওয়ার্ড দেওয়া হয়েছে।';
    if (msg.includes('Password should be at least')) return 'পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।';
    if (msg.includes('Database error')) return 'সার্ভার সমস্যা। দয়া করে একটু পর আবার চেষ্টা করুন।';
    return msg;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      // --- DEMO ADMIN BYPASS ---
      if (!isRegistering && email === 'admin@chandabaj.com' && password === 'admin789') {
        onLogin({
          id: 'demo-admin-id',
          name: 'Super Admin',
          email: 'admin@chandabaj.com',
          role: 'admin',
          createdAt: Date.now()
        } as User);
        return;
      }

      if (isRegistering) {
        if (!name || !phone) {
          setError('দয়া করে নাম এবং মোবাইল নম্বর দিন।');
          return;
        }
        console.log("Starting registration for:", email);
        const result = await onRegister(name, email, phone, password);
        console.log("Registration result:", result);
        
        if (result === "SUCCESS_EMAIL_VERIFY_PENDING") {
          setSuccessMsg("আপনার অ্যাকাউন্ট তৈরি হয়েছে! দয়া করে আপনার ইমেইল চেক করে ভেরিফাই করুন (Spam ফোল্ডারও চেক করতে পারেন)। এরপর লগইন করুন।");
          setIsRegistering(false);
          setEmail('');
          setPassword('');
        }
      } else {
        console.log("Starting login for:", email);
        const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
        
        if (authError) {
          throw authError;
        } else if (data.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profile) {
            onLogin({ id: data.user.id, email: data.user.email!, ...profile } as User);
          } else {
            console.error("Profile fetch error:", profileError);
            setError('প্রোফাইল তথ্য পাওয়া যায়নি। দয়া করে এডমিনের সাথে যোগাযোগ করুন।');
          }
        }
      }
    } catch (err: any) {
      console.error("LoginForm Error:", err);
      setError(translateError(err.message || 'একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-gray-50 overflow-hidden relative">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#2da65e]/20 border-t-[#2da65e] rounded-full animate-spin mb-4"></div>
            <p className="font-black text-[#2da65e] animate-pulse">প্রসেস হচ্ছে...</p>
          </div>
        )}

        <div className="flex justify-center mb-6">
           <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${isRegistering ? 'bg-blue-50 text-blue-600' : 'bg-[#2da65e]/10 text-[#2da65e]'}`}>
              {isRegistering ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              )}
           </div>
        </div>
        
        <h2 className="text-3xl font-black text-gray-900 text-center mb-2">
          {isRegistering ? 'নতুন অ্যাকাউন্ট' : 'প্রবেশ করুন'}
        </h2>
        
        <p className="text-center text-gray-400 text-sm font-medium mb-8">
          {isRegistering ? 'নিচের তথ্যগুলো পূরণ করে সাইন-আপ করুন' : 'আপনার ইমেইল ও পাসওয়ার্ড দিন'}
        </p>

        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl">
            <p className="text-sm text-green-700 font-bold leading-relaxed">{successMsg}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div className="space-y-4 animate-fade-in-down">
              <div className="relative">
                <input required type="text" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all font-bold" placeholder="আপনার পুরো নাম" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="relative">
                <input required type="tel" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all font-bold" placeholder="মোবাইল নম্বর" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
            </div>
          )}
          
          <div className="relative">
            <input required type="email" className={`w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:bg-white transition-all font-bold ${isRegistering ? 'focus:ring-blue-500/20' : 'focus:ring-[#2da65e]/20'}`} placeholder="ইমেইল অ্যাড্রেস" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          
          <div className="relative">
            <input required type="password" className={`w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:bg-white transition-all font-bold ${isRegistering ? 'focus:ring-blue-500/20' : 'focus:ring-[#2da65e]/20'}`} placeholder="পাসওয়ার্ড (৬+ অক্ষর)" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          
          {error && (
            <div className="p-4 bg-red-50 rounded-2xl border border-red-100 animate-bounce">
               <p className="text-xs text-red-600 font-black leading-relaxed text-center">{error}</p>
            </div>
          )}

          <button disabled={loading} type="submit" className={`w-full py-4 text-white font-black rounded-2xl shadow-xl transform active:scale-95 transition-all mt-4 ${
            isRegistering ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-100' : 'bg-[#2da65e] hover:bg-[#258a4d] shadow-green-100'
          }`}>
            {isRegistering ? 'অ্যাকাউন্ট তৈরি করুন' : 'লগইন করুন'}
          </button>

          <div className="relative py-6">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
             <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]"><span className="bg-white px-4 text-gray-300">অথবা</span></div>
          </div>

          <button type="button" onClick={() => { setIsRegistering(!isRegistering); setError(''); setSuccessMsg(''); }} className={`w-full py-3 font-black rounded-xl transition-all border-2 ${
            isRegistering ? 'text-gray-500 border-gray-100 hover:bg-gray-50' : 'text-blue-600 border-blue-50 hover:bg-blue-50'
          }`}>
            {isRegistering ? 'আগে থেকেই অ্যাকাউন্ট আছে? লগইন' : 'নতুন অ্যাকাউন্ট তৈরি করুন'}
          </button>
        </form>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.3s ease-out forwards; }
      `}} />
    </div>
  );
};

export default LoginForm;
