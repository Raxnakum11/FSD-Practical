# Job Portal - Resume Upload System

A secure Express.js application for uploading resumes with strict file validation. Only accepts PDF files up to 2MB in size.

## Features

- **Secure File Upload**: Only PDF files are accepted
- **Size Validation**: Maximum file size of 2MB
- **Type Validation**: Strict MIME type checking for PDF files
- **User-Friendly Interface**: Modern, responsive design
- **File Management**: View and download uploaded files
- **Error Handling**: Comprehensive error messages for invalid uploads
- **Drag & Drop**: Support for drag-and-drop file uploads

## File Validation Rules

✅ **Accepted:**
- PDF files only (`.pdf` extension)
- Maximum file size: 2MB
- Valid PDF MIME type (`application/pdf`)

❌ **Rejected:**
- Any non-PDF files (images, documents, etc.)
- Files larger than 2MB
- Files without proper PDF headers

## Installation

1. Navigate to the practical-14 directory:
   ```bash
   cd practical-14
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open your browser and visit:
   ```
   http://localhost:3000
   ```

## Project Structure

```
practical-14/
├── app.js                 # Main Express server
├── package.json          # Node.js dependencies
├── public/
│   └── styles.css        # CSS styling
├── views/
│   ├── index.ejs         # Upload page
│   └── files.ejs         # File management page
└── uploads/              # Directory for uploaded files
```

## API Endpoints

- `GET /` - Main upload page
- `POST /upload-resume` - Handle file upload
- `GET /uploaded-files` - View uploaded files
- `GET /download/:filename` - Download specific file

## Security Features

1. **File Type Validation**: Uses multer fileFilter to check MIME types
2. **Size Limits**: Enforces 2MB maximum file size
3. **Safe File Storage**: Files are stored with unique names to prevent conflicts
4. **Input Sanitization**: Proper validation of file inputs
5. **Error Handling**: Comprehensive error messages without exposing system details

## Error Messages

The system provides clear error messages for various scenarios:

- **File too large**: "File too large! Please upload a PDF file smaller than 2MB."
- **Wrong file type**: "Invalid file type! Please upload only PDF files."
- **No file selected**: "No file selected! Please choose a PDF file to upload."

## Dependencies

- **express**: Web framework for Node.js
- **multer**: Middleware for handling file uploads
- **ejs**: Templating engine for views
- **path**: Node.js path utilities

## Usage Instructions

1. **Upload a Resume**:
   - Click "Choose PDF File" or drag and drop a PDF
   - Only PDF files up to 2MB are accepted
   - Click "Upload Resume" to submit

2. **View Uploaded Files**:
   - Navigate to "View Uploaded Files"
   - See all uploaded resumes with details
   - Download files by clicking the download button

3. **File Validation**:
   - The system automatically validates file type and size
   - Clear error messages are displayed for invalid files
   - Only valid PDF files are stored on the server

## Testing the Application

To test the file validation:

1. **Valid Upload**: Try uploading a PDF file under 2MB
2. **Size Validation**: Try uploading a PDF larger than 2MB
3. **Type Validation**: Try uploading non-PDF files (images, documents)
4. **No File**: Try submitting without selecting a file

## Development

For development with auto-reload:

```bash
npm run dev
```

This uses nodemon to automatically restart the server when files change.

## Browser Support

- Modern browsers with HTML5 file API support
- Drag and drop functionality
- Responsive design for mobile devices

## License

This project is for educational purposes as part of FSD Practicals.