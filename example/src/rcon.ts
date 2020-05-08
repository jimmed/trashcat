/**
 * An implementation of the Source RCON protocol
 * @see https://developer.valvesoftware.com/wiki/Source_RCON_Protocol
 */
import { integer, props, enumerator, string, merge, padding } from "trashcat";

export enum PacketType {
  Auth = 3,
  Command = 2,
  ResponseValue = 0,
}

export const rconPacket = merge(
  props({
    size: integer.UInt32LE,
    id: integer.UInt32LE,
    type: enumerator<PacketType>(
      integer.UInt32LE,
      Object.values(PacketType) as PacketType[]
    ),
    body: string.nullTerminated("ascii"),
  }),
  padding(1, 0)
);
