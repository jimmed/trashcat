import { padding } from "../padding";

describe("padding", () => {
  const codec = padding(8, 1);
  const context = { context: true };

  it("returns its context when parsing", () => {
    expect(codec.parse(Buffer.alloc(8, 1), context)).toEqual({
      byteLength: 8,
      value: context,
    });
  });

  it("returns a padded Buffer when serializing", () => {
    expect(codec.serialize(context)).toEqual(Buffer.alloc(8, 1));
  });
});
