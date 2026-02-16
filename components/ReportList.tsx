
import React, { useState, useMemo, useEffect } from 'react';
import { Report, Review, CATEGORIES, DISTRICTS, DHAKA_SUB_LOCATIONS, SAVAR_WARDS } from '../types';
import { supabase } from '../services/supabase';

interface ReportListProps {
  reports: Report[];
  title?: string;
}

const ReportList: React.FC<ReportListProps> = ({ reports, title = "চাঁদাবাজদের তালিকা ও রিপোর্ট" }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [subLocationFilter, setSubLocationFilter] = useState('');
  const [wardFilter, setWardFilter] = useState('');
  
  // Modal State
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '', user_name: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Helper to safely parse reviews
  const parseReviews = (data: any): Review[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'object') return [data]; // Handle legacy single object
    return [];
  };

  // Fetch reviews when a report is selected
  useEffect(() => {
    if (selectedReport) {
      // Use the reviews directly from the selected report (JSONB column)
      // We fetch fresh data to ensure we have the latest
      const fetchFreshReportData = async () => {
         const { data, error } = await supabase
           .from('reports')
           .select('review') // Assuming column name is 'review'
           .eq('id', selectedReport.id)
           .single();
         
         if (data && !error) {
           setReviews(parseReviews(data.review));
         } else {
           // Fallback to prop data if fetch fails
           setReviews(parseReviews(selectedReport.review));
         }
      };
      
      fetchFreshReportData();
      setReviewSuccess(false);
      setNewReview({ rating: 0, comment: '', user_name: '' });
    }
  }, [selectedReport]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport || newReview.rating === 0) return;

    setIsSubmittingReview(true);
    try {
      const reviewData: Review = {
        report_id: selectedReport.id,
        user_name: newReview.user_name || 'Anonymous',
        rating: newReview.rating,
        comment: newReview.comment,
        created_at: new Date().toISOString()
      };

      const updatedReviews = [reviewData, ...reviews];

      // Update the 'review' column in the 'reports' table with the new array
      const { error } = await supabase
        .from('reports')
        .update({ review: updatedReviews })
        .eq('id', selectedReport.id);

      if (error) throw error;

      setReviews(updatedReviews);
      setReviewSuccess(true);
      setNewReview({ rating: 0, comment: '', user_name: '' });
      
      // Update local selectedReport state to reflect changes immediately
      setSelectedReport({ ...selectedReport, review: updatedReviews });

    } catch (err: any) {
      console.error("Failed to submit review:", err);
      alert(`রিভিউ জমা দেওয়া যায়নি। এরর: ${err.message || "Database connection error"}`);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        report.title.toLowerCase().includes(searchLower) ||
        report.description.toLowerCase().includes(searchLower) ||
        report.ticketNumber.toLowerCase().includes(searchLower);
      
      const matchesCategory = categoryFilter === '' || report.category === categoryFilter;
      const matchesLocation = locationFilter === '' || report.location === locationFilter;
      const matchesSubLocation = subLocationFilter === '' || report.subLocation === subLocationFilter;
      const matchesWard = wardFilter === '' || report.ward === wardFilter;
      
      return matchesSearch && matchesCategory && matchesLocation && matchesSubLocation && matchesWard;
    });
  }, [reports, searchTerm, categoryFilter, locationFilter, subLocationFilter, wardFilter]);

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-black text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-500 font-medium text-lg">
          বিস্তারিত দেখতে এবং মতামত জানাতে তালিকার যে কোনো রিপোর্টে ক্লিক করুন।
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
            <div 
              key={report.id} 
              onClick={() => setSelectedReport(report)}
              className="bg-white rounded-3xl shadow-sm border border-gray-50 p-8 hover:shadow-2xl transition-all group flex flex-col h-full animate-fade-in overflow-hidden cursor-pointer transform hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="font-mono text-xs font-black text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 group-hover:bg-[#2da65e] group-hover:text-white transition-colors">
                  {report.ticketNumber}
                </span>
                {/* Status Badge Removed */}
              </div>
              
              <h3 className="text-xl font-black text-gray-900 mb-4 group-hover:text-[#2da65e] transition-colors leading-tight">
                {report.title}
              </h3>
              
              <p className="text-gray-500 font-medium leading-relaxed mb-6 flex-grow line-clamp-4">
                {report.description}
              </p>

              <div className="flex items-center text-xs font-bold text-[#2da65e] mb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                বিস্তারিত দেখতে ক্লিক করুন <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </div>

              {report.evidence && report.evidence.length > 0 && (
                <div className="mb-6 mt-2 relative">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">সংযুক্ত প্রমাণাদি</h4>
                  <div className="grid grid-cols-4 gap-2 h-12 overflow-hidden">
                    {report.evidence.map((item, idx) => (
                      <div key={idx} className="relative rounded-lg overflow-hidden bg-gray-100 h-full">
                        {item.type === 'image' ? (
                          <img src={item.url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-black flex items-center justify-center">
                             <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent pointer-events-none"></div>
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

      {/* Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true" onClick={() => setSelectedReport(null)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-[2rem] text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full border border-gray-100">
              <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
                <button
                  type="button"
                  className="bg-gray-100 rounded-full p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-200 focus:outline-none"
                  onClick={() => setSelectedReport(null)}
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="bg-white px-4 pt-5 pb-4 sm:p-8 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                       <span className="bg-[#2da65e] text-white px-3 py-1 rounded-lg text-xs font-mono font-bold">{selectedReport.ticketNumber}</span>
                       <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest ${
                          selectedReport.status === 'Resolved' ? 'bg-green-100 text-green-700' : 
                          selectedReport.status === 'Investigating' ? 'bg-blue-100 text-blue-700' :
                          selectedReport.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-50 text-orange-600'
                        }`}>
                          {selectedReport.status}
                       </span>
                    </div>

                    <h3 className="text-3xl font-black text-gray-900 mb-2 leading-tight" id="modal-title">
                      {selectedReport.title}
                    </h3>
                    
                    <div className="flex items-center text-sm text-gray-500 font-bold mb-6 space-x-4">
                       <span className="flex items-center"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg> {selectedReport.location}, {selectedReport.subLocation}</span>
                       <span className="flex items-center"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> {selectedReport.date}</span>
                    </div>

                    {/* Description */}
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8 text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">
                      {selectedReport.description}
                    </div>

                    {/* Evidence */}
                    {selectedReport.evidence && selectedReport.evidence.length > 0 && (
                      <div className="mb-10">
                         <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">সংযুক্ত প্রমাণাদি</h4>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {selectedReport.evidence.map((item, idx) => (
                               <div key={idx} className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                                  {item.type === 'image' ? (
                                     <a href={item.url} target="_blank" rel="noopener noreferrer">
                                        <img src={item.url} alt="Evidence" className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />
                                     </a>
                                  ) : (
                                     <video src={item.url} controls className="w-full h-48 bg-black" />
                                  )}
                               </div>
                            ))}
                         </div>
                      </div>
                    )}

                    {/* Public Reviews Section */}
                    <div className="border-t border-gray-100 pt-8 mt-8">
                      <div className="flex items-center justify-between mb-6">
                         <h4 className="text-2xl font-black text-gray-900">জনগণের মতামত</h4>
                         <div className="text-right">
                            <div className="text-3xl font-black text-[#2da65e]">{getAverageRating()}</div>
                            <div className="text-xs text-gray-400 font-bold uppercase">{reviews.length} টি রিভিউ</div>
                         </div>
                      </div>

                      {/* Review List */}
                      <div className="space-y-4 mb-10 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {reviews.length === 0 ? (
                           <p className="text-gray-400 italic text-sm">এখনো কেউ মতামত দেননি। আপনিই প্রথম মতামত দিন।</p>
                        ) : (
                           reviews.map((review, idx) => (
                              <div key={idx} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                 <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-gray-900">{review.user_name}</span>
                                    <div className="flex text-yellow-400 text-xs">
                                      {[...Array(5)].map((_, i) => (
                                        <svg key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                      ))}
                                    </div>
                                 </div>
                                 <p className="text-sm text-gray-600">{review.comment}</p>
                              </div>
                           ))
                        )}
                      </div>

                      {/* Add Review Form */}
                      <div className="bg-[#2da65e]/5 p-6 rounded-3xl border border-[#2da65e]/10">
                        <h5 className="font-black text-gray-900 mb-4">আপনার মতামত দিন</h5>
                        {reviewSuccess ? (
                           <div className="text-green-600 font-bold bg-white p-4 rounded-xl text-center">আপনার মতামত গ্রহণ করা হয়েছে! ধন্যবাদ।</div>
                        ) : (
                          <form onSubmit={handleSubmitReview} className="space-y-4">
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">রেটিং (১-৫)</label>
                                <div className="flex space-x-2">
                                   {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                        key={star}
                                        type="button"
                                        onClick={() => setNewReview({...newReview, rating: star})}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${newReview.rating >= star ? 'bg-yellow-400 text-white shadow-lg scale-110' : 'bg-white text-gray-300 border border-gray-200 hover:border-yellow-400'}`}
                                      >
                                         <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                      </button>
                                   ))}
                                </div>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input 
                                  required 
                                  placeholder="আপনার নাম" 
                                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2da65e]"
                                  value={newReview.user_name}
                                  onChange={(e) => setNewReview({...newReview, user_name: e.target.value})}
                                />
                                <input 
                                  required 
                                  placeholder="মতামত লিখুন..." 
                                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2da65e]"
                                  value={newReview.comment}
                                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                                />
                             </div>
                             <button 
                               type="submit" 
                               disabled={isSubmittingReview || newReview.rating === 0}
                               className={`w-full py-3 rounded-xl font-black text-white transition-all ${isSubmittingReview || newReview.rating === 0 ? 'bg-gray-300' : 'bg-[#2da65e] hover:bg-[#258a4d] shadow-lg shadow-green-100'}`}
                             >
                                {isSubmittingReview ? 'জমা হচ্ছে...' : 'মতামত সাবমিট করুন'}
                             </button>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ccc; }
      `}} />
    </div>
  );
};

export default ReportList;
