import { padding } from "../padding";

const cases = [
  ["default", undefined, undefined],
  ["number", 1, undefined],
  ["string", "foo", "utf8"],
  ["Buffer", Buffer.from([1, 2]), undefined],
] as const;

describe("padding", () => {
  describe.each(cases)("with a %s fill", (_, fill, encoding) => {
    const codec = padding(8, fill, encoding);
    const context = { context: true };

    it("returns an empty object when parsing", () => {
      expect(codec.parse(Buffer.alloc(8, fill, encoding), context)).toEqual({
        byteLength: 8,
        value: {},
      });
    });

    it("returns a padded Buffer when serializing", () => {
      expect(codec.serialize({})).toEqual(Buffer.alloc(8, fill, encoding));
    });
  });
});
