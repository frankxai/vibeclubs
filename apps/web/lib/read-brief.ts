export class BriefReadError extends Error {
  constructor(
    message: string,
    public readonly status: 400 | 408 | 413,
  ) {
    super(message)
    this.name = 'BriefReadError'
  }
}

/** Bound the whole upload, including bodies that never finish or lie about their size. */
export async function readBrief(
  request: { body: ReadableStream<Uint8Array> | null; signal: AbortSignal },
  { maxBytes = 8192, timeoutMs = 5000 } = {},
): Promise<unknown> {
  if (!request.body) throw new BriefReadError('A brief is required.', 400)
  if (request.signal.aborted) throw new BriefReadError('Brief upload interrupted. Try again.', 408)
  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let bytes = 0
  let timer: ReturnType<typeof setTimeout> | undefined
  let rejectInterrupted: (error: BriefReadError) => void = () => {}
  const interrupted = new Promise<never>((_, reject) => {
    rejectInterrupted = reject
  })
  const abort = () =>
    rejectInterrupted(new BriefReadError('Brief upload interrupted. Try again.', 408))
  request.signal.addEventListener('abort', abort, { once: true })
  if (request.signal.aborted) abort()
  timer = setTimeout(
    () => rejectInterrupted(new BriefReadError('Brief upload took too long. Try again.', 408)),
    timeoutMs,
  )
  try {
    while (true) {
      const { done, value } = await Promise.race([reader.read(), interrupted])
      if (done) break
      bytes += value.byteLength
      if (bytes > maxBytes) throw new BriefReadError('Brief is too long.', 413)
      chunks.push(value)
    }
    const text = new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks))
    return JSON.parse(text)
  } catch (error) {
    // A hostile source may never settle cancel(); cleanup must not delay the response.
    void reader.cancel().catch(() => {})
    if (error instanceof BriefReadError) throw error
    throw new BriefReadError('Could not read the brief. Check it and try again.', 400)
  } finally {
    clearTimeout(timer)
    request.signal.removeEventListener('abort', abort)
    reader.releaseLock()
  }
}
