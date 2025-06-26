# Errand App



## Features

- Client and Service Provider user roles
- Service browsing and searching
- Service booking and management
- Reviews and ratings system
- User profiles
- Authentication system

## Tech Stack

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication

### Frontend
- React
- React Router
- CSS with Apple-inspired design system
- Vite for development

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (locally or via MongoDB Atlas)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

3. Create a `.env` file in the root directory with the following variables:

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/errand-app
JWT_SECRET=your_jwt_secret
```

### Running the Application

#### Development Mode

```bash
# Run backend and frontend concurrently
npm run dev

# Run backend only
npm run server

# Run frontend only
npm run client
```

#### Production Mode

```bash
# Build frontend
npm run build

# Start production server
npm start
```

### Demo Account

You can use the following credentials for testing:

- Email: demo@example.com
- Password: password

## Project Structure

```
errand-app/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── app.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── pages/
│       ├── styles/
│       ├── App.jsx
│       └── main.jsx
├── .env
├── package.json
└── README.md
```

## License

This project is licensed under the ISC License.
