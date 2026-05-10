import { Link } from 'react-router-dom'
import { Zap, ArrowRight, Sparkles, TrendingUp, FileText, Globe, ChevronRight, Star, Check, Target, Shield, GraduationCap } from 'lucide-react'

const STEPS = [
  { num: '01', title: 'Build your profile',   desc: 'Add your skills, experience, and work preferences. Takes under 3 minutes.' },
  { num: '02', title: 'Get matched instantly', desc: 'Our AI scores every job against your profile and ranks them by fit.' },
  { num: '03', title: 'Apply with confidence', desc: 'See your match percentage before you apply. No more guessing.' },
]

const FEATURES = [
  { icon: Sparkles, label: 'AI matching',         desc: 'Ranked by compatibility, not recency' },
  { icon: TrendingUp, label: 'Match scores',       desc: 'See % fit before you click apply' },
  { icon: FileText, label: 'Application tracker',  desc: 'Every status update in one place' },
  { icon: Globe,    label: 'Smart filters',         desc: 'Remote, hybrid, full-time, internship' },
]

const STATS = [
  { n: '12,000+', l: 'Active listings' },
  { n: '98%',     l: 'Satisfied users' },
  { n: '< 2s',    l: 'Match time' },
  { n: 'Free',    l: 'Always' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-40 border-b border-slate-100 dark:border-slate-900 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-1xl mx-7 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-display font-bold text-slate-900 dark:text-white text-lg">TalentMatch</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors px-3 py-1.5">
              Sign in
            </Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-5">
              Get started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left — copy */}
          <div>
            
            <h1 className="font-display text-5xl font-bold text-slate-900 dark:text-white leading-[1.1] mb-6">
              Jobs that actually
              <br />
              <span className="text-brand-600 dark:text-brand-400">fit who you are</span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-8 max-w-md">
              Stop scrolling through irrelevant listings. TalentMatch scores every job against your skills and shows you the ones you'll actually get.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <Link to="/register" className="btn-primary py-3 px-6 text-base font-semibold">
                Start for free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/login" className="btn-outline py-3 px-6 text-base">
                Sign in
              </Link>
            </div>
            <div className="flex items-center gap-5 flex-wrap">
              {['No credit card', 'Free forever', '10k+ jobs'].map(t => (
                <span key={t} className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right — mock UI card */}
          <div className="relative hidden lg:block max-w-lg">
            {/* Glow behind card */}
            <div className="absolute inset-0 bg-brand-400/10 dark:bg-brand-600/10 blur-3xl rounded-full" />
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-5 space-y-3">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-4">Your top matches today</p>
              {[
                { title: 'Senior Frontend Engineer', company: 'Acme Corp',     match: 97, type: 'Remote',  clr: 'text-emerald-600' },
                { title: 'Full-Stack Developer',     company: 'BuildCo',       match: 88, type: 'Hybrid',  clr: 'text-brand-600'   },
                { title: 'React Developer',          company: 'DesignLab',     match: 74, type: 'On-site', clr: 'text-amber-500'   },
              ].map(j => (
                <div key={j.title} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-brand-200 dark:hover:border-brand-800 transition-colors bg-slate-50 dark:bg-slate-800/50">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/30 border border-brand-100 dark:border-brand-800 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-3.5 h-3.5 text-brand-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{j.title}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{j.company} · {j.type}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className={`font-display font-bold text-lg leading-none ${j.clr}`}>{j.match}%</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500">match</div>
                  </div>
                </div>
              ))}
              <Link to="/register" className="flex items-center justify-center gap-2 mt-2 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-colors">
                See all your matches <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      {/* <section className="border-y border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-900/40 py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map(s => (
            <div key={s.l}>
              <div className="font-display text-3xl font-bold text-brand-600 dark:text-brand-400 mb-1">{s.n}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{s.l}</div>
            </div>
          ))}
        </div>
      </section> */}

{/* ── Why Choose Us ── */}
<section className="border-y border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-900/40 py-10">
  <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
    {[
      { icon: Target, label: 'Smart Matching', value: '95% accuracy' },
      { icon: Zap, label: 'Real-time alerts', value: 'Instant updates' },
      { icon: Shield, label: 'Privacy first', value: 'Your data safe' },
      { icon: GraduationCap, label: 'Student friendly', value: 'Internships too' }
    ].map(item => (
      <div key={item.label}>
        <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-800 border border-brand-100 dark:border-brand-700 flex items-center justify-center mx-auto mb-3">
          <item.icon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
        </div>
        <div className="font-display font-bold text-slate-900 dark:text-white text-xl mb-0.5">{item.value}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">{item.label}</div>
      </div>
    ))}
  </div>
</section>


      {/* ── How it works ── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-3">How it works</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">Three steps from profile to perfect match</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <div key={s.num} className="relative p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-10 -right-3 w-6 text-slate-200 dark:text-slate-700 text-2xl">→</div>
              )}
              <div className="font-display text-5xl font-bold text-slate-100 dark:text-slate-800 mb-4 leading-none">{s.num}</div>
              <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-t border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-900/40 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-3">Everything you need</h2>
            <p className="text-slate-500 dark:text-slate-400">Built for serious job seekers</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(f => (
              <div key={f.label} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-800 border border-brand-100 dark:border-brand-700 flex items-center justify-center mb-4">
                  <f.icon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="font-display font-semibold text-slate-900 dark:text-slate-100 mb-1">{f.label}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h2 className="font-display text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Ready to find your next role?
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-lg">
          Join thousands of job seekers who found the right fit with TalentMatch.
        </p>
        <Link to="/register" className="btn-primary py-3.5 px-8 text-base font-semibold inline-flex items-center gap-2">
          Create your free account <ArrowRight className="w-4 h-4" />
        </Link>
        <p className="mt-4 text-sm text-slate-400 dark:text-slate-500">
          Already have an account? <Link to="/login" className="text-brand-600 dark:text-brand-400 hover:underline">Sign in</Link>
        </p>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-100 dark:border-slate-900 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-brand-600 flex items-center justify-center">
            <Zap className="w-3 h-3 text-white fill-white" />
          </div>
          <span className="font-display font-semibold text-slate-900 dark:text-white text-sm">TalentMatch</span>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-600">© 2025 TalentMatch · College Project</p>
      </footer>
    </div>
  )
}