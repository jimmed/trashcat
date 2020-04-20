import { BufferCodec } from "../types";

const assertion = (condition: boolean, errorMsg?: string) => {
  if (!condition) {
    throw new Error(errorMsg);
  }
};

export const assert = <Context>(
  condition: (context: Context) => boolean,
  errorMsg?: string
): BufferCodec<{}, Context> => ({
  parse: (_, context) => {
    assertion(condition(context), errorMsg);
    return { value: {}, byteLength: 0 };
  },
  serialize: () => Buffer.alloc(0),
});
