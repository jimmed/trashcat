import { assert } from "../assert";

describe("assert", () => {
  describe.each([
    ["no error message", undefined],
    ["an error message", "it failed"],
  ])("with %s", (_, errorMsg) => {
    const goodContext = { failed: false };
    const badContext = { failed: true };
    const codec = assert((ctx: typeof goodContext) => !ctx.failed, errorMsg);

    it("throws an error if the condition is not met", () => {
      expect(() => codec.parse(Buffer.alloc(0), badContext)).toThrowError(
        errorMsg
      );
    });

    it("parses successfully if the condition is met", () => {
      expect(codec.parse(Buffer.alloc(0), goodContext)).toEqual({
        value: {},
        byteLength: 0,
      });
    });

    it("does nothing on serialisation", () => {
      expect(() => codec.serialize(badContext)).not.toThrow();
    });
  });
});
