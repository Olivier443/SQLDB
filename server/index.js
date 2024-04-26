const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();

app.use(bodyParser.json());


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'TYPE YOUR MYSQL USER',
  password: 'TYPE YOUR MYSQL PASSWORD',
  database: 'sakila'
});

connection.connect();

app.get('/data', (req, res) => {
  connection.query('SELECT * FROM film', (error, results, fields) => {
    if (error) throw error;
    res.json(results);
  });
});

const queryTitleActor =
  `
    SELECT film_actor.actor_id, film_actor.film_id, actor.first_name, actor.last_name, film.title, film.description, film.release_year, film.length FROM film_actor
    INNER JOIN actor
    ON actor.actor_id= film_actor.actor_id
    INNER JOIN film
    ON film.film_id = film_actor.film_id
    WHERE film.title = ? AND actor.last_name LIKE ?
    GROUP BY film.title, film_actor.actor_id, film_actor.film_id, actor.first_name, actor.last_name, film.description, film.release_year, film.length
    `;

const queryRatingList =
  `
    SELECT DISTINCT(rating) FROM film;
`

app.get('/titleinfo/:title', (req, res) => {
  const { title } = req.params;

  connection.query(queryTitleActor, [title, '%A%'], (error, results, fields) => {
    if (error) throw error;
    res.json(results);
  });
});

{/* Get list of the ratings available in the movie list */ }
app.get('/ratinglist', (req, res) => {
  connection.query(queryRatingList, (error, results, fields) => {
    if (error) throw error;
    res.json(results);
  });
});

{/* Get list of films for a specific rating */ }
app.get('/datalist/rating/:buttonRatingValue', (req, res) => {
  const { buttonRatingValue } = req.params;

  let queryRatingFilmList =
    `
    SELECT title FROM film
    WHERE rating = ?;
    `

  connection.query(queryRatingFilmList, [buttonRatingValue], (error, results, fields) => {
    if (error) {
      console.log('An error occurred while executing the query.', error);
      return;
    }

    console.log('Query executed successfully. Results:', results);
    res.json(results);

  });
});


app.listen(5000, () => {
  console.log('Server is running on port 5000');
});