import { mapValues } from "lodash";
import { BufferCodec } from "../types";
import { NumberEncoding } from "./encoding";
import { Output } from "./parser";

export const numberCodec = <Encoding extends NumberEncoding>(
  type: Encoding
) => ({
  parse: number[type].parse,
  serialize: number[type].serialize,
});

type NumberCodecPresets = {
  [T in NumberEncoding]: BufferCodec<Output<T>, any>;
};

export const number: NumberCodecPresets = mapValues(
  NumberEncoding,
  numberCodec
) as NumberCodecPresets;
