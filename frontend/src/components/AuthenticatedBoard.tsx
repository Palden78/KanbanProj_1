import React from 'react'


type AuthBoardProps = {
  onLogout: () => void
}

const AuthenticatedBoard = ({onLogout}:AuthBoardProps) => {
  return (
    <div>AuthenticatedBoard
        <button onClick={onLogout}>Logout</button>
    </div>
  )
}

export default AuthenticatedBoard