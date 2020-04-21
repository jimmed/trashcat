import { BufferCodec } from "../types";
import { branch } from "./branch";

export const choose = <
  T,
  C extends {},
  B extends Record<keyof T | keyof C, BufferCodec<T, C>> = Record<
    keyof T | keyof C,
    BufferCodec<T, C>
  >
>(
  chooseReadBranch: (buffer: Buffer, context: C) => keyof B,
  chooseWriteBranch: (parsed: T) => keyof B,
  branches: B
): BufferCodec<T, C> =>
  branch(
    (buffer, context) => branches[chooseReadBranch(buffer, context)],
    (context) => branches[chooseWriteBranch(context)]
  );
