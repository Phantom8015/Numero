# Numero - Discord Bot

## Overview

Numero is a fun and interactive Discord bot that provides AI-powered features, number-guessing games, server utilities, and more. With simple commands, users can engage in a variety of activities ranging from AI-generated content to helpful server management tools.

## Features

- AI-powered phrase continuation
- AI-generated images
- Interactive number guessing game
- Server and user information commands
- Message clearing functionality

## Commands

| Command                 | Description                                             |
| ----------------------- | ------------------------------------------------------- |
| `!help`                 | Displays all available commands.                        |
| `!continai`             | Continues a phrase using AI.                            |
| `!generate`             | Generates an image based on a prompt.                   |
| `!start <difficulty>`   | Starts the number-guessing game.                        |
| `!guess <number>`       | Makes a guess in the number-guessing game.              |
| `!hint`                 | Provides a hint for the current game.                   |
| `!giveup`               | Ends the game if playing alone and leaves it if not.    |
| `!botinfo`              | Displays useful information about the bot.              |
| `!userinfo`             | Shows information about a selected user.                |
| `!serverinfo`           | Shows information about the server.                     |
| `!nuke`                 | Clears all messages in the current channel.             |

## Installation

### Prerequisites

- Node.js (latest LTS recommended)
- npm or yarn
- A Discord bot token (register a bot at [Discord Developer Portal](https://discord.com/developers/applications))

### Steps to Host

1. **Clone the repository**
   ```sh
   git clone https://github.com/Phantom8015/numero.git
   cd numero
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Set up the environment**
   - Edit the `.env` file (don't even try using what's already in it)
   - Add the following lines and replace the contents of `TOKEN` with your actual token:
     ```env
     TOKEN=YOUR_BOT_TOKEN
     HUGGINGFACE_TOKEN=NEXT_STEP
     ```
   - Get a Hugging Face bearer token and put it as `HUGGINGFACE_TOKEN` field. Don't know how? Click [here](https://huggingface.co/docs/hub/en/security-tokens)
4. **Run the bot**
   ```sh
   npm start
   ```

## Support

If you encounter any issues, feel free to open an issue on GitHub or contribute a fix.

---

Enjoy using Numero! 🎲
