const express = require('express')
const port = 3000
const app =express()
const { engine }   = require('express-handlebars');

app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(express.static('./public'))
const restaurants = require('./public/jsons/restaurant.json').results

app.get('/', (req,res) => {
res.render('index',{restaurants})
})

app.get('/restaurants/:id', (req,res) => {
  const id = req.params.id
  const restaurant= restaurants.find( element => element.id.toString() === id)
res.render('detail',{restaurant})
})

app.get('/search', (req, res) => {
  const searchTerm = req.query.keyword.trim().toLowerCase(); 
  const restaurantsFiltered = restaurants.filter(element => 
    element.category.toLowerCase().includes(searchTerm) || element.name.toLowerCase().includes(searchTerm) )

  if (restaurantsFiltered.length === 0) {
    res.render('notfound');
  }
  else {
    res.render('index',{restaurants:restaurantsFiltered});
  }
  
});

app.listen(port, ()=> {
console.log(`express server listening on port ${port}`)
})