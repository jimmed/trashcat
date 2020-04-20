import { BufferCodec } from "../types";

export const extend = <T, U, C>(
  codec: BufferCodec<T, C>,
  parse: (from: T, context: C) => U,
  serialize: (from: U) => T
): BufferCodec<U, C> => ({
  parse: (buffer, context) => {
    const { value, byteLength } = codec.parse(buffer, context);
    return { value: parse(value, context), byteLength };
  },
  serialize: (parsed) => codec.serialize(serialize(parsed)),
});
