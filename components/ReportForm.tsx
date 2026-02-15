
import React, { useState, useEffect } from 'react';
import { CATEGORIES, DISTRICTS, DHAKA_SUB_LOCATIONS, SAVAR_WARDS, Report } from '../types';
import { analyzeReport } from '../services/geminiService';

interface ReportFormProps {
  onSubmit: (
    report: Omit<Report, 'id' | 'timestamp' | 'status' | 'priority' | 'aiSummary' | 'ticketNumber' | 'evidence'> & { aiAnalysis?: any },
    files: File[]
  ) => Promise<void>;
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
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ url: string; type: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      previews.forEach(p => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      // Limit file size (e.g., 10MB per file)
      const validFiles = newFiles.filter(file => {
          if (file.size > 10 * 1024 * 1024) {
              alert(`ফাইল ${file.name} অনেক বড়। ১০ এমবির নিচে ফাইল দিন।`);
              return false;
          }
          return true;
      });

      setFiles(prev => [...prev, ...validFiles]);

      const newPreviews = validFiles.map(file => ({
        url: URL.createObjectURL(file),
        type: file.type
      }));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].url);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const finalData = { ...formData };
      if (finalData.location !== 'Dhaka') {
        finalData.subLocation = '';
        finalData.ward = '';
      }

      // AI Analysis with Timeout (Max 3 seconds)
      let analysis = null;
      try {
        const aiPromise = analyzeReport(finalData.description);
        const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 3000));
        
        analysis = await Promise.race([aiPromise, timeoutPromise]);
      } catch (aiError) {
        console.warn("AI skipped due to timeout/error", aiError);
      }

      // Default analysis if AI fails
      if (!analysis) {
        analysis = {
          priority: 'Medium',
          summary: 'AI বিশ্লেষণ সম্ভব হয়নি, ম্যানুয়াল রিভিউ প্রয়োজন।',
          categorySuggestion: 'Other'
        };
      }
      
      await onSubmit({
        ...finalData,
        aiAnalysis: analysis
      }, files);

    } catch (err: any) {
      console.error("Form submission error:", err);
      const errorMessage = err.message || JSON.stringify(err);
      // Show specific error if it's about missing columns
      if (errorMessage.includes('column')) {
          alert(`সিস্টেম এরর: ডাটাবেজ কনফিগারেশন সমস্যা। অ্যাডমিনকে জানান: ${errorMessage}`);
      } else {
          alert(`দুঃখিত, রিপোর্ট জমা দেওয়া যায়নি।\nকারণ: ${errorMessage}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white shadow-2xl rounded-[2.5rem] my-8 border border-gray-50">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-black text-gray-900 mb-2">ঘটনার রিপোর্ট করুন</h2>
        <p className="text-gray-500 font-medium">আপনার তথ্য সম্পূর্ণ গোপন ও সুরক্ষিত রাখা হবে।</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
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
              প্রকাশ্যে আমার নাম গোপন রাখুন
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
                    subLocation: '',
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
                  required
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
              placeholder="কোথায়, কি ঘটেছিল বিস্তারিত লিখুন।"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 px-2">
              প্রমাণ সংযুক্ত করুন (ছবি বা ভিডিও) - <span className="text-[#2da65e]">ঐচ্ছিক</span>
            </label>
            <div className="relative group">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="w-full px-6 py-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center group-hover:border-[#2da65e] group-hover:bg-green-50/20 transition-all">
                <svg className="w-8 h-8 text-gray-400 mb-2 group-hover:text-[#2da65e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <p className="text-sm font-bold text-gray-500">ফাইল নির্বাচন করতে ক্লিক করুন</p>
                <p className="text-xs text-gray-400 mt-1">সর্বোচ্চ ১০ এমবি (ছবি/ভিডিও)</p>
              </div>
            </div>

            {previews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {previews.map((preview, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden shadow-sm group">
                    {preview.type.startsWith('video/') ? (
                      <video src={preview.url} className="w-full h-24 object-cover" />
                    ) : (
                      <img src={preview.url} alt="preview" className="w-full h-24 object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              যাচাই এবং প্রসেস করা হচ্ছে...
            </div>
          ) : 'রিপোর্ট জমা দিন'}
        </button>
      </form>
    </div>
  );
};

export default ReportForm;
