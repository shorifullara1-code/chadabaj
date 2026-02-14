
import React, { useState } from 'react';
import { Report } from '../types';

interface TrackReportProps {
  reports: Report[];
}

const TrackReport: React.FC<TrackReportProps> = ({ reports }) => {
  const [ticketNo, setTicketNo] = useState('');
  const [foundReport, setFoundReport] = useState<Report | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const result = reports.find(r => r.ticketNumber.toUpperCase() === ticketNo.toUpperCase().trim());
    setFoundReport(result || null);
    setSearched(true);
  };

  return (
    <div className="max-w-3xl mx-auto py-20 px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-gray-900 mb-4">টিকেট ট্র্যাকিং</h2>
        <p className="text-gray-500 font-medium">আপনার অভিযোগের বর্তমান অবস্থা জানতে টিকেট নম্বরটি প্রদান করুন।</p>
      </div>

      <form onSubmit={handleSearch} className="mb-12">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            required
            type="text"
            className="flex-grow px-8 py-5 bg-white border-2 border-gray-100 rounded-3xl outline-none focus:ring-4 focus:ring-[#2da65e]/10 focus:border-[#2da65e] transition-all font-mono text-xl text-center"
            placeholder="CB-XXXXXX"
            value={ticketNo}
            onChange={(e) => setTicketNo(e.target.value)}
          />
          <button type="submit" className="bg-[#1a1a1a] text-white px-10 py-5 rounded-3xl font-black hover:bg-black transition-all shadow-xl">
            ট্র্যাক করুন
          </button>
        </div>
      </form>

      {searched && (
        <div className="animate-fade-in">
          {foundReport ? (
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                 <span className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest ${
                   foundReport.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                   foundReport.status === 'Investigating' ? 'bg-blue-100 text-blue-700' :
                   foundReport.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                 }`}>
                   {foundReport.status}
                 </span>
              </div>
              
              <div className="mb-10">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] block mb-2">ঘটনার বিবরণ</span>
                <h3 className="text-2xl font-black text-gray-900 mb-4">{foundReport.title}</h3>
                <p className="text-gray-600 font-medium leading-relaxed">{foundReport.description}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8 border-t border-gray-50">
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">ক্যাটাগরি</span>
                  <div className="font-bold text-gray-900">{foundReport.category}</div>
                </div>
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">অবস্থান</span>
                  <div className="font-bold text-gray-900">{foundReport.subLocation || foundReport.location}</div>
                </div>
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">তারিখ</span>
                  <div className="font-bold text-gray-900">{foundReport.date}</div>
                </div>
              </div>

              {foundReport.status === 'Resolved' && (
                <div className="mt-10 p-6 bg-green-50 rounded-3xl border border-green-100 flex items-center space-x-6">
                   <div className="w-12 h-12 bg-[#2da65e] rounded-2xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                   </div>
                   <div>
                      <h4 className="font-black text-[#2da65e]">সফলভাবে সমাধান করা হয়েছে!</h4>
                      <p className="text-sm text-green-600 font-medium">কর্তৃপক্ষ আপনার অভিযোগটি যাচাই করে প্রয়োজনীয় ব্যবস্থা গ্রহণ করেছে।</p>
                   </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 bg-red-50 rounded-[3rem] border border-red-100">
               <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
               </div>
               <h3 className="text-xl font-black text-red-800">কোনো তথ্য পাওয়া যায়নি</h3>
               <p className="text-red-600 font-medium">টিকেট নম্বরটি সঠিক কিনা যাচাই করুন।</p>
            </div>
          )}
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}} />
    </div>
  );
};

export default TrackReport;
