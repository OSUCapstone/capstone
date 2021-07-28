const SQL = require("sql-template-strings");
const mysql = require("serverless-mysql");

// Initialize the database.
const db = mysql({
  config: {
    host: "34.74.53.112",
    user: "root",
    password: "jobtracker",
    database: "test",
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
    // Get user's id
    let result = await query(
      SQL`SELECT user_id FROM token WHERE token = '${req.headers.authorization}';`
    );

    // If token is valid
    if (result[0]) {
      return res.status(200).send(result[0].user_id);

      // If not, return unauthorized error
    } else {
      return res.status(401).send();
    }
  } catch (err) {
    console.log(err);
    return res.status(503).send();
  }
};
