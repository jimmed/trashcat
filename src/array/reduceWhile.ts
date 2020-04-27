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
 * When parsing, this maps over a given `codec` while `whileCallback` returns
 * `true`, and then passes the resulting array to `reduceCallback` to reduce to
 * a value.
 *
 * When serializing, this uses `splitCallback` to convert the single value into
 * an array. This array will be mapped over using the supplied `codec`.
 *
 * @example
 *  // Use previous parsed items to decide when to stop iterating
 *  const itemCodec = props({ id: integer.UInt8, isLast: boolean.UInt8 })
 *  const itemArray = reduceWhile(
 *   itemCodec,
 *   (buffer, context, index, result) => result[index - 1].isLast,
 *   (acc, item) => [...acc, item.id],
 *   [],
 *   items => items.map((id, i) => ({ id, isLast: i === items.length - 1 }))
 *  )
 *
 * @param codec The codec to parse/serialize each item
 * @param whileCallback A callback to execute before each iteration.
 * If the callback returns `true`, iteration will continue.
 * If the callback returns `false`, iteration will cease.
 * @param reduceCallback Reduces over the resulting parsed array to return a parsed value
 * @param initialValue The initial value to pass to the reduceCallback as an accumulator
 * @param splitCallback Converts a parsed value into an array of parsed items to be serialized
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
