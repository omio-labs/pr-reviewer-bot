# How to Use

The bot is not hosted like a server but rather used a script that examines your codebase and your configuration to decide what to do with the given PR. Which means, you will need to:

- Configure the bot
  - [Validators](#user-content-validators)
- [Run the bot](#user-content-running)
  - As a Github Action

## Configuration

You will then need to create a configuration file as `.pr-bot.json` at the root directory of your project and fill it out with your project specific configuration. Here is an example:

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

You can also use wildcard `*` character when defining file or property paths. For example, the below configuration is valid:

```json
{
  "approvalRules": [
    {
      "changedFiles": {
        "allowed": ["tests/*", "package.json", "yarn.lock"]
      },
      "properties": [
        {
          "files": ["package.json"],
          "allowed": ["dependencies.@babel/*"]
        }
      ]
    }
  ]
}
```

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

## Running

The bot runs as a script. You'll need to run the bot somewhere, preferably in CI. 

### As a Github Action

Running the bot as a Github Action is quite straight forward. We'll do it in 3 quick steps:

#### Obtaining a Github Token

The only parameter the bot needs is a `GITHUB_TOKEN` to be used when posting a review to the pull request. Github Actions adds a default token in to your project's secrets without you doing anything. However, this token does not have permission to post reviews for PRs. Because of that, we'll need to create a new token to be used here. You can find an official guide for that [here](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line). 

#### Add the Token to the Secrets of Your Repository

After we obtain a personal token, you need to add this token to `secrets` section of your repository. In your repository view, go to `Settings` > `Secrets` and add the token with a name like `GH_TOKEN` or any name of your choice.

#### Create a Github Workflow

Now we just create a new file under `.github/workflows` to tell Github to run this script whenever there is a new pull request. Let's say the file name is `auto-pr-review.yml`. Then the file would look like below:

```yml
name: Auto PR Review

on: [pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v1
    - uses: actions/setup-node@v1
    - uses: omio-labs/pr-reviewer-bot@v1
      with:
        GITHUB_TOKEN: ${{ secrets.GH_TOKEN }}
```

This will create a checker on your pull requests and run the bot. You can view this checker on your pull requests.

![auto-pr-review-checker](/omio-labs/pr-reviewer-bot/blob/master/docs/img/auto-pr-review-checker.png)


# FAQ

- **Q:** What if the bot approves a pull request based on the configuration but the author later makes changes in the pull request in a way that it should not be auto-approved anymore?

  **A:** The ideal way to run the bot would be to run it as a PR checker. In which case the bot will re-run with every code change and will detect that the pull request does not fit the criteria anymore, even if it did before. In which case the bot will go ahead and **dismiss** its own approval and leave comment to explain why.

# Contributing

All ideas, feature requests and even better code is welcome. This repository uses [semantic-release](https://github.com/semantic-release/semantic-release).

Here is an example of the release type that will be done based on a commit messages:

| Commit message                                                                                                                                                                                   | Release type               |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------- |
| `fix(pencil): stop graphite breaking when too much pressure applied`                                                                                                                             | Patch Release              |
| `feat(pencil): add 'graphiteWidth' option`                                                                                                                                                       | ~~Minor~~ Feature Release  |
| `perf(pencil): remove graphiteWidth option`<br><br>`BREAKING CHANGE: The graphiteWidth option has been removed.`<br>`The default graphite width of 10mm is always used for performance reasons.` | ~~Major~~ Breaking Release |
