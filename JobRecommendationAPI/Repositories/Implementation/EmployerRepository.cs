using JobRecommendationAPI.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using JobRecommendationAPI.DTOs;
namespace JobRecommendationAPI.Repositories.Implementation
{
    public class EmployerRepository : IEmployerRepository
    {
        private readonly AppDbContext _db;

        //dependency injnect by construtor
        public EmployerRepository(AppDbContext db)
        {
            _db = db;
        }

        //fecth the employer data using the id alsos include the connection to user
        public async Task<Employer?> GetByIdAsync(int employerId) =>
            await _db.Employers
            .Include(e => e.User)
            .FirstOrDefaultAsync(e => e.EmployerId == employerId);

        //fetch the employer profile from the user
        public async Task<Employer?> GetByUserIdAsync(int userId) =>
            await _db.Employers
            .Include(e => e.User)
            .FirstOrDefaultAsync(e => e.UserId == userId);

        //create a new employer to databse and return the newly created profile
        public async Task<Employer> CreateAsync(Employer employer)
        {
            _db.Employers.Add(employer);
            await _db.SaveChangesAsync();
            return employer;
        }

        //update the existing employer profile and return updated profile
        public async Task<Employer> UpdateAsync(Employer employer)
        {
            _db.Employers.Update(employer);
            await _db.SaveChangesAsync();
            return employer;
        }

        // JOB MANAGEMENT
        public async Task<IEnumerable<Job>> GetJobsByEmployerAsync(int employerId)
        {
            return await _db.Jobs
                .Where(j => j.EmployerId == employerId)
                .OrderByDescending(j => j.JobId)
                .ToListAsync();
        }

        public async Task<int> CountJobsAsync(int employerId)
        {
            return await _db.Jobs.CountAsync(j => j.EmployerId == employerId);
        }

        // APPLICATION INSIGHTS
        public async Task<int> GetTotalApplicationsAsync(int employerId)
        {
            return await _db.Applications
                .Where(a => a.Job.EmployerId == employerId)
                .CountAsync();
        }

        public async Task<IEnumerable<Application>> GetApplicationsByEmployerAsync(int employerId)
        {
            return await _db.Applications
                .Include(a => a.Job)
                .Include(a => a.JobSeeker)
                .ThenInclude(js => js.User)
                .Where(a => a.Job.EmployerId == employerId)
                .ToListAsync();
        }

        public async Task<EmployerReportDto> GetEmployerReportAsync(int employerId)
        {
            var jobs = await _db.Jobs
                .Where(j => j.EmployerId == employerId)
                .ToListAsync();

            var jobIds = jobs.Select(j => j.JobId).ToList();

            var applications = await _db.Applications
                .Where(a => jobIds.Contains(a.JobId))
                .ToListAsync();

            var today = DateTime.UtcNow.Date;

            // ── Daily (last 14 days) ──
            var last14Days = Enumerable.Range(0, 14)
                .Select(i => today.AddDays(-(13 - i)))
                .ToList();

            var appsByDay = applications.GroupBy(a => a.AppliedAt.Date)
                .ToDictionary(g => g.Key, g => g.Count());
            var acceptedByDay = applications
                .Where(a => a.ApplicationStatus == ApplicationStatus.Accepted)
                .GroupBy(a => a.AppliedAt.Date)
                .ToDictionary(g => g.Key, g => g.Count());

            var daily = last14Days.Select(d => new TrendPointDto
            {
                Label = d.ToString("MMM dd"),
                Applications = appsByDay.TryGetValue(d, out var ac) ? ac : 0,
                Accepted = acceptedByDay.TryGetValue(d, out var acc) ? acc : 0
            }).ToList();

            // ── Weekly (last 8 ISO weeks) ──
            var last8Weeks = Enumerable.Range(0, 8)
                .Select(i => today.AddDays(-7 * (7 - i)))
                .Select(d => (Year: ISOWeek.GetYear(d), Week: ISOWeek.GetWeekOfYear(d)))
                .Distinct()
                .ToList();

            var appsByWeek = applications
                .GroupBy(a => (ISOWeek.GetYear(a.AppliedAt), ISOWeek.GetWeekOfYear(a.AppliedAt)))
                .ToDictionary(g => g.Key, g => g.Count());
            var acceptedByWeek = applications
                .Where(a => a.ApplicationStatus == ApplicationStatus.Accepted)
                .GroupBy(a => (ISOWeek.GetYear(a.AppliedAt), ISOWeek.GetWeekOfYear(a.AppliedAt)))
                .ToDictionary(g => g.Key, g => g.Count());

            var weekly = last8Weeks.Select(w => new TrendPointDto
            {
                Label = $"W{w.Week}",
                Applications = appsByWeek.TryGetValue(w, out var ac) ? ac : 0,
                Accepted = acceptedByWeek.TryGetValue(w, out var acc) ? acc : 0
            }).ToList();

            // ── Monthly (last 6 months) ──
            var last6Months = Enumerable.Range(0, 6)
                .Select(i => today.AddMonths(-(5 - i)))
                .Select(d => (d.Year, d.Month))
                .Distinct()
                .ToList();

            var appsByMonth = applications
                .GroupBy(a => (a.AppliedAt.Year, a.AppliedAt.Month))
                .ToDictionary(g => g.Key, g => g.Count());
            var acceptedByMonth = applications
                .Where(a => a.ApplicationStatus == ApplicationStatus.Accepted)
                .GroupBy(a => (a.AppliedAt.Year, a.AppliedAt.Month))
                .ToDictionary(g => g.Key, g => g.Count());

            var monthlyTrend = last6Months.Select(m => new TrendPointDto
            {
                Label = CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(m.Month),
                Applications = appsByMonth.TryGetValue(m, out var ac) ? ac : 0,
                Accepted = acceptedByMonth.TryGetValue(m, out var acc) ? acc : 0
            }).ToList();

            // Existing monthly summary (kept for your existing MonthlyApplications field / Excel export)
            var monthly = applications
                .GroupBy(a => new { a.AppliedAt.Year, a.AppliedAt.Month })
                .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
                .Select(g => new MonthlyApplicationDto
                {
                    Year = g.Key.Year,
                    Month = CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(g.Key.Month),
                    Count = g.Count()
                }).ToList();

            return new EmployerReportDto
            {
                TotalJobs = jobs.Count,
                ActiveJobs = jobs.Count(j =>
    j.Status == JobStatus.Approved &&
    j.Deadline >= DateTime.UtcNow),
                PendingJobs = jobs.Count(j => j.Status == JobStatus.Pending),
                ExpiredJobs = jobs.Count(j =>
    j.Status == JobStatus.Approved &&
    j.Deadline < DateTime.UtcNow),
                TotalApplications = applications.Count,
                AppliedCandidates = applications.Count(a => a.ApplicationStatus == ApplicationStatus.Applied),
                ShortlistedCandidates = applications.Count(a => a.ApplicationStatus == ApplicationStatus.Shortlisted),
                AcceptedCandidates = applications.Count(a => a.ApplicationStatus == ApplicationStatus.Accepted),
                RejectedCandidates = applications.Count(a => a.ApplicationStatus == ApplicationStatus.Rejected),
                AvgApplicationsPerJob = jobs.Count == 0 ? 0 : Math.Round((double)applications.Count / jobs.Count, 1),
                MonthlyApplications = monthly,
                DailyTrend = daily,
                WeeklyTrend = weekly,
                MonthlyTrend = monthlyTrend
            };
        }

    }
}
