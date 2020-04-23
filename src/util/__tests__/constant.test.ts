import { constant } from "../constant";

describe("constant", () => {
  const value = Symbol("test constant");
  const codec = constant(value);

  it("parses a constant value", () => {
    expect(codec.parse(Buffer.alloc(0), {})).toEqual({
      value,
      byteLength: 0,
    });
  });

  it("serializes to an empty buffer", () => {
    expect(codec.serialize(value)).toEqual(Buffer.alloc(0));
  });
});
