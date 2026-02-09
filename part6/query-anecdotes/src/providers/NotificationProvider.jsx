import { createContext } from 'react'
import { useEffect } from 'react'
import { useReducer } from 'react'

// eslint-disable-next-line react-refresh/only-export-components
export const NotificationContext = createContext({
  message: null,
  dispatch: () => {},
})

const reducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE': {
      return action.message
    }
    default: {
      return state
    }
  }
}

export function NotificationProvider({ children }) {
  const [message, dispatch] = useReducer(reducer, null)

  useEffect(() => {
    if (message) {
      setTimeout(
        () =>
          dispatch({
            type: 'CHANGE',
            message: null,
          }),
        5000,
      )
    }
  }, [message])

  return (
    <NotificationContext.Provider
      value={{
        message,
        dispatch,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
