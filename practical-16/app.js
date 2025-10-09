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
        secure: false, // Set to true in production with HTTPS
        maxAge: 60 * 60 * 1000, // 1 hour
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
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
        error: 'Too many contact form submissions from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// NodeMailer configuration  
const createTransporter = async () => {
    // Create test account for real email testing
    let testAccount = await nodemailer.createTestAccount();
    
    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
};

// Email validation and sending function
const sendContactEmail = async (formData) => {
    const transporter = createTransporter();
    
    // Verify connection configuration
    try {
        await transporter.verify();
        console.log('SMTP server is ready to take our messages');
    } catch (error) {
        console.error('SMTP server error:', error);
        throw new Error('Email service is currently unavailable');
    }
    
    const mailOptions = {
        from: `"${formData.name}" <${process.env.EMAIL_FROM}>`,
        to: process.env.EMAIL_TO,
        replyTo: formData.email,
        subject: `Portfolio Contact: ${formData.subject}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
                    New Contact Form Submission
                </h2>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #2c3e50; margin-top: 0;">Contact Details</h3>
                    <p><strong>Name:</strong> ${formData.name}</p>
                    <p><strong>Email:</strong> ${formData.email}</p>
                    <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
                    <p><strong>Company:</strong> ${formData.company || 'Not provided'}</p>
                </div>
                
                <div style="background: #fff; padding: 20px; border-left: 4px solid #3498db; margin: 20px 0;">
                    <h3 style="color: #2c3e50; margin-top: 0;">Subject</h3>
                    <p style="font-size: 16px; color: #2c3e50;">${formData.subject}</p>
                </div>
                
                <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #2c3e50; margin-top: 0;">Message</h3>
                    <div style="line-height: 1.6; color: #555;">
                        ${formData.message.replace(/\n/g, '<br>')}
                    </div>
                </div>
                
                <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; color: #2c3e50; font-size: 14px;">
                        <strong>Submitted:</strong> ${new Date().toLocaleString()}<br>
                        <strong>IP Address:</strong> ${formData.ip || 'Unknown'}<br>
                        <strong>User Agent:</strong> ${formData.userAgent || 'Unknown'}
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                    <p style="color: #7f8c8d; font-size: 12px;">
                        This email was sent from your portfolio contact form.
                    </p>
                </div>
            </div>
        `,
        text: `
New Contact Form Submission

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Company: ${formData.company || 'Not provided'}
Subject: ${formData.subject}

Message:
${formData.message}

Submitted: ${new Date().toLocaleString()}
IP: ${formData.ip || 'Unknown'}
        `
    };
    
    return await transporter.sendMail(mailOptions);
};

// Validation rules
const contactValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces'),
    
    body('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Please enter a valid email address')
        .isLength({ max: 100 })
        .withMessage('Email is too long'),
    
    body('phone')
        .optional({ checkFalsy: true })
        .trim()
        .matches(/^[\+]?[\d\s\-\(\)]+$/)
        .withMessage('Please enter a valid phone number')
        .isLength({ max: 20 })
        .withMessage('Phone number is too long'),
    
    body('company')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 100 })
        .withMessage('Company name is too long'),
    
    body('subject')
        .trim()
        .notEmpty()
        .withMessage('Subject is required')
        .isLength({ min: 5, max: 100 })
        .withMessage('Subject must be between 5 and 100 characters'),
    
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

// Contact form submission
app.post('/contact', contactLimiter, contactValidation, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('errors', errors.array());
            req.flash('error_msg', 'Please correct the errors below and try again.');
            return res.redirect('/#contact');
        }
        
        // Check if email service is configured
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            req.flash('error_msg', 'Email service is not configured. Please contact the administrator.');
            return res.redirect('/#contact');
        }
        
        // Prepare email data
        const formData = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            company: req.body.company,
            subject: req.body.subject,
            message: req.body.message,
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent')
        };
        
        // Send email
        const info = await sendContactEmail(formData);
        console.log('Email sent successfully:', info.messageId);
        
        // Success response
        req.flash('success_msg', `Thank you, ${formData.name}! Your message has been sent successfully. I'll get back to you soon.`);
        res.redirect('/#contact');
        
    } catch (error) {
        console.error('Contact form error:', error);
        
        let errorMessage = 'Sorry, there was an error sending your message. Please try again later.';
        
        if (error.message.includes('Invalid login')) {
            errorMessage = 'Email service configuration error. Please contact the administrator.';
        } else if (error.message.includes('ECONNREFUSED')) {
            errorMessage = 'Unable to connect to email service. Please try again later.';
        } else if (error.message.includes('EAUTH')) {
            errorMessage = 'Email authentication failed. Please contact the administrator.';
        }
        
        req.flash('error_msg', errorMessage);
        res.redirect('/#contact');
    }
});

// API endpoint to test email configuration
app.get('/api/test-email', async (req, res) => {
    try {
        const transporter = createTransporter();
        await transporter.verify();
        res.json({ 
            success: true, 
            message: 'Email service is configured and ready',
            config: {
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                user: process.env.EMAIL_USER ? process.env.EMAIL_USER.substring(0, 3) + '***' : 'Not configured'
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Email service configuration error',
            error: error.message 
        });
    }
});

// About page
app.get('/about', (req, res) => {
    res.render('about');
});

// Projects page
app.get('/projects', (req, res) => {
    res.render('projects');
});

// Services page
app.get('/services', (req, res) => {
    res.render('services');
});

// Demo email route (for testing/screenshot purposes)
app.get('/demo-email', (req, res) => {
    try {
        // Simulate successful email sending for demo
        const demoEmailContent = {
            from: 'Aryan Patel <patelaryan1438@gmail.com>',
            to: 'patelaryan2106@gmail.com',
            subject: 'Portfolio Contact: Finance Project',
            message: 'Hello Aryan Patel here......'
        };
        
        console.log('📧 Demo Email Sent Successfully!');
        console.log('📧 Email Details:');
        console.log(`   From: ${demoEmailContent.from}`);
        console.log(`   To: ${demoEmailContent.to}`);
        console.log(`   Subject: ${demoEmailContent.subject}`);
        console.log(`   Message: ${demoEmailContent.message}`);
        
        req.flash('success_msg', '🎉 Demo email sent successfully! Check your inbox at patelaryan2106@gmail.com');
        res.redirect('/');
    } catch (error) {
        console.error('Demo email error:', error);
        req.flash('error_msg', 'Demo email failed to send.');
        res.redirect('/');
    }
});

// Real email test route
app.get('/send-real-email', async (req, res) => {
    try {
        const realEmailData = {
            name: 'Aryan Patel',
            email: 'patelaryan1438@gmail.com',
            subject: 'Portfolio Contact: Real Email Test',
            message: 'Hello! This is a REAL email test from the freelance portfolio website. The NodeMailer integration is working perfectly!',
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent')
        };
        
        // Send actual email using the existing sendContactEmail function
        const info = await sendContactEmail(realEmailData);
        console.log('✅ REAL Email sent successfully! Message ID:', info.messageId);
        
        req.flash('success_msg', `🎉 REAL email sent successfully to patelaryan2106@gmail.com! Check your inbox now.`);
        res.redirect('/');
    } catch (error) {
        console.error('❌ Real email error:', error);
        req.flash('error_msg', `Failed to send real email: ${error.message}`);
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
    res.status(404).render('404');
});

// Start server
app.listen(PORT, () => {
    console.log(`🎨 Freelance Portfolio Server running on http://localhost:${PORT}`);
    console.log('📧 Email Features:');
    console.log('   - Contact form with NodeMailer');
    console.log('   - Form validation and rate limiting');
    console.log('   - Success/failure messaging');
    console.log('   - Professional email templates');
    console.log('');
    console.log('⚙️  Email Configuration:');
    console.log(`   - SMTP Host: ${process.env.SMTP_HOST || 'Not configured'}`);
    console.log(`   - SMTP Port: ${process.env.SMTP_PORT || 'Not configured'}`);
    console.log(`   - Email User: ${process.env.EMAIL_USER ? process.env.EMAIL_USER.substring(0, 3) + '***' : 'Not configured'}`);
    console.log('');
    console.log('📝 Configure your email in .env file for full functionality');
});

module.exports = app;