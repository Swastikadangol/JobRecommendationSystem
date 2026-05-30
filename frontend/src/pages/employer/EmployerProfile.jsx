import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { employerApi } from '../../api'
import { Save, CirclePlus, X } from 'lucide-react'

/* ── constants ──────────────────────────────────────────── */
const INDUSTRIES    = ['Software Development','IT Services','Finance & Banking','Healthcare','Education','E-Commerce','Marketing & Media','Manufacturing','NGO / Non-profit','Government','Other']
const COMPANY_SIZES = ['1–10','11–50','51–200','201–500','501–1000','1000+']
const PROVINCES     = ['Koshi','Madhesh','Bagmati','Gandaki','Lumbini','Karnali','Sudurpashchim']

/* ── shared ui pieces ───────────────────────────────────── */
function SectionCard({ emoji, title, subtitle, children }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-card dark:shadow-dark-card">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
        <span className="text-lg">{emoji}</span>
        <div>
          <h2 className="font-display font-semibold text-slate-900 dark:text-slate-100 text-sm">{title}</h2>
          {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="px-6 py-5 space-y-5">{children}</div>
    </div>
  )
}

function Field({ label, required, hint, error, children }) {
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

function SaveRow({ saving, onClick, label = 'Save Changes' }) {
  return (
    <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800 mt-1">
      <button onClick={onClick} disabled={saving} className="btn-primary">
        {saving
          ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70"/></svg>
          : <><Save className="w-4 h-4"/>{label}</>
        }
      </button>
    </div>
  )
}

function InlineField({ label, type = 'text', value, onChange, placeholder, saving, onSave }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex gap-2">
        <input type={type} className="input flex-1" placeholder={placeholder}
          value={value} onChange={e => onChange(e.target.value)} />
        <button onClick={onSave} disabled={saving} className="btn-primary px-4 flex-shrink-0">
          {saving
            ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70"/></svg>
            : <><Save className="w-3.5 h-3.5"/>Save</>
          }
        </button>
      </div>
    </div>
  )
}

/* ── main ───────────────────────────────────────────────── */
export default function EmployerProfile() {
  const { user, updateUser } = useAuth()
  const { addToast }         = useToast()
  const profileId            = user?.profileId

  const [loading, setLoading] = useState(true)

  /* About section */
  const [about, setAbout] = useState({
    companyName: '', industry: '', companySize: '', about: '',
    website: '',
  })
  const [savingAbout, setSavingAbout] = useState(false)

  /* Email & Phone */
  const [email, setEmail]             = useState('')
  const [phone, setPhone]             = useState('')
  const [savingEmail, setSavingEmail] = useState(false)
  const [savingPhone, setSavingPhone] = useState(false)

  /* Address */
  const [address, setAddress]           = useState({ province: '', city: '', postalCode: '', address: '' })
  const [savingAddress, setSavingAddress] = useState(false)

  /* Social */
  const [social, setSocial]           = useState({ linkedin: '', facebook: '', twitter: '', instagram: '' })
  const [savingSocial, setSavingSocial] = useState(false)

  /* Load profile */
  useEffect(() => {
    if (!profileId) return
    employerApi.getProfile(profileId)
      .then(r => {
        const p = r.data || {}
        setAbout({
          companyName: p.companyName  || '',
          industry:    p.industry     || '',
          companySize: p.companySize  || '',
          about:       p.about        || '',
          website:     p.website      || '',
        })
        setEmail(p.email         || user?.email || '')
        setPhone(p.contactNumber || '')
        setAddress({
          province:   p.province   || '',
          city:       p.city       || '',
          postalCode: p.postalCode || '',
          address:    p.address    || '',
        })
        setSocial({
          linkedin:  p.linkedIn   || '',
          facebook:  p.facebook   || '',
          twitter:   p.twitter    || '',
          instagram: p.instagram  || '',
        })
        if (p.contactNumber) updateUser({ contactNumber: p.contactNumber })
      })
      .catch(_err => {})
      .finally(() => setLoading(false))
  }, [profileId])

  /* Save helpers */
  const saveAbout = async () => {
    setSavingAbout(true)
    try {
      await employerApi.updateProfile(profileId, {
        companyName: about.companyName,
        industry:    about.industry    || null,
        companySize: about.companySize || null,
        about:       about.about       || null,
        website:     about.website     || null,
      })
      updateUser({ companyName: about.companyName })
      addToast('Company info saved!', 'success')
    } catch (_err) { addToast('Failed to save', 'error') }
    finally { setSavingAbout(false) }
  }

  const saveEmail = async () => {
    setSavingEmail(true)
    try { await employerApi.updateProfile(profileId, { companyName: about.companyName, email }); addToast('Email saved!', 'success') }
    catch (_err) { addToast('Failed to save email', 'error') }
    finally { setSavingEmail(false) }
  }

  const savePhone = async () => {
    setSavingPhone(true)
    try {
      await employerApi.updateProfile(profileId, { companyName: about.companyName, contactNumber: phone })
      updateUser({ contactNumber: phone })
      addToast('Phone saved!', 'success')
    } catch (_err) { addToast('Failed to save phone', 'error') }
    finally { setSavingPhone(false) }
  }

  const saveAddress = async () => {
    setSavingAddress(true)
    try {
      await employerApi.updateProfile(profileId, {
        companyName: about.companyName,
        province:    address.province   || null,
        city:        address.city       || null,
        postalCode:  address.postalCode || null,
        address:     address.address    || null,
      })
      addToast('Address saved!', 'success')
    } catch (_err) { addToast('Failed to save address', 'error') }
    finally { setSavingAddress(false) }
  }

  const saveSocial = async () => {
    setSavingSocial(true)
    try {
      await employerApi.updateProfile(profileId, {
        companyName: about.companyName,
        linkedIn:    social.linkedin  || null,
        facebook:    social.facebook  || null,
        twitter:     social.twitter   || null,
        instagram:   social.instagram || null,
      })
      addToast('Social links saved!', 'success')
    } catch (_err) { addToast('Failed to save social links', 'error') }
    finally { setSavingSocial(false) }
  }


  const name = about.companyName || user?.companyName || 'C'

  if (loading) return (
    <div className="animate-fadeIn space-y-4">
      {Array(4).fill(0).map((_, i) => <div key={i} className="h-44 skeleton rounded-2xl" />)}
    </div>
  )

  return (
    <div className="animate-fadeIn space-y-5 pb-12">

      {/* Page header */}
      <div>
        <h1 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Company Profile
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Keep your company info up to date to attract the best candidates.
        </p>
      </div>

      {/* ── 1. About Company ── */}
      <SectionCard emoji="🏢" title="About Company" subtitle="Public company information visible to candidates">

        {/* Avatar */}
        <div className="flex items-center gap-4 pb-1">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-400 flex items-center justify-center text-2xl font-bold text-white shadow-sm flex-shrink-0">
            {name[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{name}</p>
            <button className="flex items-center gap-1.5 text-xs text-brand-600 dark:text-brand-400 hover:underline mt-1">
            </button>
          </div>
        </div>

        {/* Company name */}
        <Field label="Company Name" required>
          <input type="text" className="input" placeholder="Your company name"
            value={about.companyName}
            onChange={e => setAbout(a => ({ ...a, companyName: e.target.value }))} />
        </Field>

        {/* Industry + Size */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Industry">
            <select className="input" value={about.industry}
              onChange={e => setAbout(a => ({ ...a, industry: e.target.value }))}>
              <option value="">Select industry…</option>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </Field>
          <Field label="Company Size">
            <select className="input" value={about.companySize}
              onChange={e => setAbout(a => ({ ...a, companySize: e.target.value }))}>
              <option value="">Select size…</option>
              {COMPANY_SIZES.map(s => <option key={s} value={s}>{s} employees</option>)}
            </select>
          </Field>
        </div>

        {/* About */}
        <Field label="About Company"
          hint="Describe your company culture, mission and what makes it a great place to work.">
          <textarea rows={5} className="input resize-none"
            placeholder="Tell candidates what your company does and why it's a great place to work…"
            value={about.about}
            onChange={e => setAbout(a => ({ ...a, about: e.target.value }))} />
        </Field>

        {/* Website */}
        <Field label="Website URL">
          <input type="url" className="input" placeholder="https://yourcompany.com"
            value={about.website}
            onChange={e => setAbout(a => ({ ...a, website: e.target.value }))} />
        </Field>

        <SaveRow saving={savingAbout} onClick={saveAbout} />
      </SectionCard>

      {/* ── 2. Email & Phone ── */}
      <SectionCard emoji="📬" title="Email and Phone" subtitle="Update your contact details">
        <InlineField label="Email Address" type="email" value={email} onChange={setEmail}
          placeholder="hello@company.com" saving={savingEmail} onSave={saveEmail} />
        <InlineField label="Phone Number" type="tel" value={phone} onChange={setPhone}
          placeholder="+977 9XXXXXXXXX" saving={savingPhone} onSave={savePhone} />
      </SectionCard>

      {/* ── 4. Address ── */}
      <SectionCard emoji="📍" title="Address" subtitle="Your company's physical location">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Province">
            <select className="input" value={address.province}
              onChange={e => setAddress(a => ({ ...a, province: e.target.value }))}>
              <option value="">Select province…</option>
              {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="City">
            <input type="text" className="input" placeholder="e.g. Lalitpur"
              value={address.city}
              onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} />
          </Field>
        </div>
        <Field label="Postal Code">
          <input type="text" className="input" placeholder="e.g. 44600"
            value={address.postalCode}
            onChange={e => setAddress(a => ({ ...a, postalCode: e.target.value }))} />
        </Field>
        <Field label="Street Address">
          <input type="text" className="input" placeholder="Street address, area, landmark…"
            value={address.address}
            onChange={e => setAddress(a => ({ ...a, address: e.target.value }))} />
        </Field>
        <SaveRow saving={savingAddress} onClick={saveAddress} label="Save Address" />
      </SectionCard>

      {/* ── 5. Social Links ── */}
      <SectionCard emoji="🔗" title="Social Links" subtitle="Help candidates find you online">
        <div className="space-y-3">
          {[
            { key: 'linkedin',  label: 'LinkedIn',      placeholder: 'https://linkedin.com/company/…'  },
            { key: 'facebook',  label: 'Facebook',      placeholder: 'https://facebook.com/…'           },
            { key: 'twitter',   label: 'Twitter / X',   placeholder: 'https://twitter.com/…'            },
            { key: 'instagram', label: 'Instagram',     placeholder: 'https://instagram.com/…'          },
          ].map(s => (
            <div key={s.key} className="grid grid-cols-3 gap-3 items-center">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{s.label}</span>
              </div>
              <div className="col-span-2">
                <input type="url" className="input" placeholder={s.placeholder}
                  value={social[s.key]}
                  onChange={e => setSocial(prev => ({ ...prev, [s.key]: e.target.value }))} />
              </div>
            </div>
          ))}
        </div>
        <SaveRow saving={savingSocial} onClick={saveSocial} label="Save Links" />
      </SectionCard>

    </div>
  )
}