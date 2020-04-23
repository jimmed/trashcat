import { props, merge } from "../object";
import { constant, enumerator, choose } from "../util";
import { integer } from "../number";
import { Parsed } from "../types";

enum Version {
  V1 = 1,
  V2 = 2,
}

export interface Header {
  version: Version;
}

export const bodyV1 = props({
  version: constant(Version.V1 as const),
  foo: integer.UInt8,
});

export const bodyV2 = props({
  version: constant(Version.V2 as const),
  bar: integer.UInt8,
});

export const packet = merge(
  props({
    version: enumerator<Version>(
      integer.UInt8,
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
