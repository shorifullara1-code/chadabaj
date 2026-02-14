
import React, { useState } from 'react';
import { User } from '../types';
import { supabase } from '../services/supabase.ts';

interface LoginFormProps {
  onLogin: (user: User) => void;
  onRegister: (name: string, email: string, phone: string, pass: string) => void;
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
  const [loading, setLoading] = useState(false);

  const translateError = (msg: string) => {
    if (msg.includes('Email rate limit exceeded')) return 'ইমেইল লিমিট শেষ হয়েছে। দয়া করে কিছুক্ষণ পর চেষ্টা করুন।';
    if (msg.includes('User already registered')) return 'এই ইমেইল দিয়ে ইতিপূর্বেই অ্যাকাউন্ট খোলা হয়েছে।';
    if (msg.includes('Invalid login credentials')) return 'ভুল ইমেইল বা পাসওয়ার্ড দেওয়া হয়েছে।';
    if (msg.includes('Password should be at least')) return 'পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।';
    return msg;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // --- DEMO ADMIN BYPASS START ---
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
      // --- DEMO ADMIN BYPASS END ---

      if (isRegistering) {
        await onRegister(name, email, phone, password);
      } else {
        const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
        
        if (authError) {
          setError(translateError(authError.message));
        } else if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profile) {
            onLogin({ id: data.user.id, email: data.user.email!, ...profile } as User);
          } else {
            setError('প্রোফাইল তথ্য পাওয়া যায়নি। দয়া করে এডমিনের সাথে যোগাযোগ করুন।');
          }
        }
      }
    } catch (err: any) {
      setError(translateError(err.message || 'একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-gray-50">
        <div className="flex justify-center mb-6">
           <div className="w-16 h-16 bg-[#2da65e]/10 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-[#2da65e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
           </div>
        </div>
        <h2 className="text-3xl font-black text-gray-900 text-center mb-2">{isRegistering ? 'নতুন অ্যাকাউন্ট' : 'লগইন করুন'}</h2>
        {!isRegistering && (
          <p className="text-center text-[10px] text-gray-400 mb-6 font-bold uppercase tracking-widest">Demo Admin: admin@chandabaj.com / admin789</p>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegistering && (
            <>
              <input required type="text" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#2da65e]/20 transition-all" placeholder="আপনার নাম" value={name} onChange={e => setName(e.target.value)} />
              <input required type="tel" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#2da65e]/20 transition-all" placeholder="মোবাইল নম্বর" value={phone} onChange={e => setPhone(e.target.value)} />
            </>
          )}
          <input required type="email" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#2da65e]/20 transition-all" placeholder="ইমেইল" value={email} onChange={e => setEmail(e.target.value)} />
          <input required type="password" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#2da65e]/20 transition-all" placeholder="পাসওয়ার্ড" value={password} onChange={e => setPassword(e.target.value)} />
          
          {error && (
            <div className="p-4 bg-red-50 rounded-xl border border-red-100">
               <p className="text-xs text-red-600 font-bold leading-relaxed">{error}</p>
            </div>
          )}

          <button disabled={loading} type="submit" className="w-full py-4 bg-[#2da65e] text-white font-black rounded-2xl shadow-xl hover:bg-[#258a4d] disabled:bg-gray-300 transform active:scale-95 transition-all">
            {loading ? 'প্রসেস হচ্ছে...' : (isRegistering ? 'সাইন-আপ' : 'প্রবেশ করুন')}
          </button>

          <div className="relative py-4">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
             <div className="relative flex justify-center text-xs font-bold uppercase"><span className="bg-white px-4 text-gray-400">অথবা</span></div>
          </div>

          <button type="button" onClick={() => { setIsRegistering(!isRegistering); setError(''); }} className="w-full py-3 text-[#2da65e] font-bold hover:bg-green-50 rounded-xl transition-all">
            {isRegistering ? 'আগে থেকেই অ্যাকাউন্ট আছে? লগইন করুন' : 'অ্যাকাউন্ট নেই? নতুন অ্যাকাউন্ট তৈরি করুন'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
