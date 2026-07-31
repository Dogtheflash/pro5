import React, { useState } from 'react'

export interface EduCourse {
  id: string
  title: string
  category: 'coding' | 'ai' | 'art' | 'science' | 'language'
  icon: string
  ageGroup: string
  lessons: number
  rating: number
  color: string // e.g. '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'
  image: string
  description: string
  outcomes: string[]
  price: number
}

export const EDU_COURSES: EduCourse[] = [
  {
    id: 'roblox-python',
    title: 'Roblox & Python Game Studio',
    category: 'coding',
    icon: '🎮',
    ageGroup: 'Ages 8–14',
    lessons: 24,
    rating: 4.99,
    color: '#8b5cf6', // Electric Purple
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&fit=crop&auto=format',
    description: 'Build your own 3D multiplayer games on Roblox Studio using Lua & Python scripts from scratch.',
    outcomes: ['3D World Building', 'Physics Engine Logic', 'Multiplayer Publishing', 'Python Fundamentals'],
    price: 199,
  },
  {
    id: 'ai-robotics',
    title: 'AI & Smart Robotics Quest',
    category: 'ai',
    icon: '🤖',
    ageGroup: 'Ages 10–16',
    lessons: 18,
    rating: 4.98,
    color: '#06b6d4', // Cyan
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&fit=crop&auto=format',
    description: 'Train computer vision models, program micro-controllers, and build autonomous rover bots.',
    outcomes: ['Computer Vision (OpenCV)', 'Machine Learning Basics', 'Raspberry Pi / Arduino', 'Bot Navigation'],
    price: 249,
  },
  {
    id: 'blender-3d-art',
    title: 'Digital Art & Blender 3D Animation',
    category: 'art',
    icon: '🎨',
    ageGroup: 'Ages 7–13',
    lessons: 20,
    rating: 4.96,
    color: '#ec4899', // Bubblegum Pink
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&fit=crop&auto=format',
    description: 'Sculpt 3D clay characters, light cinematic scenes, and animate short cartoon movies.',
    outcomes: ['3D Modeling & Texturing', 'Lighting & Rendering', 'Character Animation', 'Digital Illustration'],
    price: 179,
  },
  {
    id: 'space-physics',
    title: 'Astronaut Astrophysics & Rocketry',
    category: 'science',
    icon: '🌌',
    ageGroup: 'Ages 9–15',
    lessons: 16,
    rating: 4.97,
    color: '#f59e0b', // Sunny Amber
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&fit=crop&auto=format',
    description: 'Explore orbital mechanics, simulate rocket launches, and analyze black holes & distant galaxies.',
    outcomes: ['Orbital Trajectory Math', 'Telescope Stargazing', 'Rocket Propulsion Physics', 'Space Exploration'],
    price: 210,
  },
  {
    id: 'polyglot-quest',
    title: 'Polyglot Kids Language Adventure',
    category: 'language',
    icon: '🌍',
    ageGroup: 'Ages 6–12',
    lessons: 30,
    rating: 4.95,
    color: '#10b981', // Emerald
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&fit=crop&auto=format',
    description: 'Master English, Japanese, and Spanish through interactive games, songs, and live native tutors.',
    outcomes: ['Conversational Fluency', 'Phonics & Pronunciation', 'Cultural Traditions', 'Storytelling Skills'],
    price: 159,
  },
  {
    id: 'bio-genetics',
    title: 'Future Bio-Genetics & Micro-Lab',
    category: 'science',
    icon: '🧬',
    ageGroup: 'Ages 11–16',
    lessons: 22,
    rating: 4.99,
    color: '#6366f1', // Indigo
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&fit=crop&auto=format',
    description: 'Discover DNA sequencing, cellular biology, and sustainable eco-engineering experiments.',
    outcomes: ['Microscope Lab Skills', 'DNA Structure Modeling', 'Ecosystem Protection', 'Scientific Method'],
    price: 229,
  },
]

