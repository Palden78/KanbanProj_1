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
    <body className='bg-sky-100  mt-20 mr-10 ml-10'>
      <div className='columns-3 gap-10'>
        <Board 
        label="To Do" 
        color="bg-rose-300"
        tasks={tasks}
        />
        <Board 
          label="In Progress"
          tasks={[]}
          color="bg-violet-300"
        />
        <Board 
          label="Done"
          tasks={[]}
          color="bg-green-300"
        />
      </div>
      
      <div>
        <InputForm onAddTask={handleAddTask}/>
      </div>
      
    </body>
  )
}

export default App