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

async function createContact(req) {
    try {
      // Create unique id for contact
      let new_contact_id = uuidv4();

      // Get user's id
      let user_id = await query(
        SQL`SELECT user_id FROM token WHERE token = '${req.headers.authorization}';`
      );

      // Check to see if contact exists
      let contact = await query(
        SQL`SELECT * FROM contact WHERE contact_name = $(req.body.contact);`
      );

      // If contact exists, return false
      if(contact.length > 0){
        return false;
      
      } else { // If contact does not exist, create new contact
        await query(
          SQL`
          INSERT INTO contact (contact_id, contact_name, company_id, user_id, role, email, phone_number)
          VALUES (${new_contact_id}, ${req.body.contact_name}, ${req.body.company_id}, ${user_id}, ${req.body.role}, ${req.body.email}, ${req.body.phone_number});`
        );
        return true;
      } 
    } catch (err) {
      console.log(err);
      return false;
    }
  }

async function readContact(req) {
  try {
    await query(
      SQL`SELECT * 
      FROM contact 
      LEFT JOIN company
      ON contact.company_id=company.company_id
      WHERE contact_id = ${req.body.contact_id};`
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function updateContact(req) {
  try {
    await query(
      SQL`UPDATE contact
      SET
      contact_name = ${req.body.contact_name},
      role = ${req.body.role},
      email = ${req.body.email},
      phone_number = ${req.body.phone_number}
      WHERE contact_id = ${req.body.contact_id};`
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function deleteContact(req) {
  try {
    await query(
      SQL`DELETE FROM contact WHERE contact_id = ${req.body.contact_id};`
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
      if (await createContact(req)) {
        return res.status(200).send();
      }
    } else if (req.body.crud == 'read') {
      if (await readContact(req)) {
        //TODO: return values from database
        return res.status(200).send();
      }
    } else if (req.body.crud == 'update') {
      if (await updateContact(req)) {
        return res.status(200).send();
      }
    } else if (req.body.crud == 'delete') {
      if (await deleteContact(req)) {
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
