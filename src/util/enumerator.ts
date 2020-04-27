import { BufferCodec } from "../types";
import { validate } from "./validate";
import { ThrownError } from "./assert";

export class EnumeratorError<E, C> extends Error {
  constructor(
    public readonly value: any,
    public readonly values: E[],
    public readonly context?: C
  ) {
    super(`Expected one of [${values.join(", ")}], but instead got "${value}"`);
  }
}

/**
 * Constrain a `codec` to a set of predefined `values`. If the parsed or
 * serialized value does not existing within `values`, an error is thrown.
 *
 * This is designed for use with TypeScript enums, but works fine without.
 *
 * @example
 *  // Vanilla JS
 *  enumerator(number.UInt8, [0, 2, 4])
 *
 *  // TypeScript
 *  enum Values { A = 0, B = 2, C = 4 }
 *  enumerator<Values>(number.UInt8, Object.values(Values) as Values[])
 *
 * @param codec The underlying codec to use
 * @param values An array of permitted values.
 */
export const enumerator = <E extends string | number, C>(
  codec: BufferCodec<E, any>,
  values: E[],
  errorMsg: ThrownError<E, C> = (value, context) =>
    new EnumeratorError<E, C>(value, values, context)
) => validate(codec, (value) => values.includes(value), errorMsg);
