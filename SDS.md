# Software Design Specification (SDS)

## Find a Majstor - Craftsman-Client Matching Platform

**Version:** 1.0
**Date:** September 30, 2025
**Authors:** Development Team

---

## Table of Contents

Pr

1. [Introduction](#1-introduction)
2. [System Overview](#2-system-overview)
3. [Architecture Design](#3-architecture-design)
4. [Data Models and Database Design](#4-data-models-and-database-design)
5. [API Design](#5-api-design)
6. [Component Design](#6-component-design)
7. [User Interface Design](#7-user-interface-design)
8. [Security Design](#8-security-design)
9. [System Diagrams](#9-system-diagrams)
10. [Technology Stack](#10-technology-stack)
11. [Deployment Architecture](#11-deployment-architecture)
12. [Quality Attributes](#12-quality-attributes)
13. [Development Guidelines](#13-development-guidelines)
14. [Future Enhancements](#14-future-enhancements)

---

## 1. Introduction

### 1.1 Purpose

Find a Majstor is a comprehensive web application designed to connect clients with skilled craftsmen in various service categories. The platform facilitates the discovery, booking, and rating of professional services while providing craftsmen with tools to manage their profiles and customer interactions.

### 1.2 Scope

This document describes the software architecture, design patterns, and implementation details for the Find a Majstor platform, including:

- User authentication and authorization system
- Craftsman profile management
- Service discovery and search functionality
- Booking and scheduling system
- Rating and review system
- Real-time notifications and updates

### 1.3 Definitions and Acronyms

- **SPA**: Single Page Application
- **JWT**: JSON Web Token
- **API**: Application Programming Interface
- **CORS**: Cross-Origin Resource Sharing
- **REST**: Representational State Transfer
- **CRUD**: Create, Read, Update, Delete
- **BCrypt**: Blowfish-based password hashing function

---

## 2. System Overview

### 2.1 System Purpose

The Find a Majstor platform serves as a marketplace connecting homeowners and businesses with qualified craftsmen across multiple service categories including electrical, plumbing, carpentry, painting, masonry, locksmith services, gardening, cleaning, and mechanical work.

### 2.2 Key Features

#### For Clients:

- Browse and search craftsmen by category, location, and rating
- View detailed craftsman profiles with qualifications and reviews
- Book time slots and schedule services
- Leave ratings and reviews for completed services
- Track booking status and history
- Responsive mobile-friendly interface

#### For Craftsmen:

- Create and manage professional profiles
- Define available time slots and working hours
- Showcase qualifications and services
- Manage bookings and customer communications
- View customer reviews and ratings
- Update availability and pricing

#### For Administrators:

- User management and moderation
- System monitoring and analytics
- Content management and verification

### 2.3 System Boundaries

The system encompasses:

- Web-based client interface (React SPA)
- RESTful API services (.NET 8.0)
- In-memory data storage (development)
- JWT-based authentication
- Real-time booking notifications

---

## 3. Architecture Design

### 3.1 Architectural Pattern

The system follows a **microservices architecture** with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Auth Service  │    │   App Service   │
│   (React SPA)   │◄──►│   (Port 5001)   │    │   (Port 5002)   │
│   Port 3000     │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                └────────────────────────┘
                                    Shared JWT Secret
```

### 3.2 Service Architecture

#### 3.2.1 Auth Service (Port 5001)

**Responsibilities:**

- User registration and authentication
- JWT token generation and validation
- Password hashing and verification
- User role management

**Technology Stack:**

- .NET 8.0 Web API
- BCrypt for password hashing
- JWT for token management
- In-memory user storage

#### 3.2.2 App Service (Port 5002)

**Responsibilities:**

- Craftsman profile management
- Service discovery and search
- Booking and time slot management
- Rating and review system
- Business logic orchestration

**Technology Stack:**

- .NET 8.0 Web API
- JWT authentication middleware
- In-memory data storage
- LINQ for data querying

#### 3.2.3 Frontend Service (Port 3000)

**Responsibilities:**

- User interface presentation
- State management
- API communication
- Client-side routing
- Responsive design

**Technology Stack:**

- React 18 with TypeScript
- React Context API for state management
- Axios for HTTP communication
- CSS3 for styling
- React Router for navigation

### 3.3 Communication Patterns

#### 3.3.1 Inter-Service Communication

- **Frontend ↔ Backend**: REST over HTTP
- **Service Discovery**: Static configuration (localhost development)
- **Authentication**: JWT tokens passed in Authorization headers
- **Data Format**: JSON for all API communications

#### 3.3.2 Error Handling

- Standardized HTTP status codes
- Consistent error response format
- Client-side error boundaries
- Graceful degradation for failed requests

---

## 4. Data Models and Database Design

### 4.1 Entity Relationship Diagram

```
┌─────────────────┐         ┌─────────────────┐
│      User       │         │ CraftsmanProfile│
├─────────────────┤    1:1  ├─────────────────┤
│ Id (PK)         │◄────────┤ UserId (FK)     │
│ Email           │         │ Id (PK)         │
│ PasswordHash    │         │ Name            │
│ Role            │         │ Email           │
│ CreatedAt       │         │ Phone           │
└─────────────────┘         │ Qualifications  │
                            │ WorkingHours    │
                            │ Category        │
                            │ Location        │
                            │ AverageRating   │
                            │ CreatedAt       │
                            │ UpdatedAt       │
                            └─────────────────┘
                                     │ 1:N
                                     ▼
┌─────────────────┐         ┌─────────────────┐
│     Rating      │         │    TimeSlot     │
├─────────────────┤         ├─────────────────┤
│ Id (PK)         │         │ Id (PK)         │
│ CraftsmanId (FK)│         │ CraftsmanId (FK)│
│ ClientId (FK)   │         │ StartTime       │
│ ClientEmail     │         │ EndTime         │
│ Stars (1-5)     │         │ IsAvailable     │
│ Comment         │         │ Description     │
│ CreatedAt       │         │ CreatedAt       │
└─────────────────┘         └─────────────────┘
         │ N:1                       │ 1:1
         ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│     Booking     │         │    TimeSlot     │
├─────────────────┤         │   (Reference)   │
│ Id (PK)         │         └─────────────────┘
│ CraftsmanId (FK)│
│ ClientId (FK)   │
│ TimeSlotId (FK) │
│ ClientEmail     │
│ ClientName      │
│ ClientPhone     │
│ BookingDate     │
│ StartTime       │
│ EndTime         │
│ Status          │
│ ServiceDesc     │
│ Notes           │
│ EstimatedPrice  │
│ CreatedAt       │
│ UpdatedAt       │
└─────────────────┘
```

### 4.2 Core Data Models

#### 4.2.1 User Model

```csharp
public class User
{
    public int Id { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public UserRole Role { get; set; }
    public DateTime CreatedAt { get; set; }
}

public enum UserRole
{
    Client,
    Craftsman,
    Admin
}
```

#### 4.2.2 CraftsmanProfile Model

```csharp
public class CraftsmanProfile
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string Qualifications { get; set; }
    public string WorkingHours { get; set; }
    public ServiceCategory Category { get; set; }
    public string Location { get; set; }
    public List&lt;Rating&gt; Ratings { get; set; }
    public double AverageRating { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public enum ServiceCategory
{
    Electrician, Plumber, Carpenter, Painter,
    Mason, Locksmith, Gardener, Cleaner,
    Mechanic, Other
}
```

#### 4.2.3 Rating Model

```csharp
public class Rating
{
    public int Id { get; set; }
    public int CraftsmanId { get; set; }
    public int ClientId { get; set; }
    public string ClientEmail { get; set; }
    public int Stars { get; set; } // 1-5 scale
    public string Comment { get; set; }
    public DateTime CreatedAt { get; set; }
}
```

#### 4.2.4 Booking and TimeSlot Models

```csharp
public class TimeSlot
{
    public int Id { get; set; }
    public int CraftsmanId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public bool IsAvailable { get; set; }
    public string Description { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class Booking
{
    public int Id { get; set; }
    public int CraftsmanId { get; set; }
    public int ClientId { get; set; }
    public int TimeSlotId { get; set; }
    public string ClientEmail { get; set; }
    public string ClientName { get; set; }
    public string ClientPhone { get; set; }
    public DateTime BookingDate { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public BookingStatus Status { get; set; }
    public string ServiceDescription { get; set; }
    public string Notes { get; set; }
    public decimal? EstimatedPrice { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public enum BookingStatus
{
    Pending, Confirmed, InProgress,
    Completed, Cancelled, Rejected
}
```

### 4.3 Data Storage Strategy

#### 4.3.1 Current Implementation (Development)

- **In-Memory Storage**: All data stored in application memory
- **Data Persistence**: None (data lost on application restart)
- **Concurrency**: Single-threaded access with thread-safe collections
- **Performance**: High read/write performance for development

#### 4.3.2 Production Considerations

- **Database**: SQL Server, PostgreSQL, or MySQL
- **ORM**: Entity Framework Core
- **Migrations**: Code-first database migrations
- **Indexing**: Optimized indexes for search operations
- **Caching**: Redis for frequently accessed data

---

## 5. API Design

### 5.1 RESTful API Principles

The system follows REST architectural principles with:

- Resource-based URLs
- HTTP verbs for operations
- Stateless communication
- JSON data format
- Consistent error responses

### 5.2 Authentication API (Port 5001)

#### Base URL: `http://localhost:5001/api/auth`

| Method | Endpoint    | Description          | Auth Required |
| ------ | ----------- | -------------------- | ------------- |
| POST   | `/register` | User registration    | No            |
| POST   | `/login`    | User authentication  | No            |
| GET    | `/users`    | List all users (dev) | No            |

#### 5.2.1 Register Endpoint

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "role": "Client" // or "Craftsman"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "email": "user@example.com",
  "role": "Client"
}
```

#### 5.2.2 Login Endpoint

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "email": "user@example.com",
  "role": "Client"
}
```

### 5.3 Application API (Port 5002)

#### Base URL: `http://localhost:5002/api`

| Method | Endpoint                           | Description         | Auth Required | Role      |
| ------ | ---------------------------------- | ------------------- | ------------- | --------- |
| GET    | `/craftsman`                       | Get all craftsmen   | No            | Any       |
| GET    | `/craftsman/search`                | Search craftsmen    | No            | Any       |
| GET    | `/craftsman/{id}`                  | Get craftsman by ID | No            | Any       |
| POST   | `/craftsman/profile`               | Create profile      | Yes           | Craftsman |
| PUT    | `/craftsman/profile`               | Update profile      | Yes           | Craftsman |
| GET    | `/craftsman/profile/me`            | Get own profile     | Yes           | Craftsman |
| POST   | `/rating/craftsman/{id}`           | Add rating          | Yes           | Client    |
| GET    | `/rating/craftsman/{id}`           | Get ratings         | No            | Any       |
| GET    | `/rating/craftsman/{id}/my-rating` | Get own rating      | Yes           | Client    |
| POST   | `/timeslot`                        | Create time slot    | Yes           | Craftsman |
| GET    | `/timeslot/craftsman/{id}`         | Get time slots      | No            | Any       |
| POST   | `/booking`                         | Create booking      | Yes           | Client    |
| GET    | `/booking/me`                      | Get own bookings    | Yes           | Any       |
| PUT    | `/booking/{id}/status`             | Update booking      | Yes           | Craftsman |

#### 5.3.1 Search Craftsmen

```http
GET /api/craftsman/search?category=Electrician&location=Belgrade&minRating=4.0

Response:
[
  {
    "id": 1,
    "userId": 2,
    "name": "Marko Petrović",
    "email": "marko@example.com",
    "phone": "+381 60 123 4567",
    "qualifications": "Licensed electrician with 10 years experience",
    "workingHours": "Monday-Friday 8:00-17:00",
    "category": "Electrician",
    "location": "Belgrade",
    "averageRating": 4.8,
    "ratings": [...],
    "createdAt": "2025-01-01T10:00:00Z",
    "updatedAt": "2025-01-15T14:30:00Z"
  }
]
```

#### 5.3.2 Create Craftsman Profile

```http
POST /api/craftsman/profile
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "John Smith",
  "phone": "+381 60 987 6543",
  "qualifications": "Certified plumber, 15 years experience",
  "workingHours": "Monday-Saturday 7:00-19:00",
  "category": "Plumber",
  "location": "Novi Sad"
}
```

#### 5.3.3 Add Rating

```http
POST /api/rating/craftsman/1
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "stars": 5,
  "comment": "Excellent work, very professional and on time!"
}
```

### 5.4 Error Response Format

```json
{
  "message": "Detailed error message",
  "details": "Additional context or validation errors",
  "timestamp": "2025-09-30T10:00:00Z",
  "path": "/api/craftsman/profile"
}
```

---

## 6. Component Design

### 6.1 Backend Components

#### 6.1.1 Service Layer Architecture

```
Controllers ──► Services ──► Repositories ──► Data Store
     │              │              │
     ▼              ▼              ▼
   HTTP          Business        Data
 Handling         Logic         Access
```

#### 6.1.2 Key Service Interfaces

**IUserService**

```csharp
public interface IUserService
{
    Task&lt;User&gt; CreateUserAsync(RegisterRequest request);
    Task&lt;User?&gt; ValidateUserAsync(string email, string password);
    Task&lt;User?&gt; GetUserByEmailAsync(string email);
    Task&lt;List&lt;User&gt;&gt; GetAllUsersAsync();
}
```

**ICraftsmanService**

```csharp
public interface ICraftsmanService
{
    Task&lt;CraftsmanProfile&gt; CreateProfileAsync(int userId, string email, CreateProfileRequest request);
    Task&lt;CraftsmanProfile?&gt; UpdateProfileAsync(int userId, CreateProfileRequest request);
    Task&lt;CraftsmanProfile?&gt; GetProfileByIdAsync(int id);
    Task&lt;CraftsmanProfile?&gt; GetProfileByUserIdAsync(int userId);
    Task&lt;List&lt;CraftsmanProfile&gt;&gt; GetAllCraftsmenAsync();
    Task&lt;List&lt;CraftsmanProfile&gt;&gt; SearchCraftsmenAsync(SearchFilters filters);
}
```

**IRatingService**

```csharp
public interface IRatingService
{
    Task&lt;Rating&gt; AddRatingAsync(int craftsmanId, int clientId, string clientEmail, AddRatingRequest request);
    Task&lt;List&lt;Rating&gt;&gt; GetRatingsForCraftsmanAsync(int craftsmanId);
    Task&lt;Rating?&gt; GetUserRatingAsync(int craftsmanId, int clientId);
}
```

#### 6.1.3 JWT Service

```csharp
public interface IJwtService
{
    string GenerateToken(User user);
    ClaimsPrincipal? ValidateToken(string token);
}
```

### 6.2 Frontend Components

#### 6.2.1 Component Hierarchy

```
App
├── AuthContext (Context Provider)
├── AuthPage
│   ├── Login
│   └── Register
├── ClientDashboard
│   ├── CraftsmanSearch
│   ├── CraftsmanCard
│   ├── CraftsmanDetail
│   ├── BookingForm
│   └── RatingForm
└── CraftsmanDashboard
    ├── ProfileForm
    ├── BookingManager
    ├── TimeSlotManager
    └── ReviewsDisplay
```

#### 6.2.2 Core React Components

**AuthContext Component**

```typescript
interface AuthContextType {
  user: User | null;
  login: (credentials: LoginRequest) =&gt; Promise&lt;void&gt;;
  register: (data: RegisterRequest) =&gt; Promise&lt;void&gt;;
  logout: () =&gt; void;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

**CraftsmanSearch Component**

```typescript
interface SearchFilters {
  category?: ServiceCategory;
  location?: string;
  minRating?: number;
  searchTerm?: string;
}

const CraftsmanSearch: React.FC = () =&gt; {
  const [filters, setFilters] = useState&lt;SearchFilters&gt;({});
  const [craftsmen, setCraftsmen] = useState&lt;CraftsmanProfile[]&gt;([]);
  const [loading, setLoading] = useState(false);

  // Search implementation
};
```

#### 6.2.3 State Management Strategy

- **Authentication State**: React Context API
- **Component State**: useState hook
- **Form State**: Controlled components
- **API State**: useEffect with loading states
- **Global State**: Context providers for cross-component data

---

## 7. User Interface Design

### 7.1 Design Principles

- **Mobile-First**: Responsive design starting from mobile screens
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Accessibility**: WCAG 2.1 compliance with semantic HTML
- **Performance**: Optimized loading and minimal bundle size
- **Consistency**: Unified color scheme and typography

### 7.2 Visual Design System

#### 7.2.1 Color Palette

```css
:root {
  /* Primary Colors */
  --primary-blue: #2e86ab;
  --primary-green: #a23b72;
  --primary-orange: #f18f01;

  /* Neutral Colors */
  --white: #ffffff;
  --light-gray: #f5f5f5;
  --medium-gray: #cccccc;
  --dark-gray: #333333;

  /* Status Colors */
  --success: #28a745;
  --warning: #ffc107;
  --error: #dc3545;
  --info: #17a2b8;
}
```

#### 7.2.2 Typography

```css
/* Font Stack */
body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: var(--dark-gray);
}

/* Heading Hierarchy */
h1 {
  font-size: 2.5rem;
  font-weight: 700;
}
h2 {
  font-size: 2rem;
  font-weight: 600;
}
h3 {
  font-size: 1.5rem;
  font-weight: 600;
}
h4 {
  font-size: 1.25rem;
  font-weight: 500;
}
```

#### 7.2.3 Layout Grid

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
```

### 7.3 User Interface Layouts

#### 7.3.1 Authentication Page

- Centered login/register form
- Tab-based navigation between login and register
- Social login options (future enhancement)
- Responsive form validation
- Professional branding

#### 7.3.2 Client Dashboard

- Search bar with filters
- Grid layout for craftsman cards
- Sorting and pagination
- Quick filters (category, rating, location)
- Booking history sidebar

#### 7.3.3 Craftsman Dashboard

- Profile management form
- Calendar view for time slots
- Booking requests panel
- Reviews and ratings display
- Statistics overview

#### 7.3.4 Craftsman Detail Page

- Hero section with photo and contact info
- Qualifications and certifications
- Customer reviews and ratings
- Available time slots
- Booking form integration

### 7.4 Responsive Breakpoints

```css
/* Mobile First Approach */
@media (min-width: 576px) {
  /* Small tablets */
}
@media (min-width: 768px) {
  /* Tablets */
}
@media (min-width: 992px) {
  /* Laptops */
}
@media (min-width: 1200px) {
  /* Desktops */
}
```

---

## 8. Security Design

### 8.1 Authentication and Authorization

#### 8.1.1 JWT Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "1",
    "email": "user@example.com",
    "role": "Client",
    "iss": "AuthService",
    "aud": "FindMajstor",
    "exp": 1735689600,
    "iat": 1735084800
  }
}
```

#### 8.1.2 Role-Based Access Control

```csharp
[Authorize(Roles = "Craftsman")]
public async Task&lt;ActionResult&gt; CreateProfile([FromBody] CreateProfileRequest request)

[Authorize(Roles = "Client")]
public async Task&lt;ActionResult&gt; AddRating(int craftsmanId, [FromBody] AddRatingRequest request)

[Authorize] // Any authenticated user
public async Task&lt;ActionResult&gt; GetMyProfile()
```

### 8.2 Input Validation and Sanitization

#### 8.2.1 Model Validation

```csharp
public class RegisterRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    [MinLength(8)]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$")]
    public string Password { get; set; }

    [Required]
    public UserRole Role { get; set; }
}
```

#### 8.2.2 Frontend Validation

```typescript
const validateEmail = (email: string): boolean =&gt; {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): string[] =&gt; {
  const errors: string[] = [];
  if (password.length &lt; 8) errors.push("Password must be at least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("Password must contain uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("Password must contain lowercase letter");
  if (!/\d/.test(password)) errors.push("Password must contain a number");
  return errors;
};
```

### 8.3 Security Headers and CORS

#### 8.3.1 CORS Configuration

```csharp
services.AddCors(options =&gt;
{
    options.AddPolicy("AllowFrontend", policy =&gt;
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
```

#### 8.3.2 Security Headers

```csharp
app.Use(async (context, next) =&gt;
{
    context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Add("X-Frame-Options", "DENY");
    context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");
    await next();
});
```

### 8.4 Password Security

- **BCrypt Hashing**: Industry-standard password hashing
- **Salt Rounds**: Configurable work factor (default: 12)
- **Password Requirements**: Minimum 8 characters, mixed case, numbers
- **Account Lockout**: Future enhancement for brute force protection

---

## 9. System Diagrams

### 9.1 System Context Diagram

```
                    ┌─────────────────────────────────┐
                    │                                 │
                    │        Find a Majstor           │
                    │          Platform               │
                    │                                 │
                    └─────────────────────────────────┘
                               ▲         ▲
                               │         │
                    ┌──────────┴───┐   ┌─┴──────────┐
                    │              │   │            │
                    │   Clients    │   │ Craftsmen  │
                    │              │   │            │
                    └──────────────┘   └────────────┘
```

### 9.2 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Browser (Client)                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                React SPA (Port 3000)                    │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐   │   │
│  │  │ Auth Pages  │ │ Client UI   │ │ Craftsman UI    │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                               │ HTTP/REST
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API Gateway                              │
│                     (Load Balancer)                            │
└─────────────────────────────────────────────────────────────────┘
                         │                    │
                         ▼                    ▼
┌──────────────────────────────┐  ┌──────────────────────────────┐
│        Auth Service          │  │         App Service          │
│       (Port 5001)            │  │        (Port 5002)           │
│                              │  │                              │
│ ┌─────────────────────────┐  │  │ ┌─────────────────────────┐  │
│ │   Controllers           │  │  │ │   Controllers           │  │
│ │ • AuthController        │  │  │ │ • CraftsmanController   │  │
│ │                         │  │  │ │ • RatingController      │  │
│ │   Services              │  │  │ │ • BookingController     │  │
│ │ • UserService           │  │  │ │                         │  │
│ │ • JwtService            │  │  │ │   Services              │  │
│ │                         │  │  │ │ • CraftsmanService      │  │
│ │   Models                │  │  │ │ • RatingService         │  │
│ │ • User                  │  │  │ │ • BookingService        │  │
│ │ • UserRole              │  │  │ │                         │  │
│ │                         │  │  │ │   Models                │  │
│ └─────────────────────────┘  │  │ │ • CraftsmanProfile      │  │
└──────────────────────────────┘  │ │ • Rating                │  │
                                  │ │ • Booking               │  │
                                  │ │ • TimeSlot              │  │
                                  │ └─────────────────────────┘  │
                                  └──────────────────────────────┘
                                                │
                                                ▼
                                  ┌──────────────────────────────┐
                                  │       Data Storage           │
                                  │     (In-Memory)              │
                                  │                              │
                                  │ • Users Collection           │
                                  │ • Craftsmen Collection       │
                                  │ • Ratings Collection         │
                                  │ • Bookings Collection        │
                                  │ • TimeSlots Collection       │
                                  └──────────────────────────────┘
```

### 9.3 Data Flow Diagram - User Registration

```
Client Registration Flow:

[Client Browser]
      │ 1. POST /api/auth/register
      ▼
[Auth Service]
      │ 2. Validate input
      │ 3. Check email uniqueness
      │ 4. Hash password (BCrypt)
      │ 5. Store user
      │ 6. Generate JWT token
      ▼
[Client Browser]
      │ 7. Store token
      │ 8. Redirect to dashboard
      ▼
[App Service]
      │ 9. Validate JWT for protected routes
```

### 9.4 Service Interaction Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │     │ Auth Service│     │ App Service │
│             │     │             │     │             │
│             │────▶│  Register   │     │             │
│             │◄────│  + JWT      │     │             │
│             │     │             │     │             │
│             │────────────────────────▶│ Get Profile │
│             │     │             │     │ (JWT Auth)  │
│             │◄────────────────────────│ Profile Data│
│             │     │             │     │             │
│             │────────────────────────▶│ Create      │
│             │     │             │     │ Booking     │
│             │◄────────────────────────│ Booking ID  │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

### 9.5 Database Schema Diagram

```
┌─────────────────┐
│      Users      │
├─────────────────┤
│ Id (PK)         │──┐
│ Email (UNIQUE)  │  │
│ PasswordHash    │  │
│ Role            │  │
│ CreatedAt       │  │
└─────────────────┘  │
                     │ 1:1
                     ▼
┌─────────────────┐  │   ┌─────────────────┐
│ CraftsmanProfile│◄─┘   │     Ratings     │
├─────────────────┤      ├─────────────────┤
│ Id (PK)         │◄─────┤ CraftsmanId(FK) │
│ UserId (FK)     │  1:N │ ClientId (FK)   │
│ Name            │      │ Stars           │
│ Email           │      │ Comment         │
│ Phone           │      │ CreatedAt       │
│ Qualifications  │      └─────────────────┘
│ WorkingHours    │
│ Category        │      ┌─────────────────┐
│ Location        │◄─────┤    TimeSlots    │
│ AverageRating   │  1:N ├─────────────────┤
│ CreatedAt       │      │ Id (PK)         │
│ UpdatedAt       │      │ CraftsmanId(FK) │
└─────────────────┘      │ StartTime       │
          │              │ EndTime         │
          │ 1:N          │ IsAvailable     │
          ▼              │ Description     │
┌─────────────────┐      │ CreatedAt       │
│    Bookings     │      └─────────────────┘
├─────────────────┤               ▲
│ Id (PK)         │               │ 1:1
│ CraftsmanId(FK) │               │
│ ClientId (FK)   │───────────────┘
│ TimeSlotId (FK) │
│ ClientEmail     │
│ ClientName      │
│ ClientPhone     │
│ BookingDate     │
│ StartTime       │
│ EndTime         │
│ Status          │
│ ServiceDesc     │
│ Notes           │
│ EstimatedPrice  │
│ CreatedAt       │
│ UpdatedAt       │
└─────────────────┘
```

---

## 10. Technology Stack

### 10.1 Backend Technologies

#### 10.1.1 Core Framework

- **.NET 8.0**: Latest LTS version with improved performance
- **ASP.NET Core Web API**: RESTful API development
- **C# 12**: Modern language features and syntax

#### 10.1.2 Authentication and Security

- **JWT Bearer Authentication**: Stateless token-based auth
- **BCrypt.Net**: Password hashing and verification
- **Microsoft.AspNetCore.Authentication.JwtBearer**: JWT middleware
- **System.IdentityModel.Tokens.Jwt**: Token generation and validation

#### 10.1.3 Data and Serialization

- **System.Text.Json**: High-performance JSON serialization
- **LINQ**: Data querying and manipulation
- **Collections.Concurrent**: Thread-safe data structures

#### 10.1.4 Development Tools

- **Swashbuckle.AspNetCore**: API documentation (Swagger)
- **Microsoft.Extensions.Logging**: Structured logging
- **Microsoft.Extensions.DependencyInjection**: IoC container

### 10.2 Frontend Technologies

#### 10.2.1 Core Framework

- **React 18**: Latest version with concurrent features
- **TypeScript 4.9**: Type-safe JavaScript development
- **Create React App**: Project scaffolding and build tools

#### 10.2.2 State Management and Routing

- **React Context API**: Global state management
- **React Router DOM 7.9**: Client-side routing
- **React Hooks**: State and lifecycle management

#### 10.2.3 HTTP and Utilities

- **Axios 1.12**: HTTP client with interceptors
- **Web Vitals**: Performance monitoring

#### 10.2.4 Testing and Quality

- **Jest**: Unit testing framework
- **React Testing Library**: Component testing utilities
- **ESLint**: Code linting and style enforcement

### 10.3 Development and Deployment

#### 10.3.1 Build Tools

- **npm**: Package management
- **Webpack**: Module bundling (via CRA)
- **MSBuild**: .NET project compilation

#### 10.3.2 Development Environment

- **Visual Studio Code**: Primary IDE
- **Visual Studio 2022**: Alternative .NET IDE
- **Node.js 16+**: JavaScript runtime
- **.NET 8.0 SDK**: Development kit

#### 10.3.3 Version Control

- **Git**: Source control
- **GitHub**: Repository hosting
- **Conventional Commits**: Commit message standards

---

## 11. Deployment Architecture

### 11.1 Development Environment

```
Developer Machine:
├── Frontend (npm start) → http://localhost:3000
├── Auth Service (dotnet run) → http://localhost:5001
├── App Service (dotnet run) → http://localhost:5002
└── In-Memory Storage (No persistence)
```

### 11.2 Production Architecture (Recommended)

#### 11.2.1 Cloud Infrastructure (Azure)

```
Internet
    │
    ▼
┌─────────────────┐
│ Azure Front Door│ (CDN + WAF)
│ / Load Balancer │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  Azure App      │
│  Service        │ (React SPA)
│  (Frontend)     │
└─────────────────┘
    │
    ▼
┌─────────────────┐     ┌─────────────────┐
│  Azure App      │     │  Azure App      │
│  Service        │     │  Service        │
│  (Auth API)     │     │  (App API)      │
└─────────────────┘     └─────────────────┘
    │                           │
    └───────────┬───────────────┘
                ▼
┌─────────────────────────────────┐
│     Azure SQL Database          │
│     (Production Data)           │
└─────────────────────────────────┘
```

#### 11.2.2 Container Deployment (Docker)

```dockerfile
# Frontend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
EXPOSE 80

# Backend Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 80
ENTRYPOINT ["dotnet", "AuthService.dll"]
```

#### 11.2.3 Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: auth-service
  template:
    metadata:
      labels:
        app: auth-service
    spec:
      containers:
        - name: auth-service
          image: findmajstor/auth-service:latest
          ports:
            - containerPort: 80
          env:
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: auth-secrets
                  key: jwt-secret
```

### 11.3 Environment Configuration

#### 11.3.1 Development

```json
{
  "Jwt": {
    "Secret": "DefaultSecretKeyForDevelopmentThatIsAtLeast256BitsLong123456789",
    "Issuer": "AuthService",
    "Audience": "FindMajstor",
    "ExpirationDays": 7
  },
  "Cors": {
    "AllowedOrigins": ["http://localhost:3000"]
  }
}
```

#### 11.3.2 Production

```json
{
  "Jwt": {
    "Secret": "${JWT_SECRET}",
    "Issuer": "FindMajstor-Production",
    "Audience": "FindMajstor",
    "ExpirationDays": 1
  },
  "ConnectionStrings": {
    "DefaultConnection": "${DATABASE_CONNECTION_STRING}"
  },
  "Cors": {
    "AllowedOrigins": ["https://findmajstor.com"]
  }
}
```

---

## 12. Quality Attributes

### 12.1 Performance Requirements

#### 12.1.1 Response Time Targets

- **API Response Time**: < 200ms for 95% of requests
- **Page Load Time**: < 2 seconds for initial load
- **Search Results**: < 500ms for filtered search
- **Authentication**: < 300ms for login/register

#### 12.1.2 Throughput Requirements

- **Concurrent Users**: Support 1000 concurrent users
- **API Requests**: 10,000 requests per minute
- **Database Operations**: 500 queries per second

#### 12.1.3 Scalability Targets

- **Horizontal Scaling**: Auto-scale based on CPU/memory usage
- **Database Scaling**: Read replicas for search operations
- **CDN Integration**: Static asset caching and distribution

### 12.2 Reliability and Availability

#### 12.2.1 Uptime Requirements

- **System Availability**: 99.9% uptime (8.77 hours downtime/year)
- **Database Availability**: 99.95% uptime with automatic failover
- **API Availability**: 99.9% for critical endpoints

#### 12.2.2 Error Handling

- **Graceful Degradation**: Core functionality works with limited features
- **Circuit Breaker**: Prevent cascade failures between services
- **Retry Logic**: Automatic retry for transient failures
- **Health Checks**: Endpoint monitoring and alerting

### 12.3 Security Requirements

#### 12.3.1 Data Protection

- **Data Encryption**: HTTPS/TLS 1.3 for all communications
- **Password Security**: BCrypt with minimum 12 rounds
- **Token Security**: JWT with short expiration times
- **Input Validation**: Server-side validation for all inputs

#### 12.3.2 Authentication and Authorization

- **Multi-Factor Authentication**: Future enhancement
- **Role-Based Access**: Granular permission system
- **Session Management**: Secure token handling
- **Account Security**: Password complexity requirements

### 12.4 Usability Requirements

#### 12.4.1 User Experience

- **Responsive Design**: Works on all device types
- **Accessibility**: WCAG 2.1 AA compliance
- **Internationalization**: Multi-language support (future)
- **Progressive Web App**: Offline functionality (future)

#### 12.4.2 Performance Perception

- **Loading States**: Visual feedback for all operations
- **Optimistic Updates**: Immediate UI feedback
- **Error Messages**: Clear, actionable error descriptions
- **Search Experience**: Auto-complete and suggestions

### 12.5 Maintainability

#### 12.5.1 Code Quality

- **Test Coverage**: Minimum 80% code coverage
- **Code Standards**: Consistent coding conventions
- **Documentation**: API documentation and code comments
- **Dependency Management**: Regular security updates

#### 12.5.2 Monitoring and Observability

- **Application Logging**: Structured logging with correlation IDs
- **Performance Monitoring**: APM integration
- **Error Tracking**: Centralized error reporting
- **Business Metrics**: User engagement and conversion tracking

---

## 13. Development Guidelines

### 13.1 Coding Standards

#### 13.1.1 C# Backend Standards

```csharp
// Naming Conventions
public class CraftsmanService : ICraftsmanService
{
    private readonly ILogger&lt;CraftsmanService&gt; _logger;
    private readonly List&lt;CraftsmanProfile&gt; _craftsmen;

    // Method naming: PascalCase with async suffix
    public async Task&lt;CraftsmanProfile?&gt; GetProfileByIdAsync(int id)
    {
        // Local variables: camelCase
        var foundCraftsman = _craftsmen.FirstOrDefault(c =&gt; c.Id == id);
        return foundCraftsman;
    }
}

// Constants: PascalCase
public static class AuthConstants
{
    public const string ClientRole = "Client";
    public const string CraftsmanRole = "Craftsman";
}
```

#### 13.1.2 TypeScript Frontend Standards

```typescript
// Interfaces: PascalCase with descriptive names
interface CraftsmanProfile {
  id: number;
  name: string;
  category: ServiceCategory;
}

// Components: PascalCase, functional components
const CraftsmanCard: React.FC&lt;CraftsmanCardProps&gt; = ({ craftsman }) =&gt; {
  // Hooks at the top
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Event handlers: handle prefix
  const handleBooking = useCallback(async () =&gt; {
    setIsLoading(true);
    try {
      await bookingService.create(craftsman.id);
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [craftsman.id]);

  return (
    &lt;div className="craftsman-card"&gt;
      {/* JSX implementation */}
    &lt;/div&gt;
  );
};
```

### 13.2 API Design Guidelines

#### 13.2.1 RESTful Conventions

```http
GET    /api/craftsman           # Get all craftsmen
GET    /api/craftsman/{id}      # Get specific craftsman
POST   /api/craftsman/profile   # Create new profile
PUT    /api/craftsman/profile   # Update existing profile
DELETE /api/craftsman/profile   # Delete profile

GET    /api/craftsman/{id}/ratings    # Get craftsman ratings
POST   /api/craftsman/{id}/ratings    # Add new rating
```

#### 13.2.2 Response Format Standards

```json
// Success Response
{
  "data": { ... },
  "message": "Operation completed successfully",
  "timestamp": "2025-09-30T10:00:00Z"
}

// Error Response
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": ["Email is required"],
      "password": ["Password must be at least 8 characters"]
    }
  },
  "timestamp": "2025-09-30T10:00:00Z",
  "path": "/api/auth/register"
}
```

### 13.3 Testing Strategy

#### 13.3.1 Backend Testing

```csharp
[Test]
public async Task GetProfileByIdAsync_ExistingId_ReturnsProfile()
{
    // Arrange
    var service = new CraftsmanService(_mockLogger.Object);
    var expectedProfile = new CraftsmanProfile { Id = 1, Name = "Test" };

    // Act
    var result = await service.GetProfileByIdAsync(1);

    // Assert
    Assert.That(result, Is.Not.Null);
    Assert.That(result.Id, Is.EqualTo(1));
    Assert.That(result.Name, Is.EqualTo("Test"));
}

[Test]
public async Task GetProfileByIdAsync_NonExistingId_ReturnsNull()
{
    // Arrange
    var service = new CraftsmanService(_mockLogger.Object);

    // Act
    var result = await service.GetProfileByIdAsync(999);

    // Assert
    Assert.That(result, Is.Null);
}
```

#### 13.3.2 Frontend Testing

```typescript
describe('CraftsmanCard', () =&gt; {
  const mockCraftsman: CraftsmanProfile = {
    id: 1,
    name: 'John Doe',
    category: ServiceCategory.Electrician,
    averageRating: 4.5,
    location: 'Belgrade'
  };

  test('renders craftsman information correctly', () =&gt; {
    render(&lt;CraftsmanCard craftsman={mockCraftsman} /&gt;);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Electrician')).toBeInTheDocument();
    expect(screen.getByText('Belgrade')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  test('calls onBook when book button is clicked', async () =&gt; {
    const mockOnBook = jest.fn();
    render(&lt;CraftsmanCard craftsman={mockCraftsman} onBook={mockOnBook} /&gt;);

    const bookButton = screen.getByRole('button', { name: /book/i });
    await user.click(bookButton);

    expect(mockOnBook).toHaveBeenCalledWith(mockCraftsman.id);
  });
});
```

### 13.4 Git Workflow

#### 13.4.1 Branch Strategy

```
main (production-ready code)
├── develop (integration branch)
├── feature/user-authentication
├── feature/booking-system
├── bugfix/rating-calculation
└── hotfix/security-patch
```

#### 13.4.2 Commit Message Format

```
feat: add user authentication with JWT
fix: resolve rating calculation bug
docs: update API documentation
style: format code according to standards
refactor: simplify booking service logic
test: add unit tests for craftsman service
chore: update dependencies
```

---

## 14. Future Enhancements

### 14.1 Short-term Enhancements (3-6 months)

#### 14.1.1 Enhanced Booking System

- **Real-time Notifications**: WebSocket integration for live updates
- **Calendar Integration**: Sync with Google Calendar, Outlook
- **Booking Reminders**: Email and SMS notifications
- **Recurring Bookings**: Support for regular service appointments

#### 14.1.2 Payment Integration

- **Payment Processing**: Stripe or PayPal integration
- **Escrow System**: Secure payment holding until service completion
- **Invoice Generation**: Automated billing and receipts
- **Payment History**: Transaction tracking and reporting

#### 14.1.3 Enhanced Search and Discovery

- **Geolocation Services**: GPS-based distance calculation
- **Advanced Filters**: Price range, availability, certifications
- **Saved Searches**: Bookmark and alert preferences
- **Recommendation Engine**: AI-based craftsman suggestions

### 14.2 Medium-term Enhancements (6-12 months)

#### 14.2.1 Mobile Applications

- **Native iOS App**: React Native or Swift implementation
- **Native Android App**: React Native or Kotlin implementation
- **Push Notifications**: Real-time mobile alerts
- **Offline Functionality**: Basic features without internet

#### 14.2.2 Advanced Features

- **Video Consultations**: Integrated video calling
- **Document Management**: Contract and certificate storage
- **Multi-language Support**: Internationalization (i18n)
- **Advanced Analytics**: Business intelligence dashboards

#### 14.2.3 Quality Assurance

- **Background Checks**: Integration with verification services
- **Insurance Verification**: Proof of liability insurance
- **Certification Tracking**: Professional license validation
- **Performance Metrics**: Service quality scoring

### 14.3 Long-term Enhancements (12+ months)

#### 14.3.1 Platform Expansion

- **Franchise System**: Multi-city/country expansion
- **White-label Solution**: Customizable platform for partners
- **API Marketplace**: Third-party integrations
- **Enterprise Solutions**: B2B service management

#### 14.3.2 Advanced Technology Integration

- **AI-powered Matching**: Machine learning for optimal pairings
- **IoT Integration**: Smart home device compatibility
- **Blockchain Verification**: Immutable credential verification
- **Voice Interface**: Alexa/Google Assistant integration

#### 14.3.3 Business Intelligence

- **Predictive Analytics**: Demand forecasting
- **Market Analysis**: Pricing optimization
- **Customer Insights**: Behavior analysis and segmentation
- **Performance Optimization**: A/B testing framework

### 14.4 Technical Debt and Infrastructure

#### 14.4.1 Database Migration

- **Entity Framework Core**: ORM implementation
- **Database Selection**: SQL Server, PostgreSQL, or MongoDB
- **Migration Strategy**: Zero-downtime data migration
- **Backup and Recovery**: Automated backup systems

#### 14.4.2 Microservices Enhancement

- **Service Mesh**: Istio or Linkerd implementation
- **Message Queues**: RabbitMQ or Azure Service Bus
- **Event Sourcing**: CQRS pattern implementation
- **Distributed Caching**: Redis cluster setup

#### 14.4.3 DevOps and Monitoring

- **CI/CD Pipeline**: GitHub Actions or Azure DevOps
- **Container Orchestration**: Kubernetes deployment
- **Application Monitoring**: Application Insights or New Relic
- **Log Aggregation**: ELK stack or Azure Monitor

---

## Conclusion

The Find a Majstor platform represents a comprehensive solution for connecting clients with skilled craftsmen through a modern, scalable web application. The architecture is designed with flexibility and growth in mind, utilizing proven technologies and patterns that support both current requirements and future enhancements.

The microservices architecture with separate authentication and application services provides clear separation of concerns while maintaining system cohesion. The React-based frontend offers a responsive, user-friendly interface that works across all device types.

Key strengths of the current design include:

- **Security-first approach** with JWT authentication and role-based authorization
- **Scalable architecture** that can grow with user demand
- **Modern technology stack** with long-term support and community backing
- **Comprehensive API design** that supports diverse client applications
- **Responsive user interface** optimized for all devices

The system is well-positioned for future enhancements including mobile applications, payment processing, advanced search capabilities, and enterprise features. The clean architecture and adherence to industry standards ensure that the platform can evolve to meet changing business requirements while maintaining code quality and system reliability.

This design specification serves as a living document that will evolve with the platform, providing a solid foundation for development teams to build upon while ensuring consistency and quality throughout the development lifecycle.

---

**Document Version:** 1.0
**Last Updated:** September 30, 2025
**Next Review:** October 30, 2025
