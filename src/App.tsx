import React from 'react'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col items-center justify-center p-6 text-center">
      {/* Glow Backdrop */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-600/30 via-purple-600/30 to-pink-600/30 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-mono text-xs uppercase tracking-widest">
          <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
          <span>System Reset Complete · Ready for New Prompt</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
          Sẵn Sàng Dựng Trang Web Mới!
        </h1>

        <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
          Đã xóa sạch các dự án cũ. Hệ thống đã chuẩn bị đầy đủ bộ kỹ năng thiết kế UI/UX, hiệu ứng chuyển động, màu sắc chuẩn xu hướng và tối ưu hóa SEO.
          <br />
          <strong>Hãy gửi prompt/yêu cầu trang web mới của bạn ngay bây giờ!</strong>
        </p>

        <div className="pt-4 flex items-center justify-center gap-3">
          <div className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            ⚡ Vite + React + Tailwind CSS + TypeScript
          </div>
        </div>
      </div>
    </div>
  )
}
