const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Validation function for income input
function validateIncome(value) {
    // Check if value exists and is not empty
    if (!value || value.trim() === '') {
        return { isValid: false, error: 'Income value is required' };
    }
    
    // Convert to number and validate
    const numValue = parseFloat(value);
    
    // Check if it's a valid number
    if (isNaN(numValue)) {
        return { isValid: false, error: 'Income must be a valid number' };
    }
    
    // Check if it's non-negative
    if (numValue < 0) {
        return { isValid: false, error: 'Income cannot be negative' };
    }
    
    // Check for reasonable upper limit (optional)
    if (numValue > 10000000) {
        return { isValid: false, error: 'Income value seems unreasonably high' };
    }
    
    return { isValid: true, value: numValue };
}

// Routes
// GET route - Display the tax form
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'Tax Income Calculator',
        errors: null,
        formData: { income1: '', income2: '' }
    });
});

// POST route - Process the form submission
app.post('/calculate', (req, res) => {
    const { income1, income2 } = req.body;
    const errors = [];
    
    // Validate income1
    const income1Validation = validateIncome(income1);
    if (!income1Validation.isValid) {
        errors.push(`Source 1: ${income1Validation.error}`);
    }
    
    // Validate income2
    const income2Validation = validateIncome(income2);
    if (!income2Validation.isValid) {
        errors.push(`Source 2: ${income2Validation.error}`);
    }
    
    // If there are validation errors, redisplay form with errors
    if (errors.length > 0) {
        return res.render('index', {
            title: 'Tax Income Calculator',
            errors: errors,
            formData: { income1: income1 || '', income2: income2 || '' }
        });
    }
    
    // Calculate total income (server-side calculation)
    const totalIncome = income1Validation.value + income2Validation.value;
    
    // Display results
    res.render('result', {
        title: 'Tax Income Calculation Result',
        income1: income1Validation.value,
        income2: income2Validation.value,
        totalIncome: totalIncome
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Tax Form Server running on http://localhost:${PORT}`);
});