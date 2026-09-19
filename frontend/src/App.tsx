import { useEffect, useState } from 'react'
import axios from 'axios'
import { getCurrUser } from './api/auth'
import AccountPage from './components/AccountPage'
import AuthenticatedBoard from './components/AuthenticatedBoard'
import DemoBoard from './components/DemoBoard'
import LoginPage from './components/LoginPage'
import RegistrationPage from './components/RegistrationPage'
import type { PublicUser } from './types'

type PublicView = 'login' | 'register' | 'demo-board'
type AuthenticatedView = 'board' | 'account'

type AuthState =
  | { status: 'checking' }
  | { status: 'anonymous' }
  | { status: 'authenticated'; user: PublicUser }

const App = () => {
  const [publicView, setPublicView] = useState<PublicView>('login')
  const [authenticatedView, setAuthenticatedView] = useState<AuthenticatedView>('board')
  const [authState, setAuthState] = useState<AuthState>({ status: 'checking' })

  useEffect(() => {
    const accessToken = sessionStorage.getItem('access_token')

    const initializeAuth = async () => {
      if (!accessToken) {
        setAuthState({ status: 'anonymous' })
        return
      }

      try {
        const user = await getCurrUser(accessToken)
        setAuthState({ status: 'authenticated', user })
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          console.log('Auth failed redirecting to login')
          sessionStorage.removeItem('access_token')
          setAuthState({ status: 'anonymous' })
          return
        }

        console.error('Failed to restore authentication', error)
      }
    }

    initializeAuth()
  }, [])

  const handleLoginSuccess = (user: PublicUser) => {
    setAuthState({ status: 'authenticated', user })
    setAuthenticatedView('board')
    setPublicView('login')
  }

  const handleLogout = () => {
    sessionStorage.removeItem('access_token')
    setAuthState({ status: 'anonymous' })
    setAuthenticatedView('board')
    setPublicView('login')
  }

  const handleExitDemo = () => {
    setPublicView('login')
  }

  if (publicView === 'demo-board') {
    return <DemoBoard onExit={handleExitDemo}/>
  }

  if (authState.status === 'checking') {
    return (
      <main className='flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white'>
        <div role='status' className='rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-center shadow-xl backdrop-blur-sm'>
          <span className='mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-lg font-black text-slate-900'>K</span>
          <p className='text-sm font-semibold'>Checking your session...</p>
        </div>
      </main>
    )
  }

  if (authState.status === 'anonymous') {
    if (publicView === 'register') {
      return <RegistrationPage onBackToLogin={() => setPublicView('login')}/>
    }

    return (
      <LoginPage
        onPreviewDemo={() => setPublicView('demo-board')}
        onCreateAccount={() => setPublicView('register')}
        onLoginSuccess={handleLoginSuccess}
      />
    )
  }

  if (authenticatedView === 'account') {
    return (
      <AccountPage
        user={authState.user}
        onBackToBoard={() => setAuthenticatedView('board')}
        onLogout={handleLogout}
      />
    )
  }

  return (
    <AuthenticatedBoard
      onLogout={handleLogout}
      onOpenAccount={() => setAuthenticatedView('account')}
    />
  )
}

export default App
