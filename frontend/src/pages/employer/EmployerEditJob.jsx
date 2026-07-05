import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { employerApi } from '../../api'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import { Save, X, Pencil, MapPin, Clock, Wifi, Users, Tag, CheckCircle, Eye, DollarSign, Calendar } from 'lucide-react'

const JOB_TYPES = [
  { value: '0', label: 'Full-time',  desc: '40hrs/week'   },
  { value: '1', label: 'Part-time',  desc: '<40hrs/week'  },
  { value: '2', label: 'Internship', desc: 'Temporary'    },
]
const WORK_MODES = [
  { value: '0', label: 'On-site', desc: 'In-office'       },
  { value: '1', label: 'Remote',  desc: 'Work anywhere'   },
  { value: '2', label: 'Hybrid',  desc: 'Mixed'           },
]
const EDU_LEVELS = [
  { value: '0', label: 'High School' },
  { value: '1', label: 'Diploma'     },
  { value: '2', label: 'Bachelor'    },
  { value: '3', label: 'Master'      },
  { value: '4', label: 'PhD'         },
]
const SALARY_RANGES = [
  'NPR 20,000–40,000','NPR 40,000–60,000','NPR 60,000–80,000',
  'NPR 80,000–100,000','NPR 100,000–150,000','NPR 150,000+','Negotiable',
]

/* normalise API enum → select value string */
const normaliseJobType  = v => { if (v == null) return ''; const m = { FullTime:'0', PartTime:'1', Internship:'2' }; return m[v] ?? String(v) }
const normaliseWorkMode = v => { if (v == null) return ''; const m = { OnSite:'0', Remote:'1', Hybrid:'2' };        return m[v] ?? String(v) }
const normaliseEdu      = v => { if (v == null) return ''; const m = { HighSchool:'0', Diploma:'1', Bachelor:'2', Master:'3', PhD:'4' }; return m[v] ?? String(v) }

// back into its three separate parts, so editing a job pre-fills all three fields correctly.
function splitDescription(fullText) {
  if (!fullText) return { main: '', responsibilities: '', benefits: '' }

  const respMarker = '\n\nResponsibilities:\n'
  const benMarker   = '\n\nBenefits:\n'

  let main = fullText
  let responsibilities = ''
  let benefits = ''

  const benIdx = main.indexOf(benMarker)
  if (benIdx !== -1) {
    benefits = main.slice(benIdx + benMarker.length).trim()
    main = main.slice(0, benIdx)
  }

  const respIdx = main.indexOf(respMarker)
  if (respIdx !== -1) {
    responsibilities = main.slice(respIdx + respMarker.length).trim()
    main = main.slice(0, respIdx)
  }

  return { main: main.trim(), responsibilities, benefits }
}

function OptionCard({ option, selected, onClick }) {
  return (
    <button type="button" onClick={onClick}
      className={`w-full text-left px-3 py-2.5 rounded-xl border-2 transition-all duration-150 ${
        selected
          ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10'
          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900'
      }`}>
      <div className={`text-sm font-semibold ${selected ? 'text-brand-700 dark:text-brand-300' : 'text-slate-800 dark:text-slate-100'}`}>
        {option.label}
      </div>
      <div className={`text-xs mt-0.5 ${selected ? 'text-brand-500 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'}`}>
        {option.desc}
      </div>
    </button>
  )
}

