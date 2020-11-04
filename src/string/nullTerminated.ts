import { BufferCodec } from "../types";
/**
 * Creates a codec for a null-terminated string with a given encoding.
 *
 * @example ```ts
 * string.nullTerminated().serialize('hello')
 * // => <Buffer 68 65 6c 6c 6f 00>
 *
 * string.nullTerminated('ascii').parse(Buffer.from('hello\0', 'ascii'))
 * // => 'hello'
 * ```
 *
 * @param byteLength The length of the string in bytes
 * @param encoding The string encoding to use
 */
export const nullTerminatedString = <C>(
  encoding: BufferEncoding = "utf8"
): BufferCodec<string, C> => ({
  parse: (buffer) => {
    const byteLength = buffer.indexOf(0);
    const value = buffer.slice(0, byteLength).toString(encoding);
    return { value, byteLength: byteLength + 1 };
  },
  serialize: (input) =>
    Buffer.concat([Buffer.from(input, encoding), Buffer.from([0])]),
});
