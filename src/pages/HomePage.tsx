import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { APP_CONFIG } from '../config';

const HomePage = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0f172a]">
      {/* Dynamic Animated Background - Same as Login */}
      <div className="absolute inset-0 gradient-bg-animated opacity-60"></div>

      {/* Persistent Grid Pattern Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Ambient Radial Glow */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.15),transparent)]"></div>

      {/* Content Container */}
      <div className="relative z-10">
        {/* Hero Section - Fullscreen Auto */}
        <div className="relative overflow-hidden min-h-screen flex items-center">
          <div className="relative max-w-none mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-16 sm:py-24 lg:py-32 xl:py-40 w-full">
            <div className="text-center lg:text-left lg:grid lg:grid-cols-2 lg:gap-16 xl:gap-20 lg:items-center">
              {/* Left Content - Fullscreen Auto */}
              <div className="space-y-6 lg:space-y-8 xl:space-y-10 reveal-group">
                {/* Animated Badge */}
                <div className="inline-flex items-center px-4 py-2 text-sm lg:text-base xl:text-lg font-bold text-white bg-white/10 backdrop-blur-sm rounded-full border border-white/20 reveal">
                  <span className="w-2 h-2 lg:w-3 lg:h-3 xl:w-4 xl:h-4 bg-emerald-400 rounded-full mr-2 lg:mr-3 xl:mr-4 animate-pulse"></span>
                  Enterprise Grade {APP_CONFIG.NAME}
                </div>

                <div className="space-y-4 lg:space-y-6 xl:space-y-8 reveal">
                  <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black leading-tight tracking-tighter filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                    <span className="block mb-2 text-emerald-400">
                      POS Solution
                    </span>
                    <span className="block text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-white">
                      Realtime Solution for Management
                    </span>
                  </h1>

                  <p className="text-lg sm:text-xl lg:text-2xl text-indigo-50/90 leading-relaxed max-w-2xl font-medium">
                    Redefining transaction excellence with
                    <span className="font-bold text-emerald-400"> QR Smart Tech</span>,
                    <span className="font-bold text-white"> Seamless Payments</span>, and
                    <span className="font-bold text-emerald-300/90"> Enterprise Insights</span>
                  </p>
                </div>

                {/* Enhanced CTA Buttons - Fullscreen Auto */}
                <div className="flex flex-col sm:flex-row gap-6 reveal pt-4">
                  <Link
                    to="/scan"
                    className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-black text-white bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl transition-all transform hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-center">
                      <span>Get Started</span>
                      <svg className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </Link>

                  <Link
                    to="/menu?table=1"
                    className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-black text-white bg-white/5 backdrop-blur-md border-2 border-white/10 rounded-2xl transition-all transform hover:scale-105 hover:bg-white/10 hover:border-white/20"
                  >
                    <span>View Showcase</span>
                  </Link>
                </div>
              </div>

              {/* Right Content - Phone Mockup */}
              <div className="hidden lg:block relative reveal">
                <div className="relative animate-float-slow">
                  {/* Phone Mockup */}
                  <div className="relative mx-auto w-72 lg:w-80 xl:w-96 h-[600px] lg:h-[700px] xl:h-[800px] rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-8 border-[#1e293b] overflow-hidden" style={{ backgroundColor: '#0f172a' }}>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-10 bg-[#1e293b] rounded-b-3xl z-20"></div>

                    {/* App Interface Screen */}
                    <div className="h-full p-6 flex flex-col pt-16" style={{ backgroundColor: '#020617' }}>
                      <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-2xl mx-auto mb-4 flex items-center justify-center border border-emerald-500/30">
                          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                        <div className="text-xl font-black text-white">{APP_CONFIG.NAME}</div>
                        <div className="text-sm text-slate-500">Premium Digital Order</div>
                      </div>

                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl" />
                            <div className="flex-1 space-y-2">
                              <div className="h-2 bg-white/20 rounded w-3/4" />
                              <div className="h-2 bg-white/10 rounded w-1/2" />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-auto h-16 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center text-white font-black">
                        ORDER NOW
                      </div>
                    </div>
                  </div>
                  {/* Ambient Glow */}
                  <div className="absolute -inset-10 bg-emerald-500/20 blur-[100px] -z-10 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-24 border-y border-gray-200 relative z-20" style={{ backgroundColor: '#f3f4f6' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 reveal-group">
              {[
                { label: 'Fast Setup', val: '< 10min', color: 'emerald' },
                { label: 'Uptime', val: '99.9%', color: 'indigo' },
                { label: 'Processing', val: 'Digital', color: 'slate' },
                { label: 'Availability', val: '24/7', color: 'emerald' }
              ].map((s, i) => (
                <div key={i} className="text-center reveal">
                  <div className={`text-5xl font-black mb-3 ${s.color === 'emerald' ? 'text-emerald-500' : s.color === 'indigo' ? 'text-indigo-600' : 'text-indigo-950'}`}>{s.val}</div>
                  <div className="text-indigo-500/80 text-xs font-black uppercase tracking-[0.2em]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-32 relative z-20 border-b border-gray-200" style={{ backgroundColor: '#ffffff' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-24 reveal">
              <h2 className="text-5xl sm:text-6xl font-black text-indigo-950 mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-indigo-600">
                  Business Excellence
                </span>
              </h2>
              <p className="text-xl text-indigo-900/60 max-w-3xl mx-auto font-medium leading-relaxed">
                Experience the next generation of business management with our highly curated {APP_CONFIG.NAME} ecosystem.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 reveal-group">
              {[
                { title: 'QR Magic', desc: 'Secure, zero-wait QR ordering system.', icon: 'M12 4v16m8-8H4' },
                { title: 'Smart Menu', desc: 'Interactive menus with live updates.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
                { title: 'Cloud Pay', desc: 'Instant multi-gateway payment processing.', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
                { title: 'Analytics', desc: 'Deep data insights for growing brands.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
              ].map((f, i) => (
                <div key={i} className="reveal group relative p-12 rounded-[3.5rem] bg-gray-50 border border-gray-100 hover:border-emerald-500/30 hover:bg-white transition-all duration-700 hover:shadow-2xl hover:shadow-indigo-100/50">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/10 rounded-[2rem] mb-10 group-hover:scale-110 transition-transform">
                    <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={f.icon} />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-indigo-950 mb-4">{f.title}</h3>
                  <p className="text-indigo-950/50 leading-relaxed font-medium">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Staff Section */}
        <div className="py-32 relative z-20" style={{ backgroundColor: '#f9fafb' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-end justify-between mb-20 gap-8 reveal">
              <div className="max-w-2xl text-center lg:text-left">
                <h2 className="text-5xl sm:text-7xl font-black text-indigo-950 mb-8 tracking-tighter">
                  STAFF PORTAL
                </h2>
                <p className="text-xl text-indigo-900/60 font-medium">
                  Efficient management interfaces for both administrators and operational staff.
                  Experience seamless control.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 reveal-group">
              {[
                { title: 'Owner Control', role: 'Full Analytics', path: '/login', desc: 'Oversee revenue and growth.' },
                { title: 'Cashier Hub', role: 'Real-time Ops', path: '/login', desc: 'Process orders with speed.' }
              ].map((c, i) => (
                <Link key={i} to={c.path} className="reveal group p-12 bg-white border border-gray-100 rounded-[4rem] hover:bg-gray-50 hover:border-emerald-500/20 transition-all duration-500 shadow-sm hover:shadow-xl">
                  <div className="flex justify-between items-start mb-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-[2rem] flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                      <svg className="w-10 h-10 text-gray-900 group-hover:text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth="2" /></svg>
                    </div>
                    <div className="px-4 py-2 bg-emerald-100 text-emerald-700 text-xs font-black rounded-full">{c.role}</div>
                  </div>
                  <h3 className="text-4xl font-black text-indigo-950 mb-4 tracking-tight">{c.title}</h3>
                  <p className="text-indigo-900/60 font-medium">{c.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-white py-24 border-t border-white/5 relative z-20" style={{ backgroundColor: '#0f172a' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20 text-center md:text-left">
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-3xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">
                  {APP_CONFIG.NAME}
                </h3>
                <p className="text-slate-500 text-xl leading-relaxed font-medium max-w-sm">
                  Tomorrow's commerce, today. Built for ambitious businesses who demand the best.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">Navigation</h4>
                <ul className="space-y-4">
                  <li><Link to="/login" className="text-slate-500 hover:text-emerald-400 font-bold transition-colors">Access Portal</Link></li>
                  <li><Link to="/scan" className="text-slate-500 hover:text-emerald-400 font-bold transition-colors">Network Scan</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">Connect</h4>
                <p className="text-slate-500 font-bold">Jakarta, Indonesia</p>
                <p className="text-emerald-500 font-bold mt-2">24/7 Priority Support</p>
              </div>
            </div>

            <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-slate-600 font-black text-xs tracking-widest uppercase">
                © 2026 {APP_CONFIG.NAME}. ALL RIGHTS RESERVED.
              </p>
              <div className="flex gap-8 text-xs font-black text-slate-600 uppercase tracking-widest">
                <span>Privacy</span>
                <span>Terms</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
