const express = require('express')
const bodyParser = require('body-parser')
const usersRouter = require('./routers/users');
const authRouter = require('./routers/auth');
const { logger } = require('./middleware')

const app = express()
const port = process.env.PORT || 3001

app.use(bodyParser.json()) 
app.use(logger)
app.use('/users', usersRouter)
app.use('/auth', authRouter)


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})