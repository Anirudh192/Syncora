import db from "../db.js";

export const getAllUsers = async (req, res) => {
  try {
    const result = await db.query("SELECT id, name, email, role FROM users");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const getUserDeets = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};
