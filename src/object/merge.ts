import { BufferCodec } from "../types";

export function merge<A extends {}>(a: BufferCodec<A>): BufferCodec<A>;
export function merge<A extends {}, B extends {}>(
  a: BufferCodec<A>,
  b: BufferCodec<B>
): BufferCodec<Omit<A, keyof B> & B>;
export function merge<A extends {}, B extends {}, C extends {}>(
  a: BufferCodec<A>,
  b: BufferCodec<B>,
  c: BufferCodec<C>
): BufferCodec<Omit<Omit<A, keyof B> & B, keyof C> & C>;
export function merge<A extends {}, B extends {}, C extends {}, D extends {}>(
  a: BufferCodec<A>,
  b: BufferCodec<B>,
  c: BufferCodec<C>,
  d: BufferCodec<D>
): BufferCodec<Omit<Omit<Omit<A, keyof B> & B, keyof C> & C, keyof D> & D>;
export function merge<
  A extends {},
  B extends {},
  C extends {},
  D extends {},
  E extends {}
>(
  a: BufferCodec<A>,
  b: BufferCodec<B>,
  c: BufferCodec<C>,
  d: BufferCodec<D>,
  e: BufferCodec<E>
): BufferCodec<
  Omit<Omit<Omit<Omit<A, keyof B> & B, keyof C> & C, keyof D> & D, keyof E> & E
>;

/**
 * Creates a codec which merges together multiple codecs, calling each
 * codec in sequence, and merging the object returned by each.
 *
 * ```ts
 * const userCodec = merge(
 *   fields({ userId: number.UInt8 }),
 *   fields({ foo: number.UInt8 })
 * )
 *
 * userCodec.parse(Buffer.from([1234, 1337])).value
 * // => { userId: 1234, foo: 1337 }
 * ```
 */
export function merge(...codecs: BufferCodec<any>[]): BufferCodec<any> {
  return {
    parse: (buffer: Buffer) =>
      codecs.reduce(
        ({ value, byteLength }, codec) => {
          const view = buffer.slice(byteLength);
          const result = codec.parse(view);
          return {
            value: { ...value, ...result.value },
            byteLength: byteLength + result.byteLength,
          };
        },
        { value: {}, byteLength: 0 }
      ),
    serialize: (input: any) =>
      Buffer.concat(codecs.map((codec) => codec.serialize(input))),
  };
}
