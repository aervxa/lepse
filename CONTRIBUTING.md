# Contributing to Lepse

All packages enabling Lepse to function have their code publicly available in the monorepo, and are licensed under either open source or source-available licenses. As such, all contributions are welcome! Before you start, there are a few things to keep in mind throughout the process.

> [!NOTE]
> This is still a WIP, so some packages are unlicensed. I have not yet decided on licenses for them. The Lepse app itself is open source.

## Development

Most of Lepse is written in JavaScript and the Rust language, either vanilla (Node.js), or with frameworks ([Nuxt](https://nuxt.com/)/[Tauri](https://tauri.app)), but other languages/frameworks may also be used in little.

The code starts at the root of the monorepo, which you can find [here](https://github.com/lepsehq/lepse). The monorepo is managed by [Turborepo](https://turborepo.org), but usually you would just run scripts from `package.json`.

Each package has its own development dependencies and requirements to get started, please refer to the respective `README.md` file.

## Guidelines

These guidelines apply to all packages in this monorepo. Packages may add onto these with their respective `CONTRIBUTING.md` files. Following them helps your contributions get reviewed easier, makes the merge/fix smoother, and is very much appreciated.

### Issues

All issues must start with a prefix indicating what the issue covers. As such, requests and feedback can also be posted as an issue, but should have the prefix 'request' and 'feedback' respectively. (other examples: 'bug', 'feature', 'styling')

Please report detailed issues. This usually includes a good title and description. The more detailed and specific you are, the easier it is to resolve the issue.

### Pull requests

Small, single implementation pull requests are preferred over huge messy pull requests. Bug fixes, tiny tweaks, QoL changes, and the likes are much easier to review and is more likely to be merged smoothly.

Large features are preferred to first be discussed in detail in an issue before working on the implementation only to find out that the implementation is executed wrongly or not as intended.

And most importantly, all pull request titles must start with a conventional prefix:

- `feat`: a new feature
- `fix`: a bug fix (or anything other fix)
- `tweak`: a change that isn't to fix a bug or doesn't add a new feature (this is often also called `refactor`)
- `chore`: a change that doesn't modify functionality or any interfaces
- `build`: a change to building (such as scripts or a build dep)
- `ci`: a change to ci

> I have not covered everything. Any other conventional or clear prefix can also be used, like `revert`, or `perf`.

### Regarding use of AI

You yourself are responsible for every line of code that you propose. If the implementation looks excessive or over-engineered, it will be declined with an `ai-slop` tag. Moreover, if anyone else does exactly your same implementation without the use of AI, theirs will be favored, no questions asked.

Refrain from replying with an AI, no one wants to discuss a change with **your** AI chatbot.

## Closing lines

There are more than a few reasons to want to discuss a feature/fix before working on it. If you are confused on if something is good/correct, unclear on an implementation, or if you can't get the code running on your machine, feel free to reach out (options are on the main `README.md` file).

If a pull request is closed, or an issue is declined for some reason, don't take it personally or as a sign to not keep contributing. Sometimes a contribution just isn't a good fit not because it's bad, but because of the timing or a change in the ideology of the implementation. Don't feel disheartened!

### Writing code is not the only way to contribute

You can contribute by supporting the community, coming up with ideas, giving feedback, requesting features, or reporting bugs. Using Lepse is a contribution in and of itself.

Thanks for sticking around for the contribution guidelines!
