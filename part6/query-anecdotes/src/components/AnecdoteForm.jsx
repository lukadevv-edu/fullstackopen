import { useMutation, useQueryClient } from '@tanstack/react-query'
import anecdotesService from '../services/anecdotes.service'
import { useContext } from 'react'
import { NotificationContext } from '../providers/NotificationProvider'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const { dispatch } = useContext(NotificationContext)

  const mutation = useMutation({
    mutationFn: anecdotesService.createNew,
    onSuccess: (newAnecdote) => {
      dispatch({
        type: 'CHANGE',
        message: `you have created "${newAnecdote.content}"`,
      })

      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
    },
    onError: (error) => {
      dispatch({
        type: 'CHANGE',
        message:
          error.response?.data?.error ??
          error.message ??
          error.cause ??
          'Error caught! Please try again!',
      })
    },
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    mutation.mutate(content)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
