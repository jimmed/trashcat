export interface BufferCodec<Parsed, Context> {
  parse(
    buffer: Buffer,
    context: Context
  ): { value: Parsed; byteLength: number };
  serialize(parsed: Parsed): Buffer;
}

export type FieldsOf<Parsed extends Record<string, any>, Context> = {
  [K in keyof Parsed]: BufferCodec<Parsed[K], Context>;
};
