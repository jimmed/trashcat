import { BufferCodec, FieldsOf } from "../types";

/**
 * A codec for parsing a Buffer into an object. Fields are executed in the
 * order they are specified.
 *
 * ```ts
 * const userCodec = fields({
 *  userId: number.UInt8,
 *  foo: number.UInt16LE
 * })
 * ```
 */
export const fields = <T, C>(
  fields: FieldsOf<T, C> = {} as FieldsOf<T, C>
): BufferCodec<T, C> => {
  const fieldEntries = Object.entries(fields) as [
    keyof T,
    BufferCodec<any, C>
  ][];

  return {
    parse: (buffer, context) =>
      fieldEntries.reduce(
        ({ value, byteLength }, [name, { parse }]) => {
          const view = buffer.slice(byteLength);
          const result = parse(view, { ...context, ...value });
          return {
            value: { ...value, [name]: result },
            byteLength: byteLength + result.byteLength,
          };
        },
        { value: {}, byteLength: 0 }
      ) as { value: T; byteLength: number },
    serialize: (parsed) =>
      Buffer.concat(
        fieldEntries.map(([name, { serialize }]) => serialize(parsed[name]))
      ),
  };
};
