import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { addExperience, getExperienceById, updateExperience } from '../../services/jobSeeker'

export default function JSExperienceForm() {
  const { expId } = useParams()           // undefined = add mode, "3" = edit mode
  const isEdit    = !!expId
  const { user }  = useAuth()
  const navigate  = useNavigate()

  const [form, setForm] = useState({
    jobTitle: '', companyName: '', startDate: '', endDate: '', description: '',
  })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEdit) {
      getExperienceById(expId).then(e => setForm({
        jobTitle:    e.jobTitle    || '',
        companyName: e.companyName || '',
        startDate:   e.startDate?.slice(0, 10) || '',
        endDate:     e.endDate?.slice(0, 10)   || '',
        description: e.description || '',
      }))
    }
  }, [expId])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = {
        ...form,
        endDate: form.endDate || null,  // empty string → null (current job)
      }
      if (isEdit) await updateExperience(expId, payload)
      else        await addExperience(user.profileId, payload)
      navigate('/jobseeker/profile')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg">
      <h2 className="text-xl font-semibold text-zinc-800 mb-6">
        {isEdit ? 'Edit Experience' : 'Add Experience'}
      </h2>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4">
        <Field label="Job Title"    value={form.jobTitle}    onChange={set('jobTitle')}    required placeholder="Software Engineer" />
        <Field label="Company Name" value={form.companyName} onChange={set('companyName')} required placeholder="Acme Corp" />
        <Field label="Start Date"   value={form.startDate}   onChange={set('startDate')}   required type="date" />
        <Field label="End Date (leave empty if current job)" value={form.endDate} onChange={set('endDate')} type="date" />

        <div>
          <label className="block text-xs font-medium text-zinc-600 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={set('description')}
            rows={3}
            placeholder="What did you do in this role?"
            className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm resize-none
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 pt-1">
          <button type="submit" disabled={loading}
            className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-60">
            {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Experience'}
          </button>
          <button type="button" onClick={() => navigate('/jobseeker/profile')}
            className="px-5 py-2 border border-zinc-200 text-sm rounded-lg hover:bg-zinc-50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-600 mb-1">{label}</label>
      <input className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm
                        focus:outline-none focus:ring-2 focus:ring-blue-500" {...props} />
    </div>
  )
}