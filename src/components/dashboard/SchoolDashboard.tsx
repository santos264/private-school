import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  GraduationCap,
  Users2,
  ShieldCheck,
  UserCheck,
  Calendar,
  Clock,
  Megaphone,
  BookOpen,
  Award,
  Sparkles,
  ArrowRight,
  LogIn,
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  ChevronRight,
  School,
  Flame,
  ArrowUpRight,
  Database
} from 'lucide-react';

export const SchoolDashboard: React.FC = () => {
  const { 
    settings, 
    students, 
    teachers, 
    classes, 
    announcements, 
    setCurrentView,
    openLoginPortal 
  } = useSchool();

  const totalBoys = students.filter(s => s.gender === 'Male').length;
  const totalGirls = students.filter(s => s.gender === 'Female').length;
  const pinnedAnnouncements = announcements.filter(a => a.isPinned);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Grand Hero & Campus Showcase Banner */}
      <section className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-900 text-white">
        {/* Campus Background with Overlay */}
        <div className="absolute inset-0">
          <img 
            src={settings.bannerUrl} 
            alt="School Campus" 
            className="w-full h-full object-cover opacity-25 filter blur-[0.5px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-indigo-950/80" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 lg:p-10">
          {/* Top Institutional Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Official School Portal · Approved Examination Centre</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
              <span>{settings.currentSession}</span>
              <span>·</span>
              <span className="text-emerald-400 font-semibold">{settings.currentTerm}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1.5 shadow-lg shrink-0 border-2 border-amber-400/80">
                  <img 
                    src={settings.crestUrl} 
                    alt="School Crest" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                    {settings.schoolName}
                  </h1>
                  <p className="text-sm sm:text-base text-indigo-200 font-medium italic mt-0.5">
                    "{settings.motto}"
                  </p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Welcome to our centralized academic management dashboard. Providing holistic 
                secondary education, Continuous Assessment (CA) tracking, verified terminal report 
                cards, and transparent portal access for students, educators, and guardians.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => openLoginPortal()}
                  className="flex items-center gap-2 px-5 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 active:from-indigo-700 active:to-blue-700 rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-indigo-200" />
                  <span>Staff & Student Login</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  onClick={() => setCurrentView('timetable')}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-200 bg-white/10 hover:bg-white/20 active:bg-white/15 backdrop-blur-md rounded-xl border border-white/20 transition-all cursor-pointer"
                >
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Class Timetables</span>
                </button>

                <button
                  onClick={() => setCurrentView('notices')}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-200 bg-white/10 hover:bg-white/20 active:bg-white/15 backdrop-blur-md rounded-xl border border-white/20 transition-all cursor-pointer"
                >
                  <Megaphone className="w-4 h-4 text-blue-400" />
                  <span>School Bulletins</span>
                </button>
              </div>
            </div>

            {/* Right: Principal's Desk Welcome Card */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-amber-400/80 shadow-md shrink-0">
                  <img 
                    src={settings.principalPortraitUrl} 
                    alt={settings.principalName} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Principal's Office</span>
                  <h4 className="text-xs font-bold text-white leading-tight">{settings.principalName}</h4>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "Our college remains committed to academic rigour, moral integrity, and modern STEM innovation. We prepare students for future leadership."
              </p>
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-indigo-200">
                <span>Resumption Date:</span>
                <span className="font-semibold text-white">{settings.nextResumptionDate}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. School Key Indicators Bar */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 leading-none">
              {students.length}
            </div>
            <p className="text-xs font-medium text-slate-500 mt-1">Total Enrolled Students</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{totalBoys} Boys · {totalGirls} Girls</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Users2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 leading-none">
              {teachers.length}
            </div>
            <p className="text-xs font-medium text-slate-500 mt-1">Teaching Faculty</p>
            <p className="text-[10px] text-blue-600 font-semibold mt-0.5">100% Certified Educators</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 leading-none">
              {classes.length}
            </div>
            <p className="text-xs font-medium text-slate-500 mt-1">Class Arms (JSS 1 - SS 3)</p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Sciences & Arts Quads</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 leading-none">
              98.6%
            </div>
            <p className="text-xs font-medium text-slate-500 mt-1">WAEC / BECE Rating</p>
            <p className="text-[10px] text-amber-600 font-semibold mt-0.5">Academic Excellence</p>
          </div>
        </div>
      </section>

      {/* 3. Dedicated Portal Login Place Cards (Staff, Student, Admin, Parent) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <LogIn className="w-5 h-5 text-indigo-600" />
              <span>Portal Access & Role Logins</span>
            </h2>
            <p className="text-xs text-slate-500">
              Select your institutional portal below or use the top "Login" button in the header.
            </p>
          </div>
          <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 self-start sm:self-auto">
            Secure Role Portals
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Student Portal */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 hover:border-indigo-400 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Student Portal
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Check Continuous Assessment (CA) scores, download verified terminal report cards, and view weekly timetable schedules.
              </p>
              <div className="mt-4 space-y-1.5 text-[11px] text-slate-600 font-medium">
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Terminal Report Cards</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Subject Assessment Marks</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Class Timetable & Roll Call</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => openLoginPortal('student')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                <span>Log in as Student</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Staff / Teacher Portal */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-400 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Staff & Teacher Portal
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Record classroom attendance, enter test and examination grades, and manage allocated subject curriculum.
              </p>
              <div className="mt-4 space-y-1.5 text-[11px] text-slate-600 font-medium">
                <div className="flex items-center gap-1.5 text-blue-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Attendance Registers</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Enter CA & Exam Marks</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Teaching Timetable & Rosters</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => openLoginPortal('teacher')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                <span>Log in as Staff</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Administrator Portal */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 hover:border-rose-400 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                Administrator Portal
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Chief Administrator console for academic sessions, staff records, student enrollment, and invite code dispatch.
              </p>
              <div className="mt-4 space-y-1.5 text-[11px] text-slate-600 font-medium">
                <div className="flex items-center gap-1.5 text-rose-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Chief Admin Code Dispatch</span>
                </div>
                <div className="flex items-center gap-1.5 text-rose-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Admissions & Staff Master</span>
                </div>
                <div className="flex items-center gap-1.5 text-rose-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>School Session & Term Settings</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => openLoginPortal('admin')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                <span>Log in as Admin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 4: Parent / Guardian Portal */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 hover:border-amber-400 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                Parent / Guardian Portal
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Monitor your ward’s learning outcomes, inspect attendance history, and verify tuition fee statements & receipts.
              </p>
              <div className="mt-4 space-y-1.5 text-[11px] text-slate-600 font-medium">
                <div className="flex items-center gap-1.5 text-amber-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Ward Performance Tracking</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Tuition Payments & Receipts</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Principal's Termly Remarks</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => openLoginPortal('parent')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                <span>Log in as Parent</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Split Section: Latest Circulars & Academic Program Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Latest Circulars / Announcements */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Official Notices & Circulars</h3>
              </div>
              <button
                onClick={() => setCurrentView('notices')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <span>View All ({announcements.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 3).map((item) => (
                <div 
                  key={item.id} 
                  className={`p-4 rounded-xl border transition-all ${
                    item.isPinned 
                      ? 'bg-amber-50/50 border-amber-200' 
                      : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">{item.title}</span>
                    {item.isPinned && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">
                        Pinned
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.content}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="capitalize">Target: {Array.isArray(item.targetAudience) ? (item.targetAudience as string[]).join(', ') : item.targetAudience}</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Published by the College Information Bureau</span>
            <button 
              onClick={() => setCurrentView('notices')}
              className="text-indigo-600 hover:underline font-medium cursor-pointer"
            >
              Browse bulletin archive →
            </button>
          </div>
        </div>

        {/* Right: Academic Structure & Departments */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">Academic Structure</h3>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">Junior Secondary School (JSS 1 - 3)</span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full">Foundation</span>
                </div>
                <p className="text-xs text-slate-500">
                  Core curriculum: English, General Mathematics, Basic Science & Tech, Civic & Computer Studies.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">Senior Science Quad (SS 1 - 3)</span>
                  <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">STEM</span>
                </div>
                <p className="text-xs text-slate-500">
                  Physics, Chemistry, Biology, Further Mathematics, Technical Drawing & ICT Laboratories.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">Senior Arts & Humanities (SS 1 - 3)</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">Humanities</span>
                </div>
                <p className="text-xs text-slate-500">
                  Literature in English, Government, Economics, History, Civic Education & French Language.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">WAEC & NECO Centre: #0028491</span>
            <button
              onClick={() => setCurrentView('classes')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              View Class Arms →
            </button>
          </div>
        </div>
      </div>

      {/* 5. Campus Helpdesk & Location Footer Card */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Building2 className="w-4 h-4" />
              <span>Campus Address</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {settings.address}
            </p>
            <p className="text-[11px] text-slate-400">
              Administrative Block & Senior Quadrangle
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Phone className="w-4 h-4" />
              <span>Admissions & Registry</span>
            </div>
            <p className="text-xs text-slate-300">
              {settings.phone}
            </p>
            <p className="text-xs text-slate-400">
              Email: {settings.email}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Calendar className="w-4 h-4" />
              <span>Current Term Resumption</span>
            </div>
            <p className="text-xs text-slate-300">
              Next Academic Resumption: <strong className="text-amber-400">{settings.nextResumptionDate}</strong>
            </p>
            <button
              onClick={() => openLoginPortal()}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-600" />
              <span>Access School Login Portal</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
