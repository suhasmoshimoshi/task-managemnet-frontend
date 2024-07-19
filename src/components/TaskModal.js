import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const TaskModal = ({ show, onClose, task, onSave, readOnly }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');

  useEffect(() => {
    if (show) {
      if (task) {
        setTitle(task.title);
        setDescription(task.description);
        setStatus(task.status || 'To Do');
      } else {
        setTitle('');
        setDescription('');
        setStatus('To Do');
      }
    }
  }, [task, show]);

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    onSave({ ...task, title, description, status });
    clearForm();
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setStatus('To Do');
  };

  const handleClose = () => {
    clearForm();
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg flex justify-between items-center">
          <h2 className="text-2xl font-semibold">{readOnly ? 'Task Details' : (task ? 'Edit Task' : 'Add Task')}</h2>
          <button onClick={handleClose} className="text-white hover:text-gray-200 text-3xl font-bold">&times;</button>
        </div>
        <div className="px-6 py-6 text-black">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={readOnly}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
              placeholder="Enter task title"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={readOnly}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out h-32 resize-none"
              placeholder="Enter task description"
            ></textarea>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={readOnly}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <button 
              onClick={handleClose} 
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Close
            </button>
            {!readOnly && (
              <button 
                onClick={handleSave} 
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;