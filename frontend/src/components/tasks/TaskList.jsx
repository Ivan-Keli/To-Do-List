import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ListTodo, CheckCircle } from 'lucide-react';
import TaskItem from './TaskItem';
import { useTask } from '../../contexts/TaskContext';

export default function TaskList({ onEditTask }) {
  const { filteredTasks, reorderTasks, loading } = useTask();

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    // Create new array with reordered tasks
    const reorderedTasks = Array.from(filteredTasks);
    const [removed] = reorderedTasks.splice(sourceIndex, 1);
    reorderedTasks.splice(destinationIndex, 0, removed);

    // Update order_index for each task
    const tasksWithNewOrder = reorderedTasks.map((task, index) => ({
      id: task.id,
      order_index: index
    }));

    try {
      await reorderTasks(tasksWithNewOrder);
    } catch (error) {
      console.error('Failed to reorder tasks:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading tasks...</span>
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <ListTodo className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No tasks found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Get started by creating your first task or adjust your filters.
        </p>
      </div>
    );
  }

  // Separate completed and incomplete tasks
  const incompleteTasks = filteredTasks.filter(task => !task.is_completed);
  const completedTasks = filteredTasks.filter(task => task.is_completed);

  return (
    <div className="space-y-6">
      {/* Incomplete Tasks */}
      {incompleteTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ListTodo className="w-5 h-5" />
            Active Tasks ({incompleteTasks.length})
          </h2>
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="active-tasks">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-3 ${snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/10 rounded-lg p-2' : ''}`}
                >
                  {incompleteTasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <TaskItem
                          task={task}
                          onEdit={onEditTask}
                          provided={provided}
                          isDragging={snapshot.isDragging}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Completed ({completedTasks.length})
          </h2>
          
          <div className="space-y-3">
            {completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={onEditTask}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
