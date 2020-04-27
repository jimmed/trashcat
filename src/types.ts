export interface ParseResult<Parsed> {
  value: Parsed;
  byteLength: number;
}

export interface BufferCodec<Parsed, Context> {
  parse(buffer: Buffer, context: Context): ParseResult<Parsed>;
  serialize(parsed: Parsed): Buffer;
}

export type FieldsOf<Parsed extends Record<string, any>, Context> = {
  [K in keyof Parsed]: BufferCodec<Parsed[K], Context>;
};

export type Parsed<B extends BufferCodec<any, any>> = B extends BufferCodec<
  infer P,
  any
>
  ? P
  : never;
