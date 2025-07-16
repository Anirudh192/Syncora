import "../index.css";
import { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";

export default function Tasks() {
  const { token } = useAuthStore();
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [currentUserDetails, setUserDetails] = useState({});
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState("");
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const BASE_API_URL = "http://localhost:3000";

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get(BASE_API_URL + "/api/teams/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeams(res.data.teams || []);
      } catch (err) {
        console.error("Failed to fetch teams:", err);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    if (!selectedTeamId) return;

    const fetchProjects = async () => {
      try {
        const res = await axios.get(
          BASE_API_URL + `/api/projects/${selectedTeamId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    };

    fetchProjects();
  }, [selectedTeamId]);

  useEffect(() => {
    console.log(selectedTeamId);
  }, [selectedTeamId]);

  useEffect(() => {
    if (!selectedProjectId) return;

    const fetchTasks = async () => {
      try {
        const res = await axios.get(
          BASE_API_URL + `/api/tasks/project/${selectedProjectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTasks(res.data.tasks || []);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    };
    fetchTasks();
  }, [selectedProjectId]);

  const getUniqueUsers = () => {
    const users = tasks
      .filter((task) => task.assigned_user_name && task.assigned_to)
      .map((task) => ({
        id: task.assigned_to,
        name: task.assigned_user_name,
        email: task.assigned_user_email,
      }));

    const uniqueUsers = users.filter(
      (user, index, self) => index === self.findIndex((u) => u.id === user.id)
    );

    return uniqueUsers;
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!newTaskTitle.trim()) {
      return;
    }

    setIsCreatingTask(true);

    try {
      await axios.post(
        BASE_API_URL + `/api/tasks/project/${selectedProjectId}`,
        {
          title: newTaskTitle,
          description: newTaskDescription,
          assignedTo: newTaskAssignedTo || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskAssignedTo("");

      const res = await axios.get(
        BASE_API_URL + `/api/tasks/project/${selectedProjectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error("Failed to create task:", err);
    } finally {
      setIsCreatingTask(false);
    }
  };

  const handleDeleteTask = async (taskId) => {

    try {
      await axios.delete(BASE_API_URL + `/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6 pb-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tasks
        </h1>
        {/* Select Team */}
        <select
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={selectedTeamId}
          onChange={(e) => setSelectedTeamId(e.target.value)}
        >
          <option value="">Select Team</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
        {/* Select Project */}
        {selectedTeamId && (
          <select
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            <option value="">Select Project</option>
            {projects &&
              projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
          </select>
        )}
        {/* Create Task Form - Only shows when project is selected */}
        {selectedProjectId && (
          <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Create New Task
            </h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  rows="3"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter task description (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assign To
                </label>
                <select
                  value={newTaskAssignedTo}
                  onChange={(e) => setNewTaskAssignedTo(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select user (optional)</option>
                  {getUniqueUsers().map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} {user.email ? `(${user.email})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isCreatingTask}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
              >
                {isCreatingTask ? "Creating..." : "Create Task"}
              </button>
            </form>
          </div>
        )}
        {/* Tasks List */}{" "}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {task.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex-grow">
                {task.description || "No description"}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">
                <span className="font-medium">Assigned to: </span>
                <span className="font-bold underline">
                  {task.assigned_user_name || "Unassigned"}
                </span>
              </p>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="mt-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
              >
                Delete Task
              </button>
            </div>
          ))}
          {tasks.length === 0 && selectedProjectId && (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No tasks found for this project.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
