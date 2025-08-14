const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const config = require('./config');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/health', (req, res) => res.json({ ok: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

module.exports = app;