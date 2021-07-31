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

async function createJob(req) {
  try {
    // Create unique id for job
    let new_job_id = uuidv4();

    let user_id = await query(
      SQL`SELECT user_id FROM token WHERE token = '${req.headers.authorization}';`
    )

    await query(
      SQL`
      INSERT INTO job (job_id, company_id, user_id, job_title, availability, application_status, type)
      VALUES (${new_job_id}, ${req.body.company_id}, ${user_id}, ${req.body.job_title}, ${req.body.availability}, ${req.body.application_status}, ${req.body.type});`
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function readJob(req) {
  try {
    await query(
      SQL`SELECT * 
      FROM job 
      LEFT JOIN company
      ON job.company_id = company.company_id
      WHERE job_id = ${req.body.job_id};`
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function updateJob(req) {
  try {
    await query(
      SQL`UPDATE job
      SET
      company_id = ${req.body.company_id},
      job_title = ${req.body.job_title},
      availability = ${req.body.availability},
      application_status = ${req.body.application_status},
      type = ${req.body.type}
      WHERE job_id = ${req.body.job_id};`
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function deleteJob(req) {
  try {
    await query(
      SQL`DELETE FROM job WHERE job_id = ${req.body.job_id};`
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
      if (await createJob(req.body)) {
        return res.status(200).send();
      }
    } else if (req.body.crud == 'read') {
      if (await readJob(req.body)) {
        //TODO: return values from database
        return res.status(200).send();
      }
    } else if (req.body.crud == 'update') {
      if (await updateJob(req.body)) {
        return res.status(200).send();
      }
    } else if (req.body.crud == 'delete') {
      if (await deleteJob(req.body)) {
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
