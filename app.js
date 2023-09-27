const express = require('express')
const port = 3000
const app =express()

app.get('/', (req,res) => {
res.send('hi')
})

app.listen(port, ()=> {
console.log(`express server listening on port ${port}`)
})