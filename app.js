const express = require('express')
const port = 3000
const app =express()
const { engine }   = require('express-handlebars');

app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(express.static('./public'))

app.get('/', (req,res) => {
res.render('index')
})

app.listen(port, ()=> {
console.log(`express server listening on port ${port}`)
})