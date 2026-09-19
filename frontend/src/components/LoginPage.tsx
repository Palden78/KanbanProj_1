import { useState } from 'react'
import LoginForm from './LoginForm'
import { type LoginCredentials, type PublicUser } from '../types'
import { loginRequest } from '../api/auth'

type LoginPageProps = {
  onPreviewDemo: () => void
  onCreateAccount: () => void
  onLoginSuccess: (user: PublicUser) => void
}

const LoginPage = ({ onPreviewDemo, onCreateAccount, onLoginSuccess }: LoginPageProps) => {
  const [loading, setLoading] = useState(false)
  const [invalidEmailPasswordFlag, setInvalidEmailPasswordFlag] = useState(true)

  

  const handleSubmit = async (formData:LoginCredentials) => {
    setLoading(true)
    setInvalidEmailPasswordFlag(true)

    try {
      const res = await loginRequest(formData)
      const token = res.token.access_token
      sessionStorage.setItem('access_token', token)
      onLoginSuccess(res.user)
    } catch {
      setInvalidEmailPasswordFlag(false)
      console.log('login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='min-h-screen bg-slate-950 px-4 py-6 text-slate-900 sm:px-6 sm:py-10 lg:px-8'>
      <div className='mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-3xl bg-slate-900 shadow-2xl shadow-slate-950/40 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[1.05fr_0.95fr]'>
        <section className='relative hidden overflow-hidden p-8 text-white sm:p-12 lg:flex lg:flex-col lg:justify-between'>
          <div className='absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl' />
          <div className='absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-rose-500/10 blur-3xl' />

          <div className='relative'>
            <div className='mb-12 flex items-center gap-3'>
              <span className='flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-lg font-black text-slate-900 shadow-lg'>K</span>
              <span className='text-sm font-bold uppercase tracking-[0.24em] text-slate-300'>Kanban</span>
            </div>

            <p className='mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300'>Your work, in view</p>
            <h1 className='max-w-lg text-4xl font-bold leading-tight tracking-tight xl:text-5xl'>Turn moving pieces into clear progress.</h1>
            <p className='mt-6 max-w-md text-base leading-relaxed text-slate-300'>Organize the day, keep momentum visible, and give every task a place to land.</p>
          </div>

          <div className='relative mt-12 max-w-sm rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm'>
            <div className='mb-4 flex items-center justify-between text-xs font-semibold text-slate-300'>
              <span>Today&apos;s focus</span>
              <span className='rounded-full bg-emerald-400/15 px-2 py-1 text-emerald-300'>On track</span>
            </div>
            <div className='space-y-3'>
              <div className='flex items-center gap-3 rounded-xl bg-white/10 px-3 py-2.5'>
                <span className='h-2.5 w-2.5 rounded-full bg-rose-400' />
                <span className='text-sm text-slate-200'>Plan the next release</span>
              </div>
              <div className='flex items-center gap-3 rounded-xl bg-white/10 px-3 py-2.5'>
                <span className='h-2.5 w-2.5 rounded-full bg-violet-400' />
                <span className='text-sm text-slate-200'>Review project progress</span>
              </div>
            </div>
          </div>
        </section>

        <section className='flex items-center justify-center bg-slate-100 p-5 sm:p-10 lg:p-12'>
          <div className='w-full max-w-md'>
            <div className='mb-8 lg:hidden'>
              <div className='mb-6 flex items-center gap-3'>
                <span className='flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-lg font-black text-white shadow-sm'>K</span>
                <span className='text-sm font-bold uppercase tracking-[0.24em] text-slate-600'>Task organiser</span>
              </div>
            </div>

            <div className='mb-8'>
              <p className='mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500'>Welcome back</p>
              <h2 className='text-3xl font-bold tracking-tight text-slate-950'>Sign in to your workspace</h2>
              <p className='mt-3 text-sm leading-relaxed text-slate-600'>Enter your details below to continue organizing your tasks.</p>
            </div>

            <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7'>
              <LoginForm onSubmit={handleSubmit} isSubmitting={loading} emailAndPassIsValid={invalidEmailPasswordFlag}/>
            </div>

            <div className='mt-5 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-center'>
              <p className='text-sm text-violet-900'>New to Kanban?</p>
              <button
                type='button'
                onClick={onCreateAccount}
                className='mt-1 font-semibold text-violet-900 underline decoration-violet-300 underline-offset-4 transition hover:decoration-violet-900 focus:outline-none focus:ring-4 focus:ring-violet-200'
              >
                Create an account
              </button>
            </div>

            <button
              type='button'
              onClick={onPreviewDemo}
              className='mt-4 w-full rounded-xl border border-slate-300 bg-transparent px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-200'
            >
              Preview demo board
            </button>
            <p className='mt-3 text-center text-xs leading-relaxed text-slate-500'>This preview bypasses authentication and keeps using local browser data.</p>
          </div>
        </section>
      </div>
    </main>
  )
}

export default LoginPage
