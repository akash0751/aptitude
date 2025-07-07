const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
dotenv.config();
const registerRoute = require('./routes/register');
const profileRoute = require('./routes/profile');
const postRoute = require('./routes/post');
const commentRoute = require('./routes/comment');
const privateReplyRoute = require('./routes/privateReply');
const notificationRoute = require('./routes/notification');
const app = express();

app.use(cors({
    origin: ["http://localhost:5173","https://aptitude-livid-tau.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/profiles', express.static(path.join(__dirname, 'profiles')));
app.use(express.json());
app.use(cookieParser());

app.use('/clideal',registerRoute)
app.use('/clideal', profileRoute)
app.use('/clideal', postRoute)
app.use('/clideal', commentRoute)
app.use('/clideal',notificationRoute)
app.use('/clideal', privateReplyRoute)
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});


mongoose.connect(process.env.URL).then(() => {
    console.log("Connected to database");
}).catch(err => {
    console.error("Database connection error:", err);
});