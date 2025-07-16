import db from '../db.js';
import { v4 as uuidv4 } from 'uuid';

export const createProject = async (req, res) => {
  const { teamId } = req.params;
  const { title, description } = req.body;

  try {
    const projectId = uuidv4();
    await db.query(
      'INSERT INTO projects (id, team_id, title, description) VALUES ($1, $2, $3, $4)',
      [projectId, teamId, title, description]
    );
    res.status(201).json({ projectId, title });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project' });
  }
};

export const listProjects = async (req,res) => {
 const userId = req.user.id;

  try {
    const projectRes = await db.query('SELECT t.* FROM projects t JOIN team_members tm ON tm.team_id = t.team_id WHERE tm.user_id = $1', [userId]);

    res.status(200).json( ...projectRes.rows );
  } catch (error) {
    console.error('Error in getMyproject:', error);
    res.status(500).json({ error: 'Failed to get all the projects list for current user' });
  }   
}

export const listProjectsByTeamId = async (req,res) => {
  const userId = req.user.id;
  const { teamId } = req.params;

  try {
    const projectRes = await db.query('SELECT p.* FROM projects p JOIN team_members tm ON tm.team_id = p.team_id WHERE tm.user_id = $1 AND tm.team_id = $2',[userId, teamId]);

    res.status(200).json(projectRes.rows);
  } catch (error) {
    console.error(error)
    res.status(500).json({message: "Error in getting projects by team id"});
  }
}

export const deleteProjectByTeamId = async (req,res) => {
  const { teamId } = req.params;

  try {
    await db.query("DELETE FROM projects WHERE team_id = $1",[teamId]);
    res.status(204).json({message: "Project deleted successfully!"})
  } catch (error) {
    console.error(error);
    res.status(500).json({message: error});
  }
}

export const deleteProjectById = async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user.id;

  try {
    // First check if user has permission to delete this project
    const checkPermission = await db.query(
      'SELECT p.* FROM projects p JOIN team_members tm ON tm.team_id = p.team_id WHERE p.id = $1 AND tm.user_id = $2',
      [projectId, userId]
    );

    if (checkPermission.rows.length === 0) {
      return res.status(403).json({ error: 'You do not have permission to delete this project' });
    }

    // Delete the project
    const result = await db.query('DELETE FROM projects WHERE id = $1 RETURNING *', [projectId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json({ message: 'Project deleted successfully', project: result.rows[0] });
  } catch (error) {
    console.error('Error in deleteProjectById:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};