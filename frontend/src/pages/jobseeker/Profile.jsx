import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { jobSeekerApi } from '../../api'
import {
  initials, avatarColor, educationLabel, jobTypeLabel,
  workModeLabel, parseSkills
} from '../../utils/helpers'
import {
  Phone, BookOpen, Briefcase, MapPin, Plus, Pencil, Trash2,
  Save, X, Calendar, Mail, Settings, ChevronRight
} from 'lucide-react'

const EDUCATION_OPTS = [
  { value: '0', label: 'High School' }, { value: '1', label: 'Diploma' },
  { value: '2', label: 'Bachelor' }, { value: '3', label: 'Master' }, { value: '4', label: 'PhD' },
]
const JOB_TYPE_OPTS = [
  { value: '', label: 'Any type' }, { value: '0', label: 'Full-time' },
  { value: '1', label: 'Part-time' }, { value: '2', label: 'Internship' },
]
const WORK_MODE_OPTS = [
  { value: '', label: 'Any mode' }, { value: '0', label: 'On-site' },
  { value: '1', label: 'Remote' }, { value: '2', label: 'Hybrid' },
]

// ── Experience Modal ──────────────────────────────────────────────────────────
function ExperienceModal({ exp, onSave, onClose }) {
  const [form, setForm] = useState({
    jobTitle: exp?.jobTitle || '',
    companyName: exp?.companyName || '',
    startDate: exp?.startDate ? exp.startDate.split('T')[0] : '',
    endDate: exp?.endDate ? exp.endDate.split('T')[0] : '',
    description: exp?.description || '',
  })

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-md animate-fadeIn">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
          <h3 className="font-display font-semibold text-ink">
            {exp ? 'Edit Experience' : 'Add Experience'}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-100 text-ink-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Job Title *</label>
              <input
                type="text" placeholder="Software Engineer" className="input"
                value={form.jobTitle}
                onChange={e => setForm({ ...form, jobTitle: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Company *</label>
              <input
                type="text" placeholder="Acme Corp" className="input"
                value={form.companyName}
                onChange={e => setForm({ ...form, companyName: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Start Date</label>
              <input type="date" className="input"
                value={form.startDate}
                onChange={e => setForm({ ...form, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="label">End Date</label>
              <input type="date" className="input"
                value={form.endDate}
                onChange={e => setForm({ ...form, endDate: e.target.value })}
                placeholder="Leave blank if current"
              />
              <p className="text-xs text-ink-light mt-1">Leave blank if current role</p>
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              placeholder="Key responsibilities and achievements…"
              rows={3}
              className="input resize-none"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>
        </div>
        <div className="flex gap-3 px-5 py-4 border-t border-surface-100">
          <button onClick={onClose} className="btn-outline flex-1 justify-center">Cancel</button>
          <button
            onClick={() => onSave(form)}
            disabled={!form.jobTitle || !form.companyName}
            className="btn-primary flex-1 justify-center"
          >
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Edit Profile Modal ────────────────────────────────────────────────────────
function EditProfileModal({ profile, onSave, onClose, saving }) {
  // Initialize form FROM the profile passed in — so values always show
  const [form, setForm] = useState({
    fullName: profile?.fullName || '',
    phone: profile?.phone || '',
    skills: profile?.skills || '',
    educationLevel: profile?.educationLevel !== null && profile?.educationLevel !== undefined
      ? String(profile.educationLevel) : '',
    preferredJobType: profile?.preferredJobType !== null && profile?.preferredJobType !== undefined
      ? String(profile.preferredJobType) : '',
    preferredWorkMode: profile?.preferredWorkMode !== null && profile?.preferredWorkMode !== undefined
      ? String(profile.preferredWorkMode) : '',
  })

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-lg animate-fadeIn">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-ink-muted" />
            <h3 className="font-display font-semibold text-ink">Edit Profile</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-100 text-ink-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Basic info */}
          <div>
            <p className="text-xs font-semibold text-ink-light uppercase tracking-wide mb-3">Basic Info</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Full Name</label>
                <input type="text" className="input" placeholder="John Doe"
                  value={form.fullName}
                  onChange={e => setForm({ ...form, fullName: e.target.value })} />
              </div>
              <div>
                <label className="label">Phone</label>
                <input type="tel" className="input" placeholder="+1 234 567 8900"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <p className="text-xs font-semibold text-ink-light uppercase tracking-wide mb-3">Skills</p>
            <label className="label">Skills (comma-separated)</label>
            <input type="text" placeholder="React, TypeScript, Python, SQL…" className="input"
              value={form.skills}
              onChange={e => setForm({ ...form, skills: e.target.value })} />
            <p className="text-xs text-ink-light mt-1">These are used for job matching and recommendations</p>
          </div>

          {/* Preferences */}
          <div>
            <p className="text-xs font-semibold text-ink-light uppercase tracking-wide mb-3">Preferences</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="label">Education</label>
                <select className="input" value={form.educationLevel}
                  onChange={e => setForm({ ...form, educationLevel: e.target.value })}>
                  <option value="">Select</option>
                  {EDUCATION_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Job Type</label>
                <select className="input" value={form.preferredJobType}
                  onChange={e => setForm({ ...form, preferredJobType: e.target.value })}>
                  {JOB_TYPE_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Work Mode</label>
                <select className="input" value={form.preferredWorkMode}
                  onChange={e => setForm({ ...form, preferredWorkMode: e.target.value })}>
                  {WORK_MODE_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-5 py-4 border-t border-surface-100">
          <button onClick={onClose} className="btn-outline flex-1 justify-center">Cancel</button>
          <button
            onClick={() => onSave(form)}
            disabled={saving}
            className="btn-primary flex-1 justify-center"
          >
            {saving ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
              </svg>
            ) : (
              <><Save className="w-4 h-4" /> Save changes</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Profile Page ─────────────────────────────────────────────────────────
export default function Profile() {
  const { user, updateUser } = useAuth()
  const { addToast } = useToast()
  const profileId = user?.profileId

  const [profile, setProfile] = useState(null)
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showExpModal, setShowExpModal] = useState(false)
  const [editingExp, setEditingExp] = useState(null)

  useEffect(() => {
    if (!profileId) return
    Promise.all([
      jobSeekerApi.getProfile(profileId),
      jobSeekerApi.getExperiences(profileId),
    ])
      .then(([pRes, eRes]) => {
        setProfile(pRes.data)
        setExperiences(eRes.data || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [profileId])

  const handleSaveProfile = async (form) => {
    setSaving(true)
    try {
      const payload = {
        fullName: form.fullName,
        phone: form.phone,
        skills: form.skills,
        educationLevel: form.educationLevel !== '' ? parseInt(form.educationLevel) : null,
        preferredJobType: form.preferredJobType !== '' ? parseInt(form.preferredJobType) : null,
        preferredWorkMode: form.preferredWorkMode !== '' ? parseInt(form.preferredWorkMode) : null,
      }
      await jobSeekerApi.updateProfile(profileId, payload)
      // Update local profile state with saved values
      setProfile(prev => ({ ...prev, ...payload }))
      updateUser({ fullName: form.fullName })
      setShowEditModal(false)
      addToast('Profile updated!', 'success')
    } catch {
      addToast('Failed to update profile', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveExp = async (expForm) => {
    try {
      const payload = {
        jobTitle: expForm.jobTitle,
        companyName: expForm.companyName,
        startDate: expForm.startDate || null,
        endDate: expForm.endDate || null,
        description: expForm.description,
      }
      if (editingExp) {
        await jobSeekerApi.updateExperience(editingExp.experienceId, payload)
        setExperiences(prev => prev.map(e =>
          e.experienceId === editingExp.experienceId ? { ...e, ...payload } : e
        ))
        addToast('Experience updated!', 'success')
      } else {
        const { data } = await jobSeekerApi.addExperience(profileId, payload)
        setExperiences(prev => [...prev, data.experience || { ...payload, experienceId: Date.now() }])
        addToast('Experience added!', 'success')
      }
    } catch {
      addToast('Failed to save experience', 'error')
    } finally {
      setShowExpModal(false)
      setEditingExp(null)
    }
  }

  const handleDeleteExp = async (expId) => {
    if (!confirm('Delete this experience?')) return
    try {
      await jobSeekerApi.deleteExperience(expId)
      setExperiences(prev => prev.filter(e => e.experienceId !== expId))
      addToast('Experience removed', 'success')
    } catch {
      addToast('Failed to delete', 'error')
    }
  }

  if (loading) {
    return (
      <div className="animate-fadeIn space-y-4">
        <div className="card h-40 skeleton" />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="card h-48 skeleton" />
          <div className="card h-48 skeleton" />
        </div>
      </div>
    )
  }

  const name = profile?.fullName || user?.userName || 'User'
  const colorCls = avatarColor(name)
  const initStr = initials(name)
  const skills = parseSkills(profile?.skills)

  return (
    <div className="animate-fadeIn space-y-5">
      {/* ── Hero card ─────────────────────────────────── */}
      <div className="card relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-brand-50 to-surface-50 rounded-t-2xl" />

        <div className="relative pt-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-end gap-4">
              {/* Avatar */}
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg border-4 border-white ${colorCls}`}>
                {initStr}
              </div>
              <div className="pb-1">
                <h1 className="font-display text-xl font-bold text-ink leading-tight">{name}</h1>
                <p className="text-sm text-ink-muted flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5" />
                  {user?.email}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowEditModal(true)}
              className="btn-outline mt-1 flex-shrink-0"
            >
              <Pencil className="w-3.5 h-3.5" /> Edit Profile
            </button>
          </div>

          {/* Preference chips */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-surface-100">
            {profile?.phone && (
              <span className="flex items-center gap-1.5 text-sm text-ink-muted">
                <Phone className="w-3.5 h-3.5 text-ink-light" />
                {profile.phone}
              </span>
            )}
            {profile?.educationLevel !== null && profile?.educationLevel !== undefined && (
              <span className="badge badge-blue flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {educationLabel(profile.educationLevel)}
              </span>
            )}
            {profile?.preferredJobType !== null && profile?.preferredJobType !== undefined && (
              <span className="badge badge-purple flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                {jobTypeLabel(profile.preferredJobType)}
              </span>
            )}
            {profile?.preferredWorkMode !== null && profile?.preferredWorkMode !== undefined && (
              <span className="badge badge-green flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {workModeLabel(profile.preferredWorkMode)}
              </span>
            )}
            {!profile?.phone && profile?.educationLevel === null && profile?.preferredJobType === null && (
              <button
                onClick={() => setShowEditModal(true)}
                className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                Complete your profile for better matches <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── 2-column section ──────────────────────────── */}
      <div className="grid sm:grid-cols-2 gap-5">
        {/* Skills */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-ink">Skills</h2>
            <button
              onClick={() => setShowEditModal(true)}
              className="p-1.5 rounded-lg text-ink-light hover:text-brand-600 hover:bg-brand-50 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
          {skills.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center mx-auto mb-2">
                <BookOpen className="w-5 h-5 text-ink-light" />
              </div>
              <p className="text-sm text-ink-muted mb-2">No skills added yet</p>
              <button
                onClick={() => setShowEditModal(true)}
                className="btn-outline text-xs py-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add skills
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map(s => (
                <span
                  key={s}
                  className="px-3 py-1.5 rounded-xl bg-brand-50 text-brand-700 text-sm font-medium border border-brand-100 hover:bg-brand-100 transition-colors"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Profile completeness / info */}
        <div className="card">
          <h2 className="font-display font-semibold text-ink mb-4">Profile Details</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-surface-100">
              <div className="flex items-center gap-2.5 text-sm">
                <Phone className="w-4 h-4 text-ink-light flex-shrink-0" />
                <span className="text-ink-muted">Phone</span>
              </div>
              <span className="text-sm font-medium text-ink">
                {profile?.phone || <span className="text-ink-light italic text-xs">Not set</span>}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-surface-100">
              <div className="flex items-center gap-2.5 text-sm">
                <BookOpen className="w-4 h-4 text-ink-light flex-shrink-0" />
                <span className="text-ink-muted">Education</span>
              </div>
              <span className="text-sm font-medium text-ink">
                {profile?.educationLevel !== null && profile?.educationLevel !== undefined
                  ? educationLabel(profile.educationLevel)
                  : <span className="text-ink-light italic text-xs">Not set</span>
                }
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-surface-100">
              <div className="flex items-center gap-2.5 text-sm">
                <Briefcase className="w-4 h-4 text-ink-light flex-shrink-0" />
                <span className="text-ink-muted">Preferred type</span>
              </div>
              <span className="text-sm font-medium text-ink">
                {profile?.preferredJobType !== null && profile?.preferredJobType !== undefined
                  ? jobTypeLabel(profile.preferredJobType)
                  : <span className="text-ink-light italic text-xs">Not set</span>
                }
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2.5 text-sm">
                <MapPin className="w-4 h-4 text-ink-light flex-shrink-0" />
                <span className="text-ink-muted">Preferred mode</span>
              </div>
              <span className="text-sm font-medium text-ink">
                {profile?.preferredWorkMode !== null && profile?.preferredWorkMode !== undefined
                  ? workModeLabel(profile.preferredWorkMode)
                  : <span className="text-ink-light italic text-xs">Not set</span>
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Experience ─────────────────────────────────── */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-ink">Experience</h2>
          <button
            onClick={() => { setEditingExp(null); setShowExpModal(true) }}
            className="btn-outline text-xs py-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>

        {experiences.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-surface-200 rounded-xl">
            <Briefcase className="w-8 h-8 text-ink-light mx-auto mb-2" />
            <p className="text-sm text-ink-muted mb-3">No experience added yet</p>
            <button
              onClick={() => { setEditingExp(null); setShowExpModal(true) }}
              className="btn-outline text-xs py-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add experience
            </button>
          </div>
        ) : (
          <div className="space-y-0">
            {experiences.map((exp, idx) => (
              <div key={exp.experienceId}>
                {idx > 0 && <div className="border-t border-surface-100 my-4" />}
                <div className="flex items-start gap-4">
                  {/* Timeline dot */}
                  <div className="relative flex-shrink-0 mt-1">
                    <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-brand-500" />
                    </div>
                    {idx < experiences.length - 1 && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-px h-8 bg-surface-200" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-ink">{exp.jobTitle}</p>
                        <p className="text-sm text-brand-600 font-medium">{exp.companyName}</p>
                        {(exp.startDate || exp.endDate) && (
                          <p className="text-xs text-ink-light mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {exp.startDate
                              ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                              : ''}
                            {exp.startDate && ' — '}
                            {exp.endDate
                              ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                              : exp.startDate ? 'Present' : ''}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => { setEditingExp(exp); setShowExpModal(true) }}
                          className="p-1.5 rounded-lg text-ink-light hover:text-brand-600 hover:bg-brand-50 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteExp(exp.experienceId)}
                          className="p-1.5 rounded-lg text-ink-light hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {exp.description && (
                      <p className="text-sm text-ink-muted mt-2 leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showEditModal && (
        <EditProfileModal
          profile={profile}
          onSave={handleSaveProfile}
          onClose={() => setShowEditModal(false)}
          saving={saving}
        />
      )}
      {showExpModal && (
        <ExperienceModal
          exp={editingExp}
          onSave={handleSaveExp}
          onClose={() => { setShowExpModal(false); setEditingExp(null) }}
        />
      )}
    </div>
  )
}