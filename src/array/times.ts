import { BufferCodec } from "../types";
import { map } from "./map";

export const times = <T, C>(
  codec: BufferCodec<T, C>,
  times: number | ((buffer: Buffer, context: C) => number)
): BufferCodec<T[], C> =>
  map(
    codec,
    typeof times === "number"
      ? (_, __, i) => i >= times
      : (b, c, i, r) => i >= times(b, c)
  );
