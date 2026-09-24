// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { readBrief } from './read-brief'

const encoder = new TextEncoder()
function request(chunks: Uint8Array[], signal = new AbortController().signal) {
  return {
    signal,
    body: new ReadableStream<Uint8Array>({
      start(controller) {
        chunks.forEach((chunk) => controller.enqueue(chunk))
        controller.close()
      },
    }),
  }
}

describe('brief admission', () => {
  it('preserves a multibyte character split across upload chunks', async () => {
    const bytes = encoder.encode('{"outcome":"café"}')
    const split = bytes.indexOf(0xc3) + 1
    await expect(readBrief(request([bytes.slice(0, split), bytes.slice(split)]))).resolves.toEqual({
      outcome: 'café',
    })
  })

  it('accepts exactly the byte limit and rejects one byte over it', async () => {
    const bytes = encoder.encode('{"a":1}')
    await expect(readBrief(request([bytes]), { maxBytes: bytes.length })).resolves.toEqual({ a: 1 })
    await expect(readBrief(request([bytes]), { maxBytes: bytes.length - 1 })).rejects.toMatchObject(
      { status: 413 },
    )
  })

  it.each(['', '{', 'not json'])('rejects malformed JSON %j', async (body) => {
    await expect(readBrief(request([encoder.encode(body)]))).rejects.toMatchObject({ status: 400 })
  })

  it('rejects invalid UTF-8 rather than changing the submitted text', async () => {
    await expect(readBrief(request([new Uint8Array([34, 255, 34])]))).rejects.toMatchObject({
      status: 400,
    })
  })

  it('cancels a stalled upload within the whole-body deadline', async () => {
    const cancel = vi.fn(() => new Promise<void>(() => {}))
    const body = new ReadableStream<Uint8Array>({ cancel })
    await expect(
      readBrief({ body, signal: new AbortController().signal }, { timeoutMs: 10 }),
    ).rejects.toMatchObject({ status: 408 })
    expect(cancel).toHaveBeenCalledOnce()
    expect(body.locked).toBe(false)
  })

  it('cancels when the caller disconnects', async () => {
    const controller = new AbortController()
    const cancel = vi.fn()
    const body = new ReadableStream<Uint8Array>({ cancel })
    const result = readBrief({ body, signal: controller.signal })
    controller.abort()
    await expect(result).rejects.toMatchObject({ status: 408 })
    expect(cancel).toHaveBeenCalledOnce()
    expect(body.locked).toBe(false)
  })

  it('rejects a pre-aborted request without accepting buffered input', async () => {
    const controller = new AbortController()
    controller.abort()
    await expect(
      readBrief(request([encoder.encode('{}')], controller.signal)),
    ).rejects.toMatchObject({ status: 408 })
  })

  it('turns a transport failure into a recoverable error', async () => {
    const body = new ReadableStream<Uint8Array>({
      start: (controller) => controller.error(new Error('transport details')),
    })
    await expect(readBrief({ body, signal: new AbortController().signal })).rejects.toMatchObject({
      status: 400,
    })
    expect(body.locked).toBe(false)
  })
})
