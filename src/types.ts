export interface BufferCodec<Parsed> {
  parse(buffer: Buffer): { value: Parsed; byteLength: number };
  serialize(parsed: Parsed): Buffer;
}

export type FieldsOf<Parsed extends Record<string, any>> = {
  [K in keyof Parsed]: BufferCodec<Parsed[K]>;
};
