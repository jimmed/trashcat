import { BufferCodec } from "../types";
import { reduceWhile, ReduceWhileCallback } from "./reduceWhile";

/**
 * Called before each iteration of a `mapWhile` loop.
 */
export interface MapWhileCallback<T, C> extends ReduceWhileCallback<T[], C> {}

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
): BufferCodec<T[], C> =>
  reduceWhile(
    codec,
    whileCallback,
    (acc, item) => [...acc, item],
    [] as T[],
    (items) => items
  );
