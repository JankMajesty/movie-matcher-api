const mysql = require('mysql')
const pool = require('../sql/connection')
const { handleSQLError } = require('../sql/error')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const jwtSecret = "secret5";

const getAllUsers = (req, res) => {
  pool.query("SELECT * FROM users", (err, rows) => {
    if (err) return handleSQLError(res, err)
    return res.json(rows);
  })
}

const getUserById = (req, res) => {
  let sql = "SELECT * FROM users WHERE id = ?"
  sql = mysql.format(sql, [ req.params.id ])

  pool.query(sql, (err, rows) => {
    if (err) return handleSQLError(res, err)
    return res.json(rows);
  })
}

const createUser = (req, res) => {
  const { username, password } = req.body
  let sql = "INSERT INTO users (username, password) VALUES (?, ?)"
  sql = mysql.format(sql, [ username, password ])

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.json({ newId: results.insertId });
  })
}

const loginUser = (req, res) => {
  const { username, password } = req.body
  let sql = "SELECT id, username, password FROM users WHERE username = ?;"
  sql = mysql.format(sql, [ username ])
  
  pool.query(sql, (err, results) => {
    let goodPassword
    if (err) { 
      return handleSQLError(res, err)
    }
    
    // if(results.length > 1){
    //   console.error("Error, too many results with the same username" + username)
    // };
    if(results.length == 0)(
      console.error("Did not find a row with the username " + username)
    )
    if(!err && results.length == 1){
      console.log('row password results before password hash compare: ' + results[0].password)
      
      let hash = results[0].password
      
      // goodPassword = bcrypt.compareSync(password, hash)
      goodPassword = password == results[0].password ? true : false;
      console.log(password)
      console.log(results[0].password)
      console.log(`this is the result of the 'good password': ` + goodPassword)
    }
    
    if(goodPassword){
      // set the jwt id equal to the user_id that has been found in the database
      const id = results[0].id
      const first_name = results[0].first_name
      const unsignedToken = {
        username: username,
        id: id
      }
      const accessToken = jwt.sign(unsignedToken, jwtSecret) //string
      res.cookie('our_token', accessToken, {httpOnly: true, sameSite: false})
      return res.json( { accessToken, username, id} );
    } else {
      res.status(401).send("username and/or Password are incorrect")
    }
  })

}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  loginUser
}