const SQL = require("sql-template-strings");
const mysql = require("serverless-mysql");
const { v4: uuidv4 } = require("uuid");

// Initialize the database.
const db = mysql({
  config: {
    host: "35.199.154.62",
    user: "admin",
    password: "njkfj4-f3j43",
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

async function createJob(vals) {
  try {
    await query(
      SQL`
      INSERT INTO job (job_id, company_id, user_id, job_title, availability, application_status, type)
      VALUES (${vals.jobId}, ${vals.companyId}, ${vals.userID}, ${vals.jobTitle}, ${vals.availability}, ${vals.applicationStatus}, ${vals.type});`
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function readJob(vals) {
  try {
    await query(
      SQL`SELECT * 
      FROM job 
      LEFT JOIN company
      ON job.company_id=company.company_id
      WHERE job_id = ${vals.jobId};`
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function updateJob(vals) {
  try {
    await query(
      SQL`UPDATE job
      SET
      company_id = ${vals.companyId},
      job_title = ${vals.jobTitle},
      availability = ${vals.availability},
      application_status = ${vals.applicationStatus},
      type = ${vals.type}
      WHERE job_id = ${vals.jobId};`
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function deleteJob(vals) {
  try {
    await query(
      SQL`DELETE FROM job WHERE job_id = ${vals.jobId};`
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

module.exports = async (req, res) => {
  try {
    if (req.body.crud == 'delete') {
      if (await deleteJob(req.body)) {
        return res.status(200).send();
      }
    } else if (req.body.crud == 'update') {
      if (await updateJob(req.body)) {
        return res.status(200).send();
      }
    } else if (req.body.crud == 'read') {
      if (await readJob(req.body)) {
        //TODO: return values from database
        return res.status(200).send();
      }
    } else if (req.body.crud == 'create') {
      if (await createJob(req.body)) {
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
