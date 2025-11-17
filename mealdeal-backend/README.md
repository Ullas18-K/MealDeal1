# MealDeal Backend

## Overview
The MealDeal backend is a Node.js application that provides authentication features using MongoDB as the database and bcrypt for password hashing. This project is structured to facilitate user registration and login, ensuring secure handling of user credentials.

## Project Structure
```
mealdeal-backend
├── src
│   ├── app.js                # Entry point of the application
│   ├── config
│   │   └── db.js            # Database connection configuration
│   ├── controllers
│   │   └── authController.js # Controller for authentication logic
│   ├── models
│   │   └── User.js          # User model schema
│   ├── routes
│   │   └── auth.js          # Authentication routes
│   ├── middleware
│   │   └── auth.js          # Authentication middleware
│   ├── services
│   │   └── authService.js    # Authentication service functions
│   └── utils
│       └── hash.js          # Utility functions for hashing
├── .env.example              # Example environment variables
├── .gitignore                # Files to ignore in Git
├── package.json              # NPM configuration file
└── README.md                 # Project documentation
```

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd mealdeal-backend
   ```

2. **Install Dependencies**
   Ensure you have Node.js installed. Then run:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Copy the `.env.example` file to `.env` and update the MongoDB URI with your own:
   ```
   MONGODB_URI=<your_mongodb_uri>
   ```

4. **Run the Application**
   Start the server using:
   ```bash
   npm start
   ```

## Usage
- **User Registration**: Send a POST request to `/auth/register` with a JSON body containing `username` and `password`.
- **User Login**: Send a POST request to `/auth/login` with a JSON body containing `username` and `password`.

## Dependencies
- Express
- Mongoose
- Bcrypt
- Jsonwebtoken

## License
This project is licensed under the MIT License.