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
        result = await createJob(req);
        break;
      case "read":
        result = await readJob(req);
        break;
      case "readAll":
        result = await readAllJobs(req);
        break;
      case "update":
        await updateJob(req);
        break;
      case "delete":
        await deleteJob(req);
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

const createJob = async (req) => {
  // Create unique id for job
  let new_job_id = uuidv4();

  // Get user ID from token
  let user_id = await query(
    SQL`SELECT user_id FROM token WHERE token = ${req.headers.authorization};`
  );
  user_id = user_id[0].user_id;

  // Create Job
  await query(
    SQL`
       INSERT INTO job (job_id, company_id, user_id, job_title, availability, application_status, type)
       VALUES (${new_job_id}, ${req.body.company_id}, ${user_id}, ${req.body.job_title}, ${req.body.availability}, ${req.body.application_status}, ${req.body.type});`
  );
  return true;
};

const readJob = async (req) => {
  // Get user ID from token
  let user_id = await query(
    SQL`SELECT user_id FROM token WHERE token = ${req.headers.authorization};`
  );
  user_id = user_id[0].user_id;

  // Read and return job
  let results = await query(
    SQL`SELECT * 
        FROM job 
        LEFT JOIN company
        ON job.company_id = company.company_id
        WHERE job_id = ${req.body.job_id}
        AND job.user_id = ${user_id};`
  );
  return results[0];
};

const readAllJobs = async (req) => {
  // Get user ID from token
  let user_id = await query(
    SQL`SELECT user_id FROM token WHERE token = ${req.headers.authorization};`
  );
  user_id = user_id[0].user_id;

  // Read and return jobs
  let results = await query(
    SQL`SELECT * 
          FROM job 
          LEFT JOIN company ON job.company_id = company.company_id
          WHERE job.user_id = ${user_id};`
  );
  return results;
};

const updateJob = async (req) => {
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
};

const deleteJob = async (req) => {
  await query(SQL`DELETE FROM job WHERE job_id = ${req.body.job_id};`);
};
