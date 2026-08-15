import { type Task } from '../types'

type BoardColor = 'rose' | 'violet' | 'green'

type BoardProps = {
  label: string;
  tasks: Task[];
  color: BoardColor;
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

const Board = ({label, tasks, color}:BoardProps) => {
  const styles = colorStyles[color]

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
            {tasks.map((task,index)=>(
              <li
                key={`${task.taskName}-${index}`}
                className='rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md'
              >
                <h3 className='wrap-break-word font-semibold text-slate-900'>
                  {task.taskName}
                </h3>
                {task.description && (
                  <p className='mt-2 wrap-break-word text-sm leading-relaxed text-slate-600'>
                    {task.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default Board
