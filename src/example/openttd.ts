import { times } from "../array";
import { boolean, integer } from "../number";
import { merge, props } from "../object";
import { string } from "../string";
import { enumerator, validate } from "../util";

enum MapType {
  Temperate = 0,
  Arctic = 1,
  Tropic = 2,
  Toyland = 3,
}

const basicStatsPackage = merge(
  props({
    packetVersion: validate(
      integer.UInt8,
      (v) => v === 4,
      `Only packet version 4 is supported`
    ),
  }),
  props({
    grfCount: integer.UInt8,
  }),
  props({
    grfs: times(
      props({
        id: string.fixedLength(4, "hex"),
        md5: string.fixedLength(16, "hex"),
      }),
      (_, ctx) => ctx.grfCount
    ),
    gameDate: integer.UInt32LE,
    startDate: integer.UInt32LE,
    maxCompanies: integer.UInt8,
    maxSpectators: integer.UInt8,
    name: string.nullTerminated(),
    gameVersion: string.nullTerminated(),
    language: integer.UInt8,
    hasPassword: boolean.UInt8,
    maxPlayers: integer.UInt8,
    onlinePlayers: integer.UInt8,
    onlineSpectators: integer.UInt8,
    mapName: string.nullTerminated(),
    mapWidth: integer.UInt16LE,
    mapHeight: integer.UInt16BE,
    mapType: enumerator<MapType>(
      integer.UInt8,
      Object.values(MapType) as MapType[]
    ),
    isDedicated: boolean.UInt8,
  })
);

const companyStatsPacket = merge(
  props({
    packetVersion: validate(
      integer.UInt8,
      (v) => v === 6,
      `Only packet version 6 is supported`
    ),
    companyCount: integer.UInt8,
  }),
  props({
    companies: times(
      props({
        id: integer.UInt8,
        name: string.nullTerminated(),
        startYear: integer.UInt32LE,
        value: integer.BigUInt64LE,
        money: integer.BigUInt64LE,
        income: integer.BigUInt64BE,
        performance: integer.UInt16LE,
        hasPassword: boolean.UInt8,
        vehicleCounts: props({
          train: integer.UInt16LE,
          truck: integer.UInt16LE,
          bus: integer.UInt16LE,
          plane: integer.UInt16LE,
          ship: integer.UInt16LE,
        }),
        stationCounts: props({
          train: integer.UInt16LE,
          truck: integer.UInt16LE,
          bus: integer.UInt16LE,
          plane: integer.UInt16LE,
          ship: integer.UInt16LE,
        }),
      }),
      (_, ctx) => ctx.companyCount
    ),
  })
);
