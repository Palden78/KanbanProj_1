import Board from './components/board'
import InputForm from './components/InputForm'
import { 
    type TaskDraft, type SavedTask,
    type TaskUpdate,
    type TaskStatus
 } from './types'
import { useState } from 'react'



const App = () => {

  const [tasks, setTasks] = useState<SavedTask[]>([])
  const handleAddTask = (newTask:TaskDraft) =>(
    setTasks((prevTasks)=>(
      [...prevTasks, {...newTask, 
            id: crypto.randomUUID(),
            status: "To Do",
            createdAt: new Date().toISOString()
          }]
    ))
  )

  const moveTask = (taskId:string, destinationStatus:TaskStatus) =>{
    setTasks(tasks.map(task => task.id === taskId ? {...task, status:destinationStatus}  : task  ))
  }

  const editTask = (taskId:string, updatedFields:TaskUpdate) =>{
    setTasks(tasks.map(task => task.id === taskId? {...task, ...updatedFields
     } : task))
  }

  const deleteTask = (taskId:string) =>{
    setTasks(tasks.filter(task=>task.id !== taskId))
  }

  return (
    <main className='min-h-screen bg-slate-100 px-3 py-6 text-slate-900 sm:px-6 sm:py-8 lg:px-8 lg:py-10'>
      <div className='mx-auto max-w-7xl'>
        <header className='mb-6 sm:mb-8'>
          <p className='mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500 sm:text-sm'>
            Workspace
          </p>
          <h1 className='text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl'>Kanban Board</h1>
          <p className='mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base'>
            Keep track of your tasks as they move through each stage.
          </p>
        </header>

        <section className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6'>
          <Board
            onDelete = {deleteTask}
            onEdit={editTask}
            onMove={moveTask}
            label="To Do"
            color="rose"
            tasks={tasks.filter((task)=>(
              task.status === "To Do"
            ))}
          />
          <Board
            onDelete = {deleteTask}
            onEdit={editTask}
            onMove={moveTask}
            label="In Progress"
            tasks={tasks.filter((task)=>(
              task.status === "In Progress"
            ))}
            color="violet"
          />
          <Board
            onEdit={editTask}
            onDelete = {deleteTask}
            onMove={moveTask}
            label="Done"
            tasks={tasks.filter((task)=>(
              task.status === "Done"
            ))}
            color="green"
          />
        </section>

        <section className='mx-auto mt-6 max-w-xl rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:mt-8 sm:rounded-2xl sm:p-6'>
          <div className='mb-5'>
            <h2 className='text-lg font-semibold sm:text-xl'>Create a task</h2>
            <p className='mt-1 text-sm text-slate-500'>Add a new item to your To Do board.</p>
          </div>
          <InputForm onAddTask={handleAddTask}/>
        </section>
      </div>
    </main>
  )
}

export default App
