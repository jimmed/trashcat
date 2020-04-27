import { context, encoded, users, makeUserCodec } from "./fixtures";
import { BufferCodec } from "../../types";
import { mapWhile, MapWhileCallback } from "../mapWhile";
import { User, Context } from "./fixtures";

beforeEach(() => jest.resetAllMocks());

describe("mapWhile", () => {
  let userCodec: BufferCodec<User, Context>;
  let whileCallback: jest.Mock<
    ReturnType<MapWhileCallback<User, Context>>,
    Parameters<MapWhileCallback<User, Context>>
  >;
  let mappedCodec: BufferCodec<User[], Context>;
  beforeEach(() => {
    userCodec = makeUserCodec();
    whileCallback = jest.fn(
      ((_, __, i) => i < users.length) as MapWhileCallback<User, Context>
    );
    mappedCodec = mapWhile(userCodec, whileCallback);
    jest.spyOn(userCodec, "parse");
    jest.spyOn(userCodec, "serialize");
  });

  describe("parse", () => {
    let result: ReturnType<typeof mappedCodec.parse>;
    beforeEach(() => {
      result = mappedCodec.parse(encoded, context);
    });

    it("calls the callback until it returns false", () => {
      expect(whileCallback.mock.calls).toEqual([
        [encoded.slice(0), context, 0, []],
        [encoded.slice(2), context, 1, users.slice(0, 1)],
        [encoded.slice(4), context, 2, users.slice(0, 2)],
        [encoded.slice(6), context, 3, users],
      ]);
    });

    it("calls the supplied codec's parse method until callback returns false", () => {
      expect((userCodec.parse as jest.Mock).mock.calls).toEqual([
        [encoded.slice(0), context],
        [encoded.slice(2), context],
        [encoded.slice(4), context],
      ]);
    });

    it("returns an array of values returned by the supplied codec's parse method", () => {
      expect(result).toEqual({
        byteLength: 6,
        value: users,
      });
    });
  });

  describe("serialize", () => {
    let result: ReturnType<typeof mappedCodec.serialize>;
    beforeEach(() => {
      result = mappedCodec.serialize(users);
    });

    it("calls the supplied codec's serialize method for each item in the array", () => {
      expect((userCodec.serialize as jest.Mock).mock.calls).toEqual(
        users.map((user) => [user])
      );
    });

    it("returns a concatenation of the buffers returned by the supplied codec's serialize method", () => {
      expect(result).toEqual(encoded);
    });
  });
});
