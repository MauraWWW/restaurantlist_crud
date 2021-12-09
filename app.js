// include express
const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurant')
const restaurantList = require('./restaurant.json')
const port = 3000

mongoose.connect('mongodb://localhost/restaurant_list')

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

// request and response 
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

app.get('/search', (req, res) => {
  if (!req.query.keywords) {
    return res.redirect('/')
  }
  const keywords = req.query.keywords
  const normalizedKeyword = req.query.keywords.trim().replace(/ /g, '').toLowerCase()
  Restaurant.find({})
    .lean()
    .then(restaurants => {
      const filteredRestaurants = restaurants.filter(restaurant => {
       return restaurant.name.trim().replace(/ /g, '').toLowerCase().includes(normalizedKeyword) || restaurant.category.includes(normalizedKeyword)
      }) 
      res.render('index', { restaurants: filteredRestaurants, keywords })
    })
    .catch(error => console.log(error))
})

app.get('/restaurants/:restaurant_id/edit', (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

app.post('/restaurants/:restaurant_id/edit', (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findByIdAndUpdate(id, req.body)
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

app.post('/restaurants', (req, res) => {
  const newRestaurant = req.body
  Restaurant.create(newRestaurant)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.post('/restaurants/:restaurant_id/delete', (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findByIdAndDelete(id)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// start and listen
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})