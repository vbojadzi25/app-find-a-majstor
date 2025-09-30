using AppService.Models;

namespace AppService.Services;

public class SeedDataService : ISeedDataService
{
    private readonly ICraftsmanService _craftsmanService;
    private readonly IRatingService _ratingService;
    private readonly ITimeSlotService _timeSlotService;

    public SeedDataService(ICraftsmanService craftsmanService, IRatingService ratingService, ITimeSlotService timeSlotService)
    {
        _craftsmanService = craftsmanService;
        _ratingService = ratingService;
        _timeSlotService = timeSlotService;
    }

    public async Task SeedDataAsync()
    {
        // Check if data already exists
        var existingCraftsmen = await _craftsmanService.GetAllCraftsmenAsync();
        if (existingCraftsmen.Any())
        {
            return; // Data already seeded
        }

        // Seed craftsmen profiles
        var craftsmen = new List<(int userId, string email, CreateProfileRequest profile)>
        {
            (101, "marko.petrovic@email.com", new CreateProfileRequest
            {
                Name = "Marko Petrović",
                Phone = "+381 60 123 4567",
                Category = ServiceCategory.Electrician,
                Location = "Belgrade, Serbia",
                WorkingHours = "Monday-Friday 8AM-6PM, Saturday 9AM-3PM",
                Qualifications = "Licensed electrician with 15 years of experience. Specialized in residential and commercial electrical installations, repairs, and maintenance. Certified for high-voltage work."
            }),

            (102, "ana.nikolic@email.com", new CreateProfileRequest
            {
                Name = "Ana Nikolić",
                Phone = "+381 64 987 6543",
                Category = ServiceCategory.Plumber,
                Location = "Novi Sad, Serbia",
                WorkingHours = "Monday-Saturday 7AM-7PM, Emergency calls 24/7",
                Qualifications = "Master plumber with 12 years of experience. Expert in pipe installation, leak repairs, bathroom renovations, and heating systems. Available for emergency calls."
            }),

            (103, "stefan.jovanovic@email.com", new CreateProfileRequest
            {
                Name = "Stefan Jovanović",
                Phone = "+381 63 456 7890",
                Category = ServiceCategory.Carpenter,
                Location = "Niš, Serbia",
                WorkingHours = "Monday-Friday 7AM-5PM, Weekend projects by appointment",
                Qualifications = "Master carpenter specializing in custom furniture, kitchen cabinets, and home renovations. 18 years of woodworking experience with modern and traditional techniques."
            }),

            (104, "milica.stojanovic@email.com", new CreateProfileRequest
            {
                Name = "Milica Stojanović",
                Phone = "+381 65 321 0987",
                Category = ServiceCategory.Painter,
                Location = "Kragujevac, Serbia",
                WorkingHours = "Monday-Saturday 8AM-6PM",
                Qualifications = "Professional painter with 10 years of experience in interior and exterior painting. Specialized in decorative finishes, wallpaper installation, and color consulting."
            }),

            (105, "aleksandar.milic@email.com", new CreateProfileRequest
            {
                Name = "Aleksandar Milić",
                Phone = "+381 62 789 0123",
                Category = ServiceCategory.Mason,
                Location = "Subotica, Serbia",
                WorkingHours = "Monday-Friday 6AM-4PM, Weekends for urgent repairs",
                Qualifications = "Experienced mason with 20 years in construction. Expert in brickwork, stone masonry, concrete work, and foundation repairs. Licensed contractor."
            }),

            (106, "jovana.radic@email.com", new CreateProfileRequest
            {
                Name = "Jovana Radić",
                Phone = "+381 66 654 3210",
                Category = ServiceCategory.Locksmith,
                Location = "Pančevo, Serbia",
                WorkingHours = "Monday-Sunday 8AM-10PM, Emergency lockouts 24/7",
                Qualifications = "Licensed locksmith with 8 years of experience. Specialized in residential and commercial lock installation, safe opening, key duplication, and security systems."
            }),

            (107, "nikola.djordjevic@email.com", new CreateProfileRequest
            {
                Name = "Nikola Đorđević",
                Phone = "+381 61 876 5432",
                Category = ServiceCategory.Gardener,
                Location = "Čačak, Serbia",
                WorkingHours = "Monday-Saturday 7AM-6PM, Seasonal hours vary",
                Qualifications = "Professional gardener and landscaper with 14 years of experience. Expert in garden design, tree pruning, lawn maintenance, and irrigation systems."
            }),

            (108, "dragana.milosevic@email.com", new CreateProfileRequest
            {
                Name = "Dragana Milošević",
                Phone = "+381 64 234 5678",
                Category = ServiceCategory.Cleaner,
                Location = "Leskovac, Serbia",
                WorkingHours = "Monday-Saturday 8AM-8PM, Sunday by appointment",
                Qualifications = "Professional cleaning service with 7 years of experience. Specialized in deep cleaning, post-construction cleanup, office cleaning, and eco-friendly cleaning products."
            }),

            (109, "vladimir.popovic@email.com", new CreateProfileRequest
            {
                Name = "Vladimir Popović",
                Phone = "+381 63 567 8901",
                Category = ServiceCategory.Mechanic,
                Location = "Valjevo, Serbia",
                WorkingHours = "Monday-Friday 8AM-6PM, Saturday 9AM-2PM",
                Qualifications = "Certified automotive mechanic with 16 years of experience. Specialized in engine repair, brake systems, electrical diagnostics, and general automotive maintenance."
            })
        };

        // Create all craftsman profiles
        var createdCraftsmen = new List<CraftsmanProfile>();
        foreach (var (userId, email, profile) in craftsmen)
        {
            var craftsman = await _craftsmanService.CreateProfileAsync(userId, email, profile);
            createdCraftsmen.Add(craftsman);
        }

        // Add sample ratings to make the profiles more realistic
        await SeedRatingsAsync(createdCraftsmen);

        // Add sample time slots for availability
        await SeedTimeSlotsAsync(createdCraftsmen);
    }

