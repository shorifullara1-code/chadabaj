
import React, { useEffect, useRef } from 'react';

const NewsPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
        }
      });
    }, observerOptions);

    const elements = containerRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto px-4 py-20 overflow-hidden">
      {/* Header Section */}
      <header className="mb-16 border-b border-gray-100 pb-10">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight animate-slide-in-left">
          চাঁদাবাজির বিরুদ্ধে নথি, সত্য ও জবাবদিহি
        </h1>
        <h2 className="text-2xl font-bold text-[#2da65e] mb-4 animate-slide-in-right">
          চাঁদাবাজি প্রতিরোধে নতুন পাবলিক রিভিউ প্ল্যাটফর্ম chandabaj.com চালু
        </h2>
        <div className="flex items-center space-x-2 text-gray-400 font-bold text-sm uppercase tracking-widest animate-fade-in delay-200">
          <span>নিজস্ব প্রতিবেদক</span>
          <span>|</span>
          <span className="text-gray-600">chandabaj.com (jatiya.org-এর অধীনে)</span>
        </div>
      </header>

      {/* Main Content Area */}
      <article className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-12 font-medium">
        <p className="reveal">
          বাংলাদেশে চাঁদাবাজি দীর্ঘদিন ধরে একটি ভয়াবহ সামাজিক ও অর্থনৈতিক সমস্যা। ছোট ব্যবসায়ী, পরিবহন শ্রমিক, ঠিকাদার, দোকানদার এমনকি সাধারণ নাগরিক—কেউই এই অপরাধ থেকে পুরোপুরি নিরাপদ নন। ভয়, হুমকি, ক্ষমতার অপব্যবহার এবং বিচারহীনতার কারণে অধিকাংশ ঘটনাই প্রকাশ পায় না। এই বাস্তবতায় চাঁদাবাজির বিরুদ্ধে নথিভিত্তিক প্রতিবাদ, জনস্বার্থে স্বচ্ছতা এবং নাগরিক জবাবদিহি নিশ্চিত করতে যাত্রা শুরু করেছে নতুন পাবলিক রিভিউ ও ডকুমেন্টেশন প্ল্যাটফর্ম chandabaj.com।
        </p>

        <div className="bg-green-50 p-8 rounded-3xl border border-green-100 reveal transition-delay-100">
          <p className="font-bold text-green-800 mb-0">
            এই উদ্যোগটি পরিচালিত হচ্ছে jatiya.org–এর অধীনে এবং এর নৈতিক ভিত্তি বাংলাদেশের সংবিধানের অনুচ্ছেদ ৭(১)—যেখানে বলা হয়েছে, <span className="underline decoration-green-300 decoration-4">প্রজাতন্ত্রের সকল ক্ষমতার মালিক জনগণ।</span>
          </p>
        </div>

        <section className="space-y-6 reveal">
          <h3 className="text-3xl font-black text-gray-900">chandabaj.com কী এবং কেন</h3>
          <h4 className="text-xl font-bold text-gray-800">চাঁদাবাজির বিরুদ্ধে একটি নাগরিক ডকুমেন্টেশন প্ল্যাটফর্ম</h4>
          <p>
            chandabaj.com হলো একটি পাবলিক-ইন্টারেস্ট রিভিউ ও রিপোর্টিং প্ল্যাটফর্ম, যা চাঁদাবাজির মতো অপরাধকে গোপন ভয় ও গুজবের স্তর থেকে তুলে এনে নথিভিত্তিক সামাজিক জবাবদিহির স্তরে নিয়ে আসে।
          </p>
          <p>
            এটি কোনো আদালত, থানা বা আইনশৃঙ্খলা বাহিনীর বিকল্প নয়। বরং এটি একটি নাগরিক ডকুমেন্টেশন স্পেস—যেখানে সমাজের বাস্তব অভিজ্ঞতা, অভিযোগের ধরণ, পুনরাবৃত্ত প্যাটার্ন এবং ক্ষমতার অপব্যবহারের চিত্র সংগঠিত ও দায়িত্বশীলভাবে দৃশ্যমান হয়।
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
            <div className="p-6 bg-white border-2 border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow reveal transition-delay-100">
              <span className="block text-sm font-black text-[#2da65e] mb-2">দর্শন ০১</span>
              যা নথিভুক্ত হয় না, তা অস্বীকার করা যায়
            </div>
            <div className="p-6 bg-white border-2 border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow reveal transition-delay-200">
              <span className="block text-sm font-black text-[#2da65e] mb-2">দর্শন ০২</span>
              যা একা থাকে, তা দমন করা যায়
            </div>
            <div className="p-6 bg-white border-2 border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow reveal transition-delay-300">
              <span className="block text-sm font-black text-[#2da65e] mb-2">দর্শন ০৩</span>
              কিন্তু যা প্রমাণসহ একত্র হয়, তা উপেক্ষা করা যায় না
            </div>
          </div>
        </section>

        <section className="space-y-6 reveal">
          <h3 className="text-3xl font-black text-gray-900">কেন chandabaj.com প্রয়োজন</h3>
          
          <div className="space-y-10">
            <div className="reveal transition-delay-100 border-l-4 border-green-200 pl-6">
              <h5 className="font-black text-gray-900 text-lg mb-2">১) চাঁদাবাজি সাধারণত “একক ঘটনা” হিসেবে চাপা পড়ে</h5>
              <p>চাঁদাবাজির অধিকাংশ ঘটনা প্রকাশ পায় না কারণ ভুক্তভোগীরা একা, ভয়গ্রস্ত এবং আইনি প্রক্রিয়া সম্পর্কে অনিশ্চিত থাকেন। chandabaj.com সেই ঘটনাগুলোকে গঠনমূলক নথিতে রূপ দেয়—তারিখ, স্থান, ধরন ও প্রমাণের কাঠামোসহ।</p>
            </div>
            
            <div className="reveal transition-delay-100 border-l-4 border-green-200 pl-6">
              <h5 className="font-black text-gray-900 text-lg mb-2">২) গুজব নয়—নথিতে রূপান্তর</h5>
              <p>এই প্ল্যাটফর্মে উদ্দেশ্য কোনো অভিযোগকে sensational করা নয়। বরং কি ঘটেছে, কবে ও কোথায় ঘটেছে এবং একই ধরণের ঘটনা কতবার ঘটছে—এসব তথ্য একত্র করলে একটি ডেটা-প্যাটার্ন তৈরি হয়, যা গুজব নয়—জনস্বার্থের তথ্য।</p>
            </div>
            
            <div className="reveal transition-delay-100 border-l-4 border-green-200 pl-6">
              <h5 className="font-black text-gray-900 text-lg mb-2">৩) ব্যক্তিগত ভয় থেকে সমষ্টিগত জবাবদিহি</h5>
              <p>চাঁদাবাজির সবচেয়ে বড় অস্ত্র হলো ভয়। একজন ভুক্তভোগী ভয় পেলে সে চুপ থাকে; কিন্তু বহু ভুক্তভোগীর অভিজ্ঞতা এক জায়গায় নথিভুক্ত হলে ভয় ব্যক্তিগত থাকে না, বরং তা দায়ে পরিণত হয়।</p>
            </div>
            
            <div className="reveal transition-delay-100 border-l-4 border-green-200 pl-6">
              <h5 className="font-black text-gray-900 text-lg mb-2">৪) ক্ষমতার নামে হওয়া অপরাধকে জনস্বার্থের আলোতে আনা</h5>
              <p>চাঁদাবাজির একটি বড় অংশ ঘটে ক্ষমতার ছত্রচ্ছায়ায়। এই প্ল্যাটফর্মের লক্ষ্য ব্যক্তিকে টার্গেট করা নয়, বরং ক্ষমতার অপব্যবহারের প্যাটার্ন তুলে ধরা। এখানে অভিযোগগুলো “reported” ও “alleged” ট্যাগসহ প্রকাশিত হয়।</p>
            </div>
          </div>
        </section>

        <section className="bg-red-50 p-8 rounded-3xl border border-red-100 reveal">
          <h3 className="text-2xl font-black text-red-800 mb-6">chandabaj.com কী নয় (স্পষ্ট সীমা)</h3>
          <ul className="list-disc list-inside space-y-2 font-bold text-red-900/80">
            <li>এটি কোনো ভিজিল্যান্টি বা ট্রাইব্যুনাল নয়</li>
            <li>এটি কাউকে দোষী ঘোষণা করে না</li>
            <li>এটি আদালতের বিকল্প নয়</li>
            <li>এটি গালাগালি বা রাজনৈতিক অপপ্রচারের জায়গা নয়</li>
          </ul>
        </section>

        <section className="space-y-6">
          <h3 className="text-3xl font-black text-gray-900 reveal">এই রিভিউ প্ল্যাটফর্ম কীভাবে চাঁদাবাজি প্রতিরোধে কাজ করবে</h3>
          <ul className="space-y-6">
            <li className="flex gap-4 reveal transition-delay-100">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-black flex-shrink-0">১</div>
              <div><strong className="text-gray-900">নীরবতা ভাঙা:</strong> ভুক্তভোগীরা পরিচয় গোপন রেখে অভিজ্ঞতা শেয়ার করতে পারবেন। এতে একক ঘটনা আর একা থাকে না—তা হয়ে ওঠে প্যাটার্ন।</div>
            </li>
            <li className="flex gap-4 reveal transition-delay-200">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-black flex-shrink-0">২</div>
              <div><strong className="text-gray-900">প্রমাণভিত্তিক রিপোর্টিং:</strong> কল লগ, মেসেজ, রসিদ ইত্যাদি প্রমাণের তালিকা দিয়ে অভিযোগকে আরও শক্ত করা।</div>
            </li>
            <li className="flex gap-4 reveal transition-delay-300">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-black flex-shrink-0">৩</div>
              <div><strong className="text-gray-900">"Political Chandabaj" চিহ্নিত করা:</strong> রাজনৈতিক প্রভাব খাটিয়ে অর্থ আদায়ের অভিযোগগুলো আলাদা করে নথিভুক্ত করা হয়।</div>
            </li>
          </ul>
        </section>

        <section className="border-t border-gray-100 pt-12 space-y-6 reveal">
          <h3 className="text-3xl font-black text-gray-900">প্রতিষ্ঠাতার বক্তব্য (Founder’s Speech)</h3>
          <div className="relative p-10 bg-gray-50 rounded-3xl">
             <div className="absolute -left-2 top-0 text-8xl text-[#2da65e]/10 font-serif">“</div>
             <p className="italic text-xl text-gray-600 leading-relaxed relative z-10">
               চাঁদাবাজি টিকে থাকে দুটি কারণে—ভয় আর একাকিত্ব। একজন ব্যবসায়ী একা প্রতিবাদ করলে সে ভেঙে পড়ে, কিন্তু শতজনের অভিজ্ঞতা এক জায়গায় নথিভুক্ত হলে তা শক্তিতে রূপ নেয়। chandabaj.com কোনো রাজনৈতিক প্ল্যাটফর্ম নয়; এটি নাগরিক ডকুমেন্টেশন স্পেস। আমরা কাউকে অপরাধী ঘোষণা করতে আসিনি—আমরা সত্য জমা করতে এসেছি, যাতে আইন ও সমাজ তাদের কাজ করতে বাধ্য হয়।
             </p>
             <p className="font-black text-gray-900 mt-6 pl-0 text-right">— Shoriful Islam ( Founder )</p>
          </div>
        </section>

        {/* Legal Section */}
        <section className="mt-20 pt-12 border-t-2 border-gray-900/5 space-y-8 text-sm text-gray-500 font-sans tracking-tight reveal">
          <div className="space-y-4">
            <h4 className="font-black text-gray-900 text-lg uppercase tracking-widest">Idea Protection & Non-Political Use Notice</h4>
            <p>The concept, framework, structure, methodology, and public-interest design of chandabaj.com constitute an original civic documentation and review model, developed and conceptualised by Shoriful Islam (“Founder”).</p>
            <p>Any unauthorised political use in Bangladesh by any political party or organisation is strictly prohibited without prior written permission.</p>
          </div>
          
          <div className="bg-gray-900 text-gray-400 p-10 rounded-3xl space-y-4 reveal transition-delay-200">
             <h5 className="text-white font-bold text-lg">Non-Assignment & Non-Endorsement</h5>
             <p>This platform is not assigned to any political ideology and does not endorse any political party, government, or opposition group.</p>
             <p className="text-xs pt-4 border-t border-white/10 opacity-50">© 2025 ChandaBaj Civic Initiative. All rights reserved by the Founder.</p>
          </div>
        </section>
      </article>

      <style dangerouslySetInnerHTML={{ __html: `
        /* On Load Animations */
        @keyframes slide-in-left { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slide-in-right { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        
        .animate-slide-in-left { animation: slide-in-left 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-in-right { animation: slide-in-right 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { animation: fade-in 1.2s ease-out forwards; }
        .delay-200 { animation-delay: 0.2s; }

        /* Scroll Reveal Animations */
        .reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-active {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        /* Staggered transition delays */
        .transition-delay-100 { transition-delay: 100ms; }
        .transition-delay-200 { transition-delay: 200ms; }
        .transition-delay-300 { transition-delay: 300ms; }
        .transition-delay-400 { transition-delay: 400ms; }
      `}} />
    </div>
  );
};

export default NewsPage;
