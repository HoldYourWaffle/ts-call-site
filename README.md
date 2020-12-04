# ts-call-site
![npm](https://img.shields.io/npm/v/ts-call-site)

Analyzes stackframes and source maps to get a function's call site as AST node *at runtime*.
This can be used to analyze *how* the function was called, with full type information.

## :warning: Enable source maps
This modules needs source maps to connect JavaScript stackframes to the orignal TypeScript AST.
Please make sure that source map support is enabled before using this module.
Instructions and more information can be found at the [source-map-support](https://www.npmjs.com/package/source-map-support) package.

<h4><p align="center">:exclamation: THIS MODULE <i>RELIES</i> ON SOURCE MAPS TO WORK :exclamation:</p></h4>

## Usage
```ts
// Enable source maps, see source-map-support's documentation for alternatives
import 'source-map-support/register'
import { getCallSite } from 'ts-call-site'

function myAmazingCaller() {
	myAmazingFunction();
}

function myAmazingFunction() {
    const caller = getCallSite();
    // Now you can do whatever you want with your CallExpression
    console.log(caller.getText()); // 'myAmazingFunction()'
}
```

The `getCallSite` method also supports an options object:
### stackAtCalled
An `Error` object containing the stack representing the call to be analyzed.
This stack will generally look like this:
```
[0] at myAmazingFunction (a:b)
[1] at myAmazingCaller (x:y)
```
The second element down this stack (index 1) is treated as 'the caller', and the `CallExpression` at that position is returned.

If none is provided, a new `Error` object is created for you.
The extra `getCallSite` stackframe is taken into account.

### project
A `Project` instance or `ProjectOptions` from `ts-morph`. Used to [setup source analysis](https://ts-morph.com/setup/).
Re-using a `Project` instance among multiple `getCallSite` calls will almost certainly result in a big performance boost.

If none is provided, a new `Project` is created based on the `tsconfig` file nearest to the *calling* file.

## Contributing
I love all contributions! See the [contribution guide](CONTRIBUTING.md) for more information.
