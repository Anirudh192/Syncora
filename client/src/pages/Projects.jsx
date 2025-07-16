import { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";

export default function ProjectPage() {
  const { token } = useAuthStore();
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const BASE_API_URL = "http://localhost:3000";

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        BASE_API_URL + `/api/projects/${selectedTeamId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProjects(res.data);
    } catch (err) {
      console.error("Failed to fetch projects", err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get(BASE_API_URL + "/api/teams/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeams(res.data.teams);
      } catch (err) {
        console.error("Failed to fetch teams", err);
      }
    };
    fetchTeams();
  }, [token]);

  useEffect(() => {
    if (!selectedTeamId) return;
    fetchProjects();
  }, [selectedTeamId, token]);

  const handleDelete = async (projectId) => {
    try {
      await axios.delete(BASE_API_URL + `/api/projects/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (err) {
      console.error("Failed to delete project", err);
      alert("Failed to delete project. Please try again.");
    }
  };

  const handleCreate = async () => {
    if (!newProjectName.trim()) return alert("Enter project name");
    await axios.post(
      BASE_API_URL + `/api/projects/create/${selectedTeamId}`,
      {
        title: newProjectName,
        description: newProjectDesc,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setNewProjectName("");
    setNewProjectDesc("");
    fetchProjects();
  };  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Projects
        </h2>
        <select
          value={selectedTeamId}
          onChange={(e) => setSelectedTeamId(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-64"
        >
          <option value="">Select a team</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>

      {selectedTeamId && (
        <div className="space-y-4 p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Create New Project
          </h2>
          <input
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Project name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <textarea
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="3"
            placeholder="Project description"
            value={newProjectDesc}
            onChange={(e) => setNewProjectDesc(e.target.value)}
          />
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
          >
            + Create Project
          </button>
        </div>
      )}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            Loading projects...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
          {Array.isArray(projects) &&
            projects.map((project) => (
              <div
                key={project.id}
                className="p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
              >                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 break-words">
                  {project.description || "No description available"}
                </p>
                <div className="flex gap-2 mt-auto">
                  <button
                    className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex-1"
                    onClick={() => {
                      /* Navigate to project details */
                    }}
                  >
                    View
                  </button>
                  <button
                    className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 flex-1"
                    onClick={() => handleDelete(project.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          {Array.isArray(projects) && projects.length === 0 && (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No projects found for this team.
              </p>
            </div>
          )}        </div>
      )}
      </div>
    </div>
  );
}
