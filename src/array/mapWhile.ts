import { BufferCodec } from "../types";
import { reduceWhile, ReduceWhileCallback } from "./reduceWhile";

/**
 * Called before each iteration of a `mapWhile` loop.
 */
export interface MapWhileCallback<T, C> extends ReduceWhileCallback<T[], C> {}

/**
 * When parsing, this maps over a given `codec` while `whileCallback` returns
 * `true`, and then returns the resulting array of parsed values.
 *
 * When serializing, the array of parsed values be mapped over using the
 * supplied `codec`.
 *
 * @param codec The codec to iterate with
 * @param whileCallback A callback to execute before each iteration.
 * If the callback returns `true`, iteration will continue.
 * If the callback returns `false`, iteration will cease.
 *
 * @example
 *  // Map until buffer is exhausted
 *  mapWhile(string.nullTerminated(), buffer => buffer.length > 0)
 */
export const mapWhile = <T, C>(
  codec: BufferCodec<T, C>,
  whileCallback: MapWhileCallback<T, C>
): BufferCodec<T[], C> =>
  reduceWhile(
    codec,
    whileCallback,
    (acc, item) => [...acc, item],
    [] as T[],
    (items) => items
  );
