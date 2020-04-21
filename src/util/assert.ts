import { BufferCodec } from "../types";
import { tap } from "./tap";

export const assert = <Context>(
  condition: (context: Context) => boolean,
  errorMsg?: string
): BufferCodec<{}, Context> =>
  tap((_, context) => {
    if (!condition(context)) {
      throw new Error(errorMsg);
    }
  });
