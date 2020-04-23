import { assert } from "../assert";

describe("assert", () => {
  const goodContext = { failed: false };
  const badContext = { failed: true };
  const codec = assert((ctx: typeof goodContext) => !ctx.failed, "it failed");

  it("throws an error if the condition is not met", () => {
    expect(() => codec.parse(Buffer.alloc(0), badContext)).toThrowError(
      "it failed"
    );
  });

  it("parses successfully if the condition is met", () => {
    expect(codec.parse(Buffer.alloc(0), goodContext)).toEqual({
      value: goodContext,
      byteLength: 0,
    });
  });

  it("does nothing on serialisation", () => {
    expect(() => codec.serialize(badContext)).not.toThrow();
  });
});
