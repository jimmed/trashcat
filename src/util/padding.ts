import { BufferCodec } from "../types";

export const padding = <F extends string | number | Buffer | undefined, C>(
  byteLength: number,
  fill: F,
  encoding?: BufferEncoding
): BufferCodec<C, C> => ({
  parse: (_, value) => ({ value, byteLength }),
  serialize: () => Buffer.alloc(byteLength, fill, encoding),
});
