import { byteLengths, NumberEncoding } from "./encoding";

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

export interface NumberParser<Parsed, Length extends number> {
  (buffer: Buffer): { value: Parsed; byteLength: Length };
}

export type Output<T extends NumberEncoding> = ReturnType<
  Buffer[typeof bufferReadFns[T]]
>;

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
