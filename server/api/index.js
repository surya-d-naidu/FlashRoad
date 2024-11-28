const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');  
const cookieParser = require('cookie-parser');


const authRoutes = require('../api/routes/authRoutes');
const orderRoutes = require('../api/routes/orderRoutes');
const userRoutes = require('../api/routes/userRoutes');
const frontendRoutes = require('../api/routes/frontendRoutes');  
const vendorRoutes = require('../api/routes/vendorRoutes');  


dotenv.config();


const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 


app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/user', userRoutes);
app.use('/api/vendor', vendorRoutes);  


app.use('/', frontendRoutes); 


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 8080, () => {
      console.log('Server running on port 5000');
    });
  })
  .catch(err => console.log(err));
