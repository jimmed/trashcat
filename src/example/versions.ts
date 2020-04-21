import { number } from "../number";
import { fields, merge } from "../object";
import { choose, enumerator } from "../util/";
import { Parsed } from "../types";

enum PacketVersion {
  V1 = 1,
  V2 = 2,
}

export interface VersionHeader {
  version: PacketVersion;
}

export const packetV1 = fields({
  foo: number.UInt8,
});
export const packetV2 = fields({
  bar: number.UInt8,
});

const versionMap = {
  [PacketVersion.V1]: packetV1,
  [PacketVersion.V2]: packetV2,
} as const;

interface PacketV1 extends Parsed<typeof packetV1> {}
interface PacketV2 extends Parsed<typeof packetV2> {}
type PacketBody = PacketV1 | PacketV2;

export const packet = merge(
  fields({
    version: enumerator<PacketVersion>(
      number.UInt8,
      Object.values(PacketVersion) as PacketVersion[]
    ),
  }),
  choose<
    VersionHeader & PacketBody,
    VersionHeader,
    typeof packetV1 | typeof packetV2
  >(
    (_, ctx) => ctx.version,
    (ctx) => ctx.version,
    versionMap
  )
);

packet.parse(Buffer.alloc(0), {}).value;
