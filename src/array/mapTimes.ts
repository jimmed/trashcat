import { BufferCodec } from "../types";
import { mapWhile } from "./mapWhile";

export interface MapTimesCallback<C> {
  (buffer: Buffer, context: C): number;
}

export type MapTimesCount<C, K> = MapTimesCallback<C> | number | K;
/**
 * When parsing, this codec creates an array by executing a codec a number of times.
 *
 * When serializing, this codec behaves identically to `mapWhile`.
 *
 * @param codec The codec to iterate over
 * @param count The number of times to iterate when parsing.
 *
 * This can be supplied as:
 *
 *  - a number
 *  - a string. This must be a key from the context (assuming context is an object),
 *    whose associated value is a number.
 *  - a callback which returns a number. The callback will be called before each iteration.
 *
 * @example
 *  // A codec for a fixed-length array:
 *  const threeUInt8s = mapTimes(integer.UInt8, 3)
 *
 * @example
 *  // Getting the length from context by key:
 *  const someUInt8s = merge(
 *    props({ count: integer.UInt8 }),
 *    props({ items: mapTimes(integer.UInt8, 'count') })
 *  )
 */
export function mapTimes<T, C>(
  codec: BufferCodec<T, C>,
  count: number
): BufferCodec<T[], C>;

export function mapTimes<T, C extends { [O in K]: number }, K extends keyof C>(
  codec: BufferCodec<T, C>,
  count: K
): BufferCodec<T[], C>;

export function mapTimes<T, C>(
  codec: BufferCodec<T, C>,
  count: MapTimesCallback<C>
): BufferCodec<T[], C>;

export function mapTimes<T, C extends { [O in K]: number }, K extends keyof C>(
  codec: BufferCodec<T, C>,
  count: MapTimesCount<C, K>
) {
  switch (typeof count) {
    case "number":
      return mapWhile(codec, (_, __, i) => i < count);
    case "string":
      return mapWhile(codec, (_, c, i) => i < c![count]);
    case "function":
      return mapWhile(codec, (b, c, i) => i < count(b, c!));
  }
}
