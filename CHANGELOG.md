# 2.0.1 (2017-06-15)
* **Fixed** the return value from `.end()` to include the version string instead of the version object
* **Added** some more tests for existing and new features


# 2.0.0 (2017-06-15)
* **Refactored** code to use newer language features and set node engine to >= 6.0 (Resolves [#8](https://github.com/ciena-blueplanet/versiony/issues/8))
* **Added** ability to make `.end()` quiet (no logging) by passing in `{quiet: true}` to it (Resolves [#7](https://github.com/ciena-blueplanet/versiony/issues/7))
* **Added** support for a `.preRelease()` function that bumps (or sets) the pre-release portion of a semver version string (Resolves [#5](https://github.com/ciena-blueplanet/versiony/issues/5))


# 1.4.2 (2017-06-14)
* **Added** more tests
* **Enabled** `eslint` to run on the source files and fixed lint issues


# 1.4.1 (2017-06-09)
* **Added** `pullapprove` integration
* **Added** latest `pr-bumper` integration (to support `none` version bump)
* **Cleaned** up the `README.md` a little
* **Renamed** `changelog.md` to `CHANGELOG.md` to work with `pr-bumper`

# 1.2.4

 - remove package.json preferGlobal

# 1.2.2

 - remove cli from package. Instead, use

```js
    npm install -g versiony-cli
```
