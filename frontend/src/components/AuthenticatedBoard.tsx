import { useEffect, useState } from 'react'
import { addTask, deleteTaskByID, editTaskDetails, getAllTasks, moveTaskByStatus } from '../api/tasks'
import axios from 'axios'
import type { AuthUserTask, SwitchStatusBody } from '../types'
import InputForm from './InputForm'
import { type TaskDraft } from '../types'
import { AuthedBoard } from './AuthBoard'
import { type TaskStatus } from '../types'
import { type TaskUpdate } from '../types'


type AuthBoardProps = {
  onLogout: () => void
}



const AuthenticatedBoard = ({onLogout}:AuthBoardProps) => {

    const [userTasks, setUserTasks] = useState<AuthUserTask[]>([])

    const token = sessionStorage.getItem('access_token')

    const handleAddTask = async (newTask:TaskDraft) =>{
        try{
            const res = await addTask(token ?? "", newTask)
            console.log(res)
            
            setUserTasks((old) => [...old, res as AuthUserTask]);

        }catch(error){
            console.error("Failed to add task", error)
        }
        
    }
        
    const moveTask = async (taskId:string, destinationStatus:TaskStatus) =>{
        try{
            const refTask = userTasks.filter(task=> task.id ===taskId)
            const movedTask:SwitchStatusBody = {
                taskName : refTask[0].task_name,
                description : refTask[0].description,
                status : destinationStatus
            }
            const res = await moveTaskByStatus(
                token ?? "",
                movedTask,
                taskId
            )
            console.log(res)
            
            setUserTasks(userTasks.map(task => task.id === taskId ? {...task, status:destinationStatus}  : task  ))

        }catch(err){
            console.error("Failed to move task", err)
        }
    }
    const editTask = async (taskId:string, updatedFields:TaskUpdate) =>{
        try{
            const refTask = userTasks.filter(task=> task.id ===taskId)
            const updatedTask:SwitchStatusBody = {
                taskName : updatedFields.taskName??'',
                description : updatedFields.description??'',
                status : refTask[0].status
            }
            const res = await editTaskDetails(
                token ?? "",
                updatedTask,
                taskId
            )
            console.log(res)
            setUserTasks(userTasks.map(task => task.id === taskId? {...task, ...updatedFields
            } : task))
        }catch(error){
            console.error("Failed to edit task", error)
        }
        
    }
    const deleteTask = async (taskId:string) =>{
        try{
            const res = await deleteTaskByID(
                token ?? "",
                {
                    task_id: taskId
                },
                taskId
            )
            console.log(res)
            setUserTasks(userTasks.filter(task=>task.id !== taskId))
        }catch(error){
            console.error("Failed to delete task", error)
        }
    }

    useEffect(()=>{
        const token = sessionStorage.getItem('access_token')

        const initializeTasks = async () => {
            if (!token) {
                onLogout()
                return
            }

            try {
                const tasks = await getAllTasks(token)
                console.log(tasks)
                setUserTasks(tasks)
            } catch (err) {
                if (axios.isAxiosError(err) && err.response?.status === 401) {
                    console.log("Auth failed redirecting to login")
                    onLogout()
                    return
                }

                console.error("Failed to load tasks", err)
            }
        }

        initializeTasks()
    },[onLogout])

  return (
    <main className='min-h-screen bg-slate-100 px-3 py-6 text-slate-900 sm:px-6 sm:py-8 lg:px-8 lg:py-10'>
      <div className='mx-auto max-w-7xl'>
        <header className='mb-6 sm:mb-8'>
              <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
                <div>
                  <p className='mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500 sm:text-sm'>
                    Workspace
                  </p>

                  <h1 className='text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl'>
                    Kanban Board
                  </h1>

                  <p className='mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base'>
                    Keep track of your tasks as they move through each stage.
                  </p>
                </div>

                <button
                  type='button'
                  onClick={onLogout}
                  className='self-start rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-200'
                >
                  Log out
                </button>
              </div>
            </header>


        <section className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6'>
          <AuthedBoard
            onDelete = {deleteTask}
            onEdit={editTask}
            onMove={moveTask}
            label="To Do"
            color="rose"
            tasks={userTasks.filter((task)=>(
              task.status === "To Do"
            ))}
          />
          <AuthedBoard
            onDelete = {deleteTask}
            onEdit={editTask}
            onMove={moveTask}
            label="In Progress"
            tasks={userTasks.filter((task)=>(
              task.status === "In Progress"
            ))}
            color="violet"
          />
          <AuthedBoard
            onEdit={editTask}
            onDelete = {deleteTask}
            onMove={moveTask}
            label="Done"
            tasks={userTasks.filter((task)=>(
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



export default AuthenticatedBoard