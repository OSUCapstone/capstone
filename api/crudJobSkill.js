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
        result = await createJobSkill(req);
        break;
      case ("read"):
        result = await readJobSkill(req);
        break;
      case ("readAll"):
        result = await readAllJobSkills(req);
        break;
      case ("update"):
        await updateJobSkill(req);
        break;
      case ("delete"):
        await deleteJobSkill(req);
        break;
      default:
        break;
    }
    if (result) {
      return res.send(result);
    } else {
      return res.send();
    }
  } catch (err) {
    console.log(err);
    return res.status(503).send();
  }
};

const createJobSkill = async (req) => {
  // Create unique id for job-skill
  let new_job_skill_id = uuidv4();

  // Get user's id
  let user_id = await query(
    SQL`SELECT user_id FROM token WHERE token = '${req.headers.authorization}';`
  );
  user_id = user_id[0].user_id;
    
  // Check to see if job-skill exists
  let jobSkill = await query(
    SQL`SELECT * 
    FROM job_skill 
    WHERE skill_id = ${req.body.skill_id} AND job_id = ${req.body.job_id};`
  );

  // If job-skill does not exist, create it
  if (!jobSkill.length == 0) {
    await query(
      SQL`INSERT INTO job_skill (job_skill_id, skill_id, job_id) 
      VALUES (${new_job_skill_id}, ${req.body.skill_id}, ${req.body.job_id});`
    );
    return true;
  } else {
    return false;
  }
}; 

const readJobSkill = async (req) => {
  // Read and return job-skill
  let results = await query(
    SQL`SELECT * 
        FROM job_skill 
        INNER JOIN skill
        ON job_skill.skill_id = skill.skill_id
        INNER JOIN job
        ON job_skill.job_id = job.job_id
        WHERE job_skill.job_id = ${req.body.job_id};`
  );
  return results[0];
};

const readAllJobSkills = async (req) => {
  // Read and return job-skills
  return await query(
    SQL`SELECT * FROM job_skill 
        WWHERE skill_id = ${req.body.skill_id} && job_id = ${req.body.job_id};`
  );
}

const updateJobSkill = async (req) => {
  await query(
    SQL`UPDATE job_skill
        SET
        skill_id = ${req.body.skill_id},
        job_id = ${req.body.job_id}
        WHERE job_skill_id = ${req.body.skill_id};`
  );
};

const deleteJobSkill = async (req) => {
  await query(
    SQL`DELETE FROM job_skill 
    WHERE skill_id = ${req.body.skill_id} && job_id = ${req.body.job_id};`
  );
};

