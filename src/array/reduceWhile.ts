import { BufferCodec } from "../types";

/**
 * Called before each iteration of a `reduceWhile` loop.
 */
export interface ReduceWhileCallback<U, C> {
  (buffer: Buffer, context: C, index: number, result: U): boolean;
}

export interface ReduceCallback<T, U, C> {
  (accumulator: U, item: T, context: C, index: number): U;
}

export interface ReduceSplitCallback<T, U> {
  (accumulated: U): T[];
}

/**
 * Reduces over a given `codec` while `whileCallback` returns `true`.
 *
 * @param codec The codec to iterate with
 * @param whileCallback A callback to execute before each iteration.
 * @param reduceCallback A callback to reduce over the resulting array
 * If the callback returns `true`, iteration will continue.
 * If the callback returns `false`, iteration will cease.
 */
export const reduceWhile = <T, U, C>(
  codec: BufferCodec<T, C>,
  whileCallback: ReduceWhileCallback<U, C>,
  reduceCallback: ReduceCallback<T, U, C>,
  initialValue: U,
  splitCallback: ReduceSplitCallback<T, U>
): BufferCodec<U, C> => ({
  parse: (buffer, context) => {
    let offset = 0;
    let index = 0;
    let result = initialValue;

    while (whileCallback(buffer.slice(offset), context, index, result)) {
      const view = buffer.slice(offset);
      const lastResult = codec.parse(view, context);
      offset += lastResult.byteLength;
      result = reduceCallback(result, lastResult.value, context, index);
      index++;
    }

    return { value: result, byteLength: offset };
  },

  serialize: (parsed) =>
    Buffer.concat(splitCallback(parsed).map((item) => codec.serialize(item))),
});
