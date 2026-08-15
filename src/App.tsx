import Board from './components/board'
import InputForm from './components/InputForm'
import { type Task } from './types'
import { useState } from 'react'

const App = () => {

  const [tasks, setTasks] = useState<Task[]>([

  ])

  const handleAddTask = (newTask:Task) =>(
    setTasks((prevTasks)=>(
      [...prevTasks, newTask]
    ))
  )

  return (
    <main className='min-h-screen bg-slate-100 px-4 py-10 text-slate-900 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-7xl'>
        <header className='mb-8'>
          <p className='mb-2 text-sm font-semibold uppercase tracking-widest text-slate-500'>
            Workspace
          </p>
          <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>Kanban Board</h1>
          <p className='mt-2 text-sm text-slate-600 sm:text-base'>
            Keep track of your tasks as they move through each stage.
          </p>
        </header>

        <section className='grid grid-cols-3 gap-6'>
          <Board
            label="To Do"
            color="rose"
            tasks={tasks}
          />
          <Board
            label="In Progress"
            tasks={[]}
            color="violet"
          />
          <Board
            label="Done"
            tasks={[]}
            color="green"
          />
        </section>

        <section className='mx-auto mt-8 max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
          <div className='mb-5'>
            <h2 className='text-xl font-semibold'>Create a task</h2>
            <p className='mt-1 text-sm text-slate-500'>Add a new item to your To Do board.</p>
          </div>
          <InputForm onAddTask={handleAddTask}/>
        </section>
      </div>
    </main>
  )
}

export default App
