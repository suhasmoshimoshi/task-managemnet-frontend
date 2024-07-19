import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await axios.get('/api/tasks');
        setTasks(data);
      } catch (error) {
        toast.error('Failed to load tasks');
      }
    };

    fetchTasks();
  }, []);

  return (
    <div>
      <Navbar />
      <h1>Tasks</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <Link href={`/tasks/${task._id}`}>
              <p>{task.title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
``
