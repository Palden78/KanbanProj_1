import { getCurrUser } from './api/auth'
import Board from './components/board'
import InputForm from './components/InputForm'
import LoginPage from './components/LoginPage'
import {
    type TaskDraft, type SavedTask,
    type TaskUpdate,
    type TaskStatus
 } from './types'
import { useState , useEffect} from 'react'
import axios from 'axios'
import DemoBoard from './components/DemoBoard'
import AuthenticatedBoard from './components/AuthenticatedBoard'



const App = () => {
  const [view, setView] = useState<'login' | 'demo-board'>('login')

  const [authState, setAuthState] = useState<'checking'|'anonymous'|'authenticated'>('checking')

  

  

  

  useEffect(()=>{
    const access_token = sessionStorage.getItem('access_token')

    const initializeAuth = async () => {
    if (access_token) {
      try {
        const res = await getCurrUser(access_token);
        setAuthState('authenticated');
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          console.log("Auth failed redirecting to login")
          sessionStorage.removeItem('access_token')
          setAuthState('anonymous');
        }
      }
    }
    if (access_token === null){
      setAuthState('anonymous')
      return
    }
  }
    initializeAuth()
    
  }, [])


  const handleLogout = ()=>{
    sessionStorage.removeItem("access_token")
    setAuthState('anonymous')
    setView('login')
  }
  const handleExitDemo = ()=>{
    setView('login')
  }

  if(view === 'demo-board'){
    return (
    <DemoBoard onExit={handleExitDemo}/>
  )
  }

  if (authState === 'checking'){
    return (<h1>Checking</h1>)
  }

  if (authState === 'anonymous'){
     return <LoginPage onPreviewDemo={() => setView('demo-board')} onLoginSuccess={()=> setAuthState('authenticated')} />
  }

  if (authState === 'authenticated'){
    return (<AuthenticatedBoard onLogout = {handleLogout}
    
    />)
  }

  
}

export default App
