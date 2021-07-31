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

async function createJobSkill(req) {
  try {
    // Create unique id for job-skill
    let new_job_skill_id = uuidv4();

    // Get user's id
    let user_id = await query(
      SQL`SELECT user_id FROM token WHERE token = '${req.headers.authorization}';`
    );
    
    // Check to see if job-skill exists
    let jobSkill = await query(
      SQL`SELECT * 
      FROM job_skill 
      WHERE skill_id = ${req.body.skill_id} AND job_id = ${req.body.job_id};`
    );

    // If job-skill exists, return false
    if (jobSkill.length > 0) {
      return false;

    } else { // If job-skill does not exist, create job-skill
      await query(
        SQL`INSERT INTO job_skill (job_skill_id, skill_id, job_id) 
        VALUES (${new_job_skill_id}, ${req.body.skill_id}, ${req.body.job_id});`
      );
      return true;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function readJobSkill(req) {
  try {
    await query(
      SQL`SELECT * 
      FROM job_skill 
      INNER JOIN skill
      ON job_skill.skill_id = skill.skill_id
      INNER JOIN job
      ON job_skill.job_id = job.job_id
      WHERE job_skill.job_id = ${req.body.job_id};`
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function updateJobSkill(req) {
  try {
    await query(
      SQL`UPDATE job_skill
      SET
      skill_id = ${req.body.skill_id},
      job_id = ${req.body.job_id}
      WHERE job_skill_id = ${req.body.skill_id};`
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function deleteJobSkill(req) {
  try {
    await query(
      SQL`DELETE FROM job_skill 
      WHERE skill_id = ${req.body.skill_id} AND job_id = ${req.body.job_id};`
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
      if (await createJobSkill(req)) {
        return res.status(200).send();
      }
    } else if (req.body.crud == 'read') {
      if (await readJobSkill(req)) {
        //TODO: return values from database
        return res.status(200).send();
      }
    } else if (req.body.crud == 'update') {
      if (await updateJobSkill(req)) {
        return res.status(200).send();
      }
    } else if (req.body.crud == 'delete') {
      if (await deleteJobSkill(req)) {
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
