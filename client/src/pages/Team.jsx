import "../index.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import ManageMembersModal from "../components/ManageMembersModal";

const Team = () => {
  const BASE_API_URL = "http://localhost:3000/api/";
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const { token } = useAuthStore();
  const navigate = useNavigate();

  const fetchTeams = async () => {
    try {
      const res = await axios.get(BASE_API_URL + "teams/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTeams(res.data.teams);
    } catch (err) {
      console.error("Error fetching teams", err);
    }
  };

  const createTeam = async () => {
    try {
      await axios.post(
        BASE_API_URL + "teams/create",
        {
          name: newTeamName,
          description: newDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewTeamName("");
      setShowModal(false);
      fetchTeams();
    } catch (err) {
      console.error("Error creating team", err);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Teams
        </h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          onClick={() => setShowModal(true)}
        >
          + Create New Team
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {team.name}
            </h2>
            <div className="space-y-2">
              <div className="text-white">
                <span className="text-blue-500 underline">Description:</span>{" "}
                {team.description}
              </div>
              <button
                className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg font-medium transition-colors"
                onClick={() => setSelectedTeamId(team.id)}
              >
                Manage Members
              </button>
              <button
                className="w-full bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-2 rounded-lg font-medium transition-colors"
                onClick={() => navigate(`/teams/${team.id}/projects`)}
              >
                View Projects
              </button>
            </div>
          </div>
        ))}
      </div>{" "}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Create New Team
            </h2>
            <input
              type="text"
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Team name"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
            />
            <input
              type="text"
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
            <div className="flex justify-end space-x-3">
              <button
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg font-medium transition-colors"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                onClick={createTeam}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedTeamId && (
        <ManageMembersModal
          teamId={selectedTeamId}
          onClose={() => setSelectedTeamId(null)}
        />
      )}

    </div>
  );
};

export default Team;
