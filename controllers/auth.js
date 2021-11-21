const mysql = require('mysql')
const jwt = require('jsonwebtoken')
const pool = require('../sql/connection')
const { handleSQLError } = require('../sql/error')


const signup = (req, res) => {
  const { username, password } = req.body
  let sql = "INSERT INTO users (username, password) VALUES (?, ?)"


  
  sql = mysql.format(sql, [ username, password ])
  
  pool.query(sql, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(409).send('Username is taken')
      return handleSQLError(res, err)
    }
    return res.send('Sign-up successful')
  })
}

const login = (req, res) => {
  const { username, password } = req.body
  let sql = "SELECT * FROM users WHERE username = ? AND password = ?"
  sql = mysql.format(sql, [ username, password ])

  pool.query(sql, (err, rows) => {
    if (err) return handleSQLError(res, err)
    if (!rows.length) return res.status(404).send('No matching users')

    const data = { ...rows[0] }
    data.password = 'REDACTED'
      
    const token = jwt.sign(data, 'secret')
    res.json({
      msg: 'Login successful',
      token
    })
  })
}

module.exports = {
  signup,
  login
}