import { BufferCodec } from "../types";
import { branch } from "./branch";

export const choose = <T, C extends {}, K extends string | number>(
  chooseReadBranch: (buffer: Buffer, context: C) => K,
  chooseWriteBranch: (parsed: T & C) => K,
  branches: Record<K, BufferCodec<T, C>>
): BufferCodec<T, C> =>
  branch(
    (buffer, context) => branches[chooseReadBranch(buffer, context)],
    (context) => branches[chooseWriteBranch(context)]
  );
