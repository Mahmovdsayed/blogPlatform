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
| POST   | `/auth/signup` | Register new user |
| POST   | `/auth/login`  | User login        |

### Users

| Method | Endpoint            | Description          |
|--------|---------------------|----------------------|
| GET    | `/users/me`         | Get current user     |
| PATCH  | `/users/me`         | Update profile       |
| GET    | `/users/:username`  | Get user profile     |

### Posts

| Method | Endpoint            | Description          |
|--------|---------------------|----------------------|
| POST   | `/posts`            | Create new post      |
| GET    | `/posts`            | Get all posts        |
| GET    | `/posts/:postId`    | Get single post      |
| PATCH  | `/posts/:postId`    | Update post          |
| DELETE | `/posts/:postId`    | Delete post          |

### Comments

| Method | Endpoint                     | Description          |
|--------|------------------------------|----------------------|
| POST   | `/posts/:postId/comments`    | Add comment          |
| GET    | `/posts/:postId/comments`    | Get post comments    |
| DELETE | `/comments/:commentId`       | Delete comment       |


## 🔒 Security

**Security Features:**
- Rate limiting (100 requests/min)
- CSRF protection with SameSite cookies
- MongoDB injection prevention
- Input sanitization with DOMPurify
- Automated security audits (weekly)


---

© 2025 Mahmoud Sayed. All rights reserved.  
