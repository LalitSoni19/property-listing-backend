# 🏡 Property Listing Backend API

##  Description
This is a backend REST API for a property listing application. It supports features like user authentication, property management (CRUD operations), filtering, caching, favorites, and recommendations.

### ✨ Key Features
- User Authentication (JWT)
- CRUD Operations for Properties
- Filtering & Searching
- Caching with Redis
- Favorite Properties Management
- Property Recommendations

## 🛠 Tech Stack
- Node.js
- Express.js
- MongoDB & Mongoose
- Redis
- JWT (JSON Web Tokens)
- bcryptjs

## 🚀 Getting Started

## 📦 Installation
1. Clone the repository:
- git clone <repository-url>
- cd <project-directory>


2. Install dependencies:
- npm install


3. Create environment variables:
- Create a `.env` file in the root directory.
  
## ⚙️ Environment Variables
The following environment variables are required in the `.env` file:
- PORT=10000                        
- MONGO_URI=your_remote_mongo_uri   
- REDIS_URL=your_remote_redis_url   
- JWT_SECRET_KEY=your_secret_key    


## 📥 CSV Data Import
To import initial data from a CSV file:
- node scripts/importData.js


## ▶️ Running the Application
To start the development server:
- npm run dev

The API will be available at:
- http://localhost:3000


## 📌 API Endpoints

| Method | Endpoint              | Description                   | Auth Required | Sample Body                             |
|--------|-----------------------|-------------------------------|---------------|------------------------------------------|
| GET    | /api/properties       | Get all properties            | No            | -                                        |
| GET    | /api/properties/:id   | Get a single property by ID   | No            | -                                        |
| POST   | /api/properties       | Create a new property         | Yes           | `{"propertyId":"ID", "title": "beautiful villa", "price": 100000, "type":"Villa",      "city":"Delhi","listingType":"rent" }` |
| PUT    | /api/properties/:id   | Update an existing property   | Yes           | `{ "price": 120000 }`                   |
| DELETE | /api/properties/:id   | Delete a property             | Yes           | -                                        |
| POST   | /api/auth/register    | Register a new user           | No            | `{ "email": "test@example.com", "password": "123456" },"username":"TEST"}` |
| POST   | /api/auth/login       | Login a user                  | No            | `{ "email": "test@example.com", "password": "123456" }` |
| POST   | /api/favorites/:id    | Add property to favorites     | Yes           | -                                        |
| GET    | /api/favorites        | List all favorite properties  | Yes           | -                                        |
| POST   | /api/recommendations  | Recommends property           | Yes           | `{"recipientEmail":"friend@mail.com", "propertyId":"someID","Message":"check this!"}`  |
| GET    | /api/recommendations/received  | Get all recommended property list  |  Yes  | -                                 | 




