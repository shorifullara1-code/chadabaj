
import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    let timer: number;
    if (loading) {
      timer = window.setTimeout(() => {
        if (loading) {
          setLoading(false);
          setError('সার্ভার রেসপন্স করছে না। দয়া করে আপনার ইন্টারনেট চেক করে রিফ্রেশ দিন।');
        }
      }, 15000);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  const translateError = (msg: string) => {
    const lowMsg = msg.toLowerCase();
    if (lowMsg.includes('rate limit')) return 'ইমেইল লিমিট শেষ হয়েছে। দয়া করে ১ ঘণ্টা পর চেষ্টা করুন।';
    if (lowMsg.includes('already registered')) return 'এই ইমেইল দিয়ে ইতিপূর্বেই অ্যাকাউন্ট খোলা হয়েছে।';
    if (lowMsg.includes('invalid login')) return 'ভুল ইমেইল বা পাসওয়ার্ড দেওয়া হয়েছে।';
    if (lowMsg.includes('at least 6 characters')) return 'পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।';
    if (lowMsg.includes('email not confirmed')) return 'ইমেইল ভেরিফাই করা হয়নি। দয়া করে আপনার ইনবক্স চেক করুন।';
    return msg;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isRegistering) {
        if (!name || !phone) {
          setError('দয়া করে নাম এবং মোবাইল নম্বর দিন।');
          setLoading(false);
          return;
        }
        const result = await onRegister(name, email, phone, password);
        if (result === "SUCCESS_EMAIL_VERIFY_PENDING") {
          setSuccessMsg("অ্যাকাউন্ট তৈরি হয়েছে! দয়া করে আপনার ইমেইল (Spam সহ) চেক করে লিঙ্কে ক্লিক করুন। এরপর লগইন করুন।");
          setIsRegistering(false);
          setEmail('');
          setPassword('');
          setLoading(false); // Stop loading to show message
        }
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
        // Success: App.tsx's onAuthStateChange will handle the view change automatically
      }
    } catch (err: any) {
      console.error("Auth process error:", err);
      setError(translateError(err.message || 'একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।'));
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-gray-50 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#2da65e]/20 border-t-[#2da65e] rounded-full animate-spin mb-4"></div>
            <p className="font-black text-[#2da65e] animate-pulse">প্রসেস হচ্ছে...</p>
          </div>
        )}

        <div className="flex justify-center mb-6">
           <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${isRegistering ? 'bg-blue-50 text-blue-600' : 'bg-[#2da65e]/10 text-[#2da65e]'}`}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
           </div>
        </div>
        
        <h2 className="text-3xl font-black text-gray-900 text-center mb-2">
          {isRegistering ? 'নতুন অ্যাকাউন্ট' : 'প্রবেশ করুন'}
        </h2>
        
        <p className="text-center text-gray-400 text-sm font-medium mb-8">
          {isRegistering ? 'সহজেই সাইন-আপ করুন' : 'আপনার ইমেইল ও পাসওয়ার্ড দিন'}
        </p>

        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl animate-fade-in">
            <p className="text-sm text-green-700 font-bold text-center leading-relaxed">{successMsg}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-2xl border border-red-100 animate-bounce">
             <p className="text-xs text-red-600 font-black text-center leading-relaxed">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div className="space-y-4">
              <input required type="text" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 font-bold" placeholder="আপনার নাম" value={name} onChange={e => setName(e.target.value)} />
              <input required type="tel" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 font-bold" placeholder="মোবাইল নম্বর" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
          )}
          
          <input required type="email" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#2da65e]/20 font-bold" placeholder="ইমেইল এড্রেস" value={email} onChange={e => setEmail(e.target.value)} />
          <input required type="password" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#2da65e]/20 font-bold" placeholder="পাসওয়ার্ড" value={password} onChange={e => setPassword(e.target.value)} />
          
          <button disabled={loading} type="submit" className={`w-full py-4 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 ${isRegistering ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-100' : 'bg-[#2da65e] hover:bg-[#258a4d] shadow-green-100'}`}>
            {isRegistering ? 'অ্যাকাউন্ট তৈরি করুন' : 'লগইন করুন'}
          </button>
        </form>

        <button type="button" onClick={() => { setIsRegistering(!isRegistering); setError(''); setSuccessMsg(''); }} className="w-full mt-8 py-2 text-gray-400 font-bold text-xs hover:text-[#2da65e] transition-colors">
          {isRegistering ? 'ইতিপূর্বেই অ্যাকাউন্ট আছে? লগইন করুন' : 'অ্যাকাউন্ট নেই? নতুন তৈরি করুন'}
        </button>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}} />
    </div>
  );
};

export default LoginForm;
