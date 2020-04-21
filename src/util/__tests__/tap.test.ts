import { merge, fields } from "../../object";
import { number } from "../../number";
import { tap } from "../";
import { BufferCodec } from "../../types";

describe("tap", () => {
  const encoded = Buffer.from([27, 28]);
  const parsed = { age: 27 };
  const context = { context: true };

  let callback: jest.Mock;
  let codec: BufferCodec<{ age: number }, {}>;
  beforeEach(() => {
    callback = jest.fn();
    codec = merge(fields({ age: number.UInt8 }), tap(callback));
  });

  it("calls the callback when parsing", () => {
    codec.parse(encoded, context);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(encoded.slice(1), {
      ...context,
      ...parsed,
    });
  });

  it("does not affect parsing", () => {
    expect(codec.parse(encoded, context)).toEqual({
      value: { ...context, ...parsed },
      byteLength: 1,
    });
  });

  it("does not call the callback when serializing", () => {
    codec.serialize(parsed);
    expect(callback).not.toHaveBeenCalled();
  });

  it("does not affect serialisation", () => {
    expect(codec.serialize(parsed)).toEqual(number.UInt8.serialize(27));
  });
});
