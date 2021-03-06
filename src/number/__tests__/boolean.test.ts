import { boolean } from "../boolean";
import { integer, returnsBigInt } from "../integer";
import { fixtures } from "./fixtures";

describe.each(fixtures)("with %s encoding", (type, byteLength) => {
  describe.each([
    [true, 1, 1n],
    [false, 0, 0n],
  ])("with %s", (boolValue, intValue, bigintValue) => {
    const numValue = returnsBigInt(type) ? bigintValue : intValue;
    it("serializes a boolean to a number", () => {
      const encoded = boolean[type].serialize(boolValue);
      expect(integer[type].parse(encoded, {})).toEqual({
        value: numValue,
        byteLength,
      });
    });

    it("parses a number to a boolean", () => {
      // @ts-ignore
      const encoded = integer[type].serialize(numValue);
      expect(boolean[type].parse(encoded, {})).toEqual({
        value: boolValue,
        byteLength,
      });
    });
  });
});
