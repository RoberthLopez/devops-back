// Get our dependencies
const express = require('express')
const app = express()
const mysql = require('mysql')
const util = require('util')

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'applicationuser',
  password: process.env.DB_PASS || 'applicationuser',
  database: process.env.DB_NAME || 'movie_db'
})
pool.query = util.promisify(pool.query)

app.get('/health', async function (req, res) {
  try {
    // Perform a simple query to test database connection
    await pool.query('SELECT 1');
    
    // If the query is successful, return a 200 status with a health check message
    res.status(200).send({status: 'healthy', message: 'Service is up and database connection is healthy'});
  } catch (err) {
    // If there is an error, return a 500 status with an error message
    console.error('Health Check Error:', err);
    res.status(500).send({status: 'unhealthy', message: 'Service is down or database connection failed'});
  }
});


// Implement the movies API endpoint
app.get('/movies', async function (req, res) {
  try {
    const rows = await pool.query(
      'select m.title, m.release_year, m.score, r.name as reviewer, p.name as publication from movies m,' +
      'reviewers r, publications p where r.publication=p.name and m.reviewer=r.name'
    )
    res.json(rows)
  } catch (err) {
    console.error('API Error:', err)
    res.status(500).send({'msg': 'Internal server error'})
  }
})

app.get('/reviewers', async function (req, res) {
  try {
    const rows = await pool.query('select r.name, r.publication, r.avatar from reviewers r')
    res.json(rows)
  } catch (err) {
    console.error('API Error:', err)
    res.staus(500).send({'msg': 'Internal server error'})
  }
})

app.get('/publications', async function (req, res) {
  try {
    const rows = await pool.query('select r.name, r.publication, r.avatar from reviewers r')
    res.json(rows)
  } catch (err) {
    console.error('API Error:', err)
    res.staus(500).send({'msg': 'Internal server error'})
  }
})

app.get('/pending', async function (req, res) {
  try {
    const rows = await pool.query(
      'select m.title, m.release, m.score, r.name as reviewer, p.name as publication' +
      'from movie_db.movies m, movie_db.reviewers r, movie_db.publications p where' +
      'r.publication=p.name and m.reviewer=r.name and m.release>=2017'
    )
    res.json(rows)
  } catch (err) {
    console.error('API Error:', err)
    res.staus(500).send({'msg': 'Internal server error'})
  }
})

app.get('/', function (req, res) {
  res.status(200).send({'service_status': 'Up'})
})

console.log('server listening through port: ' + process.env.PORT)
app.listen(process.env.PORT || 3000)
module.exports = app
