import { renderHook, act, waitFor } from '@testing-library/react'
import { useToast, toast, reducer } from '../use-toast'

describe('useToast hook', () => {
  beforeEach(() => {
    jest.clearAllTimers()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  describe('reducer', () => {
    it('should add a toast to empty state', () => {
      const state = { toasts: [] }
      const action = {
        type: 'ADD_TOAST' as const,
        toast: {
          id: '1',
          title: 'Test Toast',
          description: 'Test Description',
        },
      }

      const newState = reducer(state, action)

      expect(newState.toasts).toHaveLength(1)
      expect(newState.toasts[0]).toMatchObject({
        id: '1',
        title: 'Test Toast',
        description: 'Test Description',
      })
    })

    it('should limit toasts to TOAST_LIMIT', () => {
      const state = {
        toasts: [
          { id: '1', title: 'Toast 1' },
        ],
      }
      const action = {
        type: 'ADD_TOAST' as const,
        toast: {
          id: '2',
          title: 'Toast 2',
        },
      }

      const newState = reducer(state, action)

      expect(newState.toasts).toHaveLength(1)
      expect(newState.toasts[0].id).toBe('2')
    })

    it('should update an existing toast', () => {
      const state = {
        toasts: [
          { id: '1', title: 'Original Title' },
        ],
      }
      const action = {
        type: 'UPDATE_TOAST' as const,
        toast: {
          id: '1',
          title: 'Updated Title',
        },
      }

      const newState = reducer(state, action)

      expect(newState.toasts[0].title).toBe('Updated Title')
    })

    it('should dismiss a specific toast', () => {
      const state = {
        toasts: [
          { id: '1', title: 'Toast 1', open: true },
          { id: '2', title: 'Toast 2', open: true },
        ],
      }
      const action = {
        type: 'DISMISS_TOAST' as const,
        toastId: '1',
      }

      const newState = reducer(state, action)

      expect(newState.toasts[0].open).toBe(false)
      expect(newState.toasts[1].open).toBe(true)
    })

    it('should dismiss all toasts when no toastId provided', () => {
      const state = {
        toasts: [
          { id: '1', title: 'Toast 1', open: true },
          { id: '2', title: 'Toast 2', open: true },
        ],
      }
      const action = {
        type: 'DISMISS_TOAST' as const,
      }

      const newState = reducer(state, action)

      expect(newState.toasts[0].open).toBe(false)
      expect(newState.toasts[1].open).toBe(false)
    })

    it('should remove a specific toast', () => {
      const state = {
        toasts: [
          { id: '1', title: 'Toast 1' },
          { id: '2', title: 'Toast 2' },
        ],
      }
      const action = {
        type: 'REMOVE_TOAST' as const,
        toastId: '1',
      }

      const newState = reducer(state, action)

      expect(newState.toasts).toHaveLength(1)
      expect(newState.toasts[0].id).toBe('2')
    })

    it('should remove all toasts when no toastId provided', () => {
      const state = {
        toasts: [
          { id: '1', title: 'Toast 1' },
          { id: '2', title: 'Toast 2' },
        ],
      }
      const action = {
        type: 'REMOVE_TOAST' as const,
      }

      const newState = reducer(state, action)

      expect(newState.toasts).toHaveLength(0)
    })
  })

  describe('toast function', () => {
    it('should create a toast with title and description', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        toast({
          title: 'Success',
          description: 'Operation completed',
        })
      })

      expect(result.current.toasts).toHaveLength(1)
      expect(result.current.toasts[0].title).toBe('Success')
      expect(result.current.toasts[0].description).toBe('Operation completed')
    })

    it('should return toast control methods', () => {
      const toastController = toast({
        title: 'Test',
      })

      expect(toastController).toHaveProperty('id')
      expect(toastController).toHaveProperty('dismiss')
      expect(toastController).toHaveProperty('update')
      expect(typeof toastController.dismiss).toBe('function')
      expect(typeof toastController.update).toBe('function')
    })

    it('should set open to true by default', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        toast({
          title: 'Test',
        })
      })

      expect(result.current.toasts[0].open).toBe(true)
    })

    it('should call dismiss when onOpenChange is called with false', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        toast({
          title: 'Test',
        })
      })

      const toastItem = result.current.toasts[0]

      act(() => {
        toastItem.onOpenChange?.(false)
      })

      expect(result.current.toasts[0].open).toBe(false)
    })
  })

  describe('useToast hook', () => {
    it('should initialize with empty toasts', () => {
      const { result } = renderHook(() => useToast())

      expect(result.current.toasts).toBeDefined()
      expect(Array.isArray(result.current.toasts)).toBe(true)
    })

    it('should provide toast function', () => {
      const { result } = renderHook(() => useToast())

      expect(result.current.toast).toBeDefined()
      expect(typeof result.current.toast).toBe('function')
    })

    it('should provide dismiss function', () => {
      const { result } = renderHook(() => useToast())

      expect(result.current.dismiss).toBeDefined()
      expect(typeof result.current.dismiss).toBe('function')
    })

    it('should update when new toast is added', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.toast({
          title: 'New Toast',
        })
      })

      expect(result.current.toasts).toHaveLength(1)
    })

    it('should dismiss specific toast', () => {
      const { result } = renderHook(() => useToast())

      let toastId: string

      act(() => {
        const { id } = result.current.toast({
          title: 'Test Toast',
        })
        toastId = id
      })

      act(() => {
        result.current.dismiss(toastId!)
      })

      expect(result.current.toasts[0].open).toBe(false)
    })

    it('should dismiss all toasts when no id provided', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.toast({ title: 'Toast 1' })
      })

      act(() => {
        result.current.dismiss()
      })

      expect(result.current.toasts[0].open).toBe(false)
    })
  })

  describe('toast controller methods', () => {
    it('should update toast using controller', () => {
      const { result } = renderHook(() => useToast())

      let controller: ReturnType<typeof toast>

      act(() => {
        controller = result.current.toast({
          title: 'Original',
        })
      })

      act(() => {
        controller.update({
          id: controller.id,
          title: 'Updated',
        })
      })

      expect(result.current.toasts[0].title).toBe('Updated')
    })

    it('should dismiss toast using controller', () => {
      const { result } = renderHook(() => useToast())

      let controller: ReturnType<typeof toast>

      act(() => {
        controller = result.current.toast({
          title: 'Test',
        })
      })

      act(() => {
        controller.dismiss()
      })

      expect(result.current.toasts[0].open).toBe(false)
    })
  })

  describe('multiple hooks', () => {
    it('should sync state across multiple hook instances', () => {
      const { result: result1 } = renderHook(() => useToast())
      const { result: result2 } = renderHook(() => useToast())

      act(() => {
        result1.current.toast({
          title: 'Shared Toast',
        })
      })

      expect(result2.current.toasts).toHaveLength(1)
      expect(result2.current.toasts[0].title).toBe('Shared Toast')
    })
  })
})
