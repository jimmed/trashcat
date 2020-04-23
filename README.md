# 🗑️🐈 trashcat

> A node.js toolkit for building binary codecs

## 💡 Features

- 🔢 **Parse and serialize binary data**

  Useful for transforming structured data to/from a buffer.

- 🏗 **Declarative, extensible API**

  Compose the provided codecs, or write your own, to take complete control of how your data is parsed/serialized.

- ✍ **First-class TypeScript inference support**

  The provided codecs can (mostly) infer the type of your parsed data, leaving you to get on with the fun parts!

## 🔌 Installation

You may install `trashcat` into your project using either `npm` or `yarn`:

```sh
$ npm install --save trashcat

# or

$ yarn add trashcat
```

## 📑 Concepts

### Codecs

These are the core building blocks of trashcat. They deal with parsing and serializing a specific type of data. They are objects with two methods:

- `parse`, which takes a node.js Buffer (and optionally some context), and returns an object with the parsed value, and the length of the parsed data in bytes.
- `serialize`, which takes some data, and serializes it into a Buffer.

You can mix and match built-in codecs with your own ones.

### Using built-in codecs

trashcat provides a variety of built-in codecs, for dealing with commonprimitive types of data, such as integers and strings.

For example, `integer.UInt8` is a codec for unsigned 8-bit integers:

```ts
import { integer } from "trashcat";

integer.UInt8.parse(Buffer.from([25]), {});
// => { value: 25, byteLength: 1 }

integer.UInt8.serialize(25);
// => <Buffer 19> (Note: Buffer contents are displayed in hexadecimal!)
```

Another example is `string.nullTerminated`, which _returns_ a codec for null-terminated strings.

```ts
import { string } from "trashcat";

const codec = string.nullTerminated("ascii");

codec.parse(Buffer.from("hello world", "ascii"), {});
// => { value: 'hello world', byteLength: 11 }

codec.serialize("hello world");
// => <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>
```

### Extending an existing codec

The built-in `extend` codec can take an existing codec, and wrap it with an additional step to parse/serialize the data.

In this example, we'll write a codec for hexadecimal colour codes (like `#FF0000` or `#E2E2E2`)

```ts
import { extend, integer, times } from "trashcat";
import { chunk, flowRight, invoke, map, parseInteger } from "lodash/fp";

const colourCodec = extend(
  times(integer.UInt8, 3),
  flowRight(
    map(invoke('toString', 'hex')),
    map(invoke('padStart', 2, '0')),
    invoke('join', '')
    s => '#' + s
  ),
  flowRight(
    invoke('slice', 1),
    chunk(2),
    map(parseInteger(16))
  )
);
```

[lodashfp]: https://github.com/lodash/lodash/wiki/FP-Guide

### Composing codecs by key

In order to parse anything more complicated than a single value, we need to compose some codecs together.

Built-in methods for composing codecs are provided, such as `props`, which is used for building up an object of typed values. This can be used as follows:

```ts
import { props, integer, string } from "trashcat";

const userCodec = props({
  id: integer.UInt8,
  name: string.nullTerminated(),
  balance: integer.BigUInt64LE,
});

const buffer = userCodec.serialize({
  id: 1,
  name: "Jim",
  balance: 99999n,
});
// => Buffer<01 4a 69 6d 9f 86 01 00 00 00 00 00>

userCodec.parse(buffer, {}).value;
// => { id: 1, name: 'Jim', balance: 99999n }
```

The codecs passed into `props` will be used in the order they are defined.

> **N.B.** We do not specify any types for `userCodec`, because `props` is defined such that TypeScript can automatically infer the type of the value.

### Composing codecs by merging objects

To use a series of codecs in order, and merge them into a single object, we can use the `merge` method.

```ts
import { integer, merge, props, string } from 'trashcat'

const packetHeader = props({
  version: integer.UInt8
  token: integer.UInt16LE
})

const packetBody = props({
  message: string.nullTerminated('utf8')
})

const packet = merge(packetHeader, packetBody)

packet.parse(/* buffer */, {})
// => { version: 1, token: 10101010, message: 'hello!' }
```

Note that codecs passed into `merge` **must** parse to an object.

## 📖 Full list of built-in codecs

### Number

