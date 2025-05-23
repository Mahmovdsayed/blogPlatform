# Blog Platform API

A robust backend API for a modern blogging platform built with Node.js, TypeScript, and Express.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)

## Features

- **User Authentication** (JWT)
- **Image Upload** (Cloudinary integration)
- **Validation Middleware** (Zod schema validation)
- **Database Models** (Mongoose)
- **Error Handling** (Custom error responses)

## Technologies Used

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT
- **File Storage:** Cloudinary
- **Validation:** Zod

# Contributing

Pull requests are welcome. Please open an issue first to discuss what you would like to change.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Mahmovdsayed/blogPlatform.git
   cd blog-platform
   ```
2. Install dependencies:
   ```bash
    npm install
   ```
3. Run in development mode:

   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

| Method | Endpoint       | Description       |
|--------|---------------|-------------------|
| POST   | `/auth/signup` | Register new user (sends OTP email) |
| POST   | `/auth/signin`  | User login (JWT token)        |
| POST   | `/auth/verify-otp`  | Verify email using OTP        |
| POST   | `/auth/resend-otp`  | Request new OTP (if expired or not received)        |
| POST   | `/auth/forgot-password`  | Request password reset (sends reset token via email)        |
| POST   | `/auth/reset-password`  | Reset password using valid token        |



---

© 2025 Mahmoud Sayed. All rights reserved.  
