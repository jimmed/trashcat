import { BufferCodec } from "../../types";
import { constant } from "../constant";
import { optional } from "../optional";

describe("optional", () => {
  let switcher: jest.Mock;
  let codec: BufferCodec<"foo" | "bar", any>;

  describe.each([
    [true, "foo"],
    [false, "bar"],
  ])("when the branch method returns %s", (bool, value) => {
    beforeEach(() => {
      switcher = jest.fn().mockReturnValue(bool);
      codec = optional(
        switcher,
        switcher,
        constant("foo" as const),
        constant("bar" as const)
      );
    });

    it("branches parsing based on boolean", () => {
      expect(codec.parse(Buffer.alloc(0), {})).toEqual({
        byteLength: 0,
        value,
      });
    });

    it("branches serialization based on boolean", () => {
      expect(codec.serialize(undefined as any)).toEqual(Buffer.alloc(0));
    });
  });
});
