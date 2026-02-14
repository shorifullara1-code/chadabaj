
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("ChandaBaj App initialized.");
  } catch (error) {
    console.error("Initialization error:", error);
    rootElement.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: 'Hind Siliguri', sans-serif; text-align: center; padding: 20px;">
        <h1 style="color: #2da65e;">চান্দাবাজ</h1>
        <p style="color: #e53e3e; font-weight: bold;">দুঃখিত, অ্যাপ্লিকেশনটি চালু করা সম্ভব হয়নি।</p>
        <p style="color: #666; font-size: 14px;">ব্রাউজারের ক্যাশ (Cache) ক্লিয়ার করে আবার চেষ্টা করুন।</p>
        <button onclick="location.reload()" style="margin-top: 20px; padding: 12px 24px; background: #2da65e; color: white; border: none; border-radius: 12px; font-weight: bold; cursor: pointer;">রিফ্রেশ করুন</button>
      </div>
    `;
  }
}
