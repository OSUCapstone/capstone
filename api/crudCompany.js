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
      case "create":
        result = await createCompany(req);
        break;
      case "read":
        result = await readCompany(req);
        break;
      case "readAll":
        result = await readAllCompanies(req);
        break;
      case "update":
        await updateCompany(req);
        break;
      case "delete":
        await deleteCompany(req);
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

/* Returns true if company is created, else false */
const createCompany = async (req) => {
  // Create unique id for company
  let new_company_id = uuidv4();

  // Get user ID from token
  let user_id = await query(
    SQL`SELECT user_id FROM token WHERE token = ${req.headers.authorization};`
  );
  user_id = user_id[0].user_id;

  // Check to see if company exists
  let company = await query(
    SQL`SELECT * 
        FROM company 
        WHERE company_name = ${req.body.company_name} AND user_id = ${user_id};`
  );

  // If company does not exist, create it
  if (!company || company.length == 0) {
    await query(
      SQL`INSERT INTO company (company_id, company_name, user_id) 
          VALUES (${new_company_id}, ${req.body.company_name}, ${user_id});`
    );
    return true;
  } else {
    return false;
  }
};

const readCompany = async (req) => {
  // Read and return company
  let results = await query(
    SQL`SELECT * 
        FROM company 
        WHERE company.company_id = ${req.body.company_id};`
  );
  let company = results[0];

  // Get all jobs at company
  let companyJobs = await query(
    SQL`SELECT *
        FROM company
        LEFT JOIN job on job.company_id = company.company_id
        WHERE company.company_id = ${req.body.company_id};`
  );

  // Get all contacts at company
  let companyContacts = await query(
    SQL`SELECT *
        FROM company
        LEFT JOIN contact on contact.company_id = company.company_id
        WHERE company.company_id = ${req.body.company_id};`
  );

  return {
    company,
    jobs: companyJobs,
    contacts: companyContacts,
  };
};

const readAllCompanies = async (req) => {
  // Get user ID from token
  let user_id = await query(
    SQL`SELECT user_id FROM token WHERE token = ${req.headers.authorization};`
  );
  user_id = user_id[0].user_id;

  // Read companies
  let companies = await query(
    SQL`SELECT * FROM company WHERE user_id = ${user_id};`
  );

  // Read jobs
  let jobs = await query(SQL`SELECT * FROM job WHERE user_id = ${user_id};`);

  // Read contacts
  let contacts = await query(
    SQL`SELECT * FROM contact WHERE user_id = ${user_id};`
  );

  // Convert jobs list to object
  let jobsObject = {};
  jobs.forEach((job) => {
    let val = JSON.parse(JSON.stringify(job));
    if (job.company_id in jobsObject) {
      jobsObject[job.company_id].push(val);
    } else {
      jobsObject[job.company_id] = [val];
    }
  });

  // Convert contacts list to object
  let contactsObject = {};
  contacts.forEach((contact) => {
    let val = JSON.parse(JSON.stringify(contact));
    if (contact.company_id in contactsObject) {
      contactsObject[contact.company_id].push(val);
    } else {
      contactsObject[contact.company_id] = [val];
    }
  });

  // Add jobs and contacts to companies list
  companies = companies.map((company) => {
    let comp = {
      ...company,
      jobs: [],
      contacts: [],
    };

    if (company.company_id in jobsObject) {
      comp.jobs = jobsObject[company.company_id];
    }

    if (company.company_id in contactsObject) {
      comp.contacts = contactsObject[company.company_id];
    }

    return comp;
  });

  return companies;
};

const updateCompany = async (req) => {
  await query(
    SQL`UPDATE company
        SET
        company_name = ${req.body.company_name}
        WHERE company_id = ${req.body.company_id};`
  );
};

const deleteCompany = async (req) => {
  await query(
    SQL`DELETE FROM company WHERE company_id = ${req.body.company_id};`
  );
};
