
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isRegistering) {
      await onRegister(name, email, phone, password);
    } else {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      
      if (authError) {
        setError(authError.message);
      } else if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          onLogin({ id: data.user.id, email: data.user.email!, ...profile } as User);
        }
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-gray-50">
        <h2 className="text-3xl font-black text-gray-900 text-center mb-6">{isRegistering ? 'নতুন অ্যাকাউন্ট' : 'লগইন করুন'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegistering && (
            <>
              <input required type="text" className="w-full px-5 py-3.5 bg-gray-50 border rounded-2xl" placeholder="আপনার নাম" value={name} onChange={e => setName(e.target.value)} />
              <input required type="tel" className="w-full px-5 py-3.5 bg-gray-50 border rounded-2xl" placeholder="মোবাইল নম্বর" value={phone} onChange={e => setPhone(e.target.value)} />
            </>
          )}
          <input required type="email" className="w-full px-5 py-3.5 bg-gray-50 border rounded-2xl" placeholder="ইমেইল" value={email} onChange={e => setEmail(e.target.value)} />
          <input required type="password" className="w-full px-5 py-3.5 bg-gray-50 border rounded-2xl" placeholder="পাসওয়ার্ড" value={password} onChange={e => setPassword(e.target.value)} />
          
          {error && <p className="text-xs text-red-500 font-bold">{error}</p>}

          <button disabled={loading} type="submit" className="w-full py-4 bg-[#2da65e] text-white font-black rounded-2xl shadow-xl hover:bg-[#258a4d] disabled:bg-gray-300">
            {loading ? 'প্রসেস হচ্ছে...' : (isRegistering ? 'সাইন-আপ' : 'প্রবেশ করুন')}
          </button>

          <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="w-full py-3 text-[#2da65e] font-bold">
            {isRegistering ? 'লগইন করুন' : 'নতুন অ্যাকাউন্ট তৈরি করুন'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
