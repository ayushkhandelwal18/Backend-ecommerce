🚀  A robust e-commerce backend built with Node.js, Express.js, and MongoDB. 
This backend provides essential features for managing users, products, and orders while ensuring secure authentication and smooth API interactions.


📌 Features ---

✅ User Authentication & Authorization: Secure JWT-based authentication with role-based access control.  

✅ Product Management: CRUD operations for products, including filtering, pagination, and searching.  

✅ Order Management: Users can place, track, and manage orders, while admins can update order statuses. 

✅ Error Handling: Centralized error handling using custom error classes and middleware.  

✅ Email Notifications: Automated email notifications for account verification, password reset, and order updates. 

✅ Secure API Endpoints: Implemented authentication and authorization middleware for protected routes. 

✅ Optimized Query Handling: API features like sorting, filtering, and pagination for efficient database queries.  

✅ Scalable Project Structure: Modular codebase with controllers, routes, and models organized systematically.  




# Installation & Usage ---

1️⃣ Clone the repo  

2️⃣ Install Dependencies - `npm install`  

3️⃣ Setup Environment Variables - Create a `.env` file in the `config/` folder and add the following:  

PORT=5000

DB_URI="mongodb url"

JWT_SECRET="your_jwt_secret" 

JWT_EXPIRES_TIME="7d"

COOKIE_EXPIRES_TIME=7

SMPT_SERVICE="gmail" 

SMPT_EMAIL="your-email@gmail.com" 

SMPT_PASSWORD="your-email-password"

SMPT_HOST="smtp.gmail.com" 

SMPT_PORT=587



4️⃣ Run the Server - npm start or npm run dev







⚡ Technologies Used

✅ Node.js - Backend runtime

✅ Express.js - Web framework

✅ MongoDB - NoSQL database

✅ Mongoose - MongoDB ODM

✅ JWT - Authentication

✅ Nodemailer - Email notifications

✅ dotenv - Environment variable management

