# Threaded Comment System

##  Features

### Core Features 
- Unlimited Nested Replies**: Create deeply threaded conversations
- Real-time Like Updates**: Heart button with instant like count updates
- Functional Reply System**: Reply button works with proper threading
- Visible Thread Connectors**: Clear SVG connector lines between comments
- Responsive Design**: Works perfectly on desktop and mobile
- Collapsible Replies**: Show/hide nested replies to manage screen space
- Timestamp Formatting**: Human-readable timestamps (e.g., "2h ago", "3d ago")

### Advanced Features 
-  Basic Authentication**: Register/Login with JWT tokens
-  Pagination**: Load comments in pages for better performance
-  Load More Replies**: Lazily load additional replies on demand
-  User Profiles**: Avatar generation and user identification
-  Mobile Optimized**: Responsive design for all screen sizes

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **JavaScript ES6+** - Modern JavaScript features

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing
```

##  Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd threaded-comment-system
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

#### Quick Start (Recommended)
Use the provided startup scripts to run both client and server:

**Linux/macOS:**
```bash
./start.sh
```

**Windows:**
```cmd
start.bat
```

#### Manual Setup

1. **Start MongoDB**
   - Local MongoDB: `mongod`
   - Or use MongoDB Atlas (update connection string in server/.env)

2. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on `http://localhost:5000`

3. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application
```


```

##  API Endpoints

### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/comments` | Get comments in hierarchical structure with pagination |
| GET | `/comments/:id/replies` | Get replies for a specific comment |
| POST | `/comments` | Create a new comment or reply (requires auth) |
| POST | `/comments/:id/like` | Like a comment (requires auth) |
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login user |
| GET | `/auth/me` | Get current user info |
| GET | `/health` | Health check endpoint |

### Example API Requests

#### Create a Comment
```bash
curl -X POST http://localhost:5000/comments \
  -H "Content-Type: application/json" \
  -d '{
    "text": "This is a great post!",
    "author": "John Doe"
  }'
```

#### Create a Reply
```bash
curl -X POST http://localhost:5000/comments \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I agree with you!",
    "author": "Jane Smith",
    "parentId": "comment_id_here"
  }'
```

#### Like a Comment
```bash
curl -X POST http://localhost:3001/comments/comment_id_here/like \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Register a User
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com", 
    "password": "password123"
  }'
```

#### Login User
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Get Replies for a Comment
```bash
curl http://localhost:3001/comments/1/replies?skip=0&limit=5
```

#### Get Comments (with pagination)
```bash
curl http://localhost:3001/comments?page=1&limit=10
```

### Example Response
```json
[
  {
    "_id": "64a1b2c3d4e5f6789abcdef0",
    "text": "This is a great post!",
    "author": "John Doe",
    "parentId": null,
    "likes": 5,
    "timestamp": "2023-07-01T10:30:00.000Z",
    "children": [
      {
        "_id": "64a1b2c3d4e5f6789abcdef1",
        "text": "I agree with you!",
        "author": "Jane Smith",
        "parentId": "64a1b2c3d4e5f6789abcdef0",
        "likes": 2,
        "timestamp": "2023-07-01T11:00:00.000Z",
        "children": []
      }
    ]
  }
]
```


##  Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request


---
