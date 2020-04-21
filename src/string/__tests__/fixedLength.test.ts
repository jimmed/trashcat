import { fixedLengthString } from "../fixedLength";

describe("fixedLengthString", () => {
  const raw = "hello world";
  const buffer = Buffer.from(raw, "utf8");
  const codec = fixedLengthString(raw.length, "utf8");

  it("parses a fixed-length string", () => {
    expect(codec.parse(buffer, {})).toHaveProperty("value", raw);
  });

  it("parses the correct byteLength", () => {
    expect(codec.parse(buffer, {})).toHaveProperty("byteLength", raw.length);
  });

  it("serializes a fixed-length string", () => {
    expect(codec.serialize(raw)).toEqual(buffer);
  });
});
