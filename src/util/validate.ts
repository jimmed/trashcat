import { BufferCodec } from "../types";
import { extend } from "./extend";
import { throwError, ThrownError } from "./assert";

/**
 * Wraps a codec with an error condition.
 * During both parsing and serializing, if `condition` returns `false`, an
 * error is thrown.
 *
 * @example
 *  validate(
 *    string.nullTerminated(),
 *    s => s.length <= 10,
 *    s => `Maximum length is 10, but got ${s.length}`
 *  )
 *
 * @param codec The codec to validate
 * @param condition Returns `true` if the condition is met
 * @param errorMsg An error message to throw.
 * This can be a string, Error object or a function that takes value and
 * context and returns a string or Error object
 */
export const validate = <T, C>(
  codec: BufferCodec<T, C>,
  condition: (value: T, context?: C) => boolean,
  errorMsg?: ThrownError<T, C>
): BufferCodec<T, C> => {
  const assertion = (value: T, context?: C) => {
    if (!condition(value, context)) {
      throwError(errorMsg, value, context);
    }
    return value;
  };

  return extend(codec, assertion, assertion);
};
