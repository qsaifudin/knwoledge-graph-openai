require('dotenv').config()
const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');

const queryRoutes = require('./routes/queryRoutes');

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/api', queryRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
