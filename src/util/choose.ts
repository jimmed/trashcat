import { BufferCodec } from "../types";
import { branch } from "./branch";

/**
 * Allows switching between different supplied codecs by name.
 *
 * @param chooseReadBranch Returns the name of the codec to use for parsing
 * @param chooseWriteBranch Returns the name of the codec to use for serializing
 * @param branches An object mapping from name to a codec
 *
 * @example
 *  // Declare an enum for branch names
 *  enum Version { V1 = 1, V2 = 2 }
 *
 *  merge(
 *    // Our codec handles the version number first...
 *    props({
 *      version: enumerator<Version>(
 *        integer.UInt8,
 *        Object.values(Version) as Version[]
 *      )
 *    }),
 *    // ...and then switches codec for the rest
 *    choose(
 *      (buffer, context) => context.version,
 *      (parsed) => parsed.version,
 *      {
 *        [Version.V1]: codecForV1,
 *        [Version.V2]: codecForV2
 *      }
 *    )
 *  )
 */

export const choose = <T, C extends {}, K extends string | number>(
  chooseReadBranch: (buffer: Buffer, context: C) => K,
  chooseWriteBranch: (parsed: T & C) => K,
  branches: Record<K, BufferCodec<T, C>>
): BufferCodec<T, C> =>
  branch(
    (buffer, context) => branches[chooseReadBranch(buffer, context)],
    (context) => branches[chooseWriteBranch(context)]
  );
