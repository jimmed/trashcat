import { number } from "../../number";

export const userConfig = {
  age: number.UInt8,
  money: number.BigUInt64LE,
} as const;

export const user = { age: 27, money: 1_000_000_000_000_000_000n };
export const encoded = Buffer.concat([
  number.UInt8.serialize(user.age),
  number.BigUInt64LE.serialize(user.money),
]);
export const context = { context: true };
