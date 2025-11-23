# TinyLink Backend

A robust URL shortener backend API built with Node.js, Express, and MongoDB. TinyLink allows you to create short links with custom or auto-generated codes, track link analytics, and manage your shortened URLs efficiently.

## Features

- **URL Shortening**: Create short links with custom codes or auto-generated unique codes
- **Link Analytics**: Track click counts, creation dates, and link statistics
- **Custom Codes**: Support for user-defined short codes
- **RESTful API**: Clean and intuitive API endpoints
- **Health Monitoring**: Built-in health check endpoint with system information
- **CORS Support**: Cross-origin resource sharing enabled for frontend integration
- **Environment Configuration**: Flexible configuration using environment variables

## Tech Stack

- **Runtime**: Node.js with ES6 modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Middleware**: CORS, custom validation middleware
- **Development**: Nodemon for hot reloading

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or cloud service like MongoDB Atlas)
- npm or yarn package manager

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd TinyLink-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the values according to your setup:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/tinylink
     ```

4. Start MongoDB service (if running locally)

## Running the Application

### Development Mode
```bash
npm run dev
```
This starts the server with hot reloading using nodemon.

### Production Mode
```bash
npm start
```
This starts the server in production mode.

The server will start on the port specified in your `.env` file (default: 5000).

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Health Check
- **GET** `/health`
- Returns server status, uptime, and system information

#### Link Management

##### Create a Short Link
- **POST** `/links`
- Creates a new short link
- Request Body:
  ```json
  {
    "originalUrl": "https://example.com",
    "customCode": "optional-custom-code"
  }
  ```
- Response:
  ```json
  {
    "success": true,
    "data": {
      "code": "abc123",
      "originalUrl": "https://example.com",
      "shortUrl": "http://localhost:5000/api/links/abc123/redirect",
      "clickCount": 0,
      "createdAt": "2023-11-23T11:45:48.724Z"
    }
  }
  ```

##### Get All Links
- **GET** `/links`
- Returns all created short links

##### Get Link Statistics
- **GET** `/links/:code`
- Returns statistics for a specific link

##### Delete a Link
- **DELETE** `/links/:code`
- Deletes a specific link

##### Redirect to Original URL
- **GET** `/links/:code/redirect`
- Redirects to the original URL and increments click count

## Project Structure

```
TinyLink-backend/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── server.js              # Server entry point
│   ├── config/
│   │   ├── db.js             # Database connection
│   │   └── env.js            # Environment configuration
│   ├── constants/
│   │   ├── apiStatus.js      # API status codes
│   │   ├── messages.js       # Response messages
│   │   └── regex.js          # Regular expressions
│   ├── controllers/
│   │   └── link.controller.js # Link business logic
│   ├── middleware/
│   │   └── validateCode.js   # Code validation middleware
│   ├── models/
│   │   └── LinkModel.js      # MongoDB link schema
│   ├── routes/
│   │   ├── health.routes.js  # Health check routes
│   │   └── link.routes.js    # Link management routes
│   ├── services/
│   │   └── link.service.js   # Link service layer
│   └── utils/
│       └── generateCode.js   # Code generation utility
├── .env.example               # Environment variables template
├── .gitignore                # Git ignore rules
├── package.json              # Project dependencies
└── README.md                 # Project documentation
```

## Environment Variables

| Variable     | Description              | Default |
|--------------|--------------------------|---------|
| PORT         | Server port              | 5000    |
| MONGODB_URI  | MongoDB connection URI   | mongodb://localhost:27017/tinylink |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.