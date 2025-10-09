# Library Portal - Session Management System

A comprehensive Express.js application demonstrating user session management for a library portal. Features secure login/logout functionality, session tracking, and user profile management with real-time session information.

## 🚀 Features

### **Core Session Management:**
- ✅ **User Authentication** - Secure login with bcrypt password hashing
- ✅ **Session Creation** - Automatic session creation upon successful login
- ✅ **Session Tracking** - Real-time session duration and information display
- ✅ **Session Destruction** - Secure logout with complete session cleanup
- ✅ **Session Security** - HTTP-only cookies, secure configuration, and expiry management

### **User Interface:**
- ✅ **Modern Design** - Responsive UI with gradient backgrounds and animations
- ✅ **Profile Page** - Comprehensive session information display
- ✅ **Dashboard** - User-specific dashboard with activity tracking
- ✅ **Flash Messages** - User feedback for login/logout events
- ✅ **Real-time Updates** - Live session duration counter

### **Security Features:**
- ✅ **Password Encryption** - bcrypt hashing for secure password storage
- ✅ **Session Expiry** - Automatic session timeout after 24 hours
- ✅ **HTTP-Only Cookies** - Prevents XSS attacks on session cookies
- ✅ **CSRF Protection** - Session-based CSRF protection
- ✅ **Route Protection** - Authentication middleware for protected routes

## 📁 Project Structure

```
practical-15/
├── app.js                 # Main Express server with session configuration
├── package.json          # Dependencies and scripts
├── README.md             # Project documentation
├── public/
│   └── styles.css        # Comprehensive CSS styling
├── views/
│   ├── index.ejs         # Home page with welcome interface
│   ├── login.ejs         # Login form with demo accounts
│   ├── profile.ejs       # Session information display
│   ├── dashboard.ejs     # User dashboard
│   └── about.ejs         # Information about the system
├── routes/               # Additional route modules (if needed)
└── node_modules/         # Installed dependencies
```

## 🛠️ Installation & Setup

1. **Navigate to the practical-15 directory:**
   ```bash
   cd practical-15
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open your browser and visit:**
   ```
   http://localhost:3001
   ```

## 👥 Demo Accounts

The system includes three pre-configured demo accounts for testing:

| Role | Username | Password | Department |
|------|----------|----------|------------|
| **Librarian** | `librarian` | `password123` | Library Services |
| **Student** | `student1` | `password123` | Computer Science |
| **Faculty** | `faculty1` | `password123` | Mathematics |

## 🔧 Session Management Features

### **Login Process:**
1. User enters credentials on the login page
2. Server validates username and password using bcrypt
3. Upon successful authentication:
   - New session is created with unique session ID
   - User information is stored in session
   - Login time is recorded
   - User is redirected to profile page

### **Session Information Tracked:**
- **User Details**: Username, email, role, department
- **Session Metadata**: Unique session ID, creation time
- **Security Info**: Session expiry, last access time
- **Activity**: Login duration, real-time counter

### **Logout Process:**
1. User clicks logout button
2. Server destroys the session
3. Session cookie is cleared
4. User is redirected to home page with confirmation

## 🖥️ Pages & Functionality

### **Home Page (`/`)**
- Welcome interface with navigation
- Different content for logged-in vs guest users
- Quick access to login and main features
- Demo account information

### **Login Page (`/login`)**
- Secure login form with validation
- Password visibility toggle
- Click-to-fill demo account credentials
- Session security information
- Error handling with flash messages

### **Profile Page (`/profile`)** - *Protected Route*
- Complete user information display
- Real-time session information:
  - Login time and duration
  - Session ID and expiry
  - Security status
  - Last access time
- Session activity timeline
- Quick actions (dashboard, logout, download session info)
- Live session duration counter

### **Dashboard (`/dashboard`)** - *Protected Route*
- Personalized user dashboard
- Quick statistics and library activity
- Recent activity timeline
- Quick action buttons
- Session status widget

### **About Page (`/about`)**
- Technical implementation details
- Session management explanation
- Security features overview
- Current session information (if logged in)

## 🔒 Security Implementation

### **Session Configuration:**
```javascript
app.use(session({
    secret: 'library-portal-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true
    }
}));
```

### **Password Security:**
- Passwords are hashed using bcrypt with salt rounds
- No plaintext passwords stored in memory or logs
- Secure comparison during authentication

### **Route Protection:**
```javascript
function requireAuth(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.flash('error_msg', 'Please log in to access this page');
        res.redirect('/login');
    }
}
```

## 🌐 API Endpoints

| Method | Endpoint | Description | Protection |
|--------|----------|-------------|------------|
| `GET` | `/` | Home page | Public |
| `GET` | `/login` | Login form | Public |
| `POST` | `/login` | Process login | Public |
| `GET` | `/profile` | User profile & session info | Protected |
| `GET` | `/dashboard` | User dashboard | Protected |
| `GET` | `/api/session-info` | Session data API | Protected |
| `POST` | `/logout` | Destroy session | Protected |
| `GET` | `/about` | About page | Public |

## 💻 Frontend Features

### **JavaScript Functionality:**
- **Real-time Session Duration**: Updates every second
- **Password Toggle**: Show/hide password functionality
- **Demo Account Fill**: Click to auto-fill login credentials
- **Session Refresh**: Fetch updated session information
- **Download Session Info**: Export session data as JSON
- **Flash Message Auto-hide**: Messages disappear after 5 seconds

### **CSS Features:**
- **Responsive Design**: Mobile-friendly layout
- **Gradient Backgrounds**: Modern visual appeal
- **Smooth Animations**: Hover effects and transitions
- **Loading States**: Visual feedback for user actions
- **Status Indicators**: Online status and session activity

## 🧪 Testing the Application

### **Login Flow Test:**
1. Visit `http://localhost:3001`
2. Click "Login to Your Account" or use navigation
3. Click on any demo account card to auto-fill credentials
4. Click "Login to Portal"
5. Verify redirection to profile page with session info

