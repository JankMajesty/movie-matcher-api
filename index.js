require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const usersRouter = require('./routers/users');
const authRouter = require('./routers/auth');

const { logger } = require('./middleware');
const { config } = require('dotenv');

const app = express()
const port = process.env.PORT || 3001


app.use(bodyParser.json())
app.use(express.json())

app.use(cors())
app.use(logger)
app.use('/users', usersRouter)
app.use('/auth', authRouter)

app.post('/signup', (req, res)=> {

  const username = req.body.username
  const password = req.body.password

  db.query("INSERT INTO users (username, password) VALUES(?,?)", 
  [username, password], 
  (err, result)=> {
    console.log(err);
      }
    );
  });


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})