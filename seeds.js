const mysql = require("mysql");
const util = require("util");

async function main() {
  try {
    const pool = mysql.createPool({
      connectionLimit: 10,
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "applicationuser",
      password: process.env.DB_PASS || "applicationuser",
      database: process.env.DB_NAME || "movie_db",
    });
    pool.query = util.promisify(pool.query);

    // Create tables if they do not exist
    const createPublicationsTable = `
      CREATE TABLE IF NOT EXISTS publications (
        name VARCHAR(250) PRIMARY KEY,
        avatar VARCHAR(250)
      );
      `;

    const createReviewersTable = `
      CREATE TABLE IF NOT EXISTS reviewers (
        name VARCHAR(255) PRIMARY KEY,
        publication VARCHAR(250),
        avatar VARCHAR(250),
        FOREIGN KEY (publication) REFERENCES publications(name) ON DELETE CASCADE
      );
      `;

    const createMoviesTable = `
      CREATE TABLE IF NOT EXISTS movies (
        title VARCHAR(250) NOT NULL PRIMARY KEY,
        release VARCHAR(250),
        score INT,
        reviewer VARCHAR(250),
        publication VARCHAR(250),
        FOREIGN KEY (reviewer) REFERENCES reviewers(name) ON DELETE SET NULL,
        FOREIGN KEY (publication) REFERENCES publications(name) ON DELETE SET NULL
      );
      `;

    // Execute the table creation queries
    await pool.query(createPublicationsTable);
    await pool.query(createReviewersTable);
    await pool.query(createMoviesTable);

    const publicationsQuery =
      "INSERT INTO publications (name, avatar) VALUES ?";
    const publicationsValues = [
      ["The Daily Reviewer", "glyphicon-eye-open"],
      ["International Movie Critic", "glyphicon-fire"],
      ["MoviesNow", "glyphicon-time"],
      ["MyNextReview", "glyphicon-record"],
      ["Movies n' Games", "glyphicon-heart-empty"],
      ["TheOne", "glyphicon-globe"],
      ["ComicBookHero.com", "glyphicon-flash"],
    ];
    await pool.query(publicationsQuery, [publicationsValues]);

    const reviewersQuery =
      "INSERT INTO reviewers (name, publication, avatar) VALUES ?";
    const reviewersValues = [
      [
        "Robert Smith",
        "The Daily Reviewer",
        "https://www.firstbenefits.org/wp-content/uploads/2017/10/placeholder-1024x1024.png",
      ],
      [
        "Chris Harris",
        "International Movie Critic",
        "https://www.firstbenefits.org/wp-content/uploads/2017/10/placeholder-1024x1024.png",
      ],
      [
        "Janet Garcia",
        "MoviesNow",
        "https://www.firstbenefits.org/wp-content/uploads/2017/10/placeholder-1024x1024.png",
      ],
      [
        "Andrew West",
        "MyNextReview",
        "https://www.firstbenefits.org/wp-content/uploads/2017/10/placeholder-1024x1024.png",
      ],
      [
        "Mindy Lee",
        "Movies n' Games",
        "https://www.firstbenefits.org/wp-content/uploads/2017/10/placeholder-1024x1024.png",
      ],
      [
        "Martin Thomas",
        "TheOne",
        "https://www.firstbenefits.org/wp-content/uploads/2017/10/placeholder-1024x1024.png",
      ],
      [
        "Anthony Miller",
        "ComicBookHero.com",
        "https://www.firstbenefits.org/wp-content/uploads/2017/10/placeholder-1024x1024.png",
      ],
    ];
    await pool.query(reviewersQuery, [reviewersValues]);

    const moviesQuery =
      "INSERT INTO movies (title, release, score, reviewer, publication) VALUES ?";
    const moviesValues = [
      ["Suicide Squad", "2016", 8, "Robert Smith", "The Daily Reviewer"],
      [
        "Batman vs. Superman",
        "2016",
        6,
        "Chris Harris",
        "International Movie Critic",
      ],
      ["Captain America: Civil War", "2016", 9, "Janet Garcia", "MoviesNow"],
      ["Deadpool", "2016", 9, "Andrew West", "MyNextReview"],
      ["Avengers: Age of Ultron", "2015", 7, "Mindy Lee", "Movies n' Games"],
      ["Ant-Man", "2015", 8, "Martin Thomas", "TheOne"],
      [
        "Guardians of the Galaxy",
        "2014",
        10,
        "Anthony Miller",
        "ComicBookHero.com",
      ],
      ["Doctor Strange", "2016", 7, "Anthony Miller", "ComicBookHero.com"],
      [
        "Superman: Homecoming",
        "2017",
        10,
        "Chris Harris",
        "International Movie Critic",
      ],
      ["Wonder Woman", "2017", 8, "Martin Thomas", "TheOne"],
    ];
    await pool.query(moviesQuery, [moviesValues]);

    console.log("Seeds succesfully executed");
    process.exit(0);
  } catch (err) {
    console.error("Seeds file error:", err);
    process.exit(1);
  }
}

main();
