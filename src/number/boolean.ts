import { mapValues } from "lodash";
import { BufferCodec } from "../types";
import { extend } from "../util/extend";
import { number, NumberEncoding, Output, returnsBigInt } from "./encoding";

export type BooleanCodecPresets = {
  [T in NumberEncoding]: BufferCodec<boolean, any>;
};

export const boolean: BooleanCodecPresets = mapValues(
  NumberEncoding,
  <C>(type: NumberEncoding) =>
    extend(
      number[type] as BufferCodec<Output<typeof type>, C>,
      (n) => !!n,
      returnsBigInt(type) ? (n) => (n ? 1n : 0n) : (n) => (n ? 1 : 0)
    )
);
