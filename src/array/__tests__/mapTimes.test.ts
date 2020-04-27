import {
  User,
  Context,
  users,
  encoded,
  makeUserCodec,
  context,
} from "./fixtures";
import { MapTimesCount, mapTimes, MapTimesCallback } from "../mapTimes";
import { BufferCodec } from "../../types";

interface TestCase {
  decoded: User[];
  encoded: Buffer;
  count: MapTimesCount<Context, "userCount">;
}

const cases: [string, TestCase][] = [
  ["numeric", { decoded: users, encoded, count: users.length }],
  ["string", { decoded: users, encoded, count: "userCount" }],
  [
    "callback",
    {
      decoded: users,
      encoded,
      count: ((_, c) => c.userCount) as MapTimesCallback<Context>,
    },
  ],
];

describe("mapTimes", () => {
  let userCodec: BufferCodec<User, Context>;
  beforeEach(() => {
    userCodec = makeUserCodec();
  });

  describe.each(cases)("with a %s count", (_, testCase) => {
    let mappedCodec: BufferCodec<User[], Context>;
    beforeEach(() => {
      mappedCodec = mapTimes(
        userCodec,
        testCase.count as MapTimesCallback<Context>
      );
    });

    describe("parse", () => {
      let result: ReturnType<typeof mappedCodec.parse>;
      beforeEach(() => {
        result = mappedCodec.parse(encoded, context);
      });

      it("returns a byteLength equal to the sum of byteLengths parsed by the supplied codec", () => {
        expect(result).toHaveProperty("byteLength", 6);
      });

      it("returns an array of the values of parsed by the supplied codec", () => {
        expect(result).toHaveProperty("value", users);
      });
    });

    describe("serialize", () => {
      let result: Buffer;
      beforeEach(() => {
        result = mappedCodec.serialize(users);
      });

      it("concatenates the buffers serialized by the supplied codec", () => {
        expect(result).toEqual(encoded);
      });
    });
  });
});
