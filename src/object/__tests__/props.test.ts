import { integer } from "../../number";
import { props } from "../props";
import { context, encoded, user, userConfig } from "./fixtures";

describe("props", () => {
  const codec = props(userConfig);

  describe("parse", () => {
    beforeEach(() => {
      jest.spyOn(integer.UInt8, "parse");
      jest.spyOn(integer.BigUInt64LE, "parse");
    });

    it("correctly parses an object", () => {
      expect(codec.parse(encoded, context)).toEqual({
        byteLength: 9,
        value: user,
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