    private async Task SeedRatingsAsync(List<CraftsmanProfile> craftsmen)
    {
        var sampleRatings = new List<(int craftsmanIndex, int clientId, string clientEmail, int stars, string comment)>
        {
            // Marko Petrović (Electrician) - Very high rated
            (0, 201, "client1@email.com", 5, "Excellent work! Fixed our electrical issues quickly and professionally. Highly recommended!"),
            (0, 202, "client2@email.com", 5, "Very reliable and knowledgeable. Arrived on time and completed the job perfectly."),
            (0, 203, "client3@email.com", 4, "Good electrician, fair prices. Minor delay but overall satisfied with the work."),
            (0, 204, "client4@email.com", 5, "Outstanding service! Very thorough and explained everything clearly."),

            // Ana Nikolić (Plumber) - High rated
            (1, 205, "client5@email.com", 5, "Amazing plumber! Fixed our bathroom leak that others couldn't solve. True professional!"),
            (1, 206, "client6@email.com", 4, "Good work, responded quickly to our emergency call. Would hire again."),
            (1, 207, "client7@email.com", 5, "Excellent service and very reasonable prices. Highly recommend!"),

            // Stefan Jovanović (Carpenter) - High rated
            (2, 208, "client8@email.com", 5, "Incredible craftsmanship! Built us a beautiful custom kitchen. Worth every penny!"),
            (2, 209, "client9@email.com", 4, "Very skilled carpenter. The furniture he made is exactly what we wanted."),
            (2, 210, "client10@email.com", 5, "Fantastic work! Attention to detail is amazing. Will definitely hire again."),
            (2, 211, "client11@email.com", 4, "Great quality work, though it took a bit longer than expected."),

            // Milica Stojanović (Painter) - Good rated
            (3, 212, "client12@email.com", 4, "Professional painter with great attention to detail. Very satisfied!"),
            (3, 213, "client13@email.com", 5, "Beautiful paint job! The colors look amazing. Very clean worker."),
            (3, 214, "client14@email.com", 4, "Good work overall. Would recommend for interior painting."),

            // Aleksandar Milić (Mason) - Very high rated
            (4, 215, "client15@email.com", 5, "Excellent mason! Rebuilt our garden wall perfectly. Very experienced."),
            (4, 216, "client16@email.com", 5, "Top-quality stonework. Very professional and reliable."),
            (4, 217, "client17@email.com", 4, "Good mason, fair prices. Completed the job as promised."),

            // Jovana Radić (Locksmith) - High rated
            (5, 218, "client18@email.com", 5, "Fast and professional locksmith. Saved us when we were locked out!"),
            (5, 219, "client19@email.com", 4, "Reliable service, good prices. Installed new locks quickly."),

            // Nikola Đorđević (Gardener) - High rated
            (6, 220, "client20@email.com", 5, "Transformed our garden completely! Amazing landscaping skills."),
            (6, 221, "client21@email.com", 4, "Great gardener, very knowledgeable about plants and design."),
            (6, 222, "client22@email.com", 5, "Excellent service! Our lawn has never looked better."),

            // Dragana Milošević (Cleaner) - Good rated
            (7, 223, "client23@email.com", 4, "Thorough cleaning service. House was spotless!"),
            (7, 224, "client24@email.com", 5, "Amazing deep clean! Very professional and reliable."),

            // Vladimir Popović (Mechanic) - High rated
            (8, 225, "client25@email.com", 5, "Excellent mechanic! Fixed our car problem that others couldn't diagnose."),
            (8, 226, "client26@email.com", 4, "Good work, honest pricing. Will bring our car back for service."),
            (8, 227, "client27@email.com", 5, "Very knowledgeable and trustworthy mechanic. Highly recommend!")
        };

        foreach (var (craftsmanIndex, clientId, clientEmail, stars, comment) in sampleRatings)
        {
            var craftsman = craftsmen[craftsmanIndex];
            var ratingRequest = new AddRatingRequest
            {
                Stars = stars,
                Comment = comment
            };

            await _ratingService.AddRatingAsync(craftsman.Id, clientId, clientEmail, ratingRequest);
        }
    }

