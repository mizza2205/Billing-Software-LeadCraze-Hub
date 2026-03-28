const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:billing123@cluster0.b7epr0a.mongodb.net/billing_db')
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));