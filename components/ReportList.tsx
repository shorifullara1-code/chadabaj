
import React, { useState, useMemo } from 'react';
import { Report, CATEGORIES, DISTRICTS, DHAKA_SUB_LOCATIONS, SAVAR_WARDS } from '../types';

interface ReportListProps {
  reports: Report[];
  title?: string;
  isPrivate?: boolean;
  onReviewSubmit?: (reportId: string, rating: number, comment: string) => void;
}

const ReportList: React.FC<ReportListProps> = ({ reports, title = "চাঁদাবাজদের তালিকা ও রিপোর্ট", isPrivate = false, onReviewSubmit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [subLocationFilter, setSubLocationFilter] = useState('');
  const [wardFilter, setWardFilter] = useState('');

  // Review state
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        report.title.toLowerCase().includes(searchLower) ||
        report.description.toLowerCase().includes(searchLower) ||
        report.ticketNumber.toLowerCase().includes(searchLower); // Search by ticket number
      
      const matchesCategory = categoryFilter === '' || report.category === categoryFilter;
      const matchesLocation = locationFilter === '' || report.location === locationFilter;
      const matchesSubLocation = subLocationFilter === '' || report.subLocation === subLocationFilter;
      const matchesWard = wardFilter === '' || report.ward === wardFilter;
      
      return matchesSearch && matchesCategory && matchesLocation && matchesSubLocation && matchesWard;
    });
  }, [reports, searchTerm, categoryFilter, locationFilter, subLocationFilter, wardFilter]);

  const handleReviewSubmit = (id: string) => {
    if (onReviewSubmit) {
      onReviewSubmit(id, reviewRating, reviewComment);
      setReviewingId(null);
      setReviewComment('');
      setReviewRating(5);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-black text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-500 font-medium text-lg">
          {isPrivate ? 'আপনার সাবমিট করা সকল টিকেটের বর্তমান অবস্থা এবং ডিটেইলস।' : 'অ্যাডমিন কর্তৃক যাচাইকৃত এবং জনস্বার্থে প্রকাশিত সাম্প্রতিক অভিযোগসমূহ।'}
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-10 bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-1 relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="টিকেট নং বা টাইটেল দিয়ে খুঁজুন..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-100 rounded-2xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#2da65e] transition-all sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <select
              className="block w-full pl-3 pr-10 py-3 text-base border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2da65e] sm:text-sm rounded-2xl bg-gray-50"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">সকল ক্যাটাগরি</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              className="block w-full pl-3 pr-10 py-3 text-base border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2da65e] sm:text-sm rounded-2xl bg-gray-50"
              value={locationFilter}
              onChange={(e) => {
                setLocationFilter(e.target.value);
                setSubLocationFilter('');
                setWardFilter('');
              }}
            >
              <option value="">সকল জেলা</option>
              {DISTRICTS.map(dist => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>

          {locationFilter === 'Dhaka' && (
            <div className="animate-fade-in">
              <select
                className="block w-full pl-3 pr-10 py-3 text-base border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2da65e] sm:text-sm rounded-2xl bg-green-50/50"
                value={subLocationFilter}
                onChange={(e) => {
                  setSubLocationFilter(e.target.value);
                  setWardFilter('');
                }}
              >
                <option value="">সকল ইউনিয়ন/পৌরসভা</option>
                {DHAKA_SUB_LOCATIONS.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          )}

          {subLocationFilter === 'সাভার পৌরসভা' && (
            <div className="animate-fade-in">
              <select
                className="block w-full pl-3 pr-10 py-3 text-base border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2da65e] sm:text-sm rounded-2xl bg-blue-50/50"
                value={wardFilter}
                onChange={(e) => setWardFilter(e.target.value)}
              >
                <option value="">সকল ওয়ার্ড</option>
                {SAVAR_WARDS.map(ward => (
                  <option key={ward} value={ward}>{ward}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-gray-400 font-black uppercase tracking-widest text-xs">কোনো তথ্য পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-white rounded-3xl shadow-sm border border-gray-50 p-8 hover:shadow-2xl transition-all group flex flex-col h-full animate-fade-in overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <span className="font-mono text-xs font-black text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                  {report.ticketNumber}
                </span>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex-shrink-0 ${
                  report.status === 'Resolved' ? 'bg-green-100 text-green-700' : 
                  report.status === 'Investigating' ? 'bg-blue-100 text-blue-700' :
                  report.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-50 text-orange-600'
                }`}>
                  {report.status === 'Resolved' ? 'সমাধানকৃত' : 
                   report.status === 'Investigating' ? 'তদন্তাধীন' : 
                   report.status === 'Rejected' ? 'বাতিল' : 'অপেক্ষমান'}
                </span>
              </div>
              
              <h3 className="text-xl font-black text-gray-900 mb-4 group-hover:text-[#2da65e] transition-colors leading-tight">
                {report.title}
              </h3>
              
              <p className="text-gray-500 font-medium leading-relaxed mb-6 flex-grow line-clamp-3">
                {report.description}
              </p>

              {/* Review Section for Private View */}
              {isPrivate && report.status === 'Resolved' && (
                <div className="mb-6 pt-4 border-t border-dashed border-gray-100">
                  {report.review ? (
                    <div className="bg-green-50 p-4 rounded-2xl">
                      <div className="flex items-center mb-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-3 h-3 ${i < report.review!.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-xs text-green-700 italic">"{report.review.comment}"</p>
                    </div>
                  ) : reviewingId === report.id ? (
                    <div className="animate-fade-in-down">
                      <p className="text-xs font-black text-[#2da65e] mb-2 uppercase">সমাধান নিয়ে আপনার মতামত দিন:</p>
                      <div className="flex space-x-2 mb-3">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button key={star} onClick={() => setReviewRating(star)} className={`p-1 transition-transform hover:scale-125 ${reviewRating >= star ? 'text-yellow-400' : 'text-gray-300'}`}>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          </button>
                        ))}
                      </div>
                      <textarea 
                        className="w-full text-xs p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white mb-2" 
                        placeholder="আপনার মন্তব্য লিখুন..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                      />
                      <div className="flex space-x-2">
                        <button onClick={() => handleReviewSubmit(report.id)} className="bg-[#2da65e] text-white px-4 py-2 rounded-xl text-[10px] font-bold">জমা দিন</button>
                        <button onClick={() => setReviewingId(null)} className="text-gray-400 px-4 py-2 rounded-xl text-[10px] font-bold">বাতিল</button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setReviewingId(report.id)}
                      className="w-full py-2.5 bg-green-50 text-[#2da65e] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-100 transition-colors"
                    >
                      রিভিউ দিন (Give Feedback)
                    </button>
                  )}
                </div>
              )}
              
              <div className="pt-6 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400 font-black uppercase tracking-wider">
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <svg className="w-3.5 h-3.5 mr-1.5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {report.location}
                  </div>
                  {report.subLocation && (
                    <span className="text-[#2da65e] mt-1 opacity-70">
                      {report.subLocation} {report.ward ? `> ${report.ward}` : ''}
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1.5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {report.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
        .animate-fade-in-down { animation: fade-in-down 0.3s ease-out forwards; }
      `}} />
    </div>
  );
};

export default ReportList;
