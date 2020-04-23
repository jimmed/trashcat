import {
  choose,
  constant,
  enumerator,
  fields,
  merge,
  number,
  Parsed,
} from "..";

enum Version {
  V1 = 1,
  V2 = 2,
}

export interface Header {
  version: Version;
}

export const bodyV1 = fields({
  version: constant(Version.V1 as const),
  foo: number.UInt8,
});

export const bodyV2 = fields({
  version: constant(Version.V2 as const),
  bar: number.UInt8,
});

export const packet = merge(
  fields({
    version: enumerator<Version>(
      number.UInt8,
      Object.values(Version) as Version[]
    ),
  }),
  choose<Parsed<typeof bodyV1> | Parsed<typeof bodyV2>, Header, Version>(
    (_, ctx) => ctx.version,
    (ctx) => ctx.version,
    {
      [Version.V1]: bodyV1,
      [Version.V2]: bodyV2,
    }
  )
);
