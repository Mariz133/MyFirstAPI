const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const { body, param, validationResult } = require('express-validator');
const db = require('./queries');
const app = express();
const port = 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Validation Rules
const validateUser = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
];
const validateId = [param('id').isInt().withMessage('ID must be an integer')];

// Routes
app.get('/', (req, res) => {
  res.json({ info: 'Node.js, Express, and Postgres API' });
});

app.get('/users', db.getUsers);

app.get('/users/:id', validateId, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  db.getUserById(req, res);
});

app.post('/users', validateUser, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  db.createUser(req, res);
});

app.put('/users/:id', [...validateId, ...validateUser], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  db.updateUser(req, res);
});

app.delete('/users/:id', validateId, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  db.deleteUser(req, res);
});

// Error-Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});


// Start Server
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});