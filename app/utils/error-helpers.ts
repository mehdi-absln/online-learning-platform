export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  if (typeof err === 'object' && err !== null) {
    const e = err as { data?: { message?: string }, message?: string }
    return e.data?.message || e.message || 'Unknown error'
  }
  return 'Unknown error'
}