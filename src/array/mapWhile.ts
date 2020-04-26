import { BufferCodec } from "../types";

/**
 * Called before each iteration of a `mapWhile` loop.
 */
export interface MapWhileCallback<T, C> {
  (buffer: Buffer, context: C, index: number, results: T[]): boolean;
}

/**
 * Maps over a given `codec` while `whileCallback` returns `true`.
 *
 * @param codec The codec to iterate with
 * @param whileCallback A callback to execute before each iteration.
 * If the callback returns `true`, iteration will continue.
 * If the callback returns `false`, iteration will cease.
 */
export const mapWhile = <T, C>(
  codec: BufferCodec<T, C>,
  whileCallback: MapWhileCallback<T, C>
): BufferCodec<T[], C> => ({
  parse: (buffer, context) => {
    let results: T[] = [];
    let offset = 0;
    let index = 0;

    while (whileCallback(buffer.slice(offset), context, index, results)) {
      const view = buffer.slice(offset);
      const lastResult = codec.parse(view, context);
      offset += lastResult.byteLength;
      index++;
      results = [...results, lastResult.value];
    }

    return { value: results, byteLength: offset };
  },

  serialize: (parsed) =>
    Buffer.concat(parsed.map((item) => codec.serialize(item))),
});
