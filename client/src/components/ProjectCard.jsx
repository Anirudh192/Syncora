import React from 'react';

const ProjectCard = ({ project, onDelete }) => {
  const totalTasks = project.tasks?.length || 0;
  const pendingTasks = project.tasks?.filter((task) => task.status !== 'done').length || 0;

  return (
    <div className="bg-white rounded-2xl shadow p-4 w-full max-w-md">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{project.name}</h2>
        <button
          onClick={() => onDelete(project.id)}
          className="text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>
      <p className="text-gray-600">{project.description}</p>
      <div className="text-sm text-gray-500 mt-2">
        Team: <span className="font-medium">{project.team?.name || '—'}</span><br />
        Total Tasks: <span className="font-medium">{totalTasks}</span><br />
        Pending Tasks: <span className="font-medium">{pendingTasks}</span>
      </div>
    </div>
  );
};

export default ProjectCard;