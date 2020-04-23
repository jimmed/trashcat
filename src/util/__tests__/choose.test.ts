import { BufferCodec } from "../../types";
import { choose } from "../choose";
import { constant } from "../constant";

describe("choose", () => {
  enum Branch {
    A,
    B,
  }

  let chooseReadBranch: jest.Mock;
  let chooseWriteBranch: jest.Mock;
  let codec: BufferCodec<"foo" | "bar", any>;
  let fooCodec: BufferCodec<"foo", any>;

  beforeEach(() => {
    fooCodec = constant("foo");
    chooseReadBranch = jest.fn().mockReturnValue(Branch.A);
    chooseWriteBranch = jest.fn().mockReturnValue(Branch.A);
    codec = choose(chooseReadBranch, chooseWriteBranch, {
      [Branch.A]: fooCodec,
      [Branch.B]: constant("bar"),
    });
    jest.spyOn(fooCodec, "parse");
    jest.spyOn(fooCodec, "serialize");
  });

  describe("parse", () => {
    const buffer = Buffer.from([Branch.A]);
    const context = {};
    let result: { value: "foo" | "bar"; byteLength: number };

    beforeEach(() => {
      result = codec.parse(buffer, context);
    });

    it("calls chooseReadBranch with the buffer and context", () => {
      expect(chooseReadBranch).toHaveBeenCalledTimes(1);
      expect(chooseReadBranch).toHaveBeenCalledWith(buffer, context);
    });

    it("parses using the chosen branch codec", () => {
      expect(fooCodec.parse).toHaveBeenCalledTimes(1);
      expect(fooCodec.parse).toHaveBeenCalledWith(buffer, context);
    });

    it("returns the result from the underlying codec", () => {
      expect(result).toEqual({
        value: "foo",
        byteLength: 0,
      });
    });
  });

  describe("serialize", () => {
    let result: Buffer;
    beforeEach(() => {
      result = codec.serialize("foo");
    });

    it("calls chooseWriteBranch with the value", () => {
      expect(chooseWriteBranch).toHaveBeenCalledTimes(1);
      expect(chooseWriteBranch).toHaveBeenCalledWith("foo");
    });

    it("serializes using the chosen branch codec", () => {
      expect(fooCodec.serialize).toHaveBeenCalledTimes(1);
      expect(fooCodec.serialize).toHaveBeenLastCalledWith("foo");
    });

    it("returns the result from the underlying codec", () => {
      expect(result).toEqual(Buffer.alloc(0));
    });
  });
});
