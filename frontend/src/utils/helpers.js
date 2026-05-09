// ── Utility Helpers ──────────────────────────────────────────────

// Format salary range display
export const formatSalary = (range) => {
  if (!range) return 'Not specified' // fallback if no salary provided
  return range // return original salary value
}

// Format date into readable format (e.g. May 09, 2026)
export const formatDate = (dateStr) => {
  if (!dateStr) return 'No deadline' // fallback if date is missing

  const d = new Date(dateStr) // convert string into Date object

  return d.toLocaleDateString('en-US', {
    month: 'short', // e.g. May
    day: 'numeric', // e.g. 9
    year: 'numeric' // e.g. 2026
  })
}

// Calculate number of days until a given date
export const daysUntil = (dateStr) => {
  if (!dateStr) return null // no date provided

  const diff = new Date(dateStr) - new Date() // difference in milliseconds
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) // convert ms → days

  return days // return remaining days (can be negative if past)
}

// JobType enum → readable label
export const jobTypeLabel = (val) => {
  const map = {
    0: 'Full-time',
    1: 'Part-time',
    2: 'Internship',
    FullTime: 'Full-time',
    PartTime: 'Part-time',
    Internship: 'Internship'
  }

  return map[val] ?? val // fallback to original value if not found
}

// WorkMode enum → readable label
export const workModeLabel = (val) => {
  const map = {
    0: 'On-site',
    1: 'Remote',
    2: 'Hybrid',
    OnSite: 'On-site',
    Remote: 'Remote',
    Hybrid: 'Hybrid'
  }

  return map[val] ?? val // fallback if unknown value
}

// Application status → badge label + class
export const statusBadge = (status) => {
  const map = {
    0: { label: 'Applied', cls: 'badge-blue' },
    1: { label: 'Reviewed', cls: 'badge-yellow' },
    2: { label: 'Shortlisted', cls: 'badge-purple' },
    3: { label: 'Rejected', cls: 'badge-red' },
    4: { label: 'Accepted', cls: 'badge-green' },

    Applied: { label: 'Applied', cls: 'badge-blue' },
    Reviewed: { label: 'Reviewed', cls: 'badge-yellow' },
    Shortlisted: { label: 'Shortlisted', cls: 'badge-purple' },
    Rejected: { label: 'Rejected', cls: 'badge-red' },
    Accepted: { label: 'Accepted', cls: 'badge-green' }
  }

  return map[status] ?? { label: status, cls: 'badge-gray' } // default fallback
}

// Convert comma-separated skills into array
export const parseSkills = (skills) => {
  if (!skills) return [] // no skills provided

  return skills
    .split(',') // split string into array
    .map(s => s.trim()) // remove extra spaces
    .filter(Boolean) // remove empty values
}

// Education level → readable label
export const educationLabel = (val) => {
  const map = {
    0: 'High School',
    1: 'Diploma',
    2: 'Bachelor',
    3: 'Master',
    4: 'PhD',

    HighSchool: 'High School',
    Diploma: 'Diploma',
    Bachelor: 'Bachelor',
    Master: 'Master',
    PhD: 'PhD'
  }

  return map[val] ?? val // fallback if unknown value
}

// Match score → return color class
export const matchColor = (score) => {
  if (score >= 80) return 'text-emerald-600' // high match
  if (score >= 60) return 'text-brand-600'   // good match
  if (score >= 40) return 'text-amber-600'    // average match

  return 'text-ink-muted' // low match
}

// Convert date → relative time
export const timeAgo = (dateStr) => {
  if (!dateStr) return '' // no date

  const diff = Date.now() - new Date(dateStr) // time difference in ms
  const days = Math.floor(diff / 86400000) // convert ms → days

  if (days === 0) return 'Today' // same day
  if (days === 1) return 'Yesterday' // 1 day ago
  if (days < 7) return `${days}d ago` // less than a week
  if (days < 30) return `${Math.floor(days / 7)}w ago` // weeks

  return `${Math.floor(days / 30)}mo ago` // months
}

// Get initials from name (e.g. Ram Sharma → RS)
export const initials = (name) => {
  if (!name) return '?' // fallback if no name

  return name
    .split(' ') // split full name
    .map(n => n[0]) // take first letter of each word
    .join('') // combine letters
    .toUpperCase() // uppercase result
    .slice(0, 2) // max 2 letters
}

// Generate avatar color based on name
export const avatarColor = (name) => {
  const colors = [
    'bg-brand-100 text-brand-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-purple-100 text-purple-700',
    'bg-rose-100 text-rose-700'
  ]

  if (!name) return colors[0] // default color if no name

  const idx = name.charCodeAt(0) % colors.length // convert char → index within color range
  return colors[idx] // return consistent color for same name
}

// Check if job is expired
export const isJobExpired = (dateStr) => {
  const days = daysUntil(dateStr)
  return days !== null && days < 0
}