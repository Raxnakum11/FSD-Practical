const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter function to validate PDF files
const fileFilter = (req, file, cb) => {
    // Check if file is PDF
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        // Reject file with custom error
        cb(new Error('INVALID_FILE_TYPE'), false);
    }
};

// Configure multer with size and type restrictions
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit
    },
    fileFilter: fileFilter
});

// Routes
app.get('/', (req, res) => {
    res.render('index', {
        message: null,
        error: null
    });
});

// Handle file upload
app.post('/upload-resume', (req, res) => {
    upload.single('resume')(req, res, (err) => {
        if (err) {
            let errorMessage = '';
            
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    errorMessage = 'File too large! Please upload a PDF file smaller than 2MB.';
                } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    errorMessage = 'Invalid file field. Please use the correct upload form.';
                } else {
                    errorMessage = 'Upload error: ' + err.message;
                }
            } else if (err.message === 'INVALID_FILE_TYPE') {
                errorMessage = 'Invalid file type! Please upload only PDF files.';
            } else {
                errorMessage = 'Unknown error occurred during upload.';
            }
            
            return res.render('index', {
                message: null,
                error: errorMessage
            });
        }
        
        if (!req.file) {
            return res.render('index', {
                message: null,
                error: 'No file selected! Please choose a PDF file to upload.'
            });
        }
        
        // Success - file uploaded
        const successMessage = `Resume uploaded successfully! 
                               File: ${req.file.originalname} 
                               Size: ${(req.file.size / 1024).toFixed(2)} KB
                               Saved as: ${req.file.filename}`;
        
        res.render('index', {
            message: successMessage,
            error: null
        });
    });
});

// Route to view uploaded files
app.get('/uploaded-files', (req, res) => {
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            return res.render('files', {
                files: [],
                error: 'Unable to read uploaded files directory.'
            });
        }
        
        // Get file details
        const fileDetails = files.map(file => {
            const filePath = path.join(uploadsDir, file);
            const stats = fs.statSync(filePath);
            return {
                name: file,
                size: (stats.size / 1024).toFixed(2) + ' KB',
                uploadDate: stats.birthtime.toLocaleDateString()
            };
        });
        
        res.render('files', {
            files: fileDetails,
            error: null
        });
    });
});

// Route to download uploaded files
app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);
    
    // Check if file exists
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).send('File not found');
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).render('index', {
        message: null,
        error: 'Internal server error occurred.'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Start server
app.listen(PORT, () => {
    console.log(`Job Portal Server is running on http://localhost:${PORT}`);
    console.log('Features:');
    console.log('- PDF file upload only');
    console.log('- Maximum file size: 2MB');
    console.log('- File validation and error handling');
    console.log('- View uploaded files');
});

module.exports = app;