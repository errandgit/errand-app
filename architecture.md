# Errand App Architecture

## System Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                       Client Browser                          │
└─────────────────────────────────┬─────────────────────────────┘
                                  │
                                  ▼
┌───────────────────────────────────────────────────────────────┐
│                      Frontend (React/Vite)                    │
│                                                               │
│  ┌─────────────────┐  ┌────────────────┐  ┌────────────────┐  │
│  │      Routes     │  │   Components   │  │     Context    │  │
│  │                 │  │                │  │                │  │
│  │  - Home         │  │  - Header      │  │  - Auth       │  │
│  │  - Services     │  │  - Footer      │  │  - User       │  │
│  │  - ServiceDetail│  │  - ServiceCard │  │  - Services   │  │
│  │  - Login        │  │  - CategoryCard│  │               │  │
│  │  - Register     │  │  - Logo        │  │               │  │
│  │  - Profile      │  │                │  │               │  │
│  └─────────────────┘  └────────────────┘  └────────────────┘  │
│                                                               │
└────────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
┌───────────────────────────────────────────────────────────────┐
│                     Backend (Express.js)                      │
│                                                               │
│  ┌─────────────────┐  ┌────────────────┐  ┌────────────────┐  │
│  │  API Routes     │  │  Controllers   │  │  Middleware    │  │
│  │                 │  │                │  │                │  │
│  │  - /api/auth    │  │  - authCtrl    │  │  - auth       │  │
│  │  - /api/users   │  │  - userCtrl    │  │  - validation │  │
│  │  - /api/services│  │  - serviceCtrl │  │  - error      │  │
│  │  - /api/bookings│  │  - bookingCtrl │  │               │  │
│  │  - /api/reviews │  │  - reviewCtrl  │  │               │  │
│  └─────────────────┘  └────────────────┘  └────────────────┘  │
│                                                               │
└────────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
┌───────────────────────────────────────────────────────────────┐
│                      Database (MongoDB)                       │
│                                                               │
│  ┌─────────────────┐  ┌────────────────┐  ┌────────────────┐  │
│  │  User Model     │  │ Service Model  │  │ Booking Model  │  │
│  │                 │  │                │  │                │  │
│  │  - _id          │  │  - _id         │  │  - _id         │  │
│  │  - firstName    │  │  - title       │  │  - service     │  │
│  │  - lastName     │  │  - description │  │  - client      │  │
│  │  - email        │  │  - category    │  │  - provider    │  │
│  │  - password     │  │  - provider    │  │  - status      │  │
│  │  - role         │  │  - pricing     │  │  - scheduledDate│  │
│  │  - profile      │  │  - rating      │  │  - price       │  │
│  └─────────────────┘  └────────────────┘  └────────────────┘  │
│                                                               │
│  ┌─────────────────┐                                          │
│  │  Review Model   │                                          │
│  │                 │                                          │
│  │  - _id          │                                          │
│  │  - service      │                                          │
│  │  - booking      │                                          │
│  │  - reviewer     │                                          │
│  │  - provider     │                                          │
│  │  - rating       │                                          │
│  │  - comment      │                                          │
│  └─────────────────┘                                          │
└───────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌─────────────┐     ┌───────────────┐     ┌──────────────┐     ┌───────────────┐
│  User       │     │  Frontend     │     │  Backend     │     │  Database     │
│  Interface  │────▶│  React/Vite   │────▶│  Express.js  │────▶│  MongoDB      │
└─────────────┘     └───────────────┘     └──────────────┘     └───────────────┘
      ▲                     ▲                    │                     │
      │                     │                    │                     │
      └─────────────────────┴────────────────────┴─────────────────────┘
                           API Response
```

## Component Structure

```
App
├── Header
│   └── Logo
├── Routes
│   ├── Home
│   │   ├── HomeLogo
│   │   ├── ServiceCards
│   │   └── CategoryCards
│   ├── Services
│   │   └── ServiceList
│   ├── ServiceDetail
│   ├── Login
│   ├── Register
│   ├── ProviderRegister
│   └── Profile
│       └── BookingList
└── Footer
```

## API Routes

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password
- `PUT /api/auth/update-password` - Update password (authenticated)

### User Routes
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/profile` - Delete user account
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID (admin)
- `PUT /api/users/:id` - Update user (admin)
- `DELETE /api/users/:id` - Delete user (admin)

### Service Routes
- `GET /api/services` - Get all services
- `GET /api/services/categories` - Get all categories
- `GET /api/services/:id` - Get service by ID
- `GET /api/services/search` - Search services
- `POST /api/services` - Create a service
- `PUT /api/services/:id` - Update a service
- `DELETE /api/services/:id` - Delete a service
- `GET /api/services/provider/services` - Get services by provider
- `PUT /api/services/:id/availability` - Update service availability
- `PUT /api/services/:id/status` - Update service status

### Booking Routes
- `POST /api/bookings` - Create a booking
- `GET /api/bookings/:id` - Get booking by ID
- `GET /api/bookings/client/bookings` - Get client bookings
- `GET /api/bookings/provider/bookings` - Get provider bookings
- `PUT /api/bookings/:id/status` - Update booking status
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Review Routes
- `POST /api/reviews` - Create a review
- `PUT /api/reviews/:id` - Update a review
- `DELETE /api/reviews/:id` - Delete a review
- `POST /api/reviews/:id/reply` - Reply to a review
- `GET /api/reviews/service/:serviceId` - Get service reviews
- `GET /api/reviews/provider/:providerId` - Get provider reviews

## Database Schema

### User Model
```javascript
{
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  role: String,
  profileImage: String,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  bio: String,
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Service Model
```javascript
{
  title: String,
  description: String,
  category: String,
  subcategory: String,
  provider: ObjectId (ref: User),
  pricing: {
    type: String,
    amount: Number,
    currency: String
  },
  images: [String],
  location: {
    type: String,
    coordinates: [Number],
    address: Object
  },
  availability: [{
    day: String,
    startTime: String,
    endTime: String
  }],
  tags: [String],
  rating: {
    average: Number,
    count: Number
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Model
```javascript
{
  service: ObjectId (ref: Service),
  client: ObjectId (ref: User),
  provider: ObjectId (ref: User),
  status: String,
  scheduledDate: Date,
  scheduledTime: {
    startTime: String,
    endTime: String
  },
  duration: Number,
  location: Object,
  requirements: String,
  price: {
    amount: Number,
    currency: String
  },
  payment: {
    status: String,
    method: String,
    transactionId: String
  },
  cancellation: {
    reason: String,
    cancelledBy: ObjectId (ref: User),
    cancelledAt: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Review Model
```javascript
{
  service: ObjectId (ref: Service),
  booking: ObjectId (ref: Booking),
  reviewer: ObjectId (ref: User),
  provider: ObjectId (ref: User),
  rating: Number,
  comment: String,
  images: [String],
  reply: {
    content: String,
    createdAt: Date
  },
  isVerified: Boolean,
  isPublic: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```