const express = require('express');

const app = express();
app.use(express.json());
const mongoose = require('mongoose');
const Sauce = require('./models/Sauce');
const user = require('./models/User');
const userRoutes = require('./routes/user'); 
const sauceRoutes = require('./routes/sauce');
const path = require('path');

mongoose.connect('mongodb+srv://Mathieu:OPCdataP6@clusterprojet6.qludr3o.mongodb.net/?retryWrites=true&w=majority&appName=ClusterProjet6',
{ useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });



app.use('/api/auth/', userRoutes);  
app.use('/api/sauces/', sauceRoutes);
app.use('/images/', express.static(path.join(__dirname, 'images')));

module.exports = app;