import { BufferCodec } from "../types";

export const constant = <T, C>(parsedValue: T): BufferCodec<T, C> => ({
  parse: () => ({ value: parsedValue, byteLength: 0 }),
  serialize: () => Buffer.alloc(0),
});