### **Session Information Test:**
1. After logging in, check the profile page
2. Verify all session information is displayed:
   - Login time
   - Session duration (updating in real-time)
   - Session ID
   - Session expiry
   - Security status
3. Use the refresh button to update session info

### **Navigation Test:**
1. Navigate between different pages while logged in
2. Verify session persistence across page visits
3. Check that protected routes require authentication

### **Logout Test:**
1. Click logout from any protected page
2. Verify session is destroyed
3. Try accessing protected routes after logout
4. Confirm redirection to login page

## 🔧 Development

### **Development Mode:**
```bash
npm run dev
```
This uses nodemon for automatic server restart on file changes.

### **Environment Variables:**
For production deployment, consider setting:
- `NODE_ENV=production`
- `SESSION_SECRET=your-secure-secret-key`
- `PORT=your-preferred-port`

### **Adding New Users:**
Modify the `users` array in `app.js`:
```javascript
const users = [
    {
        id: 4,
        username: 'newuser',
        email: 'newuser@example.com',
        password: '$2b$10$...', // bcrypt hash
        role: 'Role',
        department: 'Department'
    }
];
```

## 📚 Dependencies

### **Core Dependencies:**
- **express**: `^4.18.2` - Web framework for Node.js
- **express-session**: `^1.17.3` - Session middleware for Express
- **bcrypt**: `^5.1.1` - Password hashing library
- **ejs**: `^3.1.9` - Embedded JavaScript templating
- **connect-flash**: `^0.1.1` - Flash message middleware

### **Development Dependencies:**
- **nodemon**: `^3.0.1` - Development server auto-restart

## 🎯 Learning Objectives

This project demonstrates:

1. **Session Management Concepts**:
   - Session creation and storage
   - Session-based authentication
   - Session data persistence
   - Secure session destruction

2. **Web Security Practices**:
   - Password hashing with bcrypt
   - HTTP-only cookies
   - Session timeout implementation
   - Route protection middleware

3. **User Experience Design**:
   - Intuitive login/logout flow
   - Real-time information updates
   - Responsive design principles
   - User feedback mechanisms

4. **Full-Stack Development**:
   - Express.js server configuration
   - EJS templating
   - Client-side JavaScript
   - CSS styling and animations

## 🚀 Future Enhancements

Potential improvements for the system:
- Database integration for persistent user storage
- Remember me functionality
- Session management dashboard for administrators
- Multi-factor authentication
- OAuth integration (Google, Facebook, etc.)
- Session analytics and reporting
- Rate limiting for login attempts
- Email verification for new accounts

## 📄 License

This project is for educational purposes as part of FSD Practicals.

## 🎉 Conclusion

The Library Portal successfully demonstrates comprehensive session management in a web application. It provides a secure, user-friendly interface for understanding how sessions work in real-world applications, making it an excellent learning tool for web development concepts.