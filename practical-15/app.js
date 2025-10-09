const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware setup
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session configuration
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

// Flash messages middleware
app.use(flash());

// Global variables for all templates
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Mock user database (In real application, use proper database)
const users = [
    {
        id: 1,
        username: 'librarian',
        email: 'librarian@library.com',
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password123
        role: 'Librarian',
        department: 'Library Services'
    },
    {
        id: 2,
        username: 'student1',
        email: 'student1@university.edu',
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password123
        role: 'Student',
        department: 'Computer Science'
    },
    {
        id: 3,
        username: 'faculty1',
        email: 'faculty1@university.edu',
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password123
        role: 'Faculty',
        department: 'Mathematics'
    }
];

// Helper function to find user by username
function findUserByUsername(username) {
    return users.find(user => user.username === username);
}

// Middleware to check if user is authenticated
function requireAuth(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.flash('error_msg', 'Please log in to access this page');
        res.redirect('/login');
    }
}

// Routes

// Home/Landing page
app.get('/', (req, res) => {
    res.render('index');
});

// Login page
app.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/profile');
    }
    res.render('login');
});

// Login POST handler
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Find user
        const user = findUserByUsername(username);
        
        if (!user) {
            req.flash('error_msg', 'Invalid username or password');
            return res.redirect('/login');
        }
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            req.flash('error_msg', 'Invalid username or password');
            return res.redirect('/login');
        }
        
        // Create session
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            department: user.department,
            loginTime: new Date(),
            sessionId: req.sessionID
        };
        
        req.flash('success_msg', `Welcome back, ${user.username}!`);
        res.redirect('/profile');
        
    } catch (error) {
        console.error('Login error:', error);
        req.flash('error_msg', 'An error occurred during login');
        res.redirect('/login');
    }
});

// Profile page (protected route)
app.get('/profile', requireAuth, (req, res) => {
    const sessionData = {
        ...req.session.user,
        sessionDuration: calculateSessionDuration(req.session.user.loginTime),
        sessionExpiry: new Date(Date.now() + req.session.cookie.maxAge),
        lastAccess: new Date()
    };
    
    res.render('profile', { sessionData });
});

// Library dashboard (protected route)
app.get('/dashboard', requireAuth, (req, res) => {
    const recentActivity = [
        { action: 'Book borrowed', item: 'JavaScript: The Good Parts', time: '2 hours ago' },
        { action: 'Book returned', item: 'Clean Code', time: '1 day ago' },
        { action: 'Reservation made', item: 'Design Patterns', time: '3 days ago' }
    ];
    
    res.render('dashboard', { recentActivity });
});

// Session info API endpoint
app.get('/api/session-info', requireAuth, (req, res) => {
    const sessionInfo = {
        sessionId: req.sessionID,
        user: req.session.user,
        loginTime: req.session.user.loginTime,
        currentTime: new Date(),
        sessionDuration: calculateSessionDuration(req.session.user.loginTime),
        expiresAt: new Date(Date.now() + req.session.cookie.maxAge)
    };
    
    res.json(sessionInfo);
});

// Logout handler
app.post('/logout', (req, res) => {
    const username = req.session.user ? req.session.user.username : 'User';
    
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destruction error:', err);
            req.flash('error_msg', 'Error occurred during logout');
            return res.redirect('/profile');
        }
        
        res.clearCookie('connect.sid'); // Clear session cookie
        req.flash('success_msg', `Goodbye, ${username}! You have been logged out successfully.`);
        res.redirect('/');
    });
});

// About page
app.get('/about', (req, res) => {
    res.render('about');
});

// Helper functions
function calculateSessionDuration(loginTime) {
    const now = new Date();
    const login = new Date(loginTime);
    const diffMs = now - login;
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).render('error', { 
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('error', {
        message: 'Page Not Found',
        error: { status: 404 }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🏛️  Library Portal Server is running on http://localhost:${PORT}`);
    console.log('📚 Session Management Features:');
    console.log('   - User authentication with sessions');
    console.log('   - Login/logout functionality');
    console.log('   - Profile page with session info');
    console.log('   - Session duration tracking');
    console.log('   - Secure session handling');
    console.log('');
    console.log('👥 Demo Users (username/password):');
    console.log('   - librarian/password123 (Librarian)');
    console.log('   - student1/password123 (Student)');
    console.log('   - faculty1/password123 (Faculty)');
});

module.exports = app;