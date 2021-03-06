import { context, encoded, user } from "./fixtures";
import { merge } from "../merge";
import { integer } from "../../number";
import { props } from "../props";

describe("merge", () => {
  const codec = merge(
    props({ age: integer.UInt8 }),
    props({ money: integer.BigUInt64LE })
  );

  describe("parse", () => {
    beforeEach(() => {
      jest.spyOn(integer.UInt8, "parse");
      jest.spyOn(integer.BigUInt64LE, "parse");
    });

    it("correctly parses an object", () => {
      expect(codec.parse(encoded, context)).toEqual({
        byteLength: 9,
        value: { ...context, ...user },
      });
    });

    it("parses each field in order", () => {
      codec.parse(encoded, context);
      expect(integer.UInt8.parse).toHaveBeenCalledWith(encoded, context);
      expect(integer.BigUInt64LE.parse).toHaveBeenCalledWith(encoded.slice(1), {
        ...context,
        age: user.age,
      });
    });
  });

  describe("serialize", () => {
    beforeEach(() => {
      jest.spyOn(integer.UInt8, "serialize");
      jest.spyOn(integer.BigUInt64LE, "serialize");
    });

    it("correctly serializes an object", () => {
      expect(codec.serialize(user)).toEqual(encoded);
    });

    it("serializes each field in order", () => {
      codec.serialize(user);
      expect(integer.UInt8.serialize).toHaveBeenCalledWith(user.age);
      expect(integer.BigUInt64LE.serialize).toHaveBeenCalledWith(user.money);
    });
  });
});
