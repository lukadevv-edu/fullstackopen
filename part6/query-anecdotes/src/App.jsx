import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import anecdotesService from './services/anecdotes.service'
import { useContext } from 'react'
import { NotificationContext } from './providers/NotificationProvider'

const App = () => {
  const queryClient = useQueryClient()
  const { dispatch } = useContext(NotificationContext)

  const mutation = useMutation({
    mutationFn: ({ id, ...object }) =>
      anecdotesService.updateAnecdote(id, object),
    onSuccess: (newAnecdote) => {
      dispatch({
        type: 'CHANGE',
        message: `you voted "${newAnecdote.content}"`,
      })

      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(
        ['anecdotes'],
        anecdotes.map((each) =>
          each.id === newAnecdote.id ? newAnecdote : each,
        ),
      )
    },
  })

  const handleVote = (id, votes) => {
    mutation.mutate({
      id,
      votes: votes + 1,
    })
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: anecdotesService.getAll,
    retry: 1,
  })

  if (result.isLoading) {
    return <div>Loading data...</div>
  }

  if (result.isError) {
    return (
      <div>anedcote service is not available due to problems in the server</div>
    )
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {result.data.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button
              onClick={() =>
                handleVote(anecdote.id, anecdote.votes, anecdote.content)
              }
            >
              vote
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
