import { BufferCodec } from "../types";
/**
 * Uses supplied callbacks to select a codec to parse the buffer.
 *
 * @param chooseParseBranch Returns the codec to use when parsing
 * @param chooseSerializeBranch Returns the codec to use when serializing
 */
export const branch = <T, C>(
  chooseParseBranch: (buffer: Buffer, context: C) => BufferCodec<T, C>,
  chooseSerializeBranch: (parsed: T & C) => BufferCodec<T, C>
): BufferCodec<T, C> => ({
  parse: (buffer, context) =>
    chooseParseBranch(buffer, context!).parse(buffer, context),
  serialize: (parsed) =>
    chooseSerializeBranch(parsed as T & C).serialize(parsed),
});