function Section({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="card space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
        </div>
        <div>
          <p className="font-display font-semibold text-slate-900 dark:text-slate-100 text-sm">{title}</p>
          {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}

function Field({ label, required, error, hint, children }) {
  return (
    <div>
      {label && (
        <label className="label">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{hint}</p>}
    </div>
  )
}

export default function EmployerEditJob() {
  const { jobId }    = useParams()
  const { user }     = useAuth()
  const navigate     = useNavigate()
  const { addToast } = useToast()

  const [form,    setForm]    = useState(null)
  const [saving,  setSaving]  = useState(false)
  const [loading, setLoading] = useState(true)
  const [errors,  setErrors]  = useState({})

  useEffect(() => {
    if (!user?.profileId) return
    employerApi.getMyJobs(user.profileId)
      .then(r => {
        const jobs = r.data || []
        const job  = jobs.find(j => String(j.jobId) === String(jobId))
        if (!job) { addToast('Job not found', 'error'); navigate('/employer/jobs'); return }

        // detect if salary was a preset
        const isCustom = job.salaryRange && !SALARY_RANGES.includes(job.salaryRange)
        // FIX (Issue 4): split the merged jobDescription back into main/responsibilities/benefits
        const { main, responsibilities, benefits } = splitDescription(job.jobDescription)
        setForm({
          jobTitle:              job.jobTitle               || '',
          jobDescription:        main,
          jobType:               normaliseJobType(job.jobType),
          workMode:              normaliseWorkMode(job.workMode),
          requiredSkills:        job.requiredSkills         || '',
          location:              job.location               || '',
          salaryRange:           job.salaryRange            || '',
          deadline:              job.deadline ? job.deadline.split('T')[0] : '',
          minimumEducationLevel: normaliseEdu(job.minimumEducationLevel),
          minYearsExperience:    job.minYearsExperience != null ? String(job.minYearsExperience) : '',
          responsibilities:      responsibilities,
          benefits:              benefits,
          customSalary:          isCustom,
        })
      })
      .catch(_err => { addToast('Failed to load job', 'error'); navigate('/employer/jobs') })
      .finally(() => setLoading(false))
  }, [jobId, user?.profileId])

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.jobTitle.trim())       e.jobTitle       = 'Job title is required.'
    if (!form.jobDescription.trim()) e.jobDescription = 'Job description is required.'
    if (form.jobType  === '')        e.jobType        = 'Select a job type.'
    if (form.workMode === '')        e.workMode       = 'Select a work mode.'
    if (!form.deadline)              e.deadline       = 'Set an application deadline.'
    return e
  }

  const submit = async () => {
    const e = validate()
    if (Object.keys(e).length) {
      setErrors(e)
      setTimeout(() => document.querySelector('.text-red-500')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50)
      return
    }
    setSaving(true)
    try {
      let fullDescription = form.jobDescription
      if (form.responsibilities.trim()) fullDescription += `\n\nResponsibilities:\n${form.responsibilities}`
      if (form.benefits.trim())         fullDescription += `\n\nBenefits:\n${form.benefits}`

      await employerApi.updateJob(jobId, {
        jobTitle:              form.jobTitle,
        jobDescription:        fullDescription,
        jobType:               parseInt(form.jobType),
        workMode:              parseInt(form.workMode),
        requiredSkills:        form.requiredSkills || null,
        location:              form.location       || null,
        salaryRange:           form.salaryRange    || null,
        deadline:              form.deadline       || null,
        minimumEducationLevel: form.minimumEducationLevel !== '' ? parseInt(form.minimumEducationLevel) : null,
        minYearsExperience:    form.minYearsExperience    !== '' ? parseInt(form.minYearsExperience)    : null,
      })
      addToast('Job updated! Resubmitted for admin approval.', 'success')
      navigate('/employer/jobs')
    } catch (_err) {
      addToast('Failed to update job. Please try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  if (loading) return (
    <div className="animate-fadeIn space-y-4">
      <div className="h-8 w-48 skeleton rounded-lg" />
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {Array(4).fill(0).map((_,i) => <div key={i} className="card h-36 skeleton" />)}
        </div>
        <div className="lg:col-span-2 space-y-4">
          {Array(3).fill(0).map((_,i) => <div key={i} className="card h-32 skeleton" />)}
        </div>
      </div>
    </div>
  )

  const skillsArray = form.requiredSkills.split(',').map(s => s.trim()).filter(Boolean)
  const checklist = [
    { label: 'Job title',     done: !!form.jobTitle.trim()        },
    { label: 'Description',   done: !!form.jobDescription.trim()  },
    { label: 'Job type',      done: form.jobType  !== ''          },
    { label: 'Work mode',     done: form.workMode !== ''          },
    { label: 'Location',      done: !!form.location.trim()        },
    { label: 'Salary range',  done: !!form.salaryRange            },
    { label: 'Skills listed', done: skillsArray.length > 0        },
    { label: 'Deadline set',  done: !!form.deadline               },
  ]
  const pct = Math.round((checklist.filter(c => c.done).length / checklist.length) * 100)

  return (
    <div className="animate-fadeIn">

      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <Pencil className="w-5 h-5 text-brand-600" />
          <h1 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">Edit Job</h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Update your listing. It will be resubmitted for admin approval after saving.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-6 items-start">

        {/* ── LEFT: form ── */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* Basic Info */}
          <Section icon={Pencil} title="Basic Information" subtitle="Job title and description">
            <Field label="Job Title" required error={errors.jobTitle}>
              <input type="text" className="input" placeholder="e.g. Senior Frontend Developer"
                value={form.jobTitle} onChange={e => set('jobTitle', e.target.value)} />
            </Field>
            <Field label="Job Description" required error={errors.jobDescription}
              hint="Describe the role, day-to-day tasks and what you're looking for.">
              <textarea rows={5} className="input resize-none"
                placeholder="We are looking for a talented developer…"
                value={form.jobDescription} onChange={e => set('jobDescription', e.target.value)} />
            </Field>
            <Field label="Key Responsibilities" hint="Optional — bullet-point the main responsibilities.">
              <textarea rows={3} className="input resize-none"
                placeholder={"• Design and build new features\n• Collaborate with the product team"}
                value={form.responsibilities} onChange={e => set('responsibilities', e.target.value)} />
            </Field>
            <Field label="Perks & Benefits" hint="Optional — what do you offer beyond salary?">
              <textarea rows={3} className="input resize-none"
                placeholder={"• Health insurance\n• Flexible hours\n• Learning & development budget"}
                value={form.benefits} onChange={e => set('benefits', e.target.value)} />
            </Field>
          </Section>

          {/* Job Type */}
          <Section icon={Clock} title="Job Type" subtitle="How will this person work?">
            {errors.jobType && <p className="text-xs text-red-500">{errors.jobType}</p>}
            <div className="grid grid-cols-3 gap-3">
              {JOB_TYPES.map(o => (
                <OptionCard key={o.value} option={o} selected={form.jobType === o.value}
                  onClick={() => set('jobType', o.value)} />
              ))}
            </div>
          </Section>

          {/* Work Mode */}
          <Section icon={Wifi} title="Work Mode" subtitle="Where will this person work?">
            {errors.workMode && <p className="text-xs text-red-500">{errors.workMode}</p>}
            <div className="grid grid-cols-3 gap-3">
              {WORK_MODES.map(o => (
                <OptionCard key={o.value} option={o} selected={form.workMode === o.value}
                  onClick={() => set('workMode', o.value)} />
              ))}
            </div>
          </Section>

          {/* Location & Salary */}
          <Section icon={MapPin} title="Location & Compensation">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Location" hint="City, country or 'Remote'">
                <input type="text" className="input" placeholder="e.g. Kathmandu, Nepal"
                  value={form.location} onChange={e => set('location', e.target.value)} />
              </Field>
              <Field label="Application Deadline" required error={errors.deadline}>
                <input type="date" min={today} className="input"
                  value={form.deadline} onChange={e => set('deadline', e.target.value)} />
              </Field>
            </div>
            <Field label="Salary Range">
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-1.5">
                  {SALARY_RANGES.map(r => (
                    <button key={r} type="button" onClick={() => { set('salaryRange', r); set('customSalary', false) }}
                      className={`text-xs px-2 py-2 rounded-lg border transition-all text-center ${
                        form.salaryRange === r && !form.customSalary
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 font-medium'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}>{r}</button>
                  ))}
                  <button type="button" onClick={() => { set('customSalary', true); set('salaryRange', '') }}
                    className={`text-xs px-2 py-2 rounded-lg border transition-all ${
                      form.customSalary
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 font-medium'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300'
                    }`}>Custom</button>
                </div>
                {form.customSalary && (
                  <input type="text" className="input" placeholder="e.g. NPR 200,000 / month"
                    value={form.salaryRange} onChange={e => set('salaryRange', e.target.value)} />
                )}
              </div>
            </Field>
          </Section>

          {/* Skills */}
          <Section icon={Tag} title="Required Skills" subtitle="Skills candidates should have">
            <Field hint="Comma-separated — they'll appear as individual tags.">
              <input type="text" className="input"
                placeholder="React, TypeScript, Node.js, REST APIs, Git…"
                value={form.requiredSkills} onChange={e => set('requiredSkills', e.target.value)} />
            </Field>
            {skillsArray.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {skillsArray.map(s => <span key={s} className="skill-tag">{s}</span>)}
              </div>
            )}
          </Section>

          {/* Requirements */}
          <Section icon={Users} title="Candidate Requirements">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Min. Education Level">
                <select className="input" value={form.minimumEducationLevel}
                  onChange={e => set('minimumEducationLevel', e.target.value)}>
                  <option value="">Any level</option>
                  {EDU_LEVELS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Field>
              <Field label="Min. Years of Experience">
                <div className="relative">
                  <input type="number" min="0" max="30" className="input pr-12" placeholder="0"
                    value={form.minYearsExperience}
                    onChange={e => set('minYearsExperience', e.target.value)} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">yrs</span>
                </div>
              </Field>
            </div>
          </Section>

          {/* Actions */}
          <div className="flex gap-3 pb-8">
            <button onClick={submit} disabled={saving} className="btn-primary flex-1 justify-center py-2.5">
              {saving
                ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70"/></svg>
                : <><Save className="w-4 h-4"/> Save Changes</>
              }
            </button>
            <button onClick={() => navigate('/employer/jobs')} className="btn-outline">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>

        {/* ── RIGHT: sticky sidebar ── */}
        <div className="w-72 flex-shrink-0 space-y-4 sticky top-6">

          {/* Live preview */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4 text-brand-600" />
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Preview</p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center flex-shrink-0">
                  <Pencil className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-display font-semibold text-sm leading-tight ${form.jobTitle ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500 italic'}`}>
                    {form.jobTitle || 'Job title…'}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {form.location    && <span className="text-xs px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">{form.location}</span>}
                    {form.jobType  !== '' && <span className="text-xs px-1.5 py-0.5 bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 rounded">{JOB_TYPES.find(t=>t.value===form.jobType)?.label}</span>}
                    {form.workMode !== '' && <span className="text-xs px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded">{WORK_MODES.find(m=>m.value===form.workMode)?.label}</span>}
                  </div>
                  {form.salaryRange && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1.5">
                      <DollarSign className="w-3 h-3"/>{form.salaryRange}
                    </p>
                  )}
                  {form.deadline && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3"/>Closes {form.deadline}
                    </p>
                  )}
                  {skillsArray.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {skillsArray.slice(0,4).map(s=>(
                        <span key={s} className="text-xs px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded">{s}</span>
                      ))}
                      {skillsArray.length > 4 && <span className="text-xs text-slate-400">+{skillsArray.length-4}</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Listing Quality</p>
              <span className={`text-xs font-bold ${pct===100?'text-emerald-500':'text-brand-600 dark:text-brand-400'}`}>{pct}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mb-3 overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${pct===100?'bg-emerald-500':'bg-brand-500'}`} style={{width:`${pct}%`}} />
            </div>
            <div className="space-y-1.5">
              {checklist.map(c => (
                <div key={c.label} className="flex items-center gap-2">
                  <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0 ${c.done?'text-emerald-500':'text-slate-300 dark:text-slate-600'}`}/>
                  <span className={`text-xs ${c.done?'text-slate-700 dark:text-slate-300':'text-slate-400 dark:text-slate-500'}`}>{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40">
            <span className="text-sm flex-shrink-0">⚠️</span>
            <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
              Saving will resubmit this job for admin approval before it goes live again.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}