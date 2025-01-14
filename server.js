// TO ACTIVATE YOUR env code the first line is important
require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const app = express();
const axios = require('axios')

// Sets EJS as the view engine
app.set('view engine', 'ejs');
// Specifies the location of the static assets folder
app.use(express.static('static'));
// Sets up body-parser for parsing form data
app.use(express.urlencoded({ extended: false }));
// Enables EJS Layouts middleware
app.use(ejsLayouts);

// Adds some logging to each request
app.use(require('morgan')('dev'));

// Routes
app.get('/', function(req, res) {
  console.log(process.env.RANDOM_ENV_VAR)
  // res.send('Hello, backend!');
  res.render('index')
});

app.get('/results', (req, res)=>{
  console.log(req.query)
  // let results
  axios.get(`http://www.omdbapi.com/?apikey=${process.env.OMDb_API_KEY}&s=${req.query.q}`)
    .then(results=>{
        console.log(results.data.Search)
        res.render('results.ejs', {results: results.data.Search})
    })
    .catch(err =>{
      console.log("opp! there eas an issue retrieving API")
    })
})
app.get('/movies/:id', (req, res)=>{
console.log(req.params)

  axios.get(`http://www.omdbapi.com/?apikey=${process.env.OMDb_API_KEY}&i=${req.params.id}`)
    .then(movieDetails=>{
        console.log(movieDetails.data)
        res.render('detail.ejs', movieDetails.data)
    })
  })


  
  
//Add To Fave Routes:
app.post('/faves', (req,res)=>{
  console.log(`Movie Title: ${req.body.title}`)
  console.log(`Movie Id: ${req.body.imdbid}`)
    async function addToFaves(){
      try{
          const newFave = await db.fave.create({
              title: req.body.title, 
              imdbid: req.body.imdbid
          }, res.redirect('/faves'))
          
          console.log("Added to Fave", newFave)
      }
      catch(err){
          console.log(err)
      }
  }
  addToFaves()
  })
  
  
  app.get('/faves', (req,res)=>{
  
    async function readAllFavMovies() {
      try {
        const allFave = await db.fave.findAll({
          attributes: ['title', 'imdbid']
        })
        res.render('faves', {allFave})
        console.log(allFave);
      } catch (error) {
        console.log(error)
      }
    }
    readAllFavMovies()
  
  })
// The app.listen function returns a server handle
var server = app.listen(process.env.PORT || 3000);

// We can export this server to other servers like this
module.exports = server;
