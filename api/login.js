const SQL = require("sql-template-strings");
const mysql = require("serverless-mysql");
const { v4: uuidv4 } = require("uuid");

// Initialize the database.
const db = mysql({
  config: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

// Main helper function that forms and ends a connection to the database with
// each query.
const query = async (query) => {
  try {
    const results = await db.query(query);
    await db.end();
    return results;
  } catch (error) {
    return { error };
  }
};

module.exports = async (req, res) => {
  try {
    // Check to see if username/password are valid
    let users = await query(
      SQL`SELECT * FROM user WHERE user_name = ${req.body.username} and password = ${req.body.password};`
    );

    // If user is found, create access token and return
    if (users.length) {
      let token = uuidv4();
      let userId = users[0].user_id;

      await query(SQL`INSERT INTO token VALUES (${token}, ${userId}, NULL);`);
      return res.status(200).send(token);

      // If not, return not found status code
    } else {
      return res.status(404).send();
    }
  } catch (err) {
    console.err(err);
    return res.status(503).send();
  }
};
