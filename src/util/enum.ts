import { BufferCodec } from "../types";
import { validate } from "./validate";

export const enumerator = <E extends string | number>(
  codec: BufferCodec<E, any>,
  values: E[]
) => validate(codec, (value) => values.includes(value), "Invalid value");
