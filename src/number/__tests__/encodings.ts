import { NumberEncoding } from "../encoding";

export const encodings = [
  [NumberEncoding.UInt8, 1, [255], 255],
  [NumberEncoding.UInt16LE, 2, [10, 13], 3338],
  [NumberEncoding.UInt16BE, 2, [10, 13], 2573],
  [NumberEncoding.UInt32LE, 4, [1, 2, 3, 4], 67305985],
  [NumberEncoding.UInt32BE, 4, [1, 2, 3, 4], 16909060],
  [
    NumberEncoding.BigUInt64LE,
    8,
    [1, 2, 3, 4, 5, 6, 7, 8],
    578437695752307201n,
  ],
  [NumberEncoding.BigUInt64BE, 8, [1, 2, 3, 4, 5, 6, 7, 8], 72623859790382856n],
  [NumberEncoding.Int8, 1, [255], -1],
  [NumberEncoding.Int16LE, 2, [10, 13], 3338],
  [NumberEncoding.Int16BE, 2, [10, 13], 2573],
  [NumberEncoding.Int32LE, 4, [1, 2, 3, 4], 67305985],
  [NumberEncoding.Int32BE, 4, [1, 2, 3, 4], 16909060],
  [NumberEncoding.BigInt64LE, 8, [1, 2, 3, 4, 5, 6, 7, 8], 578437695752307201n],
  [NumberEncoding.BigInt64BE, 8, [1, 2, 3, 4, 5, 6, 7, 8], 72623859790382856n],
] as const;
