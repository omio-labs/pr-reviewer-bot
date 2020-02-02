# Contributing

We love pull requests from everyone. By participating in this project, you
agree to abide by the [code of conduct](CODE_OF_CONDUCT.md).

## Contribution Guide

This repository uses [semantic-release](https://github.com/semantic-release/semantic-release).

Here is an example of the release type that will be done based on a commit messages:

| Commit message                                                                                                                                                                                   | Release type               |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------- |
| `fix(pencil): stop graphite breaking when too much pressure applied`                                                                                                                             | Patch Release              |
| `feat(pencil): add 'graphiteWidth' option`                                                                                                                                                       | ~~Minor~~ Feature Release  |
| `perf(pencil): remove graphiteWidth option`<br><br>`BREAKING CHANGE: The graphiteWidth option has been removed.`<br>`The default graphite width of 10mm is always used for performance reasons.` | ~~Major~~ Breaking Release |

### Pull request checkers

Along with the usual PR checkers (unit tests, linters), this repository has an extra checker that requires you to sign off your latest commit. We're using [DCO](https://probot.github.io/apps/dco/) for that.
