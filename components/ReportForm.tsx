
import React, { useState } from 'react';
import { CATEGORIES, DISTRICTS, DHAKA_SUB_LOCATIONS, SAVAR_WARDS, Report } from '../types';
import { analyzeReport } from '../services/geminiService';

interface ReportFormProps {
  onSubmit: (report: Omit<Report, 'id' | 'timestamp' | 'status' | 'priority' | 'aiSummary' | 'ticketNumber'> & { aiAnalysis?: any }) => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: CATEGORIES[0],
    location: DISTRICTS[0],
    subLocation: '',
    ward: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    isAnonymous: false,
    reporterName: '',
    reporterEmail: '',
    reporterPhone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const analysis = await analyzeReport(formData.description);
    
    onSubmit({
      ...formData,
      aiAnalysis: analysis
    });
    
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white shadow-2xl rounded-[2.5rem] my-8 border border-gray-50">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-black text-gray-900 mb-2">ঘটনার রিপোর্ট করুন</h2>
        <p className="text-gray-500 font-medium">আপনার তথ্য সম্পূর্ণ গোপন ও সুরক্ষিত রাখা হবে।</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Reporter Information - MANDATORY */}
        <div className="p-8 bg-gray-50 rounded-3xl space-y-4 border border-gray-100">
          <h3 className="text-sm font-black text-[#2da65e] uppercase tracking-widest mb-4">আপনার তথ্য (গোপন রাখা হবে)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              required
              type="text"
              className="w-full px-5 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#2da65e]/20 font-bold"
              placeholder="আপনার নাম"
              value={formData.reporterName}
              onChange={(e) => setFormData({...formData, reporterName: e.target.value})}
            />
            <input
              required
              type="tel"
              className="w-full px-5 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#2da65e]/20 font-bold"
              placeholder="মোবাইল নম্বর"
              value={formData.reporterPhone}
              onChange={(e) => setFormData({...formData, reporterPhone: e.target.value})}
            />
          </div>
          <input
            required
            type="email"
            className="w-full px-5 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#2da65e]/20 font-bold"
            placeholder="ইমেল এড্রেস"
            value={formData.reporterEmail}
            onChange={(e) => setFormData({...formData, reporterEmail: e.target.value})}
          />
          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="isAnonymous"
              className="w-4 h-4 text-[#2da65e] rounded"
              checked={formData.isAnonymous}
              onChange={(e) => setFormData({...formData, isAnonymous: e.target.checked})}
            />
            <label htmlFor="isAnonymous" className="text-xs font-bold text-gray-500 cursor-pointer">
              প্রকাশ্যে আমার নাম গোপন রাখুন (Anonymize my identity on public list)
            </label>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">ঘটনার বিবরণ</h3>
          
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 px-2">শিরোনাম</label>
            <input
              required
              type="text"
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#2da65e]/20 outline-none font-bold"
              placeholder="সংক্ষেপে ঘটনাটি লিখুন"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2 px-2">ক্যাটাগরি</label>
              <select
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold appearance-none"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-2 px-2">জেলা</label>
              <select
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold appearance-none"
                value={formData.location}
                onChange={(e) => {
                  const loc = e.target.value;
                  setFormData({
                    ...formData, 
                    location: loc, 
                    subLocation: loc === 'Dhaka' ? DHAKA_SUB_LOCATIONS[0] : '',
                    ward: ''
                  });
                }}
              >
                {DISTRICTS.map(dist => <option key={dist} value={dist}>{dist}</option>)}
              </select>
            </div>
          </div>

          {formData.location === 'Dhaka' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-down">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase mb-2 px-2">ইউনিয়ন/পৌরসভা</label>
                <select
                  className="w-full px-6 py-4 bg-green-50/30 border border-green-100 rounded-2xl outline-none font-bold appearance-none"
                  value={formData.subLocation}
                  onChange={(e) => setFormData({...formData, subLocation: e.target.value, ward: ''})}
                >
                  <option value="">নির্বাচন করুন</option>
                  {DHAKA_SUB_LOCATIONS.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
              </div>
              
              {formData.subLocation === 'সাভার পৌরসভা' && (
                <div className="animate-fade-in-down">
                  <label className="block text-xs font-black text-gray-400 uppercase mb-2 px-2">ওয়ার্ড নম্বর</label>
                  <select
                    required
                    className="w-full px-6 py-4 bg-blue-50/30 border border-blue-100 rounded-2xl outline-none font-bold appearance-none"
                    value={formData.ward}
                    onChange={(e) => setFormData({...formData, ward: e.target.value})}
                  >
                    <option value="">ওয়ার্ড নির্বাচন করুন</option>
                    {SAVAR_WARDS.map(ward => <option key={ward} value={ward}>{ward}</option>)}
                  </select>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 px-2">ঘটনার বিস্তারিত বিবরণ</label>
            <textarea
              required
              rows={5}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#2da65e]/20 font-medium leading-relaxed"
              placeholder="কোথায়, কি ঘটেছিল বিস্তারিত লিখুন। পূর্ণ ঠিকানা সহ দিতে পারলে ভালো হয়।"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
          className={`w-full py-5 rounded-[1.5rem] text-white font-black text-lg shadow-2xl transition-all transform active:scale-95 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2da65e] hover:bg-[#258a4d] shadow-green-100'}`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
              AI প্রসেস করছে...
            </div>
          ) : 'রিপোর্ট জমা দিন'}
        </button>
      </form>
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

export default ReportForm;
