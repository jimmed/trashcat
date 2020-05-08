import { BufferCodec } from "trashcat";

export interface ProtocolConfig<Request, Response> {
  request: BufferCodec<Request, undefined>;
  response: BufferCodec<Response, undefined>;
}

export interface Protocol<Req, Res> {
  client(config: ProtocolClientConfig<Res>): ProtocolClient<Req>;
  server(config: ProtocolServerConfig<Req>): ProtocolServer<Res>;
}

export interface ProtocolClientConfig<Res> {
  sendRequest(buffer: Buffer): void;
  handleResponse(message: Res): void;
}

export interface ProtocolClient<Request> {
  sendRequest(request: Request): void;
  handleResponse(response: Buffer): void;
}

export interface ProtocolServerConfig<Request> {
  handleRequest(request: Request): void;
  sendResponse(response: Buffer): void;
}

export interface ProtocolServer<Response> {
  sendResponse(response: Response): void;
  handleRequest(request: Buffer): void;
}

export const protocolClient = <Req, Res>({
  request: requestCodec,
  response: responseCodec,
}: ProtocolConfig<Req, Res>) => <
  TF extends (...args: any[]) => TransportLayer<Buffer, Buffer>
>(
  makeTransport: TF
) => (...args: Parameters<TF>): TransportLayer<Req, Res> => {
  const transport = makeTransport(...args);
  return {
    disconnect: transport.disconnect,
    send: (message) => transport.send(requestCodec.serialize(message)),
    next: async () => {
      const next = await transport.next();
      return responseCodec.parse(next).value;
    },
  };
};

export const protocolServer = <Req, Res>({
  request: requestCodec,
  response: responseCodec,
}: ProtocolConfig<Req, Res>) => ({
  handleRequest,
  sendResponse,
}: ProtocolServerConfig<Req>): ProtocolServer<Res> => ({
  handleRequest: (request) => handleRequest(requestCodec.parse(request).value),
  sendResponse: (response) => sendResponse(responseCodec.serialize(response)),
});

export interface TransportLayer<Req, Res> {
  disconnect(): void;
  next(): Promise<Res>;
  send(msg: Req): void;
}
