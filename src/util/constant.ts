import { BufferCodec } from "../types";

/**
 * When parsing, returns the constant `value`.
 *
 * When serializing, returns an empty buffer regardless of parsed value.
 *
 * When using with TypeScript, be sure to specify your value using `as const`.
 * This can be useful when using conditional codecs like `branch` and `either`.
 *
 * @example
 *  constant(8 as const).parse(Buffer.alloc(0))
 *  // => 8
 *
 *  constant(8 as const).serialize(1234)
 *  // => <Buffer (empty)>
 *
 *
 * @param value The constant value to return when parsing
 */
export const constant = <T, C>(value: T): BufferCodec<T, C> => ({
  parse: () => ({ value, byteLength: 0 }),
  serialize: () => Buffer.alloc(0),
});
