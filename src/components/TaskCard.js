const TaskCard = ({ task, onDragStart }) => {
    return (
      <div
        className="bg-gray-900 p-4 mb-3 rounded-lg shadow-md cursor-move hover:bg-gray-800 transition duration-300"
        draggable
        onDragStart={(e) => onDragStart(e, task.id)}
      >
        <h3 className="font-semibold mb-2 text-green-400">{task.title}</h3>
        <p className="text-sm text-gray-400">{task.description}</p>
      </div>
    );
  };
  
  export default TaskCard;