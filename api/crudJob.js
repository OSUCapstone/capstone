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

async function deleteJob(jobId) {
  try {
    await query(
      SQL`DELETE FROM job WHERE job_id = ${jobId};`
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

module.exports = async (req, res) => {
  try {
    if (req.body.type == 'delete') {
      if (await deleteJob(req.body.jobId)) {
        return res.status(200).send();
      }
    } else if (req.body.type == 'update') {
      // TODO: Implement update function
    }

    // None of the available routes executed
    return res.status(501).send();

  }  catch (err) {
    console.log(err);
    return res.status(503).send();
  }
};
