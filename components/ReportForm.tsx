
import React, { useState } from 'react';
import { CATEGORIES, DISTRICTS, DHAKA_SUB_LOCATIONS, SAVAR_WARDS, Report } from '../types';
import { analyzeReport } from '../services/geminiService';

interface ReportFormProps {
  // Fix: Omit 'ticketNumber' as it is generated in App.tsx upon submission
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
    contactInfo: '',
    isAnonymous: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Auto-analyze using Gemini before submitting to the list
    const analysis = await analyzeReport(formData.description);
    
    onSubmit({
      ...formData,
      aiAnalysis: analysis
    });
    
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white shadow-xl rounded-xl my-8">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">ঘটনার রিপোর্ট করুন</h2>
        <p className="text-gray-600">সবগুলো তথ্য নির্ভুলভাবে দেওয়ার চেষ্টা করুন। আমরা আপনার তথ্য সম্পূর্ণ গোপন রাখব।</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">শিরোনাম (Title)</label>
          <input
            required
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
            placeholder="সংক্ষেপে ঘটনাটি লিখুন"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">ক্যাটাগরি</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">জেলা (Location)</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-down">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">ইউনিয়ন/পৌরসভা</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-green-50 focus:ring-2 focus:ring-green-500"
                value={formData.subLocation}
                onChange={(e) => setFormData({...formData, subLocation: e.target.value, ward: ''})}
              >
                <option value="">নির্বাচন করুন</option>
                {DHAKA_SUB_LOCATIONS.map(sub => <option key={sub} value={sub}>{sub}</option>)}
              </select>
            </div>
            
            {/* Show Ward selection ONLY if Savar Pouroshova is selected */}
            {formData.subLocation === 'সাভার পৌরসভা' && (
              <div className="animate-fade-in-down">
                <label className="block text-sm font-semibold text-gray-700 mb-1">ওয়ার্ড নম্বর</label>
                <select
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-blue-50 focus:ring-2 focus:ring-blue-500"
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
          <label className="block text-sm font-semibold text-gray-700 mb-1">ঘটনার তারিখ</label>
          <input
            type="date"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">ঘটনার বিস্তারিত বিবরণ ও ঠিকানা (Address)</label>
          <textarea
            required
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
            placeholder="কোথায়, কি ঘটেছিল বিস্তারিত লিখুন। যদি ওয়ার্ড না থাকে তবে এখানে পূর্ণ ঠিকানা লিখে দিন।"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="anonymous"
              className="w-4 h-4 text-red-600"
              checked={formData.isAnonymous}
              onChange={(e) => setFormData({...formData, isAnonymous: e.target.checked})}
            />
            <label htmlFor="anonymous" className="ml-2 text-sm font-medium text-gray-700">
              আমি আমার পরিচয় গোপন রাখতে চাই (Report Anonymously)
            </label>
          </div>

          {!formData.isAnonymous && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">যোগাযোগের তথ্য (মোবাইল/ইমেইল)</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
                placeholder="আপনার নাম ও মোবাইল নম্বর দিন"
                value={formData.contactInfo}
                onChange={(e) => setFormData({...formData, contactInfo: e.target.value})}
              />
            </div>
          )}
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
          className={`w-full py-4 rounded-lg text-white font-bold text-lg shadow-lg transition-all ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 active:scale-95'}`}
        >
          {isSubmitting ? 'AI প্রসেস করছে...' : 'রিপোর্ট জমা দিন'}
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
