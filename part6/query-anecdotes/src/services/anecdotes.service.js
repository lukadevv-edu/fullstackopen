const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }

  const data = await response.json()
  return data
}

const createNew = async (anecdote) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(createAnedcote(anecdote)),
  })

  if (!response.ok) {
    const errorData = await response.json()

    throw new Error(errorData.error || 'Failed to create note')
  }

  return await response.json()
}

const updateAnecdote = async (id, content) => {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(content),
  })

  if (!response.ok) {
    throw new Error('Failed to create note')
  }

  return await response.json()
}

const getId = () => (1000000 * Math.random()).toFixed(0)

const createAnedcote = (content) => {
  return {
    id: getId(),
    content,
    votes: 0,
  }
}

export default { getAll, createNew, updateAnecdote }
