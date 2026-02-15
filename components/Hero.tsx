
import React from 'react';

interface HeroProps {
  onStartReport: () => void;
  totalUsers?: number;
}

const Hero: React.FC<HeroProps> = ({ onStartReport, totalUsers = 0 }) => {
  return (
    <div className="relative bg-white overflow-hidden pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            {/* Added Location Badge - Updated for better visibility */}
            <div className="inline-flex items-center space-x-3 px-5 py-3 bg-white rounded-full border-2 border-[#2da65e] mb-6 animate-fade-in-up shadow-md">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
              </span>
              <div className="flex items-center">
                <span className="text-black font-black text-lg uppercase tracking-wide mr-2">
                  DHAKA 19
                </span>
                <span className="text-[#2da65e] text-lg font-bold mr-2">|</span>
                <span className="text-gray-700 font-bold text-sm uppercase tracking-widest">
                  Savar-Ashulia
                </span>
              </div>
            </div>

            <h1 className="text-4xl tracking-tight font-black text-gray-900 sm:text-5xl md:text-6xl animate-fade-in-up">
              <span className="block xl:inline">চাঁদাবাজমুক্ত বাংলাদেশ</span>{' '}
              <span className="block text-[#2da65e] xl:inline leading-tight">গড়ার শপথ নিন</span>
            </h1>
            <p className="mt-6 text-lg text-gray-500 sm:text-xl font-medium animate-fade-in-up delay-100">
              ভয় নয়, প্রতিরোধ। <span className="text-gray-900 font-black">ঢাকা ১৯</span> (সাভার-আশুলিয়া) সহ আপনার চারপাশের যেকোনো চাঁদাবাজি বা দুর্নীতির খবর আমাদের জানান। আপনার একটি গোপন রিপোর্ট বদলে দিতে পারে সমাজ।
            </p>
            <div className="mt-10 sm:flex sm:justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-up delay-200">
              <button
                onClick={onStartReport}
                className="w-full sm:w-auto flex items-center justify-center px-10 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-[#2da65e] hover:bg-[#258a4d] shadow-xl transform transition hover:-translate-y-1 active:scale-95"
              >
                রিপোর্ট জমা দিন
              </button>
              <button
                className="w-full sm:w-auto flex items-center justify-center px-10 py-4 border-2 border-[#2da65e] text-lg font-bold rounded-xl text-[#2da65e] bg-white hover:bg-green-50 transition-all"
              >
                কিভাবে কাজ করে?
              </button>
            </div>
            
            <div className="mt-8 flex items-center space-x-4 text-sm text-gray-500 font-semibold animate-pulse">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <img key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="" />
                ))}
              </div>
              <span>{totalUsers} জন নাগরিক আমাদের সাথে যুক্ত</span>
            </div>
          </div>
          
          <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
            <div className="relative mx-auto w-full rounded-3xl shadow-2xl overflow-hidden animate-float">
              {/* Updated Image to Savar National Memorial */}
              <img
                className="w-full h-[400px] object-cover"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/National_Martyrs%27_Memorial_of_Bangladesh.jpg/1200px-National_Martyrs%27_Memorial_of_Bangladesh.jpg"
                alt="Savar National Memorial"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
                <div className="text-white">
                  <p className="text-sm font-bold uppercase tracking-widest text-green-400 mb-1">আপনার নিরাপত্তা আমাদের অগ্রাধিকার</p>
                  <h3 className="text-2xl font-black">জাতীয় স্মৃতিসৌধ, সাভার</h3>
                  <p className="text-gray-300 text-sm font-medium mt-1">ঢাকা ১৯ - সাভার-আশুলিয়ার মানুষের কণ্ঠস্বর</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .delay-100 { animation-delay: 0.2s; }
        .delay-200 { animation-delay: 0.4s; }
      `}} />
    </div>
  );
};

export default Hero;
