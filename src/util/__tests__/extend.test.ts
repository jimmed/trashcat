import { extend } from "../extend";
import { integer } from "../../number";

describe("extend", () => {
  const codec = extend(
    integer.UInt16LE,
    (number) => new Date(number),
    (date) => +date
  );

  it("should extend the parser", () => {
    expect(codec.parse(Buffer.from([123, 456]), {})).toEqual({
      value: new Date("1970-01-01T00:00:51.323Z"),
      byteLength: 2,
    });
  });

  it("should extend the serializer", () => {
    expect(codec.serialize(new Date("1970-01-01T00:00:51.323Z"))).toEqual(
      Buffer.from([123, 456])
    );
  });
});
