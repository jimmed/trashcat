import { BufferCodec } from "../types";

/**
 * Extend the capabilities of an existing codec by wrapping it with additional
 * `parse` and `serialize` methods.
 *
 * @example
 *   const numericString = extend(
 *     string.nullTerminated(),
 *     s => parseInt(s, 10),
 *     s => s.toString()
 *   )
 *
 * @param codec The codec to extend
 * @param parse Transforms the value parsed by `codec`
 * @param serialize Transforms the value serialized by `codec`
 */
export const extend = <T, U, C>(
  codec: BufferCodec<T, C>,
  parse: (from: T, context: C) => U,
  serialize: (from: U) => T
): BufferCodec<U, C> => ({
  parse: (buffer, context) => {
    const { value, byteLength } = codec.parse(buffer, context);
    return { value: parse(value, context!), byteLength };
  },
  serialize: (parsed) => codec.serialize(serialize(parsed)),
});
