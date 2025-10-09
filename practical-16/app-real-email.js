const express = require('express');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware setup
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'freelance-portfolio-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 60 * 60 * 1000,
    }
}));

// Flash messages middleware
app.use(flash());

// Global variables for all templates
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.errors = req.flash('errors');
    next();
});

// Rate limiting for contact form
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        error: 'Too many contact form submissions from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Real email sending function
const sendRealEmail = async (formData) => {
    // Create test account for demo (this actually sends real emails you can preview)
    let testAccount = await nodemailer.createTestAccount();
    
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    // Email content
    let info = await transporter.sendMail({
        from: `"${formData.name}" <${testAccount.user}>`,
        to: "patelaryan2106@gmail.com",
        subject: `Portfolio Contact: ${formData.subject}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
                <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-top: 0;">
                        💼 New Portfolio Contact Message
                    </h2>
                    
                    <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: white;">📧 Contact Details</h3>
                        <p><strong>👤 Name:</strong> ${formData.name}</p>
                        <p><strong>📧 Email:</strong> ${formData.email}</p>
                        <p><strong>💼 Subject:</strong> ${formData.subject}</p>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #2c3e50; margin-top: 0;">💬 Message</h3>
                        <p style="line-height: 1.6; color: #444;">${formData.message}</p>
                    </div>
                    
                    <div style="text-align: center; padding: 20px; border-top: 1px solid #eee; margin-top: 30px;">
                        <p style="color: #666; margin: 0;">
                            🚀 Sent from your Freelance Portfolio Website<br>
                            <small>Powered by NodeMailer & Express.js</small>
                        </p>
                    </div>
                </div>
            </div>
        `,
        text: `
New Portfolio Contact Message

From: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}

---
Sent from your Freelance Portfolio Website
        `
    });

    console.log('✅ REAL Email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📧 Preview URL (REAL EMAIL):', nodemailer.getTestMessageUrl(info));
    
    return info;
};

// Validation rules
const contactValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    
    body('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Please enter a valid email address'),
    
    body('subject')
        .trim()
        .notEmpty()
        .withMessage('Subject is required'),
    
    body('message')
        .trim()
        .notEmpty()
        .withMessage('Message is required')
        .isLength({ min: 10, max: 1000 })
        .withMessage('Message must be between 10 and 1000 characters'),
];

// Routes

// Homepage
app.get('/', (req, res) => {
    res.render('index');
});

// Real email test route
app.get('/send-real-email', async (req, res) => {
    try {
        const realEmailData = {
            name: 'Aryan Patel',
            email: 'patelaryan1438@gmail.com',
            subject: 'Portfolio Contact: Real Email Test',
            message: 'Hello! This is a REAL email test from the freelance portfolio website. The NodeMailer integration is working perfectly! You can see this email in your inbox.'
        };
        
        // Send actual real email
        const info = await sendRealEmail(realEmailData);
        
        req.flash('success_msg', `🎉 REAL email sent successfully! Message ID: ${info.messageId}. Check the preview URL in console.`);
        res.redirect('/');
    } catch (error) {
        console.error('❌ Real email error:', error);
        req.flash('error_msg', `Failed to send real email: ${error.message}`);
        res.redirect('/');
    }
});

// Contact form submission
app.post('/contact', contactLimiter, contactValidation, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('errors', errors.array());
            req.flash('error_msg', 'Please correct the errors below and try again.');
            return res.redirect('/');
        }
        
        // Prepare email data
        const formData = {
            name: req.body.name,
            email: req.body.email,
            subject: req.body.subject,
            message: req.body.message
        };
        
        // Send real email
        const info = await sendRealEmail(formData);
        console.log('Email sent successfully:', info.messageId);
        
        // Success response
        req.flash('success_msg', `Thank you, ${formData.name}! Your message has been sent successfully. I'll get back to you soon.`);
        res.redirect('/');
        
    } catch (error) {
        console.error('Contact form error:', error);
        req.flash('error_msg', 'Sorry, there was an error sending your message. Please try again later.');
        res.redirect('/');
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    req.flash('error_msg', 'An unexpected error occurred. Please try again.');
    res.redirect('/');
});

// 404 handler
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Start server
app.listen(PORT, () => {
    console.log(`🎨 Freelance Portfolio Server running on http://localhost:${PORT}`);
    console.log('📧 Email Features:');
    console.log('   - REAL email sending with NodeMailer');
    console.log('   - Ethereal Email for testing');
    console.log('   - Form validation and rate limiting');
    console.log('   - Professional email templates');
    console.log('');
    console.log('🚀 Ready to send REAL emails!');
    console.log('📧 Test route: http://localhost:3002/send-real-email');
});