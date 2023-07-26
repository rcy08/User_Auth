require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

app.use(
  cors({
    origin: "https://user-auth-csv.netlify.app",
    credentials: true,
  })
);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`connected to db and listening on port ${process.env.PORT}`);
    });
  });


app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://user-auth-csv.netlify.app"
  );
  res.header(
    "Access-Control-Allow-Origin",
    "Origin,X-Requested-With,Content-Type,Accept",
    "Access-Control-Allow-Methods: GET, DELETE, PUT, PATCH, HEAD, OPTIONS, POST"
  );
  next();
});

app.use(userRoutes);


