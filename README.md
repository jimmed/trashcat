# 🗑️🐈 trashcat

> A node.js toolkit for building binary codecs

## 📦 Features

- 🎯 **Parse and serialize binary data**

  Build codecs which can convert structured data into binary, and vice-versa.

- 🏗 **Declarative, extensible API**

  Compose the provided codecs, or write your own, to take complete control of how your data is parsed/serialized.

- ✍ **First-class TypeScript inference support**

  The provided codecs can (mostly) infer the type of your parsed data, leaving you to get on with the fun parts!

## 💡 Why would I use this?

This library is for you, if:

- you need to parse/serialize raw binary data, such as:
  - reading/writing a custom file format
  - interfacing with a network socket on an exotic protocol
- you want a single source of truth for both your codec's logic, and the data types it handles

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

integer.UInt8.parse(Buffer.from([25]));
// => { value: 25, byteLength: 1 }

integer.UInt8.serialize(25);
// => <Buffer 19> (Note: Buffer contents are displayed in hexadecimal!)
```

Another example is `string.nullTerminated`, which _returns_ a codec for null-terminated strings.

```ts
import { string } from "trashcat";

const codec = string.nullTerminated("ascii");

codec.parse(Buffer.from("hello world", "ascii"));
// => { value: 'hello world', byteLength: 11 }

codec.serialize("hello world");
// => <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>
```

### API Documentation

Every function provided by this library is documented within its source code.

- Number codecs
  - [`integer`](./src/number/integer.ts)
  - [`boolean`](./src/number/boolean.ts)
- String codecs
  - [`fixedLength`](./src/string/fixedLength.ts)
  - [`nullTerminated`](./src/string/nullTerminated.ts)
- Object codec helpers
  - [`merge`](./src/object/merge.ts)
  - [`props`](./src/object/props.ts)
- Array codec helpers
  - [`mapTimes`](./src/object/mapTimes.ts)
  - [`mapWhile`](./src/object/mapWhile.ts)
  - [`reduceWhile`](./src/object/reduceWhile.ts)
- Utilities
  - [`assert`](./src/util/assert.ts)
  - [`branch`](./src/util/branch.ts)
  - [`choose`](./src/util/choose.ts)
  - [`constant`](./src/util/constant.ts)
  - [`either`](./src/util/either.ts)
  - [`enumerator`](./src/util/enumerator.ts)
  - [`extend`](./src/util/extend.ts)
  - [`padding`](./src/util/padding.ts)
  - [`tap`](./src/util/tap.ts)
  - [`validate`](./src/util/validate.ts)

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
