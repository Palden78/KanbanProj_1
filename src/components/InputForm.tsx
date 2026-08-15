import React from 'react'
import { useState } from 'react'
import { type TaskDraft, type SavedTask,
 } from '../types'

type InputFormProps = {
    onAddTask: (newTask:TaskDraft) => void 
}


const InputForm = ({onAddTask}:InputFormProps) => {
    const [formData, setFormData] = useState<TaskDraft>({
        taskName: '',
        description:''
    })

    const [error, setError] = useState<string>('')

    const handleChange = (e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>{
        const {name,value} = e.target 

        setFormData((prev)=> ({
            ...prev,
            [name]:value
        }))

        if(name === 'taskName' && value.trim() !== ''){
            setError('')
        }
    }

    const handleSubmit = (e: React.SubmitEvent <HTMLFormElement>)=>{
        e.preventDefault();

        if (formData.taskName.trim() === ""){
            setError('Task name is required')
            return
        }

        onAddTask(formData)

        setFormData({taskName:'', description:''})
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                    Task Name <span className="text-red-500">*</span>
                </label>
                <input 
                    type="text" 
                    name="taskName"
                    value={formData.taskName}
                    onChange={handleChange}
                    className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-slate-300 focus:border-slate-500 focus:ring-slate-100'}`}
                    placeholder='e.g, build dashboard UI'
                />
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                    Description <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <textarea 
                    name="description" 
                    value={formData.description}
                    onChange={handleChange}
                    placeholder='Add detailed task notes'
                    className="h-28 w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
                    id=""></textarea>
            </div>

            <button type='submit'

            className='w-full rounded-lg bg-slate-900 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-200'>
                Create Task
            </button>
        </form>
    )
}

export default InputForm