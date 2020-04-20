import { number } from "../codec";
import { encodings } from "./encodings";

describe("numberSerializer", () => {
  describe.each(encodings)(
    "with %s encoding",
    (type, byteLength, input, expected) => {
      let result: Buffer;
      beforeEach(() => {
        // @ts-ignore
        result = number[type].serialize(expected);
      });

      it("returns the correct Buffer", () => {
        expect(result).toEqual(Buffer.from(input));
      });
    }
  );

  describe("TypeScript support", () => {
    it("accepts the right input parameter type", () => {
      const x: Buffer = number.UInt8.serialize(3);
      const y: Buffer = number.BigInt64BE.serialize(3n);
    });
  });
});
