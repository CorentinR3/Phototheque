const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const app = express();  
const path = require('path');
app.set('view engine','ejs');
app.set('views',path.join(__dirname, 'views'));

app.use(express.static('public'));

app.use(express.urlencoded({extended : false}));
app.use(express.json());
app.use(fileUpload()); 

const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const albumRoutes = require('./routes/album.routes');

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());

async function main(){
    await mongoose.connect('mongodb://localhost/phototheque');
};

app.get('/',(req, res)=>{
    res.redirect('/albums');
  })

    app.use('/', albumRoutes);



  app.use((req,res)=>{
    res.status(404);
    res.send('Page non trouvée');
  })



  app.listen(3000, ()=>{
    console.log(`App lancé sur le port 3000`);
  });


main();