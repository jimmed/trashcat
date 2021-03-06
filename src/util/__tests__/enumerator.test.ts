import { integer } from "../../number";
import { string } from "../../string";
import { BufferCodec } from "../../types";
import { enumerator } from "../enumerator";

describe("enumerator", () => {
  describe("with a number codec", () => {
    enum NumberEnum {
      ONE = 1,
      TWO = 2,
    }

    const codec = enumerator<NumberEnum, any>(
      integer.UInt8,
      Object.values(NumberEnum) as NumberEnum[]
    );

    it("parses the number", () => {
      expect(codec.parse(Buffer.from([NumberEnum.ONE]), {})).toEqual({
        value: NumberEnum.ONE,
        byteLength: 1,
      });
    });

    it("throws an error if the parsed number is not in the enum", () => {
      expect(() => codec.parse(Buffer.from([3]), {})).toThrowError(
        'Expected one of [ONE, TWO, 1, 2], but instead got "3"'
      );
    });

    it("serializes the number", () => {
      expect(codec.serialize(NumberEnum.ONE)).toEqual(
        Buffer.from([NumberEnum.ONE])
      );
    });

    it("throws an error if the serialized value is not in the enum", () => {
      expect(() => codec.serialize(3)).toThrowError(
        'Expected one of [ONE, TWO, 1, 2], but instead got "3"'
      );
    });
  });

  describe("with a string codec", () => {
    enum StringEnum {
      ONE = "one",
      TWO = "two",
    }
    const codec = enumerator<StringEnum, any>(
      string.fixedLength(3) as BufferCodec<StringEnum, any>,
      Object.values(StringEnum) as StringEnum[]
    );

    it("parses the string", () => {
      expect(codec.parse(Buffer.from(StringEnum.ONE, "utf8"), {})).toEqual({
        value: StringEnum.ONE,
        byteLength: 3,
      });
    });

    it("throws an error if the parsed string is not in the enum", () => {
      expect(() => codec.parse(Buffer.from("three", "utf8"), {})).toThrowError(
        'Expected one of [one, two], but instead got "thr"'
      );
    });

    it("serializes the string", () => {
      expect(codec.serialize(StringEnum.ONE)).toEqual(
        Buffer.from(StringEnum.ONE, "utf8")
      );
    });

    it("throws an error if the serialized string is not in the enum", () => {
      // @ts-ignore -- expected error
      expect(() => codec.serialize("three")).toThrowError(
        'Expected one of [one, two], but instead got "three"'
      );
    });
  });
});
