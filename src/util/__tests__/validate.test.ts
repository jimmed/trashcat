import { validate } from "../validate";
import { integer } from "../../number";

describe("validate", () => {
  const condition = (value: any): value is 1 => value === 1;
  const errorMsg = "it done broke";
  const codec = validate(integer.UInt8, condition, errorMsg);

  describe("when condition is met", () => {
    it("uses the underlying codec to parse the value", () => {
      expect(codec.parse(Buffer.from([1]), {})).toEqual({
        byteLength: 1,
        value: 1,
      });
    });

    it("uses the underlying codec to serialize the value", () => {
      expect(codec.serialize(1)).toEqual(Buffer.from([1]));
    });
  });

  describe("when condition is not met", () => {
    it("throws an error while parsing", () => {
      expect(() => codec.parse(Buffer.from([0]), {})).toThrowError(errorMsg);
    });

    it("throws an error while serializing", () => {
      expect(() => codec.serialize(0)).toThrowError(errorMsg);
    });
  });
});
