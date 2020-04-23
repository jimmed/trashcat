import { mergingContext, returningContext } from "../context";
import { constant } from "../constant";

describe("mergingContext", () => {
  const codec = mergingContext(constant({ id: 1 } as const));
  const context = { id: 3, name: "test" };

  it("returns its value merged with supplied context", () => {
    expect(codec.parse(Buffer.alloc(0), context)).toEqual({
      byteLength: 0,
      value: {
        id: 1,
        name: "test",
      },
    });
  });

  it("serializes its value as-is", () => {
    expect(codec.serialize({ id: 1 })).toEqual(Buffer.alloc(0));
  });
});

describe("returningContext", () => {
  const codec = returningContext(constant({ id: 1 } as const));
  const context = { id: 3, name: "test" };

  it("returns the supplied context", () => {
    expect(codec.parse(Buffer.alloc(0), context)).toEqual({
      byteLength: 0,
      value: {
        id: 3,
        name: "test",
      },
    });
  });

  it("serializes its value as-is", () => {
    expect(codec.serialize({ id: 1 })).toEqual(Buffer.alloc(0));
  });
});
