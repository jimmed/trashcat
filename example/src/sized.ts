import { BufferCodec, extend, integer, merge, props } from "trashcat";

/**
 * When parsing, accounts for a 'size' field specifying the length of the value serialized by `codec`.
 * When serializing, adds a 'size' field with the byte length of the underlying serialized value.
 * @param codec The underlying codec to use (which returns an object containing the size)
 * @param sizeKey The key to assign the size from (such as "size")
 * @param sizeCodec The codec to use to encode the size value
 * @param includeSizeInSize Whether to include the byteLength of the encoded size value in the value
 */
export const sized = <T extends {}, K extends string, C>(
  codec: BufferCodec<T, C>,
  sizeKey: K,
  sizeCodec: BufferCodec<number, any> = integer.UInt8,
  includeSizeInSize: boolean = false
) =>
  extend<T & Record<K, number>, T, C>(
    merge(props({ [sizeKey]: sizeCodec }), codec) as BufferCodec<
      T & Record<K, number>,
      C
    >,

    ({ [sizeKey]: _, ...obj }) =>
      // @ts-ignore -- TODO: Figure out why TS doesn't like this
      obj as T,

    (obj) => {
      let byteLength = codec.serialize(obj).byteLength;
      if (includeSizeInSize) {
        byteLength += sizeCodec.serialize(byteLength).byteLength;
      }

      return {
        ...obj,
        [sizeKey]: byteLength,
      } as T & Record<K, number>;
    }
  );
