# Find a Majstor

A complete web application for connecting clients with skilled craftsmen. Built with .NET 8.0 Web APIs for the backend and React TypeScript for the frontend.

## Features

### For Clients

- Browse and search craftsmen by category, location, and rating
- View detailed craftsman profiles with qualifications and reviews
- Filter search results dynamically
- Leave ratings and reviews for craftsmen
- Responsive design for desktop and mobile

### For Craftsmen

- Create and manage professional profiles
- Showcase qualifications, working hours, and services
- View customer reviews and ratings
- Update profile information anytime

### Authentication & Security

- JWT-based authentication
- Role-based access control (Client/Craftsman)
- Secure password hashing with BCrypt
- Input validation and error handling

## Technology Stack

### Backend (.NET 8.0)

- **Auth API**: User registration, login, JWT token generation
- **App API**: Craftsman profiles, search, ratings, reviews
- **In-memory storage**: All data stored in memory (no database required)
- **JWT Authentication**: Secure token-based authentication
- **CORS**: Configured for React frontend communication

### Frontend (React TypeScript)

- **React 18**: Modern React with TypeScript
- **Context API**: State management for authentication
- **Axios**: HTTP client for API communication
- **Responsive CSS**: Mobile-first design approach
- **Modern UI**: Clean, professional interface with creative colors

## Project Structure

```
FindMajstor/
├── backend/
│   ├── AuthService/           # Authentication API
│   │   ├── Controllers/       # API controllers
│   │   ├── Models/           # Data models
│   │   ├── Services/         # Business logic
│   │   └── Program.cs        # Startup configuration
│   │
│   └── AppService/           # Application API
│       ├── Controllers/      # API controllers
│       ├── Models/          # Data models
│       ├── Services/        # Business logic
│       └── Program.cs       # Startup configuration
│
├── frontend/                 # React TypeScript app
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Auth/        # Authentication components
│   │   │   ├── Client/      # Client dashboard components
│   │   │   └── Craftsman/   # Craftsman dashboard components
│   │   ├── context/         # React context providers
│   │   ├── services/        # API service layer
│   │   ├── types/           # TypeScript type definitions
│   │   └── App.tsx          # Main application component
│   └── public/              # Static assets
│
└── FindMajstor.sln          # Visual Studio solution file
```

## Getting Started

### Prerequisites

- .NET 8.0 SDK
- Node.js 16+ and npm
- Visual Studio Code or Visual Studio (optional)

### Running the Application

1. **Clone or navigate to the project directory**

   ```bash
   cd /path/to/FindMajstor
   ```

2. **Start the Backend APIs**

   Open **Terminal 1** for Auth API:

   ```bash
   cd backend/AuthService
   dotnet run --urls="http://localhost:5001"
   ```

   Open **Terminal 2** for App API:

   ```bash
   cd backend/AppService
   dotnet run --urls="http://localhost:5002"
   ```

3. **Start the Frontend**

   Open **Terminal 3** for React app:

   ```bash
   cd frontend
   npm start
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Auth API: http://localhost:5001 (with Swagger UI at /swagger)
   - App API: http://localhost:5002 (with Swagger UI at /swagger)

### Sample Data

The application comes with **pre-seeded sample data** featuring 9 craftsmen from different categories:

- **Marko Petrović** - Electrician (Belgrade) - 4.8⭐
- **Ana Nikolić** - Plumber (Novi Sad) - 4.7⭐
- **Stefan Jovanović** - Carpenter (Niš) - 4.5⭐
- **Milica Stojanović** - Painter (Kragujevac) - 4.3⭐
- **Aleksandar Milić** - Mason (Subotica) - 4.7⭐
- **Jovana Radić** - Locksmith (Pančevo) - 4.5⭐
- **Nikola Đorđević** - Gardener (Čačak) - 4.7⭐
- **Dragana Milošević** - Cleaner (Leskovac) - 4.5⭐
- **Vladimir Popović** - Mechanic (Valjevo) - 4.7⭐

Each profile includes realistic contact information, qualifications, working hours, and customer reviews.

### Testing the Application

1. **Browse Sample Craftsmen**

   - Go to http://localhost:3000
   - Register as a Client to browse the pre-loaded craftsmen
   - Use search filters to find craftsmen by category, location, or rating
   - Click on any craftsman card to view their detailed profile

2. **Register as a Client**

   - Click "Register" → Choose "Client (Looking for services)"
   - Enter email and password
   - Browse, search, and rate craftsmen

3. **Register as a Craftsman**

   - Open an incognito window or different browser
   - Click "Register" → Choose "Craftsman (Offering services)"
   - Create your own craftsman profile
   - View and manage your profile

4. **Test All Features**
   - **Search & Filtering**: Test category, location, and rating filters
   - **Ratings & Reviews**: Leave 1-5 star ratings with comments
   - **Profile Management**: Create and update craftsman profiles
   - **Responsive Design**: Test on different screen sizes

## API Endpoints

### Auth API (http://localhost:5001/api/auth)

- `POST /register` - User registration
- `POST /login` - User login
- `GET /users` - Get all users (dev endpoint)

### App API (http://localhost:5002/api)

#### Craftsman endpoints:

- `GET /craftsman` - Get all craftsmen
- `GET /craftsman/search` - Search craftsmen with filters
- `GET /craftsman/{id}` - Get craftsman by ID
- `POST /craftsman/profile` - Create craftsman profile (Craftsman role)
- `PUT /craftsman/profile` - Update craftsman profile (Craftsman role)
- `GET /craftsman/profile/me` - Get own profile (Craftsman role)

#### Rating endpoints:

- `POST /rating/craftsman/{id}` - Add rating to craftsman (Client role)
- `GET /rating/craftsman/{id}` - Get ratings for craftsman
- `GET /rating/craftsman/{id}/my-rating` - Get own rating (Client role)

## Configuration

### JWT Settings

Both APIs use the same JWT configuration for token validation:

- **Secret Key**: DefaultSecretKeyForDevelopmentThatIsAtLeast256BitsLong123456789
- **Issuer**: AuthService
- **Audience**: FindMajstor
- **Expiration**: 7 days

### CORS Configuration

Both APIs are configured to accept requests from:

- http://localhost:3000 (React development server)

## Data Models

### User

- ID, Email, PasswordHash, Role (Client/Craftsman), CreatedAt

### CraftsmanProfile

- ID, UserID, Name, Email, Phone, Qualifications, WorkingHours
- Category, Location, Ratings[], AverageRating, CreatedAt, UpdatedAt

### Rating

- ID, CraftsmanID, ClientID, ClientEmail, Stars (1-5), Comment, CreatedAt

## Development Notes

- All data is stored in memory and will be lost when servers restart
- No external database dependencies
- JWT tokens are stateless and self-contained
- Role-based authorization protects sensitive endpoints
- Input validation on both client and server sides
- Responsive design works on desktop and mobile devices

## Production Considerations

For production deployment, consider:

- Replace in-memory storage with a proper database (SQL Server, PostgreSQL, etc.)
- Use environment variables for JWT secrets and connection strings
- Implement proper logging and monitoring
- Add rate limiting and additional security measures
- Use HTTPS for all communications
- Implement proper error handling and logging
- Add unit and integration tests
- Configure proper CORS for production domains# find-a-majstor
