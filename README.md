![](https://i.imgur.com/zQUYqTY.png)

<h1 align="center"> 
	Bero Application
</h1>

> Have you ever pondered the art of infusing a perfect blend of moderation and delight into the very fabric of your Discord server? Well, search no more! With Bero undergoing continuous development, your routine tasks will be seamlessly managed, liberating you to immerse yourself in a realm of limitless possibilities and creative exploration.

Mastering this framework is akin to unlocking powerful spells that unveil the full potential of discord.js, allowing you to craft bespoke solutions and make your server's experience truly unique. 

The charm behind Bero lies in the discord.js framework, breathing life into bots and enabling adventures in the realm of Discord. It's akin to a chest filled with elements representing enchanted servers, magical channels, and mysterious messages. With magical methods and events at your fingertips, you can conjure wonders and fulfill the wishes of your users.

#### [Read the docs →](https://discord.js.org/#/)

## Settings
Within the `.env` file, we will store a few variables:

```plaintext
TOKEN=
```
To set up your application, follow these steps: Locate the `.env.example` file in your project repository. Rename the file from `.env.example` to `.env`. In the `.env` file, you'll find a line similar to this:

```plaintext
TOKEN=
```
After the equal sign (=), paste your Discord bot token. It should look like this:
```plaintext
TOKEN=your_bot_token_here
```
Save the `.env` file.

Now, your application is configured to use the Discord bot token you've provided in the `.env` file. Remember to keep this file secure and never share your token with anyone else.

## Installing Dependencies

To get started with this project, you'll need to install its dependencies. You can choose your preferred package manager from the options below.

```bash
# with npm (recommended)
npm install

# with pnpm
pnpm install

# with yarn
yarn install

# with yarn
bun install
```
Feel free to customize the installations according to your preferences.

## Start Project

You can easily start the project by directly using the command
```bash
node .
```
I personally recommend giving [bun](https://github.com/oven-sh/bun) a whirl to kickstart your project - it's a shiny, new tech.
```bash
# with npm
npm install -g bun
```
To kickstart the project:
```plaintext
bun run index.js
```
## Structure
<details>
  <summary>Example of implementing slash (/) commands in Discord using the SlashCommandBuilder class as a foundation.</summary>
  
```js
import SlashCommands from '../../Structure/SlashCommands.js';
import { SlashCommandBuilder } from 'discord.js';

export default class extends SlashCommands {
  constructor(client) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('.')  
    });
  }

  run = (interaction) => {

  }
}
```
#### Example
```
/
|-- src
|   |-- SlashCommands
|       |-- Administrator
|           |-- SetCommand.js
```
</details>
<details>
  <summary>Example of implementing prefix commands in Discord using the PrefixCommand class as a foundation.</summary>

```js
import PrefixCommands from '../../Structure/PrefixCommands.js';

export default class extends PrefixCommands {
    constructor(client) {
        super(client, {
            name: 'test',
            aliases: ['testing']
        });
    }
    run = (message, args) => {

    }
}
```
#### Example
```
/
|-- src
|   |-- PrefixCommands
|       |-- Geral
|           |-- DefaultCommand.js
```
</details>
<details>
  <summary>Example of implementing Discord.js events using the EventMap class as a foundation.</summary>
  
```js
import EventMap from '../../Structure/EventMap.js';

export default class extends EventMap {
  constructor(client) {
    super(client, {
      name: 'ready' // event name
    });
  }
  run = () => {

  }
}
```
#### Example
```
/
|-- src
|   |-- Events
|       |-- Client
|           |-- ReadyEvent.js
```
</details>

## License

This project is licensed under the Apache License. Please refer to the  [LICENSE](LICENSE) for details.

---

**🌟 Do you love this project as much as I do?**

If the answer is "yes", then I have a special request for you! Imagine that each "star" in my repository is like a magical spark that brings my work to life. ✨

I want you to join my galaxy of stars and help me illuminate the code universe! It's as easy as a click, and you'll become part of my constellation of supporters.

Leave your luminous mark on my repository by clicking on that shiny star above ⭐️ and help me keep spreading the magic!

Remember, the more shine, the more magic! Together, we can light up the code in a truly enchanting way. 🪄💫

Thank you for being part of this amazing development universe! 🚀🌌
