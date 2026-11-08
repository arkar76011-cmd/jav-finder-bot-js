# 🤖 Telegram JAV Search Bot

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Telegraf](https://img.shields.io/badge/Telegraf-v4.16.3-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-F7B93E?style=for-the-badge)

A smart and interactive Telegram Bot built with Node.js and Telegraf to search and fetch actor details and streaming links seamlessly.

</div>

---

## ✨ Features

- 🔍 **Smart Search:** Quickly search for actors or media by name or ID.
- 📄 **Paginated Results:** Displays results in batches of 5 with clean inline buttons (`Watch Now ▷`).
- ⏱️ **Cooldown System:** Built-in rate-limiting to prevent spam and server overload.
- 🔄 **Interactive Prompts:** Asks users if they want to fetch more results interactively.

---

## 🛠️ Tech Stack

- **Language:** JavaScript (Node.js)
- **Framework:** [Telegraf](https://telegraf.js.org/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Environment Management:** Dotenv

---

## 🚀 Quick Start & Installation

If you want to run this bot locally, follow these steps:

```bash
# Clone the repository & navigate to directory
git clone [https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git)
cd YOUR_REPOSITORY_NAME

# Install dependencies
npm install

# Create a .env file in the root directory and add your credentials:
# BOT_TOKEN=your_telegram_bot_token_here
# API_URL=your_target_api_url_here

# Start the bot
npm start
