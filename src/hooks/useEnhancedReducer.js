import { useReducer, useEffect, useRef, useCallback } from 'react'

// Shared DevTools instance and state tree across all contexts
let devTools = null
const globalState = {}

if (
  process.env.NODE_ENV !== 'production' &&
  typeof window !== 'undefined' &&
  window.__REDUX_DEVTOOLS_EXTENSION__
) {
  devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
    name: 'MindFlow App State',
  })
}

/**
 * A wrapper around useReducer that syncs state slices to Redux DevTools.
 * Allows keeping Context architecture while getting Redux-like visibility.
 */
export function useEnhancedReducer(reducer, initialState, sliceName) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const isInitialized = useRef(false)

  // Sync initial state
  if (!isInitialized.current) {
    globalState[sliceName] = initialState
  }

  useEffect(() => {
    if (!devTools) return

    globalState[sliceName] = state

    if (!isInitialized.current) {
      devTools.init(globalState)
      isInitialized.current = true
    }
  }, [state, sliceName])

  const enhancedDispatch = useCallback(
    (action) => {
      dispatch(action)
      
      if (devTools) {
        // Compute next state for DevTools manually since dispatch is async
        const nextState = reducer(state, action)
        globalState[sliceName] = nextState
        
        // Log the action to DevTools with the updated global tree
        const actionName = action.type ? `[${sliceName}] ${action.type}` : `[${sliceName}] UPDATE`
        devTools.send({ ...action, type: actionName }, { ...globalState })
      }
    },
    [reducer, sliceName, state]
  )

  return [state, enhancedDispatch]
}
