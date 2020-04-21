import { nullTerminatedString } from "../nullTerminated";

describe("nullTerminatedString", () => {
  const raw = "hello world";
  const buffer = Buffer.concat([Buffer.from(raw, "utf8"), Buffer.from([0])]);
  const codec = nullTerminatedString("utf8");

  it("parses a null-terminated string", () => {
    expect(codec.parse(buffer, {})).toHaveProperty("value", raw);
  });

  it("parses the correct byteLength", () => {
    expect(codec.parse(buffer, {})).toHaveProperty(
      "byteLength",
      raw.length + 1
    );
  });

  it("serializes a null-terminated string", () => {
    expect(codec.serialize(raw)).toEqual(buffer);
  });
});
