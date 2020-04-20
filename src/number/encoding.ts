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

type BigIntTypes =
  | NumberEncoding.BigUInt64LE
  | NumberEncoding.BigUInt64BE
  | NumberEncoding.BigInt64LE
  | NumberEncoding.BigInt64BE;

export const returnsBigInt = (type: NumberEncoding): type is BigIntTypes =>
  byteLengths[type] === 8;
