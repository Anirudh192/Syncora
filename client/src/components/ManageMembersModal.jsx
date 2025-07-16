import { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';

export default function ManageMembersModal({ teamId, onClose }) {
  const token = useAuthStore((state) => state.token);
  const [members, setMembers] = useState([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const API_BASE_URL = 'http://localhost:3000'

  useEffect(() => {
    axios
      .get(API_BASE_URL+`/api/teams/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMembers(res.data.members))
      .catch((err) => console.error(err));
  }, [teamId, token]);

  const handleInvite = async () => {
    setError('');
    setSuccess('');
    try {
      await axios.post(
        API_BASE_URL+`/api/teams/${teamId}/invite`,
        { email, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Invitation sent!');
      setEmail('');
      setRole('member');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to invite.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Manage Team Members</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">✖</button>
        </div>

        <ul className="mb-4 space-y-2">
          {members.map((member, index) => (
            <li key={index} className="border rounded p-2">
              👤 {member.name} - <span className="italic text-sm">{member.role}</span>
            </li>
          ))}
        </ul>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          className="w-full mb-2 p-2 border rounded"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>

        <button
          onClick={handleInvite}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Invite
        </button>

        {error && <p className="text-red-600 mt-2">{error}</p>}
        {success && <p className="text-green-600 mt-2">{success}</p>}
      </div>
    </div>
  );
}
