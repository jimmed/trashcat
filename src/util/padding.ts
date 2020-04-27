import { BufferCodec } from "../types";

/**
 * When parsing, this will skip over `byteLength` bytes of the buffer. It
 * returns an empty object, for use with `merge`.
 *
 * When serializing, this will return a Buffer of length `byteLength`, filled
 * with `fill` (and optional `encoding`), as per `Buffer.alloc`.
 *
 * @example
 *   padding(4).parse(Buffer.alloc(10))
 *   // => { value: {}, byteLength: 4 }
 *
 *   padding(4, 0xFF).serialize({})
 *   // => <Buffer FF FF FF FF>
 *
 * @param byteLength The number of bytes of padding
 * @param fill The value to fill the padding with
 * @param encoding If `fill` is a string, the text encoding to use
 */
export const padding = <F extends string | number | Buffer, C>(
  byteLength: number,
  fill: F = 0 as F,
  encoding?: BufferEncoding
): BufferCodec<{}, C> => ({
  parse: () => ({ value: {}, byteLength }),
  serialize: () => Buffer.alloc(byteLength, fill, encoding),
});
