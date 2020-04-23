import { BufferCodec } from "../types";
/**
 * Uses supplied callbacks to select a codec to parse the buffer.
 */
export const branch = <T, C>(
  chooseReadBranch: (buffer: Buffer, context: C) => BufferCodec<T, C>,
  chooseWriteBranch: (parsed: T & C) => BufferCodec<T, C>
): BufferCodec<T, C> => ({
  parse: (buffer, context) =>
    chooseReadBranch(buffer, context).parse(buffer, context),
  serialize: (parsed) => chooseWriteBranch(parsed as T & C).serialize(parsed),
});
