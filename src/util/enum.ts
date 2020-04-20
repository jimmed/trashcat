import { BufferCodec } from "../types";
import { extend } from "./extend";

export const enumerator = <E extends string | number>(
  codec: BufferCodec<E, any>,
  values: E[]
) =>
  extend(
    codec,
    (value) => {
      if (!values.includes(value)) {
        throw new Error(`Invalid value: ${value}`);
      }
      return value;
    },
    (value) => value as E
  );
