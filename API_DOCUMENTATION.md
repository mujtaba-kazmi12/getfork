# Authentication API Documentation

This document describes the authentication APIs available in the GetFork application.

## Base URL
```
http://localhost:3000/api/auth
```

## Endpoints

### 1. Sign Up
**POST** `/api/auth/signup`

Creates a new user account and sends a verification email.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Account created successfully! Please check your email to verify your account.",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "isVerified": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields or validation errors
- `409 Conflict`: User with email or phone already exists

---

### 2. Email Verification
**POST** `/api/auth/verify-email`
**GET** `/api/auth/verify-email?token=verification_token`

Verifies a user's email address using the verification token.

**Request Body (POST):**
```json
{
  "token": "verification_token_from_email"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Email verified successfully! You can now sign in.",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "isVerified": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:05:00.000Z"
    },
    "token": "jwt_token"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid or expired verification token

---

### 3. Sign In
**POST** `/api/auth/signin`

Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Sign in successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "isVerified": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:05:00.000Z"
    },
    "token": "jwt_token"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing email or password
- `401 Unauthorized`: Invalid email or password
- `403 Forbidden`: Email not verified

---

### 4. Forgot Password
**POST** `/api/auth/forgot-password`

Sends a password reset email to the user.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "If an account with that email exists, we have sent a password reset link to your email address."
}
```

**Error Responses:**
- `400 Bad Request`: Missing or invalid email
- `403 Forbidden`: Email not verified

---

### 5. Reset Password
**POST** `/api/auth/reset-password`
**GET** `/api/auth/reset-password?token=reset_token`

Resets a user's password using the reset token.

**Request Body (POST):**
```json
{
  "token": "reset_token_from_email",
  "password": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successful! You are now signed in.",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "isVerified": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:10:00.000Z"
    },
    "token": "jwt_token"
  }
}
```

**GET Response (200 OK) - Token Validation:**
```json
{
  "success": true,
  "message": "Reset token is valid. You can now reset your password.",
  "data": {
    "tokenValid": true,
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing fields, passwords don't match, or invalid/expired token

---

## Authentication Headers

For protected routes (not implemented yet), include the JWT token in the Authorization header:

```
Authorization: Bearer your_jwt_token_here
```

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

## Email Templates

The system sends two types of emails:

1. **Welcome/Verification Email**: Sent after signup with a verification link
2. **Password Reset Email**: Sent when user requests password reset

Both emails are beautifully designed with HTML templates and include fallback text versions.

## Security Features

- Passwords are hashed using bcrypt with salt rounds of 12
- JWT tokens expire in 7 days (configurable)
- Verification tokens expire in 24 hours
- Password reset tokens expire in 10 minutes
- Email addresses are normalized (lowercase, trimmed)
- Input validation and sanitization
- Secure token generation using crypto.randomBytes()

## Environment Variables Required

```env
MONGODB_URI=your_mongodb_connection_string
BREVO_API_KEY=your_brevo_api_key
SENDER_EMAIL=your_sender_email
SENDER_NAME=Your_App_Name
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Testing the APIs

You can test these APIs using tools like:
- Postman
- Insomnia
- curl
- Thunder Client (VS Code extension)

Example curl command for signup:
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "password": "password123"
  }'
```