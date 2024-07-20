import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import TaskColumn from '@/components/TaskColumn';
import TaskModal from '@/components/TaskModal';
import axios from 'axios';
import routes from "../routes"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const getToken = () => localStorage.getItem('token');
const getHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

const Dashboard = () => {
  const [tasks, setTasks] = useState({
    'To Do': [],
    'In Progress': [],
    'Done': [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [readOnly, setReadOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}${routes.task.getOrCreate}`, { headers: getHeaders() });
      const tasksData = response.data;
      const tasksByColumn = tasksData.reduce((acc, task) => {
        const column = task.status || 'To Do';
        if (!acc[column]) acc[column] = [];
        acc[column].push(task);
        return acc;
      }, {});

      setTasks({
        'To Do': tasksByColumn['To Do'] || [],
        'In Progress': tasksByColumn['In Progress'] || [],
        'Done': tasksByColumn['Done'] || [],
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks. Please try again.');
    }
  };

  const onDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = async (e, columnTitle) => {
    const taskId = e.dataTransfer.getData('taskId');
    
    let task;
    for (const column in tasks) {
      task = tasks[column].find(t => t._id === taskId);
      if (task) break;
    }

    if (!task) {
      console.error('Task not found');
      return;
    }

    const updatedTask = {
      ...task,
      status: columnTitle
    };

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}${routes.task.editOrDelete(taskId)}`, 
        updatedTask, 
        { headers: getHeaders() }
      );
      fetchTasks();
      toast.success('Task status updated successfully');
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status. Please try again.');
    }
  };

  const handleAddTask = () => {
    setCurrentTask(null);
    setReadOnly(false);
    setModalOpen(true);
  };

  const handleEditTask = (task) => {
    setCurrentTask(task);
    setReadOnly(false);
    setModalOpen(true);
  };

  const handleViewTask = (task) => {
    setCurrentTask(task);
    setReadOnly(true);
    setModalOpen(true);
  };

  const handleSaveTask = async (task) => {
    try {
      if (task._id) {
        // Update existing task
        await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}${routes.task.editOrDelete(task._id)}`,
          task,
          { headers: getHeaders() }
        );
        toast.success('Task updated successfully');
      } else {
        // Create new task
        const newTask = {
          ...task,
          status: task.status || 'To Do'
        };
        await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}${routes.task.getOrCreate}`,
          newTask,
          { headers: getHeaders() }
        );
        toast.success('New task created successfully');
      }
      fetchTasks();
      setModalOpen(false);
      setCurrentTask(null);
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Failed to save task. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}${routes.task.editOrDelete(taskId)}`, { headers: getHeaders() });
      fetchTasks();
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task. Please try again.');
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const sortedTasks = {};
  for (const column in tasks) {
    sortedTasks[column] = [...tasks[column]].sort((a, b) => {
      const orderFactor = sortOrder === 'asc' ? 1 : -1;
      if (a[sortBy] < b[sortBy]) return -1 * orderFactor;
      if (a[sortBy] > b[sortBy]) return 1 * orderFactor;
      return 0;
    });
  }

  const filteredTasks = {};
  for (const column in sortedTasks) {
    filteredTasks[column] = sortedTasks[column].filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  return (
  
      <div className="container mx-auto p-8 min-h-screen bg-blue-200">
        <ToastContainer />
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">Task Manager</h1>
          <button 
            onClick={handleAddTask} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md transition duration-300 ease-in-out"
          >
            Add Task
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative flex-grow md:mr-4">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-gray-700 font-medium">Sort by:</label>
              <select 
                value={sortBy} 
                onChange={handleSortChange} 
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
              >
                <option value="createdAt">Created At</option>
                <option value="title">Title</option>
              </select>
              <button 
                onClick={toggleSortOrder} 
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-300 ease-in-out text-black"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 justify-center">
          {Object.entries(filteredTasks).map(([columnTitle, columnTasks]) => (
            <TaskColumn
              key={columnTitle}
              title={columnTitle}
              tasks={columnTasks}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
              onView={handleViewTask}
            />
          ))}
        </div>

        <TaskModal 
          show={modalOpen} 
          onClose={() => setModalOpen(false)} 
          task={currentTask} 
          onSave={handleSaveTask} 
          readOnly={readOnly} 
        />
      </div>

  );
};

export default Dashboard;