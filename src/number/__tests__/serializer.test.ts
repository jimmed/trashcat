import { integer } from "../integer";
import { fixtures } from "./fixtures";

describe("numberSerializer", () => {
  describe.each(fixtures)(
    "with %s encoding",
    (type, byteLength, input, expected) => {
      let result: Buffer;
      beforeEach(() => {
        // @ts-ignore
        result = integer[type].serialize(expected);
      });

      it("returns the correct Buffer", () => {
        expect(result).toEqual(Buffer.from(input));
      });
    }
  );

  describe("TypeScript support", () => {
    it("accepts the right input parameter type", () => {
      const x: Buffer = integer.UInt8.serialize(3);
      const y: Buffer = integer.BigInt64BE.serialize(3n);
    });
  });
});
