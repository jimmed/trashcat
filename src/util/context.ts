import { BufferCodec } from "../types";
import { extend } from "./extend";

export const returningContext = <C>(
  codec: BufferCodec<any, C>
): BufferCodec<C, C> =>
  extend(
    codec,
    (_, c) => c,
    (x) => x
  );

export const mergingContext = <T, C>(
  codec: BufferCodec<T, C>
): BufferCodec<T & C, C> =>
  extend(
    codec,
    (x, c) => ({ ...c, ...x }),
    (x) => x
  );
