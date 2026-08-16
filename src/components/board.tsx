import { useState } from 'react';
import { type SavedTask } from '../types'
import { type TaskStatus, type TaskUpdate, type TaskDraft } from '../types';

type BoardColor = 'rose' | 'violet' | 'green'

type BoardProps = {
  label: string;
  tasks: SavedTask[];
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

const Board = ({label, tasks, color, onDelete, onMove, onEdit}:BoardProps) => {
  const styles = colorStyles[color]
  const [editingTaskId, setEditingTaskId] = useState<string|null>(null)
  const [editFormData, setEditFormData] = useState<TaskDraft>({
    taskName:'',
    description:''
  })
  const [error, setError] = useState<string>('')

  const handleEditClick = (task:SavedTask)=> {
    setError('')
    setEditingTaskId(task.id)
    setEditFormData((old)=>({
        ...old,
        taskName: task.taskName,
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

  const handleSubmitEdit = (e:React.SubmitEvent <HTMLFormElement>, task:SavedTask)=>{
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

  return (
    <section className={`flex h-136 min-h-0 flex-col overflow-hidden rounded-2xl border shadow-sm ${styles.container}`}>
      <header className='flex items-center justify-between border-b border-slate-900/5 px-5 py-4'>
        <div className='flex items-center gap-3'>
          <span className={`h-2.5 w-2.5 rounded-full ${styles.dot}`} />
          <h2 className='font-semibold text-slate-900'>{label}</h2>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles.badge}`}>
          {tasks.length}
        </span>
      </header>

      <div className='min-h-0 flex-1 p-3'>
        {tasks.length === 0 ? (
          <div className='flex h-full items-center justify-center rounded-xl border border-dashed border-slate-300/80 bg-white/40 px-6 text-center'>
            <p className='text-sm text-slate-500'>No tasks yet</p>
          </div>
        ) : (
          <ul className='h-full space-y-3 overflow-y-auto overscroll-contain px-1 pb-2 pr-2 scrollbar-gutter-stable'>
            {tasks.map((task)=>(
              <li
                key={`${task.taskName}-${task.id}`}
                className='relative rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md'
              >
                <div className='absolute right-3 top-3 flex items-center gap-1'>
                  <button
                    onClick={()=>handleEditClick(task)}
                    type='button'
                    aria-label={`Edit ${task.taskName}`}
                    title='Edit task'
                    className='rounded-md px-2 py-1 text-xs font-semibold text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200'
                  >
                    Edit
                  </button>

                  <button
                    onClick={()=>onDelete(task.id)}
                    type='button'
                    aria-label={`Delete ${task.taskName}`}
                    title='Delete task'
                    className='flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200'
                  >
                    <span aria-hidden='true' className='text-lg leading-none'>&times;</span>
                  </button>
                </div>

                <h3 className='wrap-break-word pr-24 font-semibold text-slate-900'>
                  {task.taskName}
                </h3>
                {task.description && (
                  <p className='mt-2 wrap-break-word text-sm leading-relaxed text-slate-600'>
                    {task.description}
                  </p>
                )}

                {/* Replace `hidden` with your edit-mode condition when the logic is ready. */}
                {editingTaskId === task.id? 
                <form onSubmit={(e)=> handleSubmitEdit(e,task)} className='mt-3 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3'>
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
                      defaultValue={task.taskName}
                      className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200'
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
                      className='w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200'
                    />
                  </div>

                  <div className='flex justify-end gap-2 pt-1'>
                    <button
                      onClick={cancel}
                      type='button'
                      className='rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200'
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      className='rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300'
                    >
                      Save changes
                    </button>
                  </div>
                </form>:<></>}
                

                <div className='mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3'>
                    {task.status === "To Do" ? (
                        <button
                            onClick={()=> onMove(task.id, "In Progress")}
                            type="button"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        >
                            Next
                            <span aria-hidden="true">&rarr;</span>
                        </button>
                    ) : task.status === "In Progress" ? (
                        <>
                            <button
                                onClick={()=> onMove(task.id, "Done")}
                                type="button"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
                            >
                                Next
                                <span aria-hidden="true">&rarr;</span>
                            </button>

                            <button
                                onClick={()=> onMove(task.id, "To Do")}
                                type="button"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                            >
                                <span aria-hidden="true">&larr;</span>
                                Previous
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={()=> onMove(task.id, "In Progress")}
                            type="button"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
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

export default Board
