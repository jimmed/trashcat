import { mapValues } from "lodash";
import { BufferCodec } from "../types";

export enum NumberEncoding {
  UInt8 = "UInt8",
  UInt16LE = "UInt16LE",
  UInt16BE = "UInt16BE",
  UInt32LE = "UInt32LE",
  UInt32BE = "UInt32BE",
  BigUInt64LE = "BigUInt64LE",
  BigUInt64BE = "BigUInt64BE",
  Int8 = "Int8",
  Int16LE = "Int16LE",
  Int16BE = "Int16BE",
  Int32LE = "Int32LE",
  Int32BE = "Int32BE",
  BigInt64LE = "BigInt64LE",
  BigInt64BE = "BigInt64BE",
}

export const byteLengths = {
  [NumberEncoding.UInt8]: 1,
  [NumberEncoding.UInt16LE]: 2,
  [NumberEncoding.UInt16BE]: 2,
  [NumberEncoding.UInt32LE]: 4,
  [NumberEncoding.UInt32BE]: 4,
  [NumberEncoding.BigUInt64LE]: 8,
  [NumberEncoding.BigUInt64BE]: 8,
  [NumberEncoding.Int8]: 1,
  [NumberEncoding.Int16LE]: 2,
  [NumberEncoding.Int16BE]: 2,
  [NumberEncoding.Int32LE]: 4,
  [NumberEncoding.Int32BE]: 4,
  [NumberEncoding.BigInt64LE]: 8,
  [NumberEncoding.BigInt64BE]: 8,
} as const;

export type BigIntTypes =
  | NumberEncoding.BigUInt64LE
  | NumberEncoding.BigUInt64BE
  | NumberEncoding.BigInt64LE
  | NumberEncoding.BigInt64BE;

export const returnsBigInt = (type: NumberEncoding): type is BigIntTypes =>
  byteLengths[type] === 8;

const bufferReadFns = {
  [NumberEncoding.UInt8]: "readUInt8",
  [NumberEncoding.UInt16LE]: "readUInt16LE",
  [NumberEncoding.UInt16BE]: "readUInt16BE",
  [NumberEncoding.UInt32LE]: "readUInt32LE",
  [NumberEncoding.UInt32BE]: "readUInt32BE",
  [NumberEncoding.BigUInt64LE]: "readBigUInt64LE",
  [NumberEncoding.BigUInt64BE]: "readBigUInt64BE",
  [NumberEncoding.Int8]: "readInt8",
  [NumberEncoding.Int16LE]: "readInt16LE",
  [NumberEncoding.Int16BE]: "readInt16BE",
  [NumberEncoding.Int32LE]: "readInt32LE",
  [NumberEncoding.Int32BE]: "readInt32BE",
  [NumberEncoding.BigInt64LE]: "readBigInt64LE",
  [NumberEncoding.BigInt64BE]: "readBigInt64BE",
} as const;

const bufferWriteFns = {
  [NumberEncoding.UInt8]: "writeUInt8",
  [NumberEncoding.UInt16LE]: "writeUInt16LE",
  [NumberEncoding.UInt16BE]: "writeUInt16BE",
  [NumberEncoding.UInt32LE]: "writeUInt32LE",
  [NumberEncoding.UInt32BE]: "writeUInt32BE",
  [NumberEncoding.BigUInt64LE]: "writeBigUInt64LE",
  [NumberEncoding.BigUInt64BE]: "writeBigUInt64BE",
  [NumberEncoding.Int8]: "writeInt8",
  [NumberEncoding.Int16LE]: "writeInt16LE",
  [NumberEncoding.Int16BE]: "writeInt16BE",
  [NumberEncoding.Int32LE]: "writeInt32LE",
  [NumberEncoding.Int32BE]: "writeInt32BE",
  [NumberEncoding.BigInt64LE]: "writeBigInt64LE",
  [NumberEncoding.BigInt64BE]: "writeBigInt64BE",
} as const;

export interface NumberParser<Parsed, Length extends number> {
  (buffer: Buffer): { value: Parsed; byteLength: Length };
}

export interface NumberSerializer<T> {
  (value: T): Buffer;
}

export type Output<T extends NumberEncoding> = ReturnType<
  Buffer[typeof bufferReadFns[T]]
>;

export type Input<Encoding extends NumberEncoding> = Parameters<
  Buffer[typeof bufferWriteFns[Encoding]]
>[0];

export function numberParser<Encoding extends NumberEncoding>(
  type: Encoding
): NumberParser<
  ReturnType<Buffer[typeof bufferReadFns[Encoding]]>,
  typeof byteLengths[Encoding]
> {
  const readerFn: typeof bufferReadFns[Encoding] = bufferReadFns[type];
  const byteLength: typeof byteLengths[Encoding] = byteLengths[type];
  return ((buffer) => ({
    value: buffer[readerFn](),
    byteLength,
  })) as NumberParser<Output<Encoding>, typeof byteLength>;
}

export function numberSerializer<Encoding extends keyof typeof bufferWriteFns>(
  type: Encoding
): NumberSerializer<Input<Encoding>> {
  const writerFnName: typeof bufferWriteFns[Encoding] = bufferWriteFns[type];
  const byteLength: typeof byteLengths[Encoding] = byteLengths[type];
  return ((value) => {
    const buf = Buffer.alloc(byteLength);
    // @ts-ignore
    buf[writerFnName](value);
    return buf;
  }) as NumberSerializer<Input<Encoding>>;
}

export const numberCodec = <Encoding extends NumberEncoding>(
  type: Encoding
) => ({
  parse: numberParser(type),
  serialize: numberSerializer(type),
});

export type NumberCodecPresets = {
  [T in NumberEncoding]: BufferCodec<Output<T>, any>;
};

export const number: NumberCodecPresets = mapValues(
  NumberEncoding,
  numberCodec
) as NumberCodecPresets;
