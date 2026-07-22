public class EmployerReportDto
{
    public int TotalJobs { get; set; }
    public int ActiveJobs { get; set; }
    public int PendingJobs { get; set; }
    public int ExpiredJobs { get; set; }

    public int TotalApplications { get; set; }

    public int AppliedCandidates { get; set; }
    public int ShortlistedCandidates { get; set; }
    public int AcceptedCandidates { get; set; }
    public int RejectedCandidates { get; set; }

    public double AvgApplicationsPerJob { get; set; }

    public List<MonthlyApplicationDto> MonthlyApplications { get; set; }
    public List<TrendPointDto> WeeklyAccepted { get; set; } = new();
    public List<TrendPointDto> DailyTrend { get; set; }
    public List<TrendPointDto> WeeklyTrend { get; set; }
    public List<TrendPointDto> MonthlyTrend { get; set; }
}

public class MonthlyApplicationDto
{
    public string Month { get; set; }
    public int Year { get; set; }
    public int Count { get; set; }
}