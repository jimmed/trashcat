import { integer } from "../../number";
import { merge, props } from "../../object";
import { times } from "../times";

const users = [
  { age: 27, money: 1_000n },
  { age: 35, money: 1_000_000n },
  { age: 46, money: 1_000_000n },
  { age: 72, money: 1_000_000_000n },
];

const userCodec = props({ age: integer.UInt8, money: integer.BigUInt64LE });
const encoded = Buffer.concat(users.map(userCodec.serialize));

describe("times", () => {
  describe("with a fixed-length array", () => {
    const codec = times(userCodec, 4);

    it("parses a fixed-length array", () => {
      expect(codec.parse(encoded, {})).toEqual({
        value: users,
        byteLength: 36,
      });
    });

    it("serializes a fixed-length array", () => {
      expect(codec.serialize(users)).toEqual(encoded);
    });
  });

  describe("with a dynamic-length array", () => {
    const encodedWithCount = Buffer.concat([
      integer.UInt8.serialize(4),
      encoded,
    ]);

    const codec = merge(
      props({ userCount: integer.UInt8 }),
      props({
        users: times(
          userCodec,
          (_, ctx: { userCount: number }) => ctx.userCount
        ),
      })
    );

    it("parses a dynamic-length array", () => {
      expect(codec.parse(encodedWithCount, {})).toEqual({
        value: { users, userCount: 4 },
        byteLength: 37,
      });
    });

    it("serializes a dynamic-length array", () => {
      expect(codec.serialize({ userCount: 4, users })).toEqual(
        encodedWithCount
      );
    });
  });
});
