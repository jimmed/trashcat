import { BufferCodec } from "../types";
import { choose } from "./choose";

export const optional = <T, F, C extends {}>(
  shouldParse: (buffer: Buffer, context: C) => boolean,
  shouldSerialize: (parsed: (T & C) | (F & C)) => boolean,
  trueCodec: BufferCodec<T, C>,
  falseCodec: BufferCodec<F, C>
): BufferCodec<T | F, C> =>
  choose<T | F, C, 0 | 1>(
    (b, c) => (shouldParse(b, c) ? 0 : 1),
    (c) => (shouldSerialize(c) ? 0 : 1),
    [trueCodec, falseCodec]
  );
