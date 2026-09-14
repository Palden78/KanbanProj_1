import { useState } from 'react';
import { type TaskStatus, type TaskUpdate, type TaskDraft } from '../types';
import { type AuthUserTask } from '../types';

type BoardColor = 'rose' | 'violet' | 'green'

type BoardProps = {
  label: TaskStatus;
  tasks: AuthUserTask[];
  color: BoardColor;
  onDelete: (taskId:string)=>void
  onMove : (taskId: string, destinationStatus:TaskStatus)=>void
  onEdit: (taskId: string, updatedFields: TaskUpdate) => void
}

const colorStyles: Record<BoardColor, {
  container: string;
  dot: string;
  badge: string;
}> = {
  rose: {
    container: 'border-rose-200 bg-rose-50/70',
    dot: 'bg-rose-500',
    badge: 'bg-rose-100 text-rose-700',
  },
  violet: {
    container: 'border-violet-200 bg-violet-50/70',
    dot: 'bg-violet-500',
    badge: 'bg-violet-100 text-violet-700',
  },
  green: {
    container: 'border-green-200 bg-green-50/70',
    dot: 'bg-green-500',
    badge: 'bg-green-100 text-green-700',
  },
}

export const AuthedBoard = ({label, tasks, color, onDelete, onMove, onEdit}:BoardProps) => {
  const styles = colorStyles[color]
  const [editingTaskId, setEditingTaskId] = useState<string|null>(null)
  const [editFormData, setEditFormData] = useState<TaskDraft>({
    taskName:'',
    description:''
  })
  const [error, setError] = useState<string>('')

  const handleEditClick = (task:AuthUserTask)=> {
    setError('')
    setEditingTaskId(task.id)
    setEditFormData((old)=>({
        ...old,
        taskName: task.task_name,
        description: task.description
    }))
  }

  const handleChange = (e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>{
    const {name,value} = e.target

    setEditFormData((prev)=>(
        {
            ...prev,
            [name]: value
        }
    ))
  }

  const handleSubmitEdit = (e:React.SubmitEvent <HTMLFormElement>, task:AuthUserTask)=>{
        e.preventDefault();

        //validate task name not empty
        if(editFormData.taskName.trim() === ''){
            setError("Task name is not provided")
            return 
        }

        onEdit(task.id, editFormData)

        setEditingTaskId(null)
        setError('')
    }

    const cancel = ()=>{
        setEditingTaskId(null)
        setError('')
    }

    const handleDragStart = (e:React.DragEvent<HTMLLIElement>, taskStatus:string, taskid:string)=>{
        e.dataTransfer.setData('text', e.currentTarget.id)
        e.dataTransfer.setData('taskStatus', taskStatus )
        e.dataTransfer.setData('taskid', taskid )
    }

    const enableDropping = (e:React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>)=>{
        const id = e.dataTransfer.getData('text')
        const taskStatus = e.dataTransfer.getData('taskStatus')
        const taskid = e.dataTransfer.getData('taskid')
        

        const taskDest = label 

        if (taskStatus === taskDest){
            return 
        }
        console.log(`dropped element with id ${id}`)

        onMove(taskid, taskDest)
    }

  return (
    <section className={`flex h-112 min-h-0 flex-col overflow-hidden rounded-xl border shadow-sm sm:h-120 sm:rounded-2xl lg:h-136 ${styles.container}`}>
      <header className='flex items-center justify-between border-b border-slate-900/5 px-4 py-3 sm:px-5 sm:py-4'>
        <div className='flex items-center gap-2.5 sm:gap-3'>
          <span className={`h-2.5 w-2.5 rounded-full ${styles.dot}`} />
          <h2 className='text-sm font-semibold text-slate-900 sm:text-base'>{label}</h2>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold sm:px-2.5 sm:py-1 sm:text-xs ${styles.badge}`}>
          {tasks.length}
        </span>
      </header>

      <div className='min-h-0 flex-1 p-2 sm:p-3' onDragOver={enableDropping} onDrop={handleDrop}>
        {tasks.length === 0 ? (
          <div className='flex h-full items-center justify-center rounded-lg border border-dashed border-slate-300/80 bg-white/40 px-4 text-center sm:rounded-xl sm:px-6'>
            <p className='text-xs text-slate-500 sm:text-sm'>No tasks yet</p>
          </div>
        ) : (
          <ul  className='h-full space-y-2.5 overflow-y-auto overscroll-contain px-0.5 pb-2 pr-1.5 scrollbar-gutter-stable sm:space-y-3 sm:px-1 sm:pr-2'>
            {tasks.map((task)=>(
              <li draggable="true"
                onDragStart={(e)=>handleDragStart(e, task.status, task.id)}
                key={`${task.task_name}-${task.id}`}
                className='relative rounded-lg border border-slate-200/80 bg-white p-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:rounded-xl sm:p-4'
              >
                <div className='absolute right-2 top-2 flex items-center gap-0.5 sm:right-3 sm:top-3 sm:gap-1'>
                  <button
                    onClick={()=>handleEditClick(task)}
                    type='button'
                    aria-label={`Edit ${task.task_name}`}
                    title='Edit task'
                    className='rounded-md px-1.5 py-1 text-[11px] font-semibold text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 sm:px-2 sm:text-xs'
                  >
                    Edit
                  </button>

                  <button
                    onClick={()=>onDelete(task.id)}
                    type='button'
                    aria-label={`Delete ${task.task_name}`}
                    title='Delete task'
                    className='flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200 sm:h-7 sm:w-7'
                  >
                    <span aria-hidden='true' className='text-lg leading-none'>&times;</span>
                  </button>
                </div>

                <h3 className='wrap-break-word pr-20 text-sm font-semibold text-slate-900 sm:pr-24 sm:text-base'>
                  {task.task_name}
                </h3>
                {task.description && (
                  <p className='mt-1.5 wrap-break-word text-xs leading-relaxed text-slate-600 sm:mt-2 sm:text-sm'>
                    {task.description}
                  </p>
                )}

                <time
                  dateTime={task.created_at}
                  title={new Date(task.created_at).toLocaleString()}
                  className='mt-3 inline-flex rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500 sm:text-xs'
                >
                  Created {new Date(task.created_at).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </time>

                {/* Replace `hidden` with your edit-mode condition when the logic is ready. */}
                {editingTaskId === task.id? 
                <form onSubmit={(e)=> handleSubmitEdit(e,task)} className='mt-3 space-y-2.5 rounded-lg border border-slate-200 bg-slate-50 p-2.5 sm:space-y-3 sm:p-3'>
                  <div className='space-y-1.5'>
                    <label
                      htmlFor={`edit-title-${task.id}`}
                      className='block text-xs font-semibold text-slate-600'
                    >
                      Task name
                    </label>
                    <input
                      id={`edit-title-${task.id}`}
                      name='taskName'
                      type='text'
                      onChange={handleChange}
                      defaultValue={task.task_name}
                      className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 sm:text-sm'
                    />
                    {error && <p role='alert' className='text-xs font-medium text-red-600'>
                      {error}
                    </p> }
                    
                  </div>

                  <div className='space-y-1.5'>
                    <label
                      htmlFor={`edit-description-${task.id}`}
                      className='block text-xs font-semibold text-slate-600'
                    >
                      Description
                    </label>
                    <textarea
                      id={`edit-description-${task.id}`}
                      onChange={handleChange}
                      name='description'
                      defaultValue={task.description}
                      rows={3}
                      className='w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 sm:text-sm'
                    />
                  </div>

                  <div className='flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end'>
                    <button
                      onClick={cancel}
                      type='button'
                      className='w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200 sm:w-auto sm:py-1.5'
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      className='w-full rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 sm:w-auto sm:py-1.5'
                    >
                      Save changes
                    </button>
                  </div>
                </form>:<></>}
                

                <div className='mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 sm:mt-4 sm:gap-3'>
                    {task.status === "To Do" ? (
                        <button
                            onClick={()=> onMove(task.id, "In Progress")}
                            type="button"
                            className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-2.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 sm:flex-none sm:px-3 sm:py-1.5"
                        >
                            Next
                            <span aria-hidden="true">&rarr;</span>
                        </button>
                    ) : task.status === "In Progress" ? (
                        <>
                            <button
                                onClick={()=> onMove(task.id, "Done")}
                                type="button"
                                className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-2.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 sm:flex-none sm:px-3 sm:py-1.5"
                            >
                                Next
                                <span aria-hidden="true">&rarr;</span>
                            </button>

                            <button
                                onClick={()=> onMove(task.id, "To Do")}
                                type="button"
                                className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 sm:flex-none sm:px-3 sm:py-1.5"
                            >
                                <span aria-hidden="true">&larr;</span>
                                Previous
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={()=> onMove(task.id, "In Progress")}
                            type="button"
                            className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 sm:flex-none sm:px-3 sm:py-1.5"
                        >
                            <span aria-hidden="true">&larr;</span>
                            Previous
                        </button>
                    )}
                  
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}


