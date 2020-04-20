import { BufferCodec, FieldsOf } from "../types";

/**
 * Creates a codec for parsing a sequence of codecs, and assigning the result
 * of each to an object.
 *
 * ```ts
 * const userCodec = fields({
 *  userId: number.UInt8,
 *  foo: number.UInt16LE
 * })
 * ```
 */
export const fields = <T>(
  fields: FieldsOf<T> = {} as FieldsOf<T>
): BufferCodec<T> => {
  const fieldEntries = Object.entries(fields) as [keyof T, BufferCodec<any>][];

  return {
    parse: (buffer) => {
      let offset = 0;

      const value: T = Object.fromEntries(
        fieldEntries.map(([name, { parse }]) => {
          const view = buffer.slice(offset);
          const { value, byteLength } = parse(view);
          offset += byteLength;
          return [name, value];
        })
      );

      return { value, byteLength: offset };
    },
    serialize: (parsed) =>
      Buffer.concat(
        fieldEntries.map(([name, { serialize }]) => serialize(parsed[name]))
      ),
  };
};
