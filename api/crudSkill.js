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

async function createSkill(req) {
  try {
    // Create unique id for skill
    let new_skill_id = uuidv4();

    // Get user's id
    let user_id = await query(
      SQL`SELECT user_id FROM token WHERE token = '${req.headers.authorization}';`
    );
    
    // Check to see if skill exists
    let skill = await query(
      SQL`SELECT * FROM skill WHERE skill_name = ${req.body.skill_name} AND user_id = ${user_id};`
    );

    // If skill is taken, return false
    if (skill && skill.length > 0) {
      return false;

      // If not, create new skill in table
    } else {
      await query(
        SQL`INSERT INTO skill (skill_id, skill_name, user_id, proficiency) VALUES 
        (${new_skill_id}, ${req.body.skill_name}, ${user_id}, ${req.body.proficiency});`
      );
      return true;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function readSkill(req) {
  try {
    await query(
      SQL`SELECT * FROM skill WHERE skill_id = ${req.body.skill_id};`
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function updateSkill(req) {
  try {
    await query(
      SQL`UPDATE skill
      SET
      skill_name = ${req.body.skill_name},
      proficiency = ${req.body.proficiency}
      WHERE skill_id = ${req.body.skill_id};`
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function deleteSkill(req) {
  try {
    await query(
      SQL`DELETE FROM skill WHERE skill_id = ${req.body.skill_id};`
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
      if (await createSkill(req)) {
        return res.status(200).send();
      }
    } else if (req.body.crud == 'read') {
      if (await readSkill(req)) {
        //TODO: return values from database
        return res.status(200).send();
      }
    } else if (req.body.crud == 'update') {
      if (await updateSkill(req)) {
        return res.status(200).send();
      }
    } else if (req.body.crud == 'delete') {
      if (await deleteSkill(req)) {
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