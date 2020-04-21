import { BufferCodec } from "../types";

export const tap = <Context>(
  callback: (buffer: Buffer, context: Context) => void
): BufferCodec<{}, Context> => ({
  parse: (buffer, context) => {
    callback(buffer, context);
    return { value: context, byteLength: 0 };
  },
  serialize: () => Buffer.alloc(0),
});
