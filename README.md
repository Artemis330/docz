<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="">
</p>

<p align="center">
  <img src="https://cdn-std.dprcdn.net/files/acc_649651/78jM8k">
</p>

<p align="center">
  <a href="http://docz.site" target="_blank">
    <img src="https://cdn-std.dprcdn.net/files/acc_649651/XG4L5H" alt="Docz video">
  </a>
</p>

---

<p align="center">
  [Home](https://docz.site) | [Introduction](https://docz.site/introduction) | [Documentation](https://docz.site/documentation) | [Themes](https://docz.site/themes) | [Plugins](https://docz.site/plugins)
</p>

## Introduction

The open source world with your tools that make developer's life easier and the creation of styleguides and design system are growing and evolving so fast. New and impressive things arising every day. Tools that can possibility to bring this evolution to us are really necessary nowadays. We can't create barriers or loose time with tasks that should be trivials for us.

To break barriers and facilitating the creation of tools that's Docz arose. Document our things is one of the most important and painfull process that exist when you're creating someting new. We loose a lot our precious time with unnescessary setups to can build someting that can represent and express what we want with our own style.

## More info

- [Getting Started](http://www.docz.site/introduction/getting-started)
- [Writing MDX](http://www.docz.site/introduction/writing-mdx)
- [Documenting your Things](http://www.docz.site/introduction/documenting-your-things)
- [Customizing](http://www.docz.site/introduction/customizing)
- [Deploying your docs](http://www.docz.site/introduction/deploying-your-docs)

## Features

- 🧘 **Zero config and easy.** Don't worry about complex configurations steps.
- ⚡️ **Blazing Fast.** Hot reload fully support with Wepack 4 and automatic code splitting.
- 💅 **Easy to customize.** Create and use fully customizable themes.
- 📝 **MDX Based.** Write markdown with all power of components.
- 🎛 **Pluggable.** With plugins you can manipulate a lot of things throught the docz flow and data.
- 🔐 **Typescript Support.** We have a fully support for your typings.

## Usage

Be easy is one of our core principles. So, to getting started with docz is something really easy and quick. First of all, you need to install docz on your project using some package manager

```bash
$ yarn add docz --dev
```

Then create some `.mdx` anywhere file inside your project:

```markdown
---
name: Button
---

import { Playground, PropsTable } from 'docz'
import Button from './'

# Button

<PropsTable of={Button} />

## Basic usage

<Playground>
  <Button>Click me</Button>
  <Button kind="secondary">Click me</Button>
</Playground>
```

Now just run your dev server

```bash
$ yarn docz dev
```

That's it! You're have a badass documentation now 👊

![](https://cdn-std.dprcdn.net/files/acc_649651/AmFJ2k)

Any doubt? Check [our docs](http://docz.site) to see more about Docz!

## Contributions

Contributions, issues and feature requests are very welcome. If you are using this package and fixed a bug for yourself, please consider submitting a PR!
Also you can ping me at [Twitter](https://twitter.com/pedronauck)
