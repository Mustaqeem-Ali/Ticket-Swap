# Ticket-Swap Marketplace

![Ticket Swap Banner](https://i.imgur.com/your-banner-image.png) **Ticket-Swap** is a full-stack web application built with the MERN stack that provides a secure, reliable, and user-friendly marketplace for the peer-to-peer resale of various types of tickets. It solves the common problem of non-refundable tickets by connecting sellers with interested buyers in a trusted environment.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stars](https://img.shields.io/github/stars/your-username/ticket-swap-project?style=social)](https://github.com/your-username/ticket-swap-project/stargazers)

---

## 🚀 About The Project

Have you ever bought a ticket for a movie, concert, or flight, only for your plans to change at the last minute? Ticket-Swap was built to solve this exact problem. Instead of losing your money or dealing with insecure social media groups, our platform provides a centralized marketplace for users to sell their tickets to others who need them. The system handles secure payments, user verification, and ensures a smooth transaction for both buyers and sellers.

![Project Screenshot](https://i.imgur.com/your-screenshot-demo.gif) ### Key Features:
* **Secure User Authentication**: Complete user registration and login system using JSON Web Tokens (JWT) for secure, stateless authentication.
* **Dynamic Ticket Listings**: Users can list tickets for various categories (Flights, Trains, Movies, Concerts, etc.), with form fields that dynamically adapt to the selected category.
* **Smart Search & Filtering**: A powerful search API that allows users to find tickets based on category, date, location, or route.
* **Secure Order Processing**: A complete order-to-payout flow that handles ticket purchases and automatically processes payouts to the seller after deducting a platform fee.
* **Automated Email Notifications**: Buyers and sellers receive instant email confirmations for purchases and payouts, complete with ticket details and a unique QR code for verification, powered by Nodemailer.
* **Role-Based Access Control**: The application distinguishes between regular users and administrators, with a dedicated set of API routes for admin-only actions.
* **Full Admin Dashboard**: Admins have complete CRUD (Create, Read, Update, Delete) control over all users, tickets, and orders on the platform.
* **User Profile Management**: Users can view their purchase history, manage their listed tickets, and update their personal and payment (UPI) information.

---

## 🛠️ Tech Stack

This project is built with modern technologies to ensure a fast, scalable, and maintainable application.

### Frontend
* **Framework**: [React.js](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)

* **Routing**: [React Router](https://reactrouter.com/)
* **API Client**: [Axios](https://axios-http.com/)
* **UI/Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/)

### Backend
* **Runtime**: [Node.js](https://nodejs.org/)
* **Framework**: [Express.js](https://expressjs.com/)
* **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
* **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/)
* **Email Service**: [Nodemailer](https://nodemailer.com/)
* **Security**: [bcrypt.js](https://www.npmjs.com/package/bcrypt) for password hashing

---

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
* Node.js (v18.x or later)
* npm / yarn
* MongoDB (local instance or a cloud service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Mustaqeem-Ali/Ticket-Swap.git
    cd ticket-swap-project
    ```

2.  **Setup the Backend:**
    ```sh
    cd server
    npm install
    ```
    

3.  **Setup the Frontend:**
    ```sh
    cd client
    npm install
    ```
    Create a `.env` file in the root of the `client` folder (see template below).

### Environment Variables

You will need to create `.env` files for both the server and the client.

#### Backend (`server/config/config.env`)
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Gmail Credentials for Nodemailer
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your_gmail_address@gmail.com
EMAIL_PASSWORD=your_16_character_gmail_app_password
EMAIL_FROM='Ticket Swap <no-reply@ticketswap.com>'