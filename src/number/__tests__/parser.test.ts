import { integer } from "../integer";
import { fixtures } from "./fixtures";

describe("numberParser", () => {
  describe.each(fixtures)(
    "with %s encoding",
    (type, byteLength, input, expected) => {
      let result: { value: bigint | number; byteLength: number };
      beforeEach(() => {
        result = integer[type].parse(Buffer.from(input), {});
      });

      it("returns the correct byteLength", () => {
        expect(result).toHaveProperty("byteLength", byteLength);
      });

      it("returns the parsed number correctly", () => {
        expect(result).toHaveProperty("value", expected);
      });
    }
  );

  describe("TypeScript support", () => {
    it("assigns the correct type for 'value'", () => {
      const x: number = integer.UInt8.parse(Buffer.from([0]), {}).value;
      const y: bigint = integer.BigInt64BE.parse(
        Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]),
        {}
      ).value;
    });
  });
});
