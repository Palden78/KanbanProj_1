import React from 'react'
import { useState } from 'react'
import { type Task } from '../types'

type InputFormProps = {
    onAddTask: (newTask:Task) => void 
}


const InputForm = ({onAddTask}:InputFormProps) => {
    const [formData, setFormData] = useState<Task>({
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
        <form onSubmit={handleSubmit} >
            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">
                    Task Name <span className="text-red-500">*</span>
                </label>
                <input 
                    type="text" 
                    name="taskName"
                    value={formData.taskName}
                    onChange={handleChange}
                    className={`border p-2 rounded ${error ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder='e.g, build dashboard UI'
                />
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>

            <div>
                <label className="text-sm font-semibold text-gray-700">
                    Description <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <textarea 
                    name="description" 
                    value={formData.description}
                    onChange={handleChange}
                    placeholder='Add detailed task notes'
                    className="border border-gray-300 p-2 rounded h-24 resize-none"
                    id=""></textarea>
            </div>

            <button type='submit'

            className='w-full bg-amber-400 text-white py-2 px-4 rounded font-medium hover:bg-blue-700 transition"'>
                Create Task
            </button>
        </form>
    )
}

export default InputForm