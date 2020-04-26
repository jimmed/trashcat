import { chunk, flow, flatten, fromPairs, toPairs } from "lodash/fp";
import {
  extend,
  enumerator,
  validate,
  constant,
  optional,
  returningContext,
  padding,
  mergingContext,
  choose,
} from "../util";
import { string } from "../string";
import { integer } from "../number";
import { merge, props } from "../object";
import { mapWhile } from "../array";
import { Parsed } from "../types";

const numericString = extend(
  string.nullTerminated(),
  (x) => parseInt(x),
  (x) => x.toString()
);

enum PacketType {
  Stat = 0,
  Handshake = 9,
}

const packetType = enumerator<PacketType>(
  integer.UInt8,
  Object.values(PacketType) as PacketType[]
);

const requestHeader = merge(
  props({
    magic: validate(
      integer.UInt16BE,
      (n) => n === 0xfefd,
      "Magic field is invalid"
    ),
    type: packetType,
    sessionId: integer.UInt32BE,
  })
);

const statRequestBody = merge(
  props({
    type: constant(PacketType.Stat as const),
    challengeToken: integer.UInt32BE,
    full: optional(
      (b) => b.length >= 4,
      (c) => c,
      extend<number, boolean, { full: boolean }>(
        returningContext(padding(4, 0)),
        () => true,
        () => 0
      ),
      constant(false)
    ),
  })
);
const handshakeRequestBody = props({
  type: constant(PacketType.Handshake as const),
});

const responseHeader = props({ type: packetType, sessionId: integer.UInt32BE });
const basicStatResponseBody = props({
  type: constant(PacketType.Stat as const),
  full: constant(false as const),
  motd: string.nullTerminated(),
  gametype: string.nullTerminated(),
  map: string.nullTerminated(),
  numPlayers: numericString,
  maxPlayers: numericString,
  hostport: integer.UInt16LE,
  hostip: string.nullTerminated(),
});

// Full stat packets are distinguished by some constant padding strings
const fullStatPaddingA = Buffer.concat([
  string.nullTerminated().serialize("splitnum"),
  Buffer.from([0x80, 0x0]),
]);
const fullStatPaddingB = Buffer.concat([
  Buffer.from([0x1]),
  string.nullTerminated().serialize("player_"),
  Buffer.from([0]),
]);

interface FullStat {
  hostname: string;
  ["game type"]: string;
  game_id: string;
  version: string;
  plugins: string;
  map: string;
  numplayers: string;
  ["max players"]: string;
  ["host port"]: string;
  ["host ip"]: string;
}
const fullStatResponseBody = merge(
  props({
    type: constant(PacketType.Stat as const),
    full: constant(true as const),
  }),
  padding(fullStatPaddingA.byteLength, fullStatPaddingA),
  merge(
    mergingContext(
      extend<string[], FullStat, { type: PacketType.Stat; full: true }>(
        mapWhile(string.nullTerminated(), (b) => b.readUInt8() === 0),
        flow(fromPairs, chunk(2)),
        flow(toPairs, flatten)
      )
    ),
    padding(1, 0)
  ),
  padding(fullStatPaddingB.byteLength, fullStatPaddingB),
  merge(
    props({
      players: mapWhile(string.nullTerminated(), (b) => b.readUInt8() === 0),
    }),
    padding(1, 0)
  )
);

const statResponseBody = optional(
  (b) => string.nullTerminated().parse(b, {}).value === "splitnum",
  (b) => b.full,
  fullStatResponseBody,
  basicStatResponseBody
);

const handshakeResponseBody = props({
  type: constant(PacketType.Handshake as const),
});

export const MinecraftQuery = {
  request: merge(
    requestHeader,
    choose<
      Parsed<typeof statRequestBody> | Parsed<typeof handshakeRequestBody>,
      Parsed<typeof requestHeader>,
      PacketType
    >(
      (_, context) => context.type,
      (context) => context.type,
      {
        [PacketType.Handshake]: handshakeRequestBody,
        [PacketType.Stat]: statRequestBody,
      }
    )
  ),
  response: merge(
    responseHeader,
    choose<
      Parsed<typeof statResponseBody> | Parsed<typeof handshakeResponseBody>,
      Parsed<typeof responseHeader>,
      PacketType
    >(
      (_, context) => context.type,
      (context) => context.type,
      {
        [PacketType.Handshake]: handshakeResponseBody,
        [PacketType.Stat]: statResponseBody,
      }
    )
  ),
} as const;
