import React from 'react';

const TaskColumn = ({ title, tasks, onDragStart, onDragOver, onDrop, onDelete, onEdit, onView }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md w-80 flex-shrink-0"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, title)}
    >
      <h2 className="text-xl font-semibold text-white bg-blue-500 p-4 rounded-t-lg">{title}</h2>
      <div className="p-4">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className="bg-blue-100 p-4 mb-4 rounded-lg"
            draggable
            onDragStart={(e) => onDragStart(e, task._id)}
          >
            <h3 className="text-lg font-medium text-blue-800">{task.title}</h3>
            <p className="text-blue-600 mb-2">{task.description}</p>
            <p className="text-sm text-blue-500 mb-2">Created at: {task.createdAt}</p>
            <div className="flex justify-end space-x-2">
              <button onClick={() => onDelete(task._id)} className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                Delete
              </button>
              <button onClick={() => onEdit(task)} className="bg-yellow-500 text-white px-2 py-1 rounded text-sm">
                Edit
              </button>
              <button onClick={() => onView(task)} className="bg-green-500 text-white px-2 py-1 rounded text-sm">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskColumn;
