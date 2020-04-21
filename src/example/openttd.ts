import { boolean, number } from "../number";
import { fields } from "../object/fields";
import { merge } from "../object/merge";
import { fixedLengthString } from "../string/fixedLength";
import { nullTerminatedString } from "../string/nullTerminated";
import { assert } from "../util/assert";
import { enumerator } from "../util/enum";
import { times } from "../array/times";

enum MapType {
  Temperate = 0,
  Arctic = 1,
  Tropic = 2,
  Toyland = 3,
}

const basicStatsPackage = merge(
  fields({
    packetVersion: number.UInt8,
  }),
  assert(
    ({ packetVersion }) => packetVersion === 4,
    `Only packet version 4 is supported`
  ),
  fields({
    grfCount: number.UInt8,
  }),
  fields({
    grfs: times(
      fields({
        id: fixedLengthString(4, "hex"),
        md5: fixedLengthString(16, "hex"),
      }),
      (_, ctx) => ctx.grfCount
    ),
    gameDate: number.UInt32LE,
    startDate: number.UInt32LE,
    maxCompanies: number.UInt8,
    maxSpectators: number.UInt8,
    name: nullTerminatedString("utf8"),
    gameVersion: nullTerminatedString("utf8"),
    language: number.UInt8,
    hasPassword: boolean.UInt8,
    maxPlayers: number.UInt8,
    onlinePlayers: number.UInt8,
    onlineSpectators: number.UInt8,
    mapName: nullTerminatedString("utf8"),
    mapWidth: number.UInt16LE,
    mapHeight: number.UInt16BE,
    mapType: enumerator<MapType>(
      number.UInt8,
      Object.values(MapType) as MapType[]
    ),
    isDedicated: boolean.UInt8,
  })
);

const companyStatsPacket = merge(
  fields({ packetVersion: number.UInt8 }),
  assert(
    ({ packetVersion }) => packetVersion === 6,
    `Only packet version 6 is supported`
  ),
  fields({ companyCount: number.UInt8 }),
  fields({
    companies: times(
      fields({
        id: number.UInt8,
        name: nullTerminatedString("utf8"),
        startYear: number.UInt32LE,
        value: number.BigUInt64LE,
        money: number.BigUInt64LE,
        income: number.BigUInt64BE,
        performance: number.UInt16LE,
        hasPassword: boolean.UInt8,
        vehicleCounts: fields({
          train: number.UInt16LE,
          truck: number.UInt16LE,
          bus: number.UInt16LE,
          plane: number.UInt16LE,
          ship: number.UInt16LE,
        }),
        stationCounts: fields({
          train: number.UInt16LE,
          truck: number.UInt16LE,
          bus: number.UInt16LE,
          plane: number.UInt16LE,
          ship: number.UInt16LE,
        }),
      }),
      (_, ctx) => ctx.companyCount
    ),
  })
);
