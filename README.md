# Auto Pull Request Review Bot/Action

`pr-reviewer-bot` reviews your pull requests based on the criteria you set and approves them automatically.

## How to Use

The ideal way to run this bot is to do it as a pull request checker. You can do so by running it as a Github Action. You will then need to write a configuration file define the rules of PR approval for the bot.

### Quick Access

- [Run the bot as a Github Action](#user-content-running)
- [Configure the bot](docs/configuration.md)
- [Frequently asked questions](docs/faq)
- [Contributing](CONTRIBUTING.md)

## Running As a Github Action

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

![auto-pr-review-checker](/docs/img/auto-pr-review-action.png)

# FAQ

Please refer to [FAQ](docs/faq.md).

# Contributing

Please refer to the [contribution guide](CONTRIBUTING.md).
