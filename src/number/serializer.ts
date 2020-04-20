import { mapValues } from "lodash";
import { byteLengths, NumberEncoding } from "./encoding";

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

export interface NumberSerializer<T> {
  (value: T): Buffer;
}

interface numberSerializer {
  <Encoding extends keyof typeof bufferWriteFns>(
    type: Encoding
  ): NumberSerializer<Parameters<Buffer[typeof bufferWriteFns[Encoding]]>[0]>;
}

type Input<Encoding extends keyof typeof bufferWriteFns> = Parameters<
  Buffer[typeof bufferWriteFns[Encoding]]
>[0];

function numberSerializer<Encoding extends keyof typeof bufferWriteFns>(
  type: Encoding
) {
  const writerFn: typeof bufferWriteFns[Encoding] = bufferWriteFns[type];
  const byteLength: typeof byteLengths[Encoding] = byteLengths[type];
  return ((value) => {
    const buf = Buffer.alloc(byteLength);
    // @ts-ignore
    buf[writerFn](value);
    return buf;
  }) as NumberSerializer<Input<Encoding>>;
}
