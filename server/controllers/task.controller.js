import db from '../db.js';
import { v4 as uuidv4 } from 'uuid';

export const createTask = async (req, res) => {
  const { projectId } = req.params;
  const { title, description, assignedTo } = req.body;
  
  try {
    const taskId = uuidv4();
    console.log(projectId);
    const result = await db.query(
      'INSERT INTO tasks (id, title, description, project_id, assigned_to) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [taskId, title, description || '', projectId, assignedTo || null]
      );
      
      // if (global.io) {
      //   global.io.to(projectId).emit("task_created", {[title]:title,[projectId]: projectId,[description]: description});
      //   console.log(`📡 Emitted task_created for project ${projectId}:`, result.rows[0]);
      // }
      
      res.status(201).json({ taskId, title });
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: 'Failed to create task' });
    }
};

export const getTasksByProject = async (req, res) => {
const { projectId } = req.params;

try {
  const result = await db.query(
    `SELECT 
        t.*, 
        u.name as assigned_user_name,
        u.email as assigned_user_email,
        u.avatar as assigned_user_avatar
      FROM tasks t 
      LEFT JOIN users u ON t.assigned_to = u.id 
      WHERE t.project_id = $1 
      ORDER BY t.created_at DESC`,
    [projectId]
    );
    res.status(200).json({ tasks: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get tasks' });
  }
};

export const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, assignedTo, status } = req.body;
  
  try {
    const updated_task = await db.query(
      `UPDATE tasks SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      assigned_to = COALESCE($3, assigned_to),
      status = COALESCE($4, status)
      WHERE id = $5 RETURNING *`,
      [title, description, assignedTo, status, taskId]
      );
      
      const projId = updated_task.rows[0].project_id
      
      // if (global.io) {
      //   global.io.to(projId).emit("task_updated", updated_task.rows[0]);
      //   console.log(`📡 Emitted task_updated for project ${projId}:`, updated_task.rows[0]);
      // }
      
      res.status(200).json({ message: 'Task updated' });
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: 'Failed to update task' });
    }
  };
  
export const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  
  try {
    const result = await db.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [taskId]);

    console.log(result.rows[0])

    // if (global.io && result.rows[0]) {
    //   global.io.to(result.rows[0].project_id).emit("task_deleted", result.rows[0]);
    //   console.log(`📡 Emitted task_deleted for project ${result.rows[0].project_id}:`, result.rows[0]);
    // }
    
    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

export const getTasksAssignedToMe = async (req,res) => {
  const assigned_to = req.query.assigned_to;
  
  try {
    console.log(assigned_to)
    const tasksList = await db.query('SELECT * FROM tasks WHERE assigned_to = $1', [assigned_to]);
    res.status(200).json(tasksList.rows)
  } catch(error) {
    console.error(error)
    res.status(500).json({ message: 'Error while fetching tasks assigned to user'})
  }
};