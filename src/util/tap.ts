import { BufferCodec } from "../types";

/**
 * Allows 'tapping' into the parser of a codec without affecting
 * parsing or serializing. This can be useful for debugging!
 *
 * Returns its supplied context for use with `merge`
 *
 * @example
 *  merge(
 *    props({ name: string.nullTerminated() }),
 *    tap(({ name }) => console.log(`name is: ${name}`))
 *  )
 *
 * @param callback Called with the current context
 */
export const tap = <Context>(
  callback: (buffer: Buffer, context: Context) => void
): BufferCodec<{}, Context> => ({
  parse: (buffer, context) => {
    callback(buffer, context);
    return { value: context, byteLength: 0 };
  },
  serialize: () => Buffer.alloc(0),
});
