/**
 * An implementation of the Source RCON protocol
 * @see https://developer.valvesoftware.com/wiki/Source_RCON_Protocol
 */
import {
  enumerator,
  integer,
  merge,
  padding,
  props,
  string,
  Parsed,
} from "trashcat";
import { protocolClient, TransportLayer, ProtocolClient } from "./protocol";
import { sized } from "./sized";
import { createSocket, SocketType } from "dgram";

export enum PacketType {
  Auth = 3,
  Command = 2,
  ResponseValue = 0,
}

export const rconPacket = sized(
  merge(
    props({
      id: integer.UInt32LE,
      type: enumerator<PacketType, {}>(
        integer.UInt32LE,
        Object.values(PacketType) as PacketType[]
      ),
      body: string.nullTerminated("ascii"),
    }),
    padding(1, 0)
  ),
  "size",
  integer.UInt32LE
);

export const createUdpSocket = (
  type: SocketType,
  port: number,
  host?: string
): TransportLayer<Buffer, Buffer> => {
  const socket = createSocket(type);
  socket.connect(port, host);
  return {
    disconnect: () => socket.disconnect(),
    send: (msg) => socket.send(msg),
    next: () =>
      new Promise((resolve, reject) => {
        socket.once("message", (msg) => resolve(msg)).once("close", reject);
      }),
  };
};
export const udpRconClient = protocolClient({
  request: rconPacket,
  response: rconPacket,
})(createUdpSocket);

export const clientApi = <
  Context,
  ContextArgs extends any[],
  Commands extends Record<
    string,
    (...args: any[]) => Promise<any | void> | void
  >,
  TL extends TransportLayer<any, any>
>(config: {
  getContext(...args: ContextArgs): Context;
  getTransportLayer(context: Context): TL;
  behavior(transport: TL, context: Context): Commands;
}) => (...args: ContextArgs): Commands & { disconnect(): void } => {
  let context = config.getContext(...args);
  const transport = config.getTransportLayer(context);
  return {
    disconnect: transport.disconnect,
    ...config.behavior(transport, context),
  };
};

export const rconClient = clientApi({
  getContext: (port: number, host?: string, clientId: number = 1) => ({
    port,
    host,
    clientId,
  }),
  getTransportLayer: ({ port, host }) => udpRconClient("udp4", port, host),
  behavior: (
    client: TransportLayer<
      Parsed<typeof rconPacket>,
      Parsed<typeof rconPacket>
    >,
    { clientId }
  ) => ({
    async login(password: string) {
      client.send({
        id: clientId,
        type: PacketType.Auth,
        body: password,
      });
      const next = await client.next();
      if (next.type !== PacketType.ResponseValue || next.body !== "") {
        throw new Error("Unable to login");
      }
    },
    async send(command: string) {
      client.send({ id: clientId, type: PacketType.Command, body: command });
      const next = await client.next();
      if (next.type !== PacketType.ResponseValue) {
        throw new Error("Invalid response");
      }
      return next.body;
    },
  }),
});
