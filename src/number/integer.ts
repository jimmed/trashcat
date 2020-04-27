import { BufferCodec } from "../types";

export enum IntegerEncoding {
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

const byteLengths = {
  [IntegerEncoding.UInt8]: 1,
  [IntegerEncoding.UInt16LE]: 2,
  [IntegerEncoding.UInt16BE]: 2,
  [IntegerEncoding.UInt32LE]: 4,
  [IntegerEncoding.UInt32BE]: 4,
  [IntegerEncoding.BigUInt64LE]: 8,
  [IntegerEncoding.BigUInt64BE]: 8,
  [IntegerEncoding.Int8]: 1,
  [IntegerEncoding.Int16LE]: 2,
  [IntegerEncoding.Int16BE]: 2,
  [IntegerEncoding.Int32LE]: 4,
  [IntegerEncoding.Int32BE]: 4,
  [IntegerEncoding.BigInt64LE]: 8,
  [IntegerEncoding.BigInt64BE]: 8,
} as const;

type BigIntTypes =
  | IntegerEncoding.BigUInt64LE
  | IntegerEncoding.BigUInt64BE
  | IntegerEncoding.BigInt64LE
  | IntegerEncoding.BigInt64BE;

export const returnsBigInt = (type: IntegerEncoding): type is BigIntTypes =>
  byteLengths[type] === 8;

const bufferReadFns = {
  [IntegerEncoding.UInt8]: "readUInt8",
  [IntegerEncoding.UInt16LE]: "readUInt16LE",
  [IntegerEncoding.UInt16BE]: "readUInt16BE",
  [IntegerEncoding.UInt32LE]: "readUInt32LE",
  [IntegerEncoding.UInt32BE]: "readUInt32BE",
  [IntegerEncoding.BigUInt64LE]: "readBigUInt64LE",
  [IntegerEncoding.BigUInt64BE]: "readBigUInt64BE",
  [IntegerEncoding.Int8]: "readInt8",
  [IntegerEncoding.Int16LE]: "readInt16LE",
  [IntegerEncoding.Int16BE]: "readInt16BE",
  [IntegerEncoding.Int32LE]: "readInt32LE",
  [IntegerEncoding.Int32BE]: "readInt32BE",
  [IntegerEncoding.BigInt64LE]: "readBigInt64LE",
  [IntegerEncoding.BigInt64BE]: "readBigInt64BE",
} as const;

const bufferWriteFns = {
  [IntegerEncoding.UInt8]: "writeUInt8",
  [IntegerEncoding.UInt16LE]: "writeUInt16LE",
  [IntegerEncoding.UInt16BE]: "writeUInt16BE",
  [IntegerEncoding.UInt32LE]: "writeUInt32LE",
  [IntegerEncoding.UInt32BE]: "writeUInt32BE",
  [IntegerEncoding.BigUInt64LE]: "writeBigUInt64LE",
  [IntegerEncoding.BigUInt64BE]: "writeBigUInt64BE",
  [IntegerEncoding.Int8]: "writeInt8",
  [IntegerEncoding.Int16LE]: "writeInt16LE",
  [IntegerEncoding.Int16BE]: "writeInt16BE",
  [IntegerEncoding.Int32LE]: "writeInt32LE",
  [IntegerEncoding.Int32BE]: "writeInt32BE",
  [IntegerEncoding.BigInt64LE]: "writeBigInt64LE",
  [IntegerEncoding.BigInt64BE]: "writeBigInt64BE",
} as const;

interface IntegerParser<Parsed, Length extends number> {
  (buffer: Buffer): { value: Parsed; byteLength: Length };
}

interface IntegerSerializer<T> {
  (value: T): Buffer;
}

export type Output<T extends IntegerEncoding> = ReturnType<
  Buffer[typeof bufferReadFns[T]]
>;

type Input<Encoding extends IntegerEncoding> = Parameters<
  Buffer[typeof bufferWriteFns[Encoding]]
>[0];

function integerParser<Encoding extends IntegerEncoding>(
  type: Encoding
): IntegerParser<
  ReturnType<Buffer[typeof bufferReadFns[Encoding]]>,
  typeof byteLengths[Encoding]
> {
  const readerFn: typeof bufferReadFns[Encoding] = bufferReadFns[type];
  const byteLength: typeof byteLengths[Encoding] = byteLengths[type];
  return ((buffer) => ({
    value: buffer[readerFn](),
    byteLength,
  })) as IntegerParser<Output<Encoding>, typeof byteLength>;
}

function integerSerializer<Encoding extends keyof typeof bufferWriteFns>(
  type: Encoding
): IntegerSerializer<Input<Encoding>> {
  const writerFnName: typeof bufferWriteFns[Encoding] = bufferWriteFns[type];
  const byteLength: typeof byteLengths[Encoding] = byteLengths[type];
  return ((value) => {
    const buf = Buffer.alloc(byteLength);
    buf[writerFnName](
      // @ts-ignore -- TODO: figure out
      value
    );
    return buf;
  }) as IntegerSerializer<Input<Encoding>>;
}

const integerCodec = <Encoding extends IntegerEncoding>(type: Encoding) => ({
  parse: integerParser(type),
  serialize: integerSerializer(type),
});

type IntegerCodecs = {
  [T in IntegerEncoding]: BufferCodec<Output<T>, any>;
};

export const integer = Object.values(IntegerEncoding).reduce(
  (acc, key) => ({ ...acc, [key]: integerCodec(key) }),
  {}
) as IntegerCodecs;
