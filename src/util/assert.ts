import { BufferCodec } from "../types";
import { tap } from "./tap";

/**
 * Makes an assertion based on the context passed in.
 *
 * Parses to an empty object, for use with `merge`.
 * Serializes to an empty buffer.
 *
 * @example
 *  const codec = merge(
 *    props({ foo: integer.UInt8, bar: integer.UInt8 }),
 *    assert(({ foo, bar }) => foo + bar === 10, 'foo + bar must equal 10')
 *  )
 *
 * @param condition Returns whether the assertion holds.
 * If this returns `true`, parsing continues silently.
 * If this returns `false`, parsing fails with an error.
 * @param errorMsg An optional error message to pass in.
 * This can be a string, Error object or a function that takes value and
 * context and returns a string or Error object.
 */
export const assert = <Context>(
  condition: (context: Context) => boolean,
  errorMsg?: ThrownError<{}, Context>
): BufferCodec<{}, Context> =>
  tap((_, context) => {
    if (!condition(context!)) {
      throwError(errorMsg, {}, context);
    }
  });

export type ThrownError<T, C> =
  | string
  | Error
  | ((value: T, context?: C) => string | Error);

export const throwError = <T, C>(
  errorMsg: ThrownError<T, C> = "Invalid value",
  value: T,
  context?: C
) => {
  let error: Error | string;
  if (typeof errorMsg === "string" || errorMsg instanceof Error) {
    error = errorMsg;
  } else {
    error = errorMsg(value, context);
  }
  throw error instanceof Error ? error : new Error(error);
};
