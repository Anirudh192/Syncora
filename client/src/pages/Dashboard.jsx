import useAuthStore  from '../store/authStore.js';
import { Trash2 } from 'lucide-react'; 
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'Project Alpha',
      tasksPending: 5,
      progress: 40,
    },
    {
      id: 2,
      title: 'Beta Launch',
      tasksPending: 2,
      progress: 70,
    },
    {
      id: 3,
      title: 'Gamma Redesign',
      tasksPending: 7,
      progress: 20,
    },
    {
      id: 4,
      title: 'Delta Expansion',
      tasksPending: 0,
      progress: 100,
    },
  ]);

  const handleDelete = (id) => {
    setProjects(projects.filter((project) => project.id !== id));
  };

  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-xl text-gray-700">Please log in to view your dashboard.</p>
      </div>
    );
  }
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Your Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{project.title}</h2>
              <button
                onClick={() => handleDelete(project.id)}
                className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">
                {project.progress}% complete
              </p>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {project.tasksPending} task(s) pending
            </p>

            <Link
              to="/tasks"
              className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
            >
              View Tasks →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