    private async Task SeedTimeSlotsAsync(List<CraftsmanProfile> craftsmen)
    {
        var now = DateTime.UtcNow;
        var baseDate = now.Date.AddDays(1); // Start from tomorrow

        foreach (var craftsman in craftsmen)
        {
            // Create time slots for the next 7 days
            for (int day = 0; day < 7; day++)
            {
                var currentDate = baseDate.AddDays(day);

                // Skip weekends for some craftsmen (make it more realistic)
                if ((currentDate.DayOfWeek == DayOfWeek.Saturday || currentDate.DayOfWeek == DayOfWeek.Sunday)
                    && craftsman.Id % 3 == 0) // Every third craftsman doesn't work weekends
                {
                    continue;
                }

                // Create morning slots (9 AM - 12 PM)
                var morningStart = currentDate.AddHours(9);
                var morningEnd = currentDate.AddHours(12);

                var morningSlotRequest = new CreateTimeSlotRequest
                {
                    StartTime = morningStart,
                    EndTime = morningEnd,
                    Description = "Morning availability"
                };

                try
                {
                    await _timeSlotService.CreateTimeSlotAsync(craftsman.Id, morningSlotRequest);
                }
                catch (Exception)
                {
                    // Skip if there's an overlap or other issue
                    continue;
                }

                // Create afternoon slots (2 PM - 5 PM)
                var afternoonStart = currentDate.AddHours(14);
                var afternoonEnd = currentDate.AddHours(17);

                var afternoonSlotRequest = new CreateTimeSlotRequest
                {
                    StartTime = afternoonStart,
                    EndTime = afternoonEnd,
                    Description = "Afternoon availability"
                };

                try
                {
                    await _timeSlotService.CreateTimeSlotAsync(craftsman.Id, afternoonSlotRequest);
                }
                catch (Exception)
                {
                    // Skip if there's an overlap or other issue
                    continue;
                }

                // Some craftsmen also have evening slots (6 PM - 8 PM)
                if (craftsman.Id % 2 == 0) // Every second craftsman has evening slots
                {
                    var eveningStart = currentDate.AddHours(18);
                    var eveningEnd = currentDate.AddHours(20);

                    var eveningSlotRequest = new CreateTimeSlotRequest
                    {
                        StartTime = eveningStart,
                        EndTime = eveningEnd,
                        Description = "Evening availability"
                    };

                    try
                    {
                        await _timeSlotService.CreateTimeSlotAsync(craftsman.Id, eveningSlotRequest);
                    }
                    catch (Exception)
                    {
                        // Skip if there's an overlap or other issue
                        continue;
                    }
                }
            }
        }
    }
}