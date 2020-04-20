import { BufferCodec } from "../types";
import { mapValues } from "lodash";
import { NumberEncoding } from "./encoding";
import { parseNumber, Output } from "./parser";
import { serializeNumber } from "./serializer";

export const numberCodec = <Encoding extends NumberEncoding>(
  type: Encoding
) => ({
  parse: parseNumber[type],
  serialize: serializeNumber[type],
});

type NumberCodecPresets = {
  [T in NumberEncoding]: BufferCodec<Output<T>>;
};

export const number: NumberCodecPresets = mapValues(
  NumberEncoding,
  numberCodec
) as NumberCodecPresets;
