import { BufferCodec } from "../types";
import { extend } from "./extend";

export const validate = <E>(values: E[]) => (value: E) => {
  if (!values.includes(value)) {
    throw new Error(`Invalid value: ${value}`);
  }
  return value as E;
};

export const enumerator = <E extends string | number>(
  codec: BufferCodec<E, any>,
  values: E[]
) => {
  const validator = validate(values);
  return extend(codec, validator, validator);
};
