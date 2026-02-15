
import React, { useState } from 'react';
import { Report, ReportStatus, User } from '../types';

interface AdminDashboardProps {
  reports: Report[];
  users: User[];
  onUpdateStatus: (id: string, status: ReportStatus) => void;
  onDelete: (id: string) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ reports, users, onUpdateStatus, onDelete, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reports' | 'users'>('dashboard');
  const [reportSearch, setReportSearch] = useState('');

  const stats = [
    { label: 'মোট রিপোর্ট', count: reports.length, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { label: 'নিবন্ধিত ইউজার', count: users.length, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { label: 'সমাধানকৃত', count: reports.filter(r => r.status === 'Resolved').length, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'তদন্তাধীন', count: reports.filter(r => r.status === 'Investigating').length, icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' }
  ];

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case 'Resolved': return 'bg-green-100 text-green-700';
      case 'Investigating': return 'bg-blue-100 text-blue-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  const filteredReports = reports.filter(r => 
    r.title.toLowerCase().includes(reportSearch.toLowerCase()) || 
    r.ticketNumber.toLowerCase().includes(reportSearch.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col p-6 m-4 rounded-3xl shadow-sm">
        <div className="flex items-center space-x-3 mb-10 px-2">
          <div className="w-8 h-8 bg-[#2da65e] rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <span className="font-black text-xl text-gray-900">অ্যাডমিন</span>
        </div>
        
        <div className="space-y-2 flex-grow">
          {[
            { id: 'dashboard', label: 'ওভারভিউ', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
            { id: 'reports', label: 'রিপোর্টসমূহ', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
            { id: 'users', label: 'নিবন্ধিত ইউজার', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center space-x-3 px-5 py-4 rounded-2xl transition-all font-bold ${
                activeTab === item.id ? 'bg-[#1a1a1a] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
              </svg>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <button onClick={onLogout} className="mt-auto flex items-center space-x-3 px-5 py-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          <span>লগআউট</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <>
            <header className="mb-10">
              <h1 className="text-4xl font-black text-gray-900">ড্যাশবোর্ড ওভারভিউ</h1>
              <p className="text-gray-500 mt-2 font-medium">প্ল্যাটফর্মের সার্বিক কার্যক্রম পর্যবেক্ষণ করুন</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-hover hover:shadow-xl">
                  <div className="text-sm font-black text-gray-400 mb-4 uppercase tracking-widest">{stat.label}</div>
                  <div className="text-4xl font-black text-gray-900">{stat.count}</div>
                </div>
              ))}
            </div>

            <div className="bg-[#2da65e] rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-2xl font-black mb-4">নিরাপত্তা সতর্কতা</h2>
                <p className="max-w-xl opacity-90 leading-relaxed font-medium">
                  সবগুলো রিপোর্ট যাচাই করার আগে ব্যক্তিগত তথ্য জনসমক্ষে প্রকাশ করবেন না। টিকেট নম্বর ব্যবহার করে দ্রুত সার্চ করুন।
                </p>
              </div>
              <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            </div>
          </>
        )}

        {activeTab === 'reports' && (
          <div className="animate-fade-in">
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-4xl font-black text-gray-900">সকল রিপোর্ট</h1>
                <p className="text-gray-500 mt-2 font-medium">আগত এবং তদন্তাধীন সকল অভিযোগের তালিকা</p>
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  className="px-6 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#2da65e] min-w-[300px]"
                  placeholder="টিকেট নম্বর দিয়ে খুঁজুন..."
                  value={reportSearch}
                  onChange={(e) => setReportSearch(e.target.value)}
                />
              </div>
            </header>
            
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-50">
                {filteredReports.length === 0 ? (
                  <div className="p-20 text-center text-gray-400 font-bold">কোনো রিপোর্ট পাওয়া যায়নি।</div>
                ) : (
                  filteredReports.map((report) => (
                    <div key={report.id} className="p-8 hover:bg-gray-50/50 transition-colors">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                             <span className="font-mono text-xs bg-gray-900 text-white px-3 py-1 rounded-lg">{report.ticketNumber}</span>
                             <h3 className="text-xl font-black text-gray-900">{report.title}</h3>
                          </div>
                          <div className="flex flex-wrap gap-3 mt-2">
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-black uppercase tracking-widest">{report.category}</span>
                            <span className="px-3 py-1 bg-green-50 text-[#2da65e] rounded-lg text-xs font-black">{report.location}</span>
                            {report.subLocation && <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-black">{report.subLocation}</span>}
                          </div>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 font-medium leading-relaxed mb-8 border-l-4 border-[#2da65e] pl-6 py-2">
                        {report.description}
                      </p>

                      {/* Evidence Display Section */}
                      {report.evidence && report.evidence.length > 0 && (
                        <div className="mb-8 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                          <h4 className="text-xs font-black text-gray-400 uppercase mb-4 tracking-widest">সংযুক্ত প্রমাণাদি ({report.evidence.length})</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {report.evidence.map((item, idx) => (
                              <div key={idx} className="relative rounded-xl overflow-hidden shadow-sm group border border-gray-200 bg-white">
                                {item.type === 'image' ? (
                                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="block">
                                     <img src={item.url} alt="Evidence" className="w-full h-32 object-cover hover:scale-110 transition-transform duration-300" />
                                  </a>
                                ) : (
                                  <video src={item.url} controls className="w-full h-32 object-cover bg-black" />
                                )}
                                <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 text-white text-[10px] font-bold rounded-md backdrop-blur-sm uppercase">
                                  {item.type}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Review Section */}
                      {report.review && (
                        <div className="mb-8 p-6 bg-yellow-50 rounded-3xl border border-yellow-100">
                           <div className="text-xs font-black text-yellow-600 uppercase mb-2">ইউজার রিভিউ:</div>
                           <div className="flex items-center mb-2">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-4 h-4 ${i < report.review!.rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                              ))}
                           </div>
                           <p className="text-gray-700 italic">"{report.review.comment}"</p>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-gray-50">
                        <div className="flex items-center space-x-6 text-sm font-bold text-gray-400">
                          <span className="flex items-center"><svg className="w-4 h-4 mr-1.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> {report.isAnonymous ? 'গোপন' : (report.reporterEmail || 'ইউজার')}</span>
                          <span className="flex items-center"><svg className="w-4 h-4 mr-1.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> {report.date}</span>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <select 
                            value={report.status}
                            onChange={(e) => onUpdateStatus(report.id, e.target.value as ReportStatus)}
                            className="bg-white border-2 border-gray-100 px-4 py-2.5 rounded-xl text-sm font-black outline-none focus:border-[#2da65e] transition-all"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Investigating">Investigating</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                          <button onClick={() => onDelete(report.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="animate-fade-in">
            <header className="mb-10">
              <h1 className="text-4xl font-black text-gray-900">নিবন্ধিত ইউজার</h1>
              <p className="text-gray-500 mt-2 font-medium">প্ল্যাটফর্মের সকল সদস্যের তথ্য</p>
            </header>
            
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-5 text-sm font-black text-gray-400 uppercase tracking-widest">নাম</th>
                    <th className="px-8 py-5 text-sm font-black text-gray-400 uppercase tracking-widest">ইমেইল</th>
                    <th className="px-8 py-5 text-sm font-black text-gray-400 uppercase tracking-widest">মোবাইল</th>
                    <th className="px-8 py-5 text-sm font-black text-gray-400 uppercase tracking-widest">রোল</th>
                    <th className="px-8 py-5 text-sm font-black text-gray-400 uppercase tracking-widest">নিবন্ধন তারিখ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center text-gray-400 font-bold">এখনো কোনো ইউজার নেই।</td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-6 font-bold text-gray-900">{user.name}</td>
                        <td className="px-8 py-6 font-medium text-gray-500">{user.email}</td>
                        <td className="px-8 py-6 font-medium text-gray-700">{user.phone || 'N/A'}</td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${user.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-sm text-gray-400 font-medium">
                          {new Date(user.createdAt).toLocaleDateString('bn-BD')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
      `}} />
    </div>
  );
};

export default AdminDashboard;
