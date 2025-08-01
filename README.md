# 💸 Node.js Banking API

A secure and RESTful banking backend API built with Node.js, Express, and MongoDB. This project enables users to register, log in, manage accounts, and perform fund transfers with email alerts.

## 🚀 Features

- User registration & authentication (JWT)
- Account creation and management
- Secure fund transfers (double-entry system)
- Email notifications for transactions (credit/debit alerts)
- Real-time balance updates
- Transaction history
- Error handling with descriptive responses
- MongoDB transaction session support
- Clean and modular architecture

## 📦 Technologies Used

- Node.js
- Express.js
- MongoDB + Mongoose
- bcryptjs
- JSON Web Tokens (JWT)
- Nodemailer (for email alerts)
- Postman (for API testing)

## ⚙️ Getting Started

### Prerequisites

- Node.js
- MongoDB
- Postman (optional, for testing)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/banking-api.git
   cd banking-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   - Create a `.env` file in the root of the project:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     EMAIL_HOST=your_host
     EMAIL_PORT=your_port
     EMAIL_USER=your_smtp_user
     EMAIL_PASS=your_smtp_pass
     ```

4. Run the server:
   ```bash
   npm start
   ```

## 🔐 API Endpoints

| METHOD | ENDPOINT             | DESCRIPTION                           |
| ------ | -------------------- | ------------------------------------- |
| POST   | `/api/auth/register` | Register a new user                   |
| POST   | `/api/auth/login`    | Login and get JWT token               |
| GET    | `/api/account`       | Get authenticated user's account info |
| POST   | `/api/transfer`      | Transfer funds to another account     |
| GET    | `/api/transactions`  | Get user's transaction history        |

🛠 Additional routes are available in the Postman collection.

## 🧪 Postman Collection

Import the Postman collection to test all available API routes:

- 📁 `postman/banking-api.postman_collection.json`

## 📂 Folder Structure

```
.
├── controller/
│   ├── auth.js
│   ├── account.js
│   └── transaction.js
├── models/
│   ├── User.js
│   ├── Account.js
│   └── Transaction.js
├── utils/
│   ├── sendEmail.js
│   └── sendTransactionEmail.js
├── routes/
│   ├── auth.js
│   ├── account.js
│   └── transaction.js
├── middleware/
│   └── authMiddleware.js
├── postman/
│   └── banking-api.postman_collection.json
├── .env
├── app.js
└── server.js
```

## 📧 Email Alerts

Email notifications are automatically triggered for:

- Credit and debit transactions
- Failed transfers (optional)

Set up your SMTP credentials in `.env` to enable this feature.

## 🧠 Future Improvements

- Admin dashboard
- Daily and monthly transaction summaries
- Two-factor authentication (2FA)
- Audit logging
- SMS alerts (Twilio integration)

## 📝 License

This project is licensed under the MIT License. Feel free to use, fork, and modify!

## 👤 Author

Thankgod Ikefuama – [@yourusername](https://github.com/yourusername)
