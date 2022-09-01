const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const searchRouter = require('./routes/searchResults');

const PORT = process.env.PORT || 3000;

// init express
const app = express();

// enable cors
app.use(cors());

//routes
app.use('/api/search', searchRouter);

app.listen(PORT, () => console.log(`The server is running on ${PORT}`));
