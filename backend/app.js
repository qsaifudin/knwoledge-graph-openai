const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
require('dotenv').config()

const queryRoutes = require('./routes/queryRoutes');
const nodeRoutes = require('./routes/nodeRoutes');
const db = require('./models');

const app = express();
app.use(cors());
app.use(bodyParser.json());


// (async ()=>{
//   await db.syncDB()
// })()
// db.syncDB()
// console.log("🚀 ~ db.syncDB():", db.syncDB())

app.use('/api', queryRoutes);
app.use('/api', nodeRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
