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
    }

    // None of the available routes executed
    return res.status(501).send();

  }  catch (err) {
    console.log(err);
    return res.status(503).send();
  }
};
