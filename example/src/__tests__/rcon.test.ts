/**
 * Examples in this test-case are taken from the Source RCON documentation.
 * @see https://developer.valvesoftware.com/wiki/Source_RCON_Protocol#Example_Packets
 */
import { rconPacket, PacketType } from "../rcon";
import { Parsed } from "trashcat";

describe("rconPacket", () => {
  describe.each([
    [
      "client login packet",
      [
        0x11,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x03,
        0x00,
        0x00,
        0x00,
        0x70,
        0x61,
        0x73,
        0x73,
        0x77,
        0x72,
        0x64,
        0x00,
        0x00,
      ],
      {
        id: 0,
        size: 17,
        body: "passwrd",
        type: PacketType.Auth,
      },
    ],
    [
      "server login response",
      [
        0x0a,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
      ],
      {
        id: 0,
        size: 10,
        type: PacketType.ResponseValue,
        body: "",
      },
    ],
    [
      "server login response 2",
      [
        0x0a,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x02,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
      ],
      {
        id: 0,
        size: 10,
        type: PacketType.Command,
        body: "",
      },
    ],
  ] as [string, number[], Parsed<typeof rconPacket>][])(
    "with %s",
    (_, bytes, parsedData) => {
      const buffer = Buffer.from(bytes);
      test("parses", () => {
        expect(rconPacket.parse(buffer, {})).toEqual({
          byteLength: bytes.length,
          value: parsedData,
        });
      });
      test("serializes", () => {
        expect(rconPacket.serialize(parsedData)).toEqual(buffer);
      });
    }
  );
});
