const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const restaurantList = require('../../restaurant.json').results

mongoose.connect('mongodb://localhost/restaurant_list')

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('restaurantSeeder is running.')
  Restaurant.create(restaurantList)
    .then(() => {
      console.log('restaurantSeeder is done')
      db.close()
    })
    .catch(error => console.log(error))
})

