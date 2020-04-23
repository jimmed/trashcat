import { IntegerEncoding } from "../integer";

export const fixtures = [
  [IntegerEncoding.UInt8, 1, [255], 255],
  [IntegerEncoding.UInt16LE, 2, [10, 13], 3338],
  [IntegerEncoding.UInt16BE, 2, [10, 13], 2573],
  [IntegerEncoding.UInt32LE, 4, [1, 2, 3, 4], 67305985],
  [IntegerEncoding.UInt32BE, 4, [1, 2, 3, 4], 16909060],
  [
    IntegerEncoding.BigUInt64LE,
    8,
    [1, 2, 3, 4, 5, 6, 7, 8],
    578437695752307201n,
  ],
  [
    IntegerEncoding.BigUInt64BE,
    8,
    [1, 2, 3, 4, 5, 6, 7, 8],
    72623859790382856n,
  ],
  [IntegerEncoding.Int8, 1, [255], -1],
  [IntegerEncoding.Int16LE, 2, [10, 13], 3338],
  [IntegerEncoding.Int16BE, 2, [10, 13], 2573],
  [IntegerEncoding.Int32LE, 4, [1, 2, 3, 4], 67305985],
  [IntegerEncoding.Int32BE, 4, [1, 2, 3, 4], 16909060],
  [
    IntegerEncoding.BigInt64LE,
    8,
    [1, 2, 3, 4, 5, 6, 7, 8],
    578437695752307201n,
  ],
  [IntegerEncoding.BigInt64BE, 8, [1, 2, 3, 4, 5, 6, 7, 8], 72623859790382856n],
] as const;
