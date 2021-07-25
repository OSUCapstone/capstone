const SQL = require("sql-template-strings");
const mysql = require("serverless-mysql");
const { v4: uuidv4 } = require("uuid");

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
    // Create unique id for company
    let newCompanyId = uuidv4();

    // Check to see if company exists
    let company = await query(
      SQL`SELECT * FROM company WHERE company_name = ${req.body.company} AND user_id = ${req.body.userId};`
    );

    // If company is taken, return 400 status code
    if (company.length) {
      console.log(`FOUR`);
      return res.status(409).send();

    // If not, create new account in company table
    } else {          
      await query(
        SQL`INSERT INTO company (company_id, company_name, user_id) VALUES (${newCompanyId}, ${req.body.company}, ${req.body.userId});`
      );
      return res.status(200).send();
    }
  } catch (err) {
    console.log(err);
    return res.status(503).send();
  }
};
  