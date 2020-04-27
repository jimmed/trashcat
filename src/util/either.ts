import { BufferCodec } from "../types";
import { choose } from "./choose";
import { merge, props } from "../object";
import { enumerator } from "./enumerator";
import { integer, boolean } from "../number";
import { constant } from "./constant";

/**
 * Switches between two codecs.
 *
 * When parsing or serializing, if `shouldParse` or `shouldSerialize`
 * (respectively) returns `true`, then `trueCodec` is used.
 * Otherwise, `falseCodec` is used.
 *
 * @example
 *  merge(
 *    props({
 *      full: boolean.UInt8,
 *    }),
 *    either(
 *      (_, c) => c.full,
 *      (p) => p.full,
 *      props({ full: constant(true as const), extra: integer.UInt8 }),
 *      props({ full: constant(false as const) })
 *    )
 *  )
 *
 * When using TypeScript, `either` creates a union type between the parsed
 * values from each branch. To ensure TypeScript's inference can distinguish
 * between these, use `constant` inside each branch, as per `full` in the
 * above example.
 *
 * @param shouldParse Returns a boolean to determine which codec to use
 * @param shouldSerialize Returns a boolean to determine which codec to use
 * @param trueCodec The codec to use if the callback returns `true`
 * @param falseCodec The codec to use if the callback returns `false`.
 * If this is not supplied, then a constant of `null` will be parsed,
 * and an empty buffer serialized.
 */
export function either<T, F, C extends {}>(
  shouldParse: (buffer: Buffer, context: C) => boolean,
  shouldSerialize: (parsed: (T & C) | (F & C)) => boolean,
  trueCodec: BufferCodec<T, C>,
  falseCodec: BufferCodec<F, C>
): BufferCodec<T | F, C> {
  return choose<T | F, C, 0 | 1>(
    (b, c) => (shouldParse(b, c) ? 0 : 1),
    (c) => (shouldSerialize(c) ? 0 : 1),
    [trueCodec, falseCodec]
  );
}