export function ClaymorphismEduPlatformSection({
  onAddToCart,
}: {
  onAddToCart?: (item: { id: string; name: string; country: string; flag: string; priceUsd: number }) => void
}) {
  const [selectedCat, setSelectedCat] = useState<string>('all')
  const [activeCourseModal, setActiveCourseModal] = useState<EduCourse | null>(null)
  const [enrollModalOpen, setEnrollModalOpen] = useState(false)

  // Interactive Progress Tracking Demo State
  const [studentXp, setStudentXp] = useState(1450)
  const [streakDays, setStreakDays] = useState(14)
  const [level, setLevel] = useState(5)
  const [showLevelUp, setShowLevelUp] = useState(false)

  // Trial Enrollment Form State
  const [parentName, setParentName] = useState('')
  const [childAge, setChildAge] = useState('9-12')
  const [selectedCourseId, setSelectedCourseId] = useState(EDU_COURSES[0].id)
  const [enrolledSuccess, setEnrolledSuccess] = useState(false)

  const filteredCourses = selectedCat === 'all'
    ? EDU_COURSES
    : EDU_COURSES.filter((c) => c.category === selectedCat)

  const handleQuestComplete = () => {
    const nextXp = studentXp + 150
    setStudentXp(nextXp)
    if (nextXp >= 1600 && level === 5) {
      setLevel(6)
      setShowLevelUp(true)
    }
  }

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!parentName) {
      alert('Please enter parent name to claim free trial.')
      return
    }
    setEnrolledSuccess(true)
  }

  return (
    <section className="relative w-full bg-[#f4f0ff] text-slate-900 py-20 px-4 sm:px-8 overflow-hidden">
      {/* Background Soft Blobs */}
      <div className="absolute top-10 left-10 h-96 w-96 rounded-full bg-purple-300/40 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 h-[450px] w-[450px] rounded-full bg-pink-300/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 h-[500px] w-[500px] rounded-full bg-amber-200/40 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-24">
        {/* ── 1. Hero Banner with Claymorphism Cards ────────────────────────── */}
        <div className="text-center space-y-8 max-w-4xl mx-auto pt-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full clay-card text-xs font-mono font-700 uppercase tracking-widest text-purple-700">
            <span className="text-lg">✨</span>
            <span>ClayQuest Academy · Gamified Learning Platform</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-800 leading-[1.08] tracking-tight text-slate-900">
            Learn Anything, Build Everything. <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">
              The Ultimate Gamified Quest!
            </span>
          </h1>

          <p className="font-body text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Interactive coding, AI robotics, 3D digital art, and space physics designed for curious young minds with real-time XP, rewards, and live 1-on-1 mentor guidance.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setEnrollModalOpen(true)}
              className="px-8 py-4 font-mono text-xs uppercase tracking-widest font-700 clay-btn-primary cursor-pointer hover:scale-105"
            >
              🚀 Claim 7-Day Free Trial
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('progress-demo')
                el?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="px-8 py-4 font-mono text-xs uppercase tracking-widest font-700 rounded-full bg-white text-purple-700 shadow-md hover:shadow-lg border border-purple-200 cursor-pointer"
            >
              🎮 Try Progress Demo
            </button>
          </div>
        </div>

        {/* ── 2. Course Catalog Preview Grid ───────────────────────────────── */}
        <div id="course-catalog" className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-purple-200 pb-6">
            <div className="text-left">
              <span className="font-mono text-xs uppercase tracking-widest text-purple-600 font-bold">✦ Interactive Syllabus</span>
              <h2 className="font-display text-3xl sm:text-5xl font-800 text-slate-900 mt-1">
                Explore <span className="text-pink-500">Playful Quests</span>
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Quests' },
                { id: 'coding', label: '🎮 Game Dev' },
                { id: 'ai', label: '🤖 AI & Bots' },
                { id: 'art', label: '🎨 3D Art' },
                { id: 'science', label: '🌌 Physics & Bio' },
                { id: 'language', label: '🌍 Languages' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCat(c.id)}
                  className={`px-4 py-2 font-mono text-xs uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                    selectedCat === c.id
                      ? 'bg-purple-600 text-white font-700 shadow-md shadow-purple-500/30'
                      : 'bg-white text-slate-600 hover:bg-purple-100 border border-purple-100'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div key={course.id} className="clay-card p-6 flex flex-col justify-between text-left space-y-5">
                <div className="space-y-4">
                  {/* Card Header Image */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100">
                    <img src={course.image} alt={course.title} className="h-full w-full object-cover" />
                    <span className="absolute top-3 left-3 h-10 w-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-xl shadow-md">
                      {course.icon}
                    </span>
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white font-mono text-xs font-700">
                      {course.ageGroup}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-purple-600 font-bold">📚 {course.lessons} Lessons</span>
                    <span className="text-amber-500 font-bold">★ {course.rating}</span>
                  </div>

                  <h3 className="font-display text-2xl font-700 text-slate-900 leading-tight">
                    {course.title}
                  </h3>

                  <p className="font-body text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {course.outcomes.slice(0, 3).map((o, i) => (
                      <span key={i} className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 font-600">
                        ✓ {o}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-purple-100 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-mono text-slate-400">Tuition</span>
                    <span className="font-mono text-2xl font-800 text-purple-700">${course.price}</span>
                  </div>

                  <button
                    onClick={() => setActiveCourseModal(course)}
                    className="px-5 py-2.5 font-mono text-xs uppercase tracking-widest font-700 rounded-full bg-purple-100 hover:bg-purple-600 hover:text-white text-purple-700 transition-all cursor-pointer"
                  >
                    View Quest
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. Interactive Progress Tracking Demo ────────────────────────── */}
        <div id="progress-demo" className="clay-card p-8 sm:p-14 text-left space-y-8 relative overflow-hidden bg-gradient-to-br from-white via-purple-50 to-pink-50">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-purple-100 pb-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-pink-600 font-bold">✦ Gamified Student Dashboard Demo</span>
              <h2 className="font-display text-3xl sm:text-4xl font-800 text-slate-900 mt-1">
                Real-Time <span className="text-purple-600">Skill Progress & XP Gauge</span>
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-2xl bg-amber-100 border border-amber-300 font-mono text-xs text-amber-800 font-700 flex items-center gap-1.5">
                <span>🔥</span>
                <span>{streakDays} Day Streak!</span>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-purple-100 border border-purple-300 font-mono text-xs text-purple-800 font-700 flex items-center gap-1.5">
                <span>🎖️</span>
                <span>Level {level} Explorer</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Live XP Counter & Meter */}
            <div className="space-y-4 p-6 rounded-3xl bg-white shadow-md border border-purple-100">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-slate-500">Current XP Level</span>
                <span className="font-bold text-purple-700">{studentXp} / 1600 XP</span>
              </div>

              {/* Progress Bar */}
              <div className="h-4 w-full rounded-full bg-purple-100 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, (studentXp / 1600) * 100)}%` }}
                />
              </div>

              <p className="font-body text-xs text-slate-500">
                Complete quests to earn XP badges and level up your explorer rank!
              </p>

              <button
                onClick={handleQuestComplete}
                className="w-full py-3.5 font-mono text-xs uppercase tracking-widest font-700 clay-btn-amber cursor-pointer"
              >
                ⚡ Complete Daily Quest (+150 XP)
              </button>
            </div>

            {/* Skill Mastery Breakdown */}
            <div className="space-y-3 col-span-2 p-6 rounded-3xl bg-white shadow-md border border-purple-100">
              <h4 className="font-display text-xl font-700 text-slate-900">Active Skill Mastery Progress:</h4>

              {[
                { skill: 'Python Logic & Loops', percent: 85, color: 'bg-purple-500' },
                { skill: 'Roblox 3D Physics Engine', percent: 70, color: 'bg-pink-500' },
                { skill: 'AI Computer Vision Basics', percent: 60, color: 'bg-cyan-500' },
                { skill: 'Blender Character Sculpting', percent: 92, color: 'bg-emerald-500' },
              ].map((s) => (
                <div key={s.skill} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="font-600 text-slate-700">{s.skill}</span>
                    <span className="font-bold text-slate-900">{s.percent}%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Level Up Celebration Toast */}
        {showLevelUp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
            <div className="clay-card p-8 text-center max-w-sm space-y-4 animate-bounce">
              <div className="text-6xl">🎉</div>
              <h3 className="font-display text-3xl font-800 text-purple-700">LEVEL UP!</h3>
              <p className="font-body text-sm text-slate-600">
                Congratulations! You reached <strong>Level 6 Code Wizard</strong>!
              </p>
              <button
                onClick={() => setShowLevelUp(false)}
                className="px-6 py-2.5 font-mono text-xs uppercase font-700 clay-btn-primary cursor-pointer"
              >
                Awesome!
              </button>
            </div>
          </div>
        )}

        {/* ── 4. Student & Parent Testimonials ────────────────────────────── */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-pink-600 font-bold">✦ Happy Explorers & Parents</span>
            <h2 className="font-display text-3xl sm:text-5xl font-800 text-slate-900">
              Loved by <span className="text-purple-600">10,000+ Young Creators</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Leo Chen (Age 11)',
                role: 'Roblox & Python Student',
                avatar: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=150&fit=crop&auto=format',
                quote: 'I built my own obstacle course game on Roblox and 50 people played it! The XP leveling system makes learning coding feel like a video game.',
              },
              {
                name: 'Sarah Jenkins (Parent)',
                role: 'Mother of Maya (Age 9)',
                avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&fit=crop&auto=format',
                quote: 'ClayQuest turned Maya’s screen time into creative time. She built a working AI bot that detects shapes in just 4 weeks!',
              },
              {
                name: 'David K. (Age 13)',
                role: '3D Art & Blender Student',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&fit=crop&auto=format',
                quote: 'My mentor helped me render my first 3D character in Blender. The live feedback and gamified badges keep me super motivated!',
              },
            ].map((t, idx) => (
              <div key={idx} className="clay-card p-6 space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="h-12 w-12 rounded-full object-cover border-2 border-purple-400" />
                  <div>
                    <h4 className="font-display font-700 text-base text-slate-900">{t.name}</h4>
                    <p className="font-mono text-xs text-purple-600">{t.role}</p>
                  </div>
                </div>
                <div className="text-amber-400 font-bold text-sm">★★★★★</div>
                <p className="font-body text-sm text-slate-600 italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. Enrollment CTA & Trial Form ──────────────────────────────── */}
        <div className="clay-card p-8 sm:p-14 text-left bg-gradient-to-r from-purple-600 to-pink-500 text-white space-y-8 relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-6 text-center">
            <span className="font-mono text-xs uppercase tracking-widest text-amber-300 font-bold">✦ Start Learning Today</span>
            <h2 className="font-display text-3xl sm:text-5xl font-800 text-white">
              Claim Your Child’s 7-Day Free Trial Pass!
            </h2>
            <p className="font-body text-base text-purple-100 max-w-xl mx-auto">
              Get unlimited access to interactive coding labs, live mentor Q&A, and gamified quest projects with zero risk.
            </p>

            {enrolledSuccess ? (
              <div className="p-8 rounded-3xl bg-white text-slate-900 space-y-4">
                <div className="text-5xl">🎓</div>
                <h3 className="font-display text-3xl font-800 text-purple-700">Trial Pass Unlocked!</h3>
                <p className="font-body text-sm text-slate-600">
                  Welcome, <strong>{parentName}</strong>! Your 7-day trial pass has been issued. Check your email for login credentials.
                </p>
                <button
                  onClick={() => setEnrolledSuccess(false)}
                  className="px-6 py-3 rounded-full font-mono text-xs uppercase font-700 clay-btn-primary cursor-pointer"
                >
                  Register Another Student
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnrollSubmit} className="space-y-4 max-w-xl mx-auto text-left">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-purple-200 mb-1">Parent's Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Jessica Miller"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full p-3.5 rounded-2xl bg-white text-slate-900 font-body text-sm outline-none shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-purple-200 mb-1">Child's Age Group</label>
                    <select
                      value={childAge}
                      onChange={(e) => setChildAge(e.target.value)}
                      className="w-full p-3.5 rounded-2xl bg-white text-slate-900 font-mono text-sm outline-none shadow-inner cursor-pointer"
                    >
                      <option>Ages 6–8 (Beginner)</option>
                      <option>Ages 9–12 (Intermediate)</option>
                      <option>Ages 13–16 (Advanced)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-purple-200 mb-1">First Quest Interest</label>
                    <select
                      value={selectedCourseId}
                      onChange={(e) => setSelectedCourseId(e.target.value)}
                      className="w-full p-3.5 rounded-2xl bg-white text-slate-900 font-mono text-sm outline-none shadow-inner cursor-pointer"
                    >
                      {EDU_COURSES.map((c) => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 font-mono text-xs uppercase tracking-widest font-700 clay-btn-amber cursor-pointer hover:scale-105 transition-all mt-4"
                >
                  🚀 Activate 7-Day Free Pass Now
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── 6. Course Details Modal ───────────────────────────────────────── */}
      {activeCourseModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4"
          onClick={() => setActiveCourseModal(null)}
        >
          <div
            className="clay-card p-6 sm:p-8 max-w-2xl w-full text-left space-y-5 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveCourseModal(null)}
              className="absolute top-4 right-4 h-9 w-9 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center hover:bg-slate-200 cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-3">
              <span className="text-3xl">{activeCourseModal.icon}</span>
              <div>
                <span className="font-mono text-xs font-bold text-purple-600">{activeCourseModal.ageGroup}</span>
                <h3 className="font-display text-2xl font-800 text-slate-900">{activeCourseModal.title}</h3>
              </div>
            </div>

            <p className="font-body text-sm text-slate-600 leading-relaxed">
              {activeCourseModal.description}
            </p>

            <div className="space-y-2">
              <h4 className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold">Key Learning Outcomes:</h4>
              <div className="grid grid-cols-2 gap-2">
                {activeCourseModal.outcomes.map((o, i) => (
                  <div key={i} className="p-2 rounded-xl bg-purple-50 text-purple-700 font-mono text-xs font-600">
                    ✓ {o}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-purple-100 flex items-center justify-between">
              <span className="font-mono text-2xl font-800 text-purple-700">${activeCourseModal.price}</span>
              {onAddToCart && (
                <button
                  onClick={() => {
                    onAddToCart({
                      id: activeCourseModal.id,
                      name: activeCourseModal.title,
                      country: 'ClayQuest Academy',
                      flag: activeCourseModal.icon,
                      priceUsd: activeCourseModal.price,
                    })
                    setActiveCourseModal(null)
                    alert('Course added to your enrollment cart!')
                  }}
                  className="px-6 py-3 font-mono text-xs uppercase tracking-widest font-700 clay-btn-primary cursor-pointer"
                >
                  🛒 Enroll in Course (${activeCourseModal.price})
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
