import { integer } from "../../number";

export const userConfig = {
  age: integer.UInt8,
  money: integer.BigUInt64LE,
} as const;

export const user = { age: 27, money: 1_000_000_000_000_000_000n };
export const encoded = Buffer.concat([
  integer.UInt8.serialize(user.age),
  integer.BigUInt64LE.serialize(user.money),
]);
export const context = { context: true };
