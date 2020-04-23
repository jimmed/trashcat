import { BufferCodec } from "../types";
import { extend } from "./extend";

export const validate = <T, C>(
  codec: BufferCodec<T, C>,
  condition: (value: T, context?: C) => boolean,
  errorMsg?: string
): BufferCodec<T, C> => {
  const assertion = (value: T, context?: C) => {
    if (!condition(value, context)) {
      throw new Error(errorMsg);
    }
  };

  return extend(
    codec,
    (v, c) => {
      assertion(v, c);
      return v;
    },
    (v) => {
      assertion(v);
      return v;
    }
  );
};
