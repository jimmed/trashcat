import { BufferCodec } from "../types";

export const mapUntil = <T, C>(
  codec: BufferCodec<T, C>,
  until: (buffer: Buffer, context: C, index: number, results: T[]) => boolean
): BufferCodec<T[], C> => ({
  parse: (buffer, context) => {
    let index = 0;
    let offset = 0;
    const results: T[] = [];
    do {
      const view = buffer.slice(offset);
      const lastResult = codec.parse(view, context);
      results.push(lastResult.value);
      offset += lastResult.byteLength;
      index++;
    } while (!until(buffer.slice(offset), context, index, results));

    return { value: results, byteLength: offset };
  },
  serialize: (parsed) =>
    Buffer.concat(parsed.map((item) => codec.serialize(item))),
});

export const times = <T, C>(codec: BufferCodec<T, C>, times: number) =>
  mapUntil(codec, (_, __, index) => index < times);
