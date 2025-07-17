const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/gaming-platform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Routes
const usersRouter = require('./routes/users');
const tournamentsRouter = require('./routes/tournaments');

app.use('/api/users', usersRouter);
app.use('/api/tournaments', tournamentsRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
