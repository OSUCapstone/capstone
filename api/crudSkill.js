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
        result = await createSkill(req);
        break;
      case "read":
        result = await readSkill(req);
        break;
      case "readAll":
        result = await readAllSkills(req);
        break;
      case "update":
        await updateSkill(req);
        break;
      case "delete":
        await deleteSkill(req);
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

const createSkill = async (req) => {
  // Create unique id for skill
  let new_skill_id = uuidv4();

  // Get user ID from token
  let user_id = await query(
    SQL`SELECT user_id FROM token WHERE token = ${req.headers.authorization};`
  );
  user_id = user_id[0].user_id;

  // Check to see if skill exists
  let skill = await query(
    SQL`SELECT * FROM skill WHERE skill_name = ${req.body.skill_name} AND user_id = ${user_id};`
  );

  // If skill does not exist, create it
  if (!skill || skill.length == 0) {
    await query(
      SQL`INSERT INTO skill (skill_id, skill_name, user_id, proficiency) VALUES 
          (${new_skill_id}, ${req.body.skill_name}, ${user_id}, ${req.body.proficiency});`
    );
    return true;
  } else {
    return false;
  }
};

const readSkill = async (req) => {
  // Read and return skill
  let results = await query(
    SQL`SELECT * FROM skill WHERE skill_id = ${req.body.skill_id};`
  );
  return results[0];
};

const readAllSkills = async (req) => {
  // Get user ID from token
  let user_id = await query(
    SQL`SELECT user_id FROM token WHERE token = ${req.headers.authorization};`
  );
  user_id = user_id[0].user_id;

  // Read skills
  let skills = await query(
    SQL`SELECT * FROM skill WHERE user_id = ${user_id};`
  );

  // Read job_skills
  let jobSkills = await query(SQL`SELECT * FROM job_skill;`);

  // Convert job_skills list to object
  let jobSkillsObject = {};
  jobSkills.forEach((jobSkill) => {
    let val = JSON.parse(JSON.stringify(jobSkill));
    if (jobSkill.skill_id in jobSkillsObject) {
      jobSkillsObject[jobSkill.skill_id].push(val);
    } else {
      jobSkillsObject[jobSkill.skill_id] = [val];
    }
  });

  // Add job skills to skills list
  skills = skills.map((skill) => {
    let skillObject = {
      ...skill,
      jobs: [],
    };

    if (skill.skill_id in jobSkillsObject) {
      skillObject.jobs = jobSkillsObject[skill.skill_id];
    }

    return skillObject;
  });

  return skills;
};

const updateSkill = async (req) => {
  await query(
    SQL`UPDATE skill
        SET
        skill_name = ${req.body.skill_name},
        proficiency = ${req.body.proficiency}
        WHERE skill_id = ${req.body.skill_id};`
  );
};

const deleteSkill = async (req) => {
  await query(SQL`DELETE FROM skill WHERE skill_id = ${req.body.skill_id};`);
};
