import { BufferCodec } from "../types";
import { extend } from "../util";
import { integer, IntegerEncoding, Output, returnsBigInt } from "./integer";

const booleanCodec = <C>(type: IntegerEncoding) =>
  extend(
    integer[type] as BufferCodec<Output<typeof type>, C>,
    (n) => !!n,
    returnsBigInt(type) ? (n) => (n ? 1n : 0n) : (n) => (n ? 1 : 0)
  );

type BooleanCodecs = {
  [T in IntegerEncoding]: BufferCodec<boolean, any>;
};

/**
 * An object which maps from each `IntegerEncoding` to a codec
 * that handles it as a boolean. All non-zero integers are
 * considered `true` -- zero is considered `false`.
 *
 * @see {IntegerEncoding}
 */
export const boolean = Object.values(IntegerEncoding).reduce(
  (acc, key) => ({ ...acc, [key]: booleanCodec(key) }),
  {}
) as BooleanCodecs;
