# Sweet Shop - Full Stack MERN Application

A modern, full-featured e-commerce platform for managing and purchasing sweets. Built with MongoDB, Express.js, React, and Node.js (MERN stack), featuring role-based authentication, inventory management, and a responsive user interface.

## Features

### User Features
- **Browse & Search**: View all available sweets with real-time stock information
- **Advanced Filtering**: Search by name, category, and price range
- **Purchase System**: Buy sweets with quantity selection and automatic stock updates
- **User Authentication**: Secure registration and login with JWT tokens
- **Responsive Design**: Optimized for desktop and mobile devices

### Admin Features
- **Inventory Management**: Create, update, and delete sweet products
- **Stock Control**: Restock items and monitor quantity levels
- **Image Upload**: Support for both URL and file-based image uploads (base64)
- **Admin Dashboard**: Dedicated panel for product management
- **Category Management**: Organize sweets into predefined categories

## Tech Stack

### Backend
- **Node.js** (v14+) - Runtime environment
- **Express.js** (v5.2.1) - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** (v9.0.1) - ODM for MongoDB
- **JWT** - JSON Web Token for authentication
- **bcryptjs** - Password hashing
- **Jest** & **Supertest** - Testing framework

### Frontend
- **React** (v19.2.3) - UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management
- **CSS3** - Styling with modern features

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** - Package manager (comes with Node.js)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Incubyte
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/sweetshop
JWT_SECRET=your_super_secret_key_change_this_in_production
NODE_ENV=development
```

**Important**: Change the `JWT_SECRET` to a strong, random string in production.

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. Start MongoDB

Ensure MongoDB is running on your system:

```bash
mongod
```

Or if using MongoDB as a service:
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

## Running the Application

### Development Mode

#### Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on: `http://localhost:5000`

#### Start Frontend Server
```bash
cd frontend
npm start
```
Frontend will run on: `http://localhost:3000`

### Production Mode

#### Build Frontend
```bash
cd frontend
npm run build
```

#### Run Backend
```bash
cd backend
npm start
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Sweet Endpoints

#### Get All Sweets (Public)
```http
GET /sweets
```

#### Search Sweets (Public)
```http
GET /sweets/search?name=chocolate&category=Chocolate&minPrice=1&maxPrice=10
```

**Query Parameters:**
- `name` - Search by sweet name (case-insensitive)
- `category` - Filter by category
- `minPrice` - Minimum price
- `maxPrice` - Maximum price

#### Create Sweet (Admin Only)
```http
POST /sweets
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Chocolate Bar",
  "category": "Chocolate",
  "price": 5.99,
  "quantity": 100,
  "description": "Delicious milk chocolate",
  "imageUrl": "https://example.com/image.jpg"
}
```

#### Update Sweet (Admin Only)
```http
PUT /sweets/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 6.99,
  "quantity": 150
}
```

#### Delete Sweet (Admin Only)
```http
DELETE /sweets/:id
Authorization: Bearer {token}
```

#### Purchase Sweet (Authenticated Users)
```http
POST /sweets/:id/purchase
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 2
}
```

#### Restock Sweet (Admin Only)
```http
POST /sweets/:id/restock
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 50
}
```

## Database Schema

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date,
  updatedAt: Date
}
```

### Sweet Model
```javascript
{
  name: String (required),
  category: String (required, enum: ['Chocolate', 'Candy', 'Gummy', 'Hard Candy', 'Lollipop', 'Other']),
  price: Number (required, min: 0),
  quantity: Number (required, min: 0),
  description: String,
  imageUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Testing

### Run Backend Tests
```bash
cd backend
npm test
```

### Test Coverage
```bash
npm run test:coverage
```

Current test coverage: **66.25%**

### Test Suites
- **Authentication Tests**: User registration and login
- **Sweet Tests**: CRUD operations, purchase, restock, search functionality

## Project Structure

```
Incubyte/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB configuration
│   │   ├── controllers/
│   │   │   ├── authController.js    # Authentication logic
│   │   │   └── sweetController.js   # Sweet CRUD operations
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT authentication middleware
│   │   ├── models/
│   │   │   ├── User.js              # User schema
│   │   │   └── Sweet.js             # Sweet schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js        # Auth endpoints
│   │   │   └── sweetRoutes.js       # Sweet endpoints
│   │   ├── tests/
│   │   │   ├── auth.test.js         # Auth tests
│   │   │   ├── sweet.test.js        # Sweet tests
│   │   │   └── setup.js             # Test configuration
│   │   ├── app.js                   # Express app setup
│   │   └── server.js                # Server entry point
│   ├── .env                         # Environment variables
│   ├── package.json
│   └── jest.config.js               # Jest configuration
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js            # Navigation component
│   │   │   ├── Navbar.css
│   │   │   ├── SweetCard.js         # Sweet display component
│   │   │   └── SweetCard.css
│   │   ├── context/
│   │   │   └── AuthContext.js       # Global auth state
│   │   ├── pages/
│   │   │   ├── Home.js              # Main page
│   │   │   ├── Home.css
│   │   │   ├── Login.js             # Login page
│   │   │   ├── Register.js          # Registration page
│   │   │   ├── Auth.css
│   │   │   ├── AdminPanel.js        # Admin dashboard
│   │   │   └── AdminPanel.css
│   │   ├── services/
│   │   │   └── api.js               # API client
│   │   ├── App.js                   # Root component
│   │   ├── App.css
│   │   └── index.js                 # Entry point
│   └── package.json
│
└── README.md
```

## Default Credentials

### Admin User
- **Email**: `admin@test.com`
- **Password**: `admin123`

### Regular User
- **Email**: `user@test.com`
- **Password**: `user123`

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/sweetshop
JWT_SECRET=your_super_secret_key_change_this
NODE_ENV=development
```

## Troubleshooting

### MongoDB Connection Issues
If you get `ECONNREFUSED` error:
- Ensure MongoDB is running
- Check if MongoDB is bound to `127.0.0.1` instead of `localhost`
- Verify the connection string in `.env` file

### Port Already in Use
If port 5000 or 3000 is already in use:
```bash
# Find process using the port (Windows)
netstat -ano | findstr :5000
taskkill /PID <process_id> /F

# Find process using the port (macOS/Linux)
lsof -ti:5000 | xargs kill -9
```

### JWT Authentication Errors
- Ensure JWT_SECRET is set in `.env`
- Check if token is being sent in Authorization header
- Verify token format: `Bearer <token>`

### Image Upload Issues
- Maximum payload size is set to 50MB
- Images are converted to base64 format
- Ensure file size doesn't exceed limit

## Security Considerations

1. **Password Security**: All passwords are hashed using bcryptjs with salt rounds
2. **JWT Tokens**: Tokens expire after 7 days
3. **Role-Based Access**: Admin routes are protected with middleware
4. **Input Validation**: Mongoose schema validation for all data
5. **Environment Variables**: Sensitive data stored in .env files (not committed to git)

## Best Practices

- Never commit `.env` files to version control
- Use strong JWT secrets in production
- Implement rate limiting for production
- Enable CORS only for trusted domains in production
- Regular database backups
- Monitor application logs
- Keep dependencies updated

## Future Enhancements

- Payment gateway integration
- Order history and tracking
- Email notifications
- Password reset functionality
- Product reviews and ratings
- Advanced analytics dashboard
- Multi-language support
- PWA capabilities

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is created as part of an assignment. Feel free to use it for educational purposes.

## Support

For any issues or questions, please create an issue in the repository or contact the maintainer.

---

**Built with ❤️ using the MERN Stack**
