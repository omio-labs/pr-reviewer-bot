#!/bin/bash

set -eu

INPUT_COMMIT_OPTIONS=""

_main() {
    if _git_is_dirty; then

        _setup_git

        _stash_changes

        _switch_to_branch

        _stash_pop

        _add_files

        _local_commit

        _push_to_github
    else
        echo "Working tree clean. Nothing to commit."
    fi
}

_git_is_dirty() {
    [[ -n "$(git status -s)" ]]
}

# Set up .netrc file with GitHub credentials
_setup_git ( ) {
  cat <<- EOF > $HOME/.netrc
        machine github.com
        login $GITHUB_ACTOR
        password $GITHUB_TOKEN
        machine api.github.com
        login $GITHUB_ACTOR
        password $GITHUB_TOKEN
EOF
    chmod 600 $HOME/.netrc

    git config --global user.email "actions@github.com"
    git config --global user.name "GitHub Actions"
}

_stash_changes() {
  git stash
}

_stash_pop() {
  git checkout stash -- .
}

_switch_to_branch() {
    echo "INPUT_BRANCH value: $INPUT_BRANCH";

    # Switch to branch from current Workflow run
    git checkout $INPUT_BRANCH
}

_add_files() {
    echo "INPUT_FILE_PATTERN: ${INPUT_FILE_PATTERN}"
    git add "${INPUT_FILE_PATTERN}"
}

_local_commit() {
    echo "INPUT_COMMIT_OPTIONS: ${INPUT_COMMIT_OPTIONS}"
    git commit -m "$INPUT_COMMIT_MESSAGE" --author="$GITHUB_ACTOR <$GITHUB_ACTOR@users.noreply.github.com>" ${INPUT_COMMIT_OPTIONS:+"$INPUT_COMMIT_OPTIONS"}
}

_push_to_github() {
    git push --set-upstream origin "HEAD:$INPUT_BRANCH"
}

_main
