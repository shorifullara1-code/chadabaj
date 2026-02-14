
import React, { useState, useMemo } from 'react';
import { Report } from '../types';

interface TrackReportProps {
  reports: Report[];
}

const TrackReport: React.FC<TrackReportProps> = ({ reports }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [trackType, setTrackType] = useState<'ticket' | 'contact'>('ticket');

  const foundResults = useMemo(() => {
    if (!searched || !searchQuery.trim()) return [];
    
    if (trackType === 'ticket') {
      return reports.filter(r => r.ticketNumber.toUpperCase() === searchQuery.toUpperCase().trim());
    } else {
      const query = searchQuery.toLowerCase().trim();
      return reports.filter(r => 
        (r.reporterEmail && r.reporterEmail.toLowerCase() === query) || 
        (r.reporterPhone && r.reporterPhone.trim() === query)
      );
    }
  }, [reports, searchQuery, searched, trackType]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-gray-900 mb-4">রিপোর্ট ট্র্যাকিং</h2>
        <p className="text-gray-500 font-medium">আপনার অভিযোগের বর্তমান অবস্থা জানতে টিকেট নম্বর অথবা ফোন/ইমেল দিন।</p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1.5 rounded-2xl flex">
          <button 
            onClick={() => { setTrackType('ticket'); setSearched(false); }}
            className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${trackType === 'ticket' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            টিকেট নম্বর
          </button>
          <button 
            onClick={() => { setTrackType('contact'); setSearched(false); }}
            className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${trackType === 'contact' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            ফোন বা ইমেল
          </button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mb-16">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            required
            type="text"
            className="flex-grow px-8 py-5 bg-white border-2 border-gray-100 rounded-3xl outline-none focus:ring-4 focus:ring-[#2da65e]/10 focus:border-[#2da65e] transition-all font-mono text-xl text-center"
            placeholder={trackType === 'ticket' ? "CB-XXXXXX" : "01XXXXXXXXX বা email@example.com"}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="bg-[#1a1a1a] text-white px-10 py-5 rounded-3xl font-black hover:bg-black transition-all shadow-xl">
            খুঁজুন
          </button>
        </div>
      </form>

      {searched && (
        <div className="animate-fade-in space-y-8">
          {foundResults.length > 0 ? (
            <>
              {trackType === 'contact' && (
                <div className="mb-6 flex items-center justify-between px-6">
                  <h3 className="font-black text-gray-900">পাওয়া গেছে {foundResults.length} টি রিপোর্ট</h3>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">আপনার হিস্ট্রি</span>
                </div>
              )}
              {foundResults.map((report) => (
                <div key={report.id} className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-gray-50 relative overflow-hidden transition-all hover:shadow-2xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                      <span className="text-[10px] font-black text-[#2da65e] bg-green-50 px-3 py-1 rounded-full uppercase tracking-[0.2em] mb-3 inline-block">টিকেট নম্বর</span>
                      <h3 className="text-2xl font-black text-gray-900 font-mono">{report.ticketNumber}</h3>
                    </div>
                    <div className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-center ${
                      report.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                      report.status === 'Investigating' ? 'bg-blue-100 text-blue-700' :
                      report.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {report.status === 'Resolved' ? 'সমাধানকৃত' : 
                       report.status === 'Investigating' ? 'তদন্তাধীন' : 
                       report.status === 'Rejected' ? 'বাতিল' : 'অপেক্ষমান'}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">অভিযোগের সারসংক্ষেপ</span>
                      <h4 className="text-xl font-black text-gray-900 mb-3">{report.title}</h4>
                      <p className="text-gray-500 font-medium leading-relaxed line-clamp-4">{report.description}</p>
                    </div>
                    
                    <div className="space-y-6 bg-gray-50 p-8 rounded-[2rem]">
                      <div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">ক্যাটাগরি</span>
                        <div className="font-bold text-gray-900">{report.category}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">অবস্থান</span>
                          <div className="font-bold text-gray-900">{report.subLocation || report.location}</div>
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">তারিখ</span>
                          <div className="font-bold text-gray-900">{new Date(report.timestamp).toLocaleDateString('bn-BD')}</div>
                        </div>
                      </div>
                      
                      {report.status === 'Resolved' && (
                        <div className="pt-4 border-t border-gray-100 mt-2 flex items-center space-x-3 text-[#2da65e]">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                          <span className="text-sm font-black">সফল সমাধান!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-20 bg-red-50 rounded-[3rem] border border-red-100">
               <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
               </div>
               <h3 className="text-xl font-black text-red-800">কোনো তথ্য পাওয়া যায়নি</h3>
               <p className="text-red-600 font-medium">অনুগ্রহ করে সঠিক নম্বর বা ইমেল দিয়ে আবার চেষ্টা করুন।</p>
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
