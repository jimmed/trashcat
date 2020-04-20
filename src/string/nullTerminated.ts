import { BufferCodec } from "../types";

export const nullTerminatedString = <C>(
  encoding: BufferEncoding
): BufferCodec<string, C> => ({
  parse: (buffer) => {
    const byteLength = buffer.indexOf(0);
    const value = buffer.slice(0, byteLength).toString(encoding);
    return { value, byteLength };
  },
  serialize: (input) =>
    Buffer.concat([Buffer.from(input, encoding), Buffer.from([0])]),
});
