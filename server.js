// Below is code added from FreeCode Camp template
const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

// Above is code from FreeCodeCamp template

// Test endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' })
});

const mongoose = require('mongoose')

app.use(express.json())
app.use(express.urlencoded({extended: false}))

const user = process.env.user
const password = process.env.password
const server = process.env.server

mongoose.connect(`mongodb+srv://${user}:${password}@${server}`, { useNewUrlParser: true, useUnifiedTopology: true })
        .then( () => console.log("MongoDB Connected..."))
        .catch(err => console.log(err))

const Schema = mongoose.Schema

const UserSchema = new Schema({
  username: { type: String, required: true },
  log: [{description: String, duration: Number, date: Date}]
})

const User = new mongoose.model('User', UserSchema)

app.post('/api/users', async (req, res) => {
  try {
    console.log('Username: ' + req.body.username)
    const current = await User.findOne({username: req.body.username})
    if (current) {
      console.log('User already exists')
      return res.json({
        "username": current.username,
        "_id": current._id
      })
    } else {
        const newUser = new User({
          username: req.body.username
        })
        console.log("new User is: " + newUser)
        await newUser.save()
        return res.json({
          "username": newUser.username,
          "_id": newUser._id
        })
    }
  } catch (err) {
    console.log('Error - catch block')
    res.json({
      error: 'invalid user'
    })
  }
})

app.get('/api/users', async (req, res) => {
  try {
    const find = await User.find()
    let newArray = []
    for (var i = 0; i < find.length; i++) {
      newArray.push(find[i])
    }
    res.send(newArray)
  } catch (err) {
    console.log('Error - catch block')
    res.json({
      error: 'bad request'
    })
  }
})

app.post('/api/users/:_id/exercises', (req, res) => {
  let date = req.body.date
  let id = req.params._id
  let description = req.body.description
  let duration = req.body.duration || 0

  if (!date) {
    date = new Date()
  } else {
    date = new Date(req.body.date)
  }
  
  try {
    console.log(req.params._id)
    console.log(req.body.description)
    console.log(req.body.duration)
    console.log(date)

    User.findById(id, (err, user) => {
      if (err) {
        return console.log(err)
      } 
      
      console.log('user is: ' + user)
        user.log.push({
          description: req.body.description,
          duration: Number(req.body.duration),
          date: date
        })
        user.save((err, updatedUser) => {
          if (err) return console.log(err)
          res.json({
            username: user.username,
            description: req.body.description,
            duration: Number(req.body.duration),
            date: date.toDateString(),
            _id: user._id
          })
        })
    })
    
  } catch (err) {
    console.log('Error - catch block')
    res.json({
      error: 'invalid input'
    })
  }
})

app.get('/api/users/:_id/logs', (req, res) => {
  let id = req.params._id
  let from = req.query['from']
  let to = req.query['to']
  let limit = req.query['limit']
  
  try {
    console.log(req.params._id)
    console.log(req.query['from'])
    console.log(req.query['to'])
    console.log(req.query['limit'])

     // limit setup
    let limit = 0
    if (req.query['limit']) {
      limit = parseInt(req.query['limit'])
    } else {
      limit = 9999999999999
    }
    console.log(limit)
    

    User.findById(id, (err, user) => {
      if (err) {
        return console.log(err)
      } 
      
      console.log('user from database is: ' + user)

       // from and to
      let from = req.query['from']
      if (req.query['from']) {
        from = new Date(from)
      } else {
        from = new Date("1970-01-01")
      }

      let to = req.query['to']
      if (req.query['to']) {
        to = new Date(to)
      } else {
        to = new Date("2022-12-31")
      }

      console.log('from and to are: ' + from + ' ' + to)
      
      let output = user

      console.log('output stage 1 is: ' + output)
       // filter and log
      output.log = output.log.filter(x => {
        return x.date.getTime() > from && x.date.getTime() < to
      })
      console.log('output stage 2 is: ' + output)

      output.log = output.log.slice(0, limit) // this enforces the limit
      
      console.log('output stage 3 is: ' + output)

      output = output.toJSON()
      output.log.forEach(y => {
        y.date = y.date.toDateString()
      })      

      console.log('output stage 4 is: ' + output)
      
      res.json({
        username: id,
        count: output.log.length,
        _id: req.params._id,
        log: output.log
      })
    })
    
  } catch (err) {
    console.log('Error - catch block')
    res.json({
      error: 'invalid input'
    })
  }
})
