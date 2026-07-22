using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using QuestPDF.Helpers;
using JobRecommendationAPI.Models;
using System.Globalization;

namespace JobRecommendationAPI.Services
{
    public static class CvPdfBuilder
    {
        private static readonly string DarkGrey = "#1F2937";
        private static readonly string TextGrey = "#6B7280";
        private static readonly string AccentColor = "#184ab8";   // blue — change this one line to re-theme the whole CV
        private static readonly string AccentBg = "#EFF6FF";     // light blue background for section headers

        public static byte[] Build(JobSeeker profile)
        {
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(45);
                    page.DefaultTextStyle(x => x.FontSize(11).FontColor(DarkGrey));

                    page.Content().Column(col =>
                    {
                        // ── HEADER ──────────────────────────────
                        col.Item().AlignCenter().Text(profile.FullName ?? "Your Name")
                            .FontSize(26).Bold().FontColor(AccentColor);

                        col.Item().AlignCenter().PaddingTop(4)
                            .Text(profile.PreferredJobType?.ToString() ?? "Job Seeker")
                            .FontSize(12).FontColor(TextGrey);

                        col.Item().AlignCenter().PaddingTop(6).Text(text =>
                        {
                            var contact = new List<string>();
                            if (!string.IsNullOrWhiteSpace(profile.Phone)) contact.Add(profile.Phone);
                            if (!string.IsNullOrWhiteSpace(profile.User?.Email)) contact.Add(profile.User.Email);
                            text.Span(string.Join("   |   ", contact)).FontSize(10).FontColor(TextGrey);
                        });

                        col.Item().PaddingTop(12).AlignCenter()
                            .Width(120).Height(2.5f).Background(AccentColor);

                        col.Item().PaddingTop(20);

                        // ── SUMMARY ─────────────────────────────
                        var summaryText = BuildSummary(profile);
                        if (!string.IsNullOrWhiteSpace(summaryText))
                        {
                            col.Item().Background(AccentBg).Padding(6)
                                .Text("SUMMARY").Bold().FontSize(13).FontColor(AccentColor);

                            col.Item().PaddingTop(10).PaddingBottom(20).Text(summaryText)
                                .FontSize(10.5f).LineHeight(1.5f).FontColor(DarkGrey);
                        }

                        // ── EXPERIENCE ──────────────────────────
                        var hasExperience = profile.Experiences != null && profile.Experiences.Any();
                        if (hasExperience)
                        {
                            col.Item().Background(AccentBg).Padding(6)
                                .Text("EXPERIENCE").Bold().FontSize(13).FontColor(AccentColor);

                            col.Item().PaddingTop(14);

                            foreach (var exp in profile.Experiences!.OrderByDescending(e => e.StartDate))
                            {
                                col.Item().PaddingBottom(18).Column(expCol =>
                                {
                                    expCol.Item().Row(r =>
                                    {
                                        r.RelativeItem().Text(exp.JobTitle ?? "").Bold().FontSize(12).FontColor(AccentColor);
                                        r.ConstantItem(160).AlignRight().Text(
                                            $"{exp.StartDate.ToString("MMM yyyy", CultureInfo.InvariantCulture)} - " +
                                            $"{(exp.EndDate?.ToString("MMM yyyy", CultureInfo.InvariantCulture) ?? "Present")}"
                                        ).FontSize(10).FontColor(TextGrey);
                                    });

                                    expCol.Item().PaddingTop(2).Text(exp.CompanyName ?? "")
                                        .Italic().FontSize(10.5f).FontColor(DarkGrey);

                                    if (!string.IsNullOrWhiteSpace(exp.Description))
                                    {
                                        expCol.Item().PaddingTop(8).Column(descCol =>
                                        {
                                            var lines = exp.Description
                                                .Split(new[] { '\n', '.' }, StringSplitOptions.RemoveEmptyEntries)
                                                .Select(l => l.Trim())
                                                .Where(l => l.Length > 0);

                                            foreach (var line in lines)
                                            {
                                                descCol.Item().PaddingBottom(3).Row(lineRow =>
                                                {
                                                    lineRow.ConstantItem(14).Text("•").FontSize(10.5f).FontColor(AccentColor);
                                                    lineRow.RelativeItem().Text(line)
                                                        .FontSize(10.5f).LineHeight(1.4f);
                                                });
                                            }
                                        });
                                    }
                                });
                            }

                            col.Item().PaddingTop(6);
                        }

                        // ── EDUCATION ───────────────────────────
                        var hasEducation = profile.Educations != null && profile.Educations.Any();
                        var hasEducationLevel = !string.IsNullOrWhiteSpace(profile.EducationLevel?.ToString());

                        if (hasEducation || hasEducationLevel)
                        {
                            col.Item().Background(AccentBg).Padding(6)
                                .Text("EDUCATION").Bold().FontSize(13).FontColor(AccentColor);

                            col.Item().PaddingTop(14);

                            if (!hasEducation)
                            {
                                col.Item().PaddingBottom(20)
                                    .Text(profile.EducationLevel!.ToString())
                                    .FontSize(11);
                            }
                            else
                            {
                                foreach (var edu in profile.Educations!.OrderByDescending(e => e.GraduationYear))
                                {
                                    col.Item().PaddingBottom(16).Column(eduCol =>
                                    {
                                        eduCol.Item().Row(r =>
                                        {
                                            r.RelativeItem().Text($"{edu.Level} in {edu.FieldOfStudy}")
                                                .Bold().FontSize(12).FontColor(AccentColor);
                                            if (edu.GraduationYear != null)
                                            {
                                                r.ConstantItem(100).AlignRight()
                                                    .Text(edu.GraduationYear.ToString())
                                                    .FontSize(10).FontColor(TextGrey);
                                            }
                                        });

                                        eduCol.Item().PaddingTop(2).Text(edu.InstitutionName ?? "")
                                            .Italic().FontSize(10.5f).FontColor(DarkGrey);
                                    });
                                }
                            }

                            col.Item().PaddingTop(6);
                        }

                        // ── SKILLS ──────────────────────────────
                        var skillsList = string.IsNullOrWhiteSpace(profile.Skills)
                            ? new List<string>()
                            : profile.Skills.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToList();

                        if (skillsList.Count > 0)
                        {
                            col.Item().Background(AccentBg).Padding(6)
                                .Text("SKILLS").Bold().FontSize(13).FontColor(AccentColor);

                            col.Item().PaddingTop(14);

                            if (skillsList.Count <= 5)
                            {
                                // Single column list
                                col.Item().Column(skillsCol =>
                                {
                                    foreach (var skill in skillsList)
                                    {
                                        skillsCol.Item().PaddingBottom(5).Row(r =>
                                        {
                                            r.ConstantItem(14).Text("•").FontSize(11).FontColor(AccentColor);
                                            r.RelativeItem().Text(skill).FontSize(11);
                                        });
                                    }
                                });
                            }
                            else
                            {
                                // 2-column grid, filled row by row (left, right, left, right...)
                                col.Item().Column(skillsCol =>
                                {
                                    for (int i = 0; i < skillsList.Count; i += 2)
                                    {
                                        skillsCol.Item().PaddingBottom(5).Row(r =>
                                        {
                                            r.RelativeItem().Row(left =>
                                            {
                                                left.ConstantItem(14).Text("•").FontSize(11).FontColor(AccentColor);
                                                left.RelativeItem().Text(skillsList[i]).FontSize(11);
                                            });

                                            if (i + 1 < skillsList.Count)
                                            {
                                                r.RelativeItem().Row(right =>
                                                {
                                                    right.ConstantItem(14).Text("•").FontSize(11).FontColor(AccentColor);
                                                    right.RelativeItem().Text(skillsList[i + 1]).FontSize(11);
                                                });
                                            }
                                            else
                                            {
                                                r.RelativeItem(); // keep alignment when odd count leaves last row with one item
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });

                    page.Footer().AlignCenter().PaddingTop(15)
                        .Text("Generated via TalentMatch").FontSize(8).FontColor(TextGrey);
                });
            });

            return document.GeneratePdf();
        }

        // ==================== SUMMARY BUILDING ====================

        private static string BuildSummary(JobSeeker profile)
        {
            var experiences = profile.Experiences?.OrderByDescending(e => e.StartDate).ToList() ?? new List<Experience>();
            var skills = string.IsNullOrWhiteSpace(profile.Skills)
                ? new List<string>()
                : profile.Skills.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToList();

            var eduLevel = profile.EducationLevel?.ToString();
            var totalYears = CalculateTotalExperienceYears(profile.Experiences);
            var hasExperience = experiences.Any();

            var sentence1 = BuildOpeningSentence(experiences, totalYears);
            var sentence2 = BuildSkillsSentence(skills, hasExperience);
            var sentence3 = BuildEducationSentence(eduLevel);

            return string.Join(" ", new[] { sentence1, sentence2, sentence3 }.Where(s => !string.IsNullOrWhiteSpace(s)));
        }

        private static string BuildOpeningSentence(List<Experience> experiences, int totalYears)
        {
            if (!experiences.Any())
                return "Motivated and detail-oriented professional eager to launch a career and contribute fresh perspective to a growing team.";

            var mostRecent = experiences.First();
            var yearsText = totalYears > 0
                ? $"{totalYears}+ year{(totalYears > 1 ? "s" : "")} of experience"
                : "hands-on experience";

            return $"{mostRecent.JobTitle} with {yearsText}, most recently at {mostRecent.CompanyName}.";
        }

        private static string BuildSkillsSentence(List<string> skills, bool hasExperience)
        {
            if (!skills.Any()) return "";

            var topSkills = skills.Take(3).ToList();
            var skillsText = topSkills.Count == 1
                ? topSkills[0]
                : string.Join(", ", topSkills.Take(topSkills.Count - 1)) + " and " + topSkills.Last();

            return hasExperience
                ? $"Strong technical foundation in {skillsText}, with a track record of applying these skills to deliver practical results."
                : $"Proficient in {skillsText}, with a strong foundation built through academic projects and self-driven learning.";
        }

        private static string BuildEducationSentence(string? eduLevel)
        {
            if (string.IsNullOrWhiteSpace(eduLevel)) return "";

            return $"Holds a {eduLevel}-level qualification and is committed to continuous learning and professional growth.";
        }

        private static int CalculateTotalExperienceYears(ICollection<Experience>? experiences)
        {
            if (experiences == null || !experiences.Any()) return 0;

            double totalMonths = 0;
            foreach (var exp in experiences)
            {
                var endDate = exp.EndDate ?? DateTime.Now;
                var months = ((endDate.Year - exp.StartDate.Year) * 12) + (endDate.Month - exp.StartDate.Month);
                totalMonths += months;
            }
            return (int)(totalMonths / 12);
        }
    }
}