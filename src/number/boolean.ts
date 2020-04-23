import { mapValues } from "lodash";
import { BufferCodec } from "../types";
import { extend } from "../util";
import { integer, IntegerEncoding, Output, returnsBigInt } from "./integer";

type BooleanCodecPresets = {
  [T in IntegerEncoding]: BufferCodec<boolean, any>;
};

export const boolean: BooleanCodecPresets = mapValues(
  IntegerEncoding,
  <C>(type: IntegerEncoding) =>
    extend(
      integer[type] as BufferCodec<Output<typeof type>, C>,
      (n) => !!n,
      returnsBigInt(type) ? (n) => (n ? 1n : 0n) : (n) => (n ? 1 : 0)
    )
);