| Codec                 | JavaScript Type | Serialized Type                       |
| --------------------- | --------------- | ------------------------------------- |
| `integer.UInt8`       | number          | unsigned 8-bit integer                |
| `integer.Int8`        | number          | signed 8-bit integer                  |
| `integer.UInt16LE`    | number          | unsigned little-endian 16-bit integer |
| `integer.Int16LE`     | number          | signed little-endian 16-bit integer   |
| `integer.UInt16BE`    | number          | unsigned big-endian 16-bit integer    |
| `integer.Int16BE`     | number          | signed big-endian 16-bit integer      |
| `integer.UInt32LE`    | number          | unsigned little-endian 32-bit integer |
| `integer.Int32LE`     | number          | signed little-endian 32-bit integer   |
| `integer.UInt32BE`    | number          | unsigned big-endian 32-bit integer    |
| `integer.Int32BE`     | number          | signed big-endian 32-bit integer      |
| `integer.BigUInt64LE` | bigint          | unsigned little-endian 64-bit integer |
| `integer.BigInt64LE`  | bigint          | signed little-endian 64-bit integer   |
| `integer.BigUInt64BE` | bigint          | unsigned big-endian 64-bit integer    |
| `integer.BigInt64BE`  | bigint          | signed big-endian 64-bit integer      |

### Boolean

`boolean` is identical to `number`, except its JavaScript type is `boolean` instead of `number` or `bigint`. Any non-zero number is considered truthy. The first row of the table is shown for posterity, but the rest are removed for brevity.

| Codec           | JavaScript Type | Serialized Type        |
| --------------- | --------------- | ---------------------- |
| `boolean.UInt8` | boolean         | unsigned 8-bit integer |

### String

| Codec                                   | JavaScript Type | Serialized Type        |
| --------------------------------------- | --------------- | ---------------------- |
| `string.fixedLength(length, encoding?)` | string          | unterminated string    |
| `string.nullTerminated(encoding?)`      | string          | null-terminated string |

### Array

| Codec                    | Description                                          |
| ------------------------ | ---------------------------------------------------- |
| `times(codec, count)`    | Executes `codec` `count` times, and returns an array |
| `mapUntil(codec, until)` | Executes `codec` until `until` returns `true`        |

### Object

| Codec              | Description                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| `props(codecMap)`  | Parses an object, assigning the parsed output of each codec in `codecMap` to its respective key |
| `merge(...codecs)` | Parses an object by merging the parsed output of all `codecs` in series                         |

### Utility

| Codec                                                           | Description                                                                                   |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `assert(conditionFn, errorMsg)`                                 | Throws an error if the supplied condition is not met                                          |
| `branch(parseFn, serializeFn)`                                  | Uses the codec returned by `parseFn` or `serializeFn`.                                        |
| `choose(parseBranch, serializeBranch, branchMap)`               | Uses the codec selected by `parseFn` or `serializeFn`, by key of `branchMap`                  |
| `constant(value)`                                               | Parses to a constant value, and serializes to an empty buffer                                 |
| `enum(codec, values)`                                           | Uses `codec`, but throws an error if value is not in `values`                                 |
| `extend(codec, parse, serialize)`                               | Extend a codec, wrapping it with an extra `parse`/`serialize` method                          |
| `optional(shouldParse, shouldSerialize, trueCodec, falseCodec)` | If `shouldParse`/`shouldSerialize` return true, then uses `trueCodec`, otherwise `falseCodec` |
| `padding(length, fill?, encoding?)`                             | Parses to its context, but serializes `length` bytes worth of `fill`                          |
| `tap(callback)`                                                 | Calls `callback` when parsing and returns its context, serializes to an empty buffer          |
| `validate(codec, condition, errorMsg)`                          | Extends an existing parser to throw an error if the `condition` returns false                 |

## ➕ Contributing

This project is far from perfect, and so issues and pull requests are very welcome!

When contributing, please respect the [_Don't be a Dick_ Code of Conduct][dbad].

### Coding standards

- Everything should be written in TypeScript, with as-strong-as-possible type definitions.
- Code will be automatically formatted on every commit (using husky/lint-staged).
- An editorconfig file is supplied - please ensure editorconfig support is enabled in your editor of choice.

### Building locally

To get started, check out this repository locally, and then run `yarn` to install the dependencies.

You may build the project using:

```sh
$ yarn build
```

This will output the compiled library to the `./dist` folder.

### Running unit tests

You may run the unit tests using:

```sh
$ yarn test
```

Add the `--coverage` flag to generate a code coverage report. Where possible, this project aims to have 100% unit test code coverage, so please ensure any changes you make are covered by unit tests.

[dbad]: https://github.com/karlgroves/dontbeadick
