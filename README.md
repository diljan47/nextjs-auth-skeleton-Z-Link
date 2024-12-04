# Z-Link-Auth: Next.js Authentication Template

A modern, secure authentication system built with Next.js 15, featuring email verification, password reset, and Google OAuth integration.

## 🚀 Overview

Z-Link-Auth is a comprehensive authentication template that provides a robust foundation for your Next.js projects. Built with security and developer experience in mind, it combines modern authentication methods with an elegant UI.


## 🚀 Features

- 🔐 TOTP Authentication
- ✉️ Email Verification
- 🔑 Session-based Authentication 
- 🔄 Password Reset Functionality
- 🌐 Google OAuth Integration
- 🎨 Shadcn UI Components
- 🌙 Dark Mode Support
- 🍪 Secure Session Cookies
- 🎨 Tailwind CSS 
- 📊 MongoDB Integration
- ⚡ Next.js 15 App Router



## 🚦 Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/z-auth.git
cd z-auth

```

2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables:
Create a `.env.local` file with the following variables:

```env
MONGODB_URI=
NODE_ENV=development | production
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_RESPONSE_VERIFICATION_URL=
RESEND_API_KEY=
JWT_RESET_PASSWORD_SECRET=
EMAIL_VERIFICATION_TOTP_SECRET=
NEXT_PUBLIC_URL= http://localhost:3000
GITHUB_PERSONAL_LINK=
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## 📝 Project Structure

- `/src/app` - App router pages and layouts
- `/src/components` - Reusable UI components
- `/src/lib` - Utility functions and database connection
- `/src/hooks` - Custom React hooks

## 🚀 Deployment

This project can be deployed on any platform that supports Next.js applications. We recommend:

- [Netlify](https://netlify.com)

