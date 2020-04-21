import { BufferCodec } from "../types";
/**
 * **Experimental!**
 *
 * Uses supplied callbacks to select a codec to parse the buffer.
 */
export const branch = <T, C>(
  chooseReadBranch: (buffer: Buffer, context: C) => BufferCodec<T, C>,
  chooseWriteBranch: (parsed: T) => BufferCodec<T, C>
): BufferCodec<T, C> => ({
  parse: (buffer, context) => {
    const codec = chooseReadBranch(buffer, context);
    return codec.parse(buffer, context);
  },
  serialize: (parsed) => {
    const codec = chooseWriteBranch(parsed);
    return codec.serialize(parsed);
  },
});
