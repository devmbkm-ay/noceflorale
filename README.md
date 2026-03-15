# Noce Florale - Wedding RSVP Application

A modern wedding RSVP application with an admin dashboard for managing guest information. Built with Next.js, Apollo GraphQL, Express, and MongoDB.

## Project Overview

Noce Florale is a full-stack application designed to help couples manage RSVPs for their wedding. The application consists of:

- **Frontend**: A Next.js application with a beautiful UI for guests to submit RSVPs
- **Backend**: A GraphQL API built with Apollo Server and Express
- **Database**: MongoDB for storing guest information
- **Admin Dashboard**: An interface for the wedding couple to manage RSVPs

### Key Features

- Multi-step RSVP form with validation
- Partner and children information collection
- Admin dashboard for managing RSVPs
- Export functionality for guest information
- Cloudinary integration for image uploads
- User authentication with JWT

## Prerequisites

- Node.js (version 22.x or higher)
- npm (version 11.x or higher)
- MongoDB account (or local MongoDB instance)
- Cloudinary account (for image uploads)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/ricardomb94/noce-florale.git
cd noce-florale
```

2. Install dependencies:

```bash
npm install
```

3. Create environment files:

```bash
# Copy sample environment files (if available)
cp .env.example backend/.env
cp .env.example frontend/.env

# Or manually create them based on the Environment Variables section below
```

4. Set up your MongoDB database and update the MONGODB_URI in the backend/.env file.

5. Set up Cloudinary (if needed) and update the Cloudinary configuration in the backend/.env file.

## Development Setup

### Frontend

The frontend is built with Next.js and Apollo Client. To set up the frontend for development:

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies (if not already done at the root level):

```bash
npm install
```

3. Create or update the .env file with the following variables:

```
NEXT_PUBLIC_API_URL="http://localhost:4000/graphql"
NEXT_PUBLIC_USE_MOCKS="false"
```

### Backend

The backend is built with Express, Apollo Server, and MongoDB. To set up the backend for development:

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies (if not already done at the root level):

```bash
npm install
```

3. Create or update the .env file with the necessary variables (see Environment Variables section).

## Running the Application

### Development Mode

To run both frontend and backend in development mode:

```bash
npm run dev:all
```

To run only the frontend:

```bash
npm run dev:frontend
```

To run only the backend:

```bash
npm run dev:backend
```

### Production Mode

To build and run the application in production mode:

1. Build the application:

```bash
npm run build
```

2. Start the application:

```bash
npm start
```

## Environment Variables

### Backend (.env)

```
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# API URL
NEXT_PUBLIC_API_URL="http://localhost:4000/graphql"

# Authentication
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-jwt-refresh-secret

# Environment
NODE_ENV=development
PORT=4000
BACKEND_PORT=4000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)

```
# API URL
NEXT_PUBLIC_API_URL="http://localhost:4000/graphql"

# Mock data toggle
NEXT_PUBLIC_USE_MOCKS="false"

# Development mode
NODE_ENV=development
```

## Deployment

### Deployment to Render

This application is configured for deployment on Render. Here are the steps to deploy:

1. Create a new Web Service on Render.
2. Connect your GitHub repository.
3. Set the build command to: `npm install && npm run build`
4. Set the start command to: `npm start`
5. Add the necessary environment variables in the Render dashboard.
6. Set up a MongoDB database and update the MONGODB_URI.
7. Deploy the application.

### Deployment to Other Platforms

The application can also be deployed to other platforms like Heroku, Vercel, or Netlify. Follow the platform-specific documentation for deploying Node.js applications.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

