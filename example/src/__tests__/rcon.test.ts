/**
 * Examples in this test-case are taken from the Source RCON documentation.
 * @see https://developer.valvesoftware.com/wiki/Source_RCON_Protocol#Example_Packets
 */
import { rconPacket, PacketType } from "../rcon";
import { Parsed } from "trashcat";

describe("rconPacket", () => {
  describe.each([
    [
      "client: auth request",
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
        body: "passwrd",
        type: PacketType.Auth,
      },
    ],
    [
      "server: auth response",
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
        type: PacketType.ResponseValue,
        body: "",
      },
    ],
    [
      "server: auth response 2",
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
        type: PacketType.Command,
        body: "",
      },
    ],
    [
      "client: echo command request",
      [
        0x19,
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
        0x65,
        0x63,
        0x68,
        0x6f,
        0x20,
        0x48,
        0x4c,
        0x53,
        0x57,
        0x3a,
        0x20,
        0x54,
        0x65,
        0x73,
        0x74,
        0x00,
        0x00,
      ],
      {
        id: 0,
        type: PacketType.Command,
        body: "echo HLSW: Test",
      },
    ],
    [
      "server: echo command response",
      [
        0x17,
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
        0x48,
        0x4c,
        0x53,
        0x57,
        0x20,
        0x3a,
        0x20,
        0x54,
        0x65,
        0x73,
        0x74,
        0x20,
        0x0a,
        0x00,
        0x00,
      ],
      {
        id: 0,
        type: PacketType.ResponseValue,
        body: "HLSW : Test \n",
      },
    ],
  ] as [string, number[], Parsed<typeof rconPacket>][])(
    "with %s",
    (_, bytes, parsedData) => {
      const buffer = Buffer.from(bytes);

      it("parses", () => {
        expect(rconPacket.parse(buffer, {})).toEqual({
          byteLength: bytes.length,
          value: parsedData,
        });
      });

      it("serializes", () => {
        expect(rconPacket.serialize(parsedData)).toEqual(buffer);
      });
    }
  );
});
