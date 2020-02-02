# Configuration

The bot read your configuration from a YAML or a JSON file called either `.pr-bot.yml` or `.pr-bot.json` respectively. These files should be placed at the root directory of your project. It will include the rules you define for the bot to decide whether or not to approve a certain pull request. Here is an example one such configuration:

```yml
approvalRules:
  - changedFiles:
      allowed:
        - tests/*
        - package.json
        - yarn.lock
    properties:
      - files:
          - package.json
        allowed:
          - dependencies.@babel/*
```

Based on this configuration, the bot will approve if all of below is true:

- only files under `tests` or `package.json` or `yarn.lock` have changed.
- `dependencies.@babel/*` is the only property of `package.json` that has changed.

You can [view more examples below](#user-content-more-examples).

### Validators

`approvalRules` is an array of objects and each object has a set of validators you can configure. A PR will only be auto-approved if all the validators in a set of rule object allows it. These are the validators the bot currently supports:

#### `changedFiles`

Using this validator, you can whitelist a set of files that a PR can change and can still be auto-approved. `changedFiles` accepts two array of strings called `allowed` and `disallowed`. Any file that's not covered in `allowed` is by default disallowed. The `disallowed` option can be used to blacklist a set of files `allowed` already covers. For instance if you want to whitelist `app/components` but you have a special component that you don't want auto-approved, then you can set:

```js
{
  "changedFiles": {
    "allowed": ["app/components/*"],
    "disallowed": ["app/components/SpecialComponent"]
  }
}
```

#### `properties`

This validator allows you to whitelist a specific set of properties that you want to allow in a file. For instance, you might want to allow people to update the `devDependencies` section of your `package.json` (if you're running this on a JavaScript project), you can do it as follows:

```js
{
  "properties": [{
    "files": ["package.json"],
    "allowed": ["devDependencies"]
  }]
}
```

Every property that is not covered by `allowed` section will by default be **disallowed**. The `disallowed` option let's you further blacklist the set of files you want to disallow even if they're already already allowed by the `allowed` option. For instance, if you wanted to allow people to update `devDependencies` but not the `babel`, you could set the following config:

```js
{
  "properties": [{
    "files": ["package.json"],
    "allowed": ["devDependencies"],
    "disallowed": ["devDependencies.@babel/*"]
  }]
}
```

The `properties` setting works on data files with the following file types:

- JSON
- YAML

The bot automatically detects the file type based on the file extension.

#### `versionBump`

This validator lets you validate the dependency version changes on your PRs. It uses [semantic versioning](https://semver.org) terms to decide whether a dependency update is allowed or not. It supports the following dependency managers:

- npm/yarn

You can define the sort of the version change you want to auto-approve like this:

```js
{
  "versionBump": {
    "packageManager": "npm",
    "versionBumpType": "minor"
  }
}
```

In this example, we're allowing only minor version changes to be auto-approved. For instance, if the author of the pull request has updated the `react` version from `16.8.0` to `16.9.0`, this change will be auto-approved as this is a _minor_ version change. But a change from `16.8.0` to `17.0.0` will not be approved.

## More Examples

```yml
approvalRules:
  - changedFiles:
      allowed:
        - app/locales
        - package.json
        - yarn.lock
    properties:
      - files:
          - package.json
        allowed:
          - translationVersion
          - dependencies
          - devDependencies
    versionBump:
      packageManager: npm
      versionBumpType: minor
  - changedFiles:
      allowed:
        - native-app
        - app-slice
```

PR will be approved if all of below is true:

- only files under `app/locales` or `package.json` or `yarn.lock` have changed.
- `translationVersion`, `dependencies` and `devDependencies` are the only properties of `package.json` that have changed.
- Version bumps of in `dependencies`, `devDependencies` or `peerDependencies` are only `minor` or `patch`.

**or**

- only files under `native-app` or `app-slice` have changed.

Notice that multiple `approvalRules` work as an `OR` check while the rules under `validators` work as `AND` checks.

If you don't like YAML, you can also set this configuration in a JSON format by writing the below text in a `.pr-bot.json` file.

```json
{
  "approvalRules": [
    {
      "changedFiles": {
        "allowed": ["app/locales", "package.json", "yarn.lock"]
      },
      "properties": [
        {
          "files": ["package.json"],
          "allowed": ["translationVersion", "dependencies", "devDependencies"]
        }
      ],
      "versionBump": {
        "packageManager": "npm",
        "versionBumpType": "minor"
      }
    },
    {
      "changedFiles": {
        "allowed": ["native-app", "app-slice"]
      }
    }
  ]
}
```
