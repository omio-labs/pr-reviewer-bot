# Frequently Asked Questions

- **Q:** What if the bot approves a pull request based on the configuration but the author later makes changes in the pull request in a way that it should not be auto-approved anymore?

  **A:** The ideal way to run the bot would be to run it as a PR checker. In which case the bot will re-run with every code change and will detect that the pull request does not fit the criteria anymore, even if it did before. In which case the bot will go ahead and **dismiss** its own approval and leave comment to explain why.
