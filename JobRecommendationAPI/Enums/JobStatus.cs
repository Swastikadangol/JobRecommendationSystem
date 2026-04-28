namespace JobRecommendationAPI.Enums
{
    public enum JobStatus
    {
        Pending ,    // Waiting for admin approval
        Approved,   // Approved by admin
        Rejected ,   // Rejected by admin
        Closed       // Job is closed
    }
}
