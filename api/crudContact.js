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
    let result;
    switch (req.body.crud) {
      case ("create"):
        result = await createContact(req);
        break;
      case ("read"):
        result = await readContact(req);
        break;
      case ("readAll"):
        result = await readAllContacts(req);
        break;
      case ("update"):
        await updateContact(req);
        break;
      case ("delete"):
        await deleteContact(req);
        break;
      default:
        break;
    }
    if (result) {
      res.send(result);
    } else {
      res.send();
    }
  } catch (err) {
    console.log(err);
    return res.status(503).send();
  }
};

const createContact = async (req) => {
  // Create unique id for contact
  let new_contact_id = uuidv4();

  // Get user ID from token
  let user_id = await query(
    SQL`SELECT user_id FROM token WHERE token = ${req.headers.authorization};`
  );
  user_id = user_id[0].user_id;

  // Check to see if contact exists
  let contact = await query(
    SQL`SELECT * 
        FROM contact 
        WHERE contact_name = ${req.body.contact_name} AND user_id = ${user_id};`
  );

  // If contact does not exist, create it
  if (!contact || contact.length == 0) {
    await query(
      SQL`INSERT INTO contact (
            contact_id, 
            contact_name, 
            company_id, 
            user_id,
            role, 
            email, 
            phone_number
          ) 
          VALUES (
            ${new_contact_id}, 
            ${req.body.contact_name}, 
            ${req.body.company_id}, 
            ${user_id}, 
            ${req.body.role}, 
            ${req.body.email}, 
            ${req.body.phone_number}
          );`
    );
    return true;
  } else {
    return false;
  }
}

const readContact = async (req) => {
  // Read and return contact
  let results = await query(
    SQL`SELECT * 
        FROM contact 
        LEFT JOIN company
        ON contact.company_id=company.company_id
        WHERE contact_id = ${req.body.contact_id};`
  );
  let contact = results[0];

  let contactJobs = await query(
    SQL`SELECT *
        FROM contact
        LEFT JOIN company ON contact.company_id = company.company_id
        LEFT JOIN job ON job.company_id = company.company_id
        WHERE contact_id = ${req.body.contact_id};`
  );

  return {
    contact,
    jobs: contactJobs,
  };
}

const readAllContacts = async (req) => {
  // Get user ID from token
  let user_id = await query(
    SQL`SELECT user_id FROM token WHERE token = ${req.headers.authorization};`
  );
  user_id = user_id[0].user_id;

  // Read and return contacts
  return await query(
    SQL`SELECT * FROM contact WHERE user_id = ${user_id};`
  );
};

const updateContact = async (req) => {
  await query(
    SQL`UPDATE contact
        SET
        contact_name = ${req.body.contact_name},
        role = ${req.body.role},
        email = ${req.body.email},
        phone_number = ${req.body.phone_number}
        WHERE contact_id = ${req.body.contact_id};`
  );
};

const deleteContact = async (req) => {
  await query(SQL`DELETE FROM contact WHERE contact_id = ${req.body.contact_id};`);
};
