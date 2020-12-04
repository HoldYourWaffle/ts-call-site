# Contributing to ts-call-site
All contributions are appreciated, as long as they keep in mind these basic rules:

## Issues
1. Check if an issue for your bug/suggestion already exists.
2. Please provide a clear description of the bug/suggestion.
3. **Always** include a **minimal code sample**.
4. If you're up to it, try contributing the fix/feature yourself by opening a [pull request](#Pull-requests).
5. Be nice :heart:

## Pull requests
1. Pull requests must be based-on and targeted-to the `main` branch.
2. Tests must be added or updated (if applicable).
3. Do not introduce breaking changes, except when:
	- This behavior relies on a bug.
	- There's another *very good* reason to.
4. Splitting your contribution in multiple commits is highly encouraged, as long as each of them represents a ["unit of work"](https://jasonmccreary.me/articles/when-to-make-git-commit/). Please squash all 'intermediate' commits before opening your pull request.
5. Be nice :heart:

### Code style
1. Use **tabs** instead of spaces.
2. Prefer `'` over `"`.
3. Always keep two empty lines between the last import statement and actual code.
4. Always use semicolons, except for:
	- Import declarations.
	- Multi-line function invocations, for example a function invocation with an anonymous function as parameter.
5. Only use `any` when **absolutely necessary**.
6. The return type of functions should be declared **explicitly**, except for small inner functions.
7. In tests, when the exact 'location of invocation' is not immediately obvious, put it on a new line to avoid "parentheses hell".
