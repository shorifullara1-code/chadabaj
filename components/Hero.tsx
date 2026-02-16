
import React from 'react';

interface HeroProps {
  onStartReport: () => void;
  totalUsers?: number;
}

const Hero: React.FC<HeroProps> = ({ onStartReport, totalUsers = 0 }) => {
  return (
    <div className="relative bg-white overflow-hidden pt-10 min-h-[90vh] flex items-center">
      {/* Background Animated Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          
          {/* Text Section */}
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left mb-12 lg:mb-0">
            {/* Location Badge */}
            <div className="inline-flex items-center space-x-3 px-5 py-3 bg-white/80 backdrop-blur-md rounded-full border border-green-100 mb-8 animate-pop-in shadow-lg hover:shadow-xl transition-shadow duration-300">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
              </span>
              <div className="flex items-center">
                <span className="text-gray-900 font-black text-xl uppercase tracking-wide mr-1.5">
                  DHAKA
                </span>
                <span className="text-red-600 font-black text-xl mr-3">
                  19
                </span>
                <span className="text-[#2da65e] text-lg font-bold mr-2">|</span>
                <span className="text-gray-700 font-bold text-sm uppercase tracking-widest">
                  Savar-Ashulia
                </span>
              </div>
            </div>

            <h1 className="text-4xl tracking-tight font-black text-gray-900 sm:text-5xl md:text-6xl animate-fade-in-up">
              <span className="block xl:inline">চাঁদাবাজমুক্ত বাংলাদেশ</span>{' '}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#2da65e] to-emerald-600 xl:inline leading-tight">গড়ার শপথ নিন</span>
            </h1>
            
            <p className="mt-6 text-lg text-gray-600 sm:text-xl font-medium animate-fade-in-up delay-100 leading-relaxed">
              ভয় নয়, প্রতিরোধ। <span className="text-gray-900 font-black bg-green-50 px-2 py-0.5 rounded-md">ঢাকা ১৯</span> (সাভার-আশুলিয়া) সহ আপনার চারপাশের যেকোনো চাঁদাবাজি বা দুর্নীতির খবর আমাদের জানান। আপনার একটি গোপন রিপোর্ট বদলে দিতে পারে সমাজ।
            </p>
            
            <div className="mt-10 sm:flex sm:justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-up delay-200">
              <button
                onClick={onStartReport}
                className="group relative w-full sm:w-auto flex items-center justify-center px-10 py-4 border border-transparent text-lg font-bold rounded-2xl text-white bg-[#2da65e] hover:bg-[#258a4d] shadow-xl shadow-green-200 transform transition-all hover:-translate-y-1 active:scale-95 overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine"></span>
                <span className="relative flex items-center">
                  রিপোর্ট জমা দিন 
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </span>
              </button>
              
              <button
                className="w-full sm:w-auto flex items-center justify-center px-10 py-4 border-2 border-gray-100 text-lg font-bold rounded-2xl text-gray-600 bg-white hover:border-[#2da65e] hover:text-[#2da65e] transition-all hover:shadow-lg"
              >
                কিভাবে কাজ করে?
              </button>
            </div>
            
            <div className="mt-10 flex items-center space-x-4 text-sm text-gray-500 font-semibold animate-fade-in-up delay-300">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <img key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-white shadow-md" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="" />
                ))}
              </div>
              <div className="flex flex-col">
                 <span className="font-black text-gray-800 text-base">{totalUsers}+</span>
                 <span className="text-xs uppercase tracking-wider">সচেতন নাগরিক যুক্ত</span>
              </div>
            </div>
          </div>
          
          {/* Image Section */}
          <div className="relative sm:max-w-lg sm:mx-auto lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
            <div className="relative mx-auto w-full rounded-[2.5rem] shadow-2xl overflow-hidden animate-float group cursor-pointer">
              {/* Decorative Circle behind image */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-dashed border-gray-300 rounded-full animate-spin-slow opacity-30 pointer-events-none"></div>
              
              <div className="relative overflow-hidden rounded-[2.5rem]">
                <img
                  className="w-full h-[450px] object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/National_Martyrs%27_Memorial_2017.jpg/1280px-National_Martyrs%27_Memorial_2017.jpg"
                  alt="Savar National Memorial Bangladesh"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-10">
                  <div className="text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#4ade80] mb-2">সুরক্ষিত ও গোপন</p>
                    <h3 className="text-3xl font-black mb-2">জাতীয় স্মৃতিসৌধ, সাভার</h3>
                    <p className="text-gray-300 text-sm font-medium border-l-2 border-[#4ade80] pl-3">ঢাকা ১৯ - সাভার-আশুলিয়ার মানুষের কণ্ঠস্বর</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-10 -left-10 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 animate-bounce-slow hidden md:block">
               <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-bold uppercase">স্ট্যাটাস</div>
                    <div className="font-black text-gray-800">অ্যাকশন নেওয়া হচ্ছে</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pop-in {
          0% { opacity: 0; transform: scale(0.8); }
          70% { transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes shine {
          100% { transform: translateX(100%); }
        }
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes bounce-slow {
           0%, 100% { transform: translateY(0); }
           50% { transform: translateY(-10px); }
        }

        .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-pop-in { animation: pop-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-blob { animation: blob 7s infinite; }
        .animate-shine { animation: shine 1.5s infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}} />
    </div>
  );
};

export default Hero;
