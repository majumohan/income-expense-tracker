const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const transactions = require('./routes/transactions');
const auth = require('./routes/auth');
const budgets = require('./routes/budgets');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/transactions', transactions);
app.use('/api/auth', auth);
app.use('/api/budgets', budgets);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));
