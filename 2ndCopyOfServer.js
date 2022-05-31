// This copy of server.js was with the split-schema model between User Schema and Exercise Schema
// I refactored to a single Schema for users with a built-it array of exercises for the log - see final version


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

//mongoose.set('useFindAndModify', false);

mongoose.connect(`mongodb+srv://${user}:${password}@${server}`, { useNewUrlParser: true, useUnifiedTopology: true })
        .then( () => console.log("MongoDB Connected..."))
        .catch(err => console.log(err))

const Schema = mongoose.Schema

const UserSchema = new Schema({
  "username": { type: String, required: true }
})

const ExerciseUser = new mongoose.model('ExerciseUser', UserSchema)

const ExerciseSchema = new Schema({
  //"userid": {type: Schema.Types.ObjectId, ref: 'ExerciseUser', required: true },
  "username": {type: String },
  "description": {type: String, required: true },
  "duration": {type: Number, required: true },
  "date": {type: Date }
})

const ExerciseActivity = mongoose.model('ExerciseActivity', ExerciseSchema)

app.post('/api/users', async (req, res) => {
  try {
    console.log('Username: ' + req.body.username)
    const current = await ExerciseUser.findOne({username: req.body.username})
    if (current) {
      console.log('User already exists')
      return res.json({
        "username": current.username,
        "_id": current._id
      })
    } else {
        const newUser = new ExerciseUser({
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
    const find = await ExerciseUser.find()
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

app.post('/api/users/:_id/exercises', async (req, res) => {
  let date = req.body.date
  if (!date) { 
    let newToday = new Date()
    let newText = newToday
    console.log(newText)
    date = newText
  } else {
    let secondDate = new Date(req.body.date)
    let secondText = secondDate
    console.log(secondText)
    date = secondText 
  }

  try {
    console.log(req.params._id)
    console.log(req.body.description)
    console.log(req.body.duration)
    console.log(date)

    // If the following line fails (i.e. input is not a valid user) then the try block fails and it errors
    const findResults = await ExerciseUser.findById(req.params._id)
    console.log('findResults is: ' + findResults) 

    const newExercise = new ExerciseActivity({
      username: findResults.username,
      description: req.body.description,
      duration: Number(req.body.duration),
      date: date
    })
    //console.log("new exercise activity is: " + newExercise)
    await newExercise.save()
    console.log("new exercise activity is: " + newExercise)
    
    console.log(findResults._id)
    console.log(findResults.username)
    console.log(newExercise.date)
    console.log(newExercise.duration)
    console.log(typeof(+newExercise.duration))
    console.log(newExercise.description)

    return res.json({
      _id: findResults._id,
      username: findResults.username,
      date: newExercise.date.toDateString(),
      duration: newExercise.duration,
      description: newExercise.description
    })

  } catch (err) {
    console.log('Error - catch block')
    res.json({
      error: 'invalid input'
    })
  }
})

app.get('/api/users/:_id/logs', async (req, res) => {
  try {
    console.log('body id is: ' + req.params._id)
    console.log('from is: ' + req.query['from'])
    //console.log('from type is: ' + typeof(req.query['from']))
    console.log('to is: ' + req.query['to'])
    console.log('limit is: ' + req.query['limit'])
    console.log('limit type is: ' + typeof(req.query['limit']))
    let newLimit = 0;
    if (req.query['limit']) {
      newLimit = parseInt(req.query['limit'])
    } else {
      newLimit = 999999999999;
    }
    console.log('newLimit is:' + newLimit)
    console.log('newLimit type is: ' + typeof(newLimit))

    // If the following line fails (i.e. input is not a valid user) then the try block fails and it errors
    const findUser = await ExerciseUser.findById(req.params._id)
    console.log('findUser is: ' + findUser)
    console.log('line 181')
    console.log('findUser.username is: ' + findUser.username)
    console.log('line 183')

    //const idWeAreLookingFor = req.params._id
    //console.log('idWeAreLookingFor is: ' + idWeAreLookingFor)
    console.log('req.params._id: ' + req.params._id)

    const newArray = []

    //console.log(`ObjectId("${idWeAreLookingFor}")`)

    // "username": 'ObjectId("61f1cd22ec7c0e9258006c15")'
    //let findExercises = await ExerciseActivity.findById("61f691a53f6f49649bf14b45")
    //let findExercises = await ExerciseActivity.find({"username": "61f1cd22ec7c0e9258006c15"})

    /*
    let fromDate = ''
    if (req.query['from']) {
      fromDate = req.query['from']
    }
    */
      console.log("line 203")
      // if "from" then drop any dates before the "from" date
      let from = req.query['from']
      let numFrom = 0
      if (req.query['from']) {
        from = new Date(from)
        numFrom = Date.parse(from)
      } else {
        from = new Date("1970-01-01")
        numFrom = Date.parse(from)
      }
      
      // if "to" then drop any dates after the "to" date
      let to = req.query['to']
      let numTo = 0
      if (req.query['to']) {
        to = new Date(to)
        numTo = Date.parse(to)
      } else {
        to = new Date("2022-01-01")
        numTo = Date.parse(to)
        console.log("to is : " + to)
        console.log("Typeof to is: " + typeof(to))
      }
      
      console.log('from and to are: ' + from + ' ' + to)
      console.log('numFrom and numTo are: ' + numFrom + ' ' + numTo)
    
    let findExercises = await ExerciseActivity.
      find({
        /*
        $expr: {
          $and: [
            {
              username: findUser.username
            }, {
              $gte: [
                {
                  $toDate: "$date"
                },
                from
              ]
            }
            
          ]
        }
         //username: findUser.username
        */

      })
        
//        {
        //"username": findUser.username,
        /*
        "date": { 
          $gt: from
          //$lt: to
          }
        */
      //})
      
      .where('username').equals(findUser.username)
      //.where('log.date').gte(from)
      //.where('log.date').gte(numFrom).lte(numTo)
      .limit(newLimit)
      //.sort({ "date": 1 })
      //.where('log.date').gte(from)
      //.limit(newLimit)
      //.where(findUser.date).gte(from)
      //.where(Date.parse('date')).lte(numTo)
      //.exec()
      
    .then(activities => { 
      console.log("confirmation: success")
      console.log(activities)

      let betterResult = activities.filter(x => 
          x.date >= from && x.date <= to                                
        )

      console.log('betterResult at stage 1 is: ' + betterResult)

      /*
      let helloResult = betterResult.map(x =>
        "description: " + x.description + ", duration: " + x.duration + ", date: " + x.date.toDateString()
      )
      
      
      console.log('helloResult is: ' + helloResult)
      */

      let newerResult = betterResult.map(x => {
        let y = {
          description: x.description,
          duration: Number(x.duration),
          date: x.date.toDateString()
        }
        return y
      })

     console.log('betterResult at stage 1.5 is: ' + betterResult)
      
      console.log('newerResult is: ' + JSON.stringify(newerResult))

      /*
      let noResult = betterResult

      activities.forEach(element => {
        element.date = date.toDateString()
      })
      
      console.log('new activities is: ' + (activities))
      */


      /*
      let finalResult = []
      
      betterResult.forEach(x =>
        finalResult.push({
          description: x.description,
          duration: x.duration,
          date: x.date.toDateString()
        })
        )

      console.log('finalResult: ' + finalResult)
      */

      /*
      let newestResult = JSON.stringify(betterResult)
      console.log('newestResult: ' + newestResult)
      */

      /*
      exerciseLog = exerciseLog.map(x => "description: " + x.description + ", duration: " + x.duration + ", date: " + x.date.toLocaleDateString());
    */

      res.json({
        username: findUser.username,
        count: betterResult.length,
        _id: req.params._id,
        log: betterResult //newerResult
      })
    })
    .catch(err => {
      res.json({
        confirmation: 'fail',
        message: err.message
      })
    })
    //console.log('findExercises is: ' + findExercises)

    // https://mongoosejs.com/docs/queries.html - later can do limit and sort on the find operation

    /*
    res.json({
      username: findUser.username,
      count: 1,
      _id: findUser._id,
      log: 2
    })
    */

  } catch (err) {
    console.log('Error - catch block')
    res.json({
      error: 'invalid input'
    })
  }
})
