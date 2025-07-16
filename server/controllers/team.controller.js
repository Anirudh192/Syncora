import db from '../db.js';
import { v4 as uuidv4 } from 'uuid';

export const createTeam = async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.id;

  try {
    const teamId = uuidv4();
    await db.query('INSERT INTO teams (id, name, description) VALUES ($1, $2, $3)', [teamId, name, description]);
    await db.query(
      'INSERT INTO team_members (team_id, user_id, role) VALUES ($1, $2, $3)',
      [teamId, userId, 'owner']
    );
    res.status(201).json({ teamId, name });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create team' });
  }
};

export const inviteMember = async (req, res) => {
  const { teamId } = req.params;
  const { email, role } = req.body;

  try {
    const userData = await db.query('SELECT id FROM users WHERE email = $1',[email]);
    const userId = userData.rows[0].id;
    const nameData = await db.query('SELECT name FROM users WHERE email = $1',[email]);
    const name = nameData.rows[0].name;
    await db.query(
      'INSERT INTO team_members (team_id, user_id, role, name) VALUES ($1, $2, $3, $4)',
      [teamId, userId, role || 'member',name]
    );
    res.status(200).json({ message: 'User invited to team' });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Failed to invite member' });
  }
};

export const getTeamDetails = async (req, res) => {
  const { teamId } = req.params;

  try {
    const teamRes = await db.query('SELECT * FROM teams WHERE id = $1', [teamId]);
    const membersRes = await db.query(
      'SELECT user_id, role, name FROM team_members WHERE team_id = $1',
      [teamId]
    );
    res.status(200).json({ team: teamRes.rows[0], members: membersRes.rows });  } catch (err) {
    console.error('Error in getTeam:', err);
    res.status(500).json({ error: 'Failed to get team details' });
  }
};

export const getMyTeam = async (req, res) => {
  const userId = req.user.id;

  try {
    const teamRes = await db.query('SELECT t.* FROM teams t JOIN team_members tm ON tm.team_id = t.id WHERE tm.user_id = $1', [userId]);

    res.status(200).json( {teams : teamRes.rows} );
  } catch (error) {
    console.error('Error in getMyTeam:', error);
    res.status(500).json({ error: 'Failed to get all the teams list for current user' });
  }
}