import { props } from "../../object";
import { integer } from "../../number";

export interface User {
  id: number;
  age: number;
}

export interface Context {
  context: symbol;
  userCount: number;
}

export const users: User[] = [
  { id: 1, age: 31 },
  { id: 2, age: 33 },
  { id: 3, age: 35 },
];

export const context: Context = {
  context: Symbol("test context"),
  userCount: users.length,
};

export const makeUserCodec = () =>
  props({ id: integer.UInt8, age: integer.UInt8 });
export const encoded = Buffer.concat(
  users.map((user) => makeUserCodec().serialize(user))
);
