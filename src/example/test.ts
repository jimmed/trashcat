import { fields } from "../object/fields";
import { number } from "../number/codec";

const ttd = fields({
  packetVersion: number.UInt8,
  grfCount: number.UInt8,
}).parse(Buffer.from([1, 2]));
