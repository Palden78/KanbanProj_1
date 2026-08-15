import { type Task } from '../types'

type BoardProps = {
  label: string;
  tasks?: Task[];
  color: string;
}
const Board = ({label, tasks=[],color}:BoardProps) => {
  return (
    <div className={`${color} 
     aspect-square justify-center align-middle`}>
        <h2 className='font-mono font-extrabold self-center justify-self-center pt-5'>{label}</h2>
        <div className='flex justify-center align-middle mt-2.5 '>
            {tasks.length === 0? <h1>No tasks yet</h1>
            :
            <ul>
                {tasks.map((task,index)=>(
                    <li key={`${task}-${index}`}>
                        {task.taskName}
                        {task.description}
                    </li>
                ))}
            </ul>
            }
            
        </div>
    </div>
  )
}

export default Board