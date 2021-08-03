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

async function createCompany(req) {
  try {
    // Create unique id for company
    let new_company_id = uuidv4();

    // Get user's id
    let user_id = await query(
      SQL`SELECT user_id FROM token WHERE token = ${req.headers.authorization};`
    );

    // Check for valid user id
    if (user_id && user_id.length > 0) {
      // Extract id from response body
      user_id = user_id[0].user_id;

      // Check to see if company exists
      let company = await query(
        SQL`SELECT * 
        FROM company 
        WHERE company_name = ${req.body.company_name} AND user_id = ${user_id};`
      );
        
      // If company exists, return false
      if (company && company.length > 0) {
        console.log('Company exists!');
        return false;
      } else { // If company does not exist, create company
        await query(
          SQL`INSERT INTO company (company_id, company_name, user_id) 
          VALUES (${new_company_id}, ${req.body.company_name}, ${user_id});`
        );
        return true;
      }
    } else {
      console.log('user_id in createCompany() is invalid');
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function readAllCompanies(req) {
  try {
    // Get user's id
    let user_id = await query(
      SQL`SELECT user_id FROM token WHERE token = ${req.headers.authorization};`
    );

    // Check for valid user id
    if (user_id && user_id.length > 0) {
      // Extract id from response body
      user_id = user_id[0].user_id;

      // Get all companies for this user
      return await query(
        SQL`SELECT * FROM company WHERE user_id = ${user_id};`
      );
    } else {
      console.log('user_id in readAllCompanies() is invalid');
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function readCompany(req) {
  try {
    await query(
      SQL`SELECT * 
      FROM company 
      LEFT JOIN contact
      ON company.company_id = contact.company_id
      WHERE company.company_id = ${req.body.company_id};`
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function updateCompany(req) {
  try {
    await query(
      SQL`UPDATE company
      SET
      company_name = ${req.body.company_name}
      WHERE company_id = ${req.body.company_id};`
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function deleteCompany(req) {
  try {
    await query(
      SQL`DELETE FROM company 
      WHERE company_id = ${req.body.company_id};`
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

module.exports = async (req, res) => {
  try {
    if (req.body.crud == 'create') {
      if (await createCompany(req)) {
        return res.status(200).send(true);
      } else {
        // Server conflict, token invalid or company exists
        return res.status(409).send(false);
      }
    } else if (req.body.crud == 'read_all') {
      let response = await readAllCompanies(req);
      if (response != false) {
        return res.status(200).send(response);
      } else {
        // Server conflict
        return res.status(409).send(false);
      }
    } else if (req.body.crud == 'read') {
      if (await readCompany(req)) {
        //TODO: return values from database
        return res.status(200).send();
      }
    } else if (req.body.crud == 'update') {
      if (await updateCompany(req)) {
        return res.status(200).send();
      }
    } else if (req.body.crud == 'delete') {
      if (await deleteCompany(req)) {
        return res.status(200).send();
      }
    }

    // None of the available routes executed
    return res.status(501).send();

  }  catch (err) {
    console.log(err);
    return res.status(503).send();
  }
};
