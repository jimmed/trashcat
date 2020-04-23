import { BufferCodec } from "../types";

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
