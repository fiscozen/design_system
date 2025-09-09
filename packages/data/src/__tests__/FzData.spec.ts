import { describe, it, expect, beforeAll, vi } from 'vitest'
import { nextTick } from 'vue'

import { setupFzFetcher, useActions, useFzFetch } from '../rest';

interface User {
  id: string
  name: string
  email: string
}


describe.concurrent('FzData / Rest / setupFzFetcher', () => {
  it('is a function', () => {
    expect(typeof setupFzFetcher).toBe('function')
  })
})

describe.concurrent('FzData / Rest / useActions', () => {
  beforeAll(() => {
    setupFzFetcher({
      baseUrl: 'https://api.example.com',
    })
  })

  it('is a function', () => {
    expect(typeof useActions).toBe('function')
  })

  it('returns an object with the correct properties', () => {
    const actions = useActions<User>('/users')
    expect(actions).toHaveProperty('useRetrieve')
    expect(actions).toHaveProperty('useAll')
  })
})

describe.concurrent('FzData / Rest / useActions / all', () => {
  beforeAll(() => {
    setupFzFetcher({
      baseUrl: 'https://api.example.com',
    })
  })

  it('returns an object with the correct properties', () => {
    const {useAll} = useActions<User>('/users')

    const allResponse = useAll();

    console.log(allResponse)

    expect(allResponse).toHaveProperty('error')
    expect(allResponse).toHaveProperty('data')
    expect(allResponse).toHaveProperty('isLoading')
    expect(allResponse).toHaveProperty('execute')
  })
})

describe('FzData / Rest / useFzFetch - Reactive State Testing', () => {
  beforeAll(() => {
    setupFzFetcher({
      baseUrl: 'https://api.openbrewerydb.org/v1/',
    })
  })

  it('should have correct initial reactive state', async () => {
  const {useRetrieve} = useActions<User>('breweries')

    const { data, isLoading, error, execute } = useRetrieve('b54b16e1-ac3b-4bff-a11f-f7ae9ddc27e0', {
      onMount: false,
    })

    const fetchPromise = execute()


    console.log('data A', data.value)

    await fetchPromise
    await nextTick()

    console.log('data B', data.value)
  })
  
  /*
  it('should update reactive state during fetch operation', async () => {
    // Mock di una risposta fetch di successo
    const mockUser: User = { id: '1', name: 'John Doe', email: 'john@example.com' }
    
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockUser,
    } as Response)

    const {useRetrieve} = useActions<User>('/users')

    const { data, isLoading, error, execute } = useRetrieve(1, {
      onMount: false
    })

    // Stato iniziale
    expect(isLoading.value).toBe(false)
    expect(data.value).toBe(null)

    // Inizio fetch
    const fetchPromise = execute()
    
    // Durante il fetch
    expect(isLoading.value).toBe(true)
    expect(data.value).toBe(null)

    // Aspetto che il fetch completi
    await fetchPromise
    await nextTick()

    // Dopo il successo
    expect(isLoading.value).toBe(false)
    console.log('data', data.value)
    expect(data.value).toEqual(mockUser)
    expect(error.value).toBe(null)
  })
*/
  /*it('should handle error state correctly', async () => {
    // Mock di una risposta fetch di errore
    const errorMessage = 'Network error'
    global.fetch = vi.fn().mockRejectedValueOnce(new Error(errorMessage))

    const { data, isFetching, error, execute } = useFzFetch<User>('/users/999', {
      immediate: false
    })

    // Stato iniziale
    expect(error.value).toBe(null)
    expect(data.value).toBe(null)

    // Eseguo fetch che dovrebbe fallire
    try {
      await execute()
    } catch (e) {
      // Può lanciare errore ma testiamo lo stato reattivo
    }
    
    await nextTick()

    // Verifico che l'errore sia stato impostato
    expect(isFetching.value).toBe(false)
    expect(error.value).toBeTruthy()
    expect(data.value).toBe(null)
  })

  it('should re-fetch when execute is called multiple times', async () => {
    const mockUser1: User = { id: '1', name: 'John', email: 'john@example.com' }
    const mockUser2: User = { id: '1', name: 'Jane', email: 'jane@example.com' }
    
    // Prima chiamata
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockUser1,
    } as Response)

    const { data, execute } = useFzFetch<User>('/users/1', { immediate: false })

    await execute()
    await nextTick()
    
    expect(data.value).toEqual(mockUser1)

    // Seconda chiamata con dati diversi
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockUser2,
    } as Response)

    await execute()
    await nextTick()
    
    expect(data.value).toEqual(mockUser2)
  })*/
})