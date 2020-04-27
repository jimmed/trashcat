import { BufferCodec } from "../types";

/**
 * Creates a codec for a fixed-length string with a given encoding.
 *
 * @example ```ts
 * string.fixedLength(5).serialize('hello')
 * // => <Buffer 68 65 6c 6c 6f>
 *
 * string.fixedLength(5, 'ascii').parse(Buffer.from('hello', 'ascii'))
 * // => 'hello'
 * ```
 *
 * @param byteLength The length of the string in bytes
 * @param encoding The string encoding to use
 */
export const fixedLengthString = <C>(
  byteLength: number,
  encoding: BufferEncoding = "utf8"
): BufferCodec<string, C> => ({
  parse: (buffer) => {
    const value = buffer.slice(0, byteLength).toString(encoding);
    return { value, byteLength };
  },
  serialize: (input) => {
    const buffer = Buffer.alloc(byteLength);
    buffer.write(input, encoding);
    return buffer;
  },
});
