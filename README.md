# 🤖 Telegram Jav Search Bot

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green?style=for-the-badge&logo=node.js)
![Telegraf](https://img.shields.io/badge/Telegraf-v4.16.3-blue?style=for-the-badge&logo=telegram)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

A smart and interactive Telegram Bot built with Node.js and Telegraf to search and fetch actor details and streaming links seamlessly.

</div>

---

## ✨ Features

- **🔍 Smart Search:** Quickly search for actors or media by name or ID.
- **📄 Paginated Results:** Displays results in batches of 5 with clean inline buttons (`Watch Now ▷`).
- **⏱️ Cooldown System:** Built-in rate-limiting to prevent spam and server overload.
- **🔄 Interactive Prompts:** Asks users if they want to fetch more results interactively.

---

## 🛠️ Tech Stack

- **Language:** JavaScript (Node.js)
- **Framework:** [Telegraf](https://telegraf.js.org/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Environment Management:** Dotenv

---

## 🚀 Quick Start & Installation

If you want to run this bot locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git)
   cd YOUR_REPOSITORY_NAME

   Install dependencies:
npm install

Configure environment variables:
Create a .env file in the root directory and add your credentials:
BOT_TOKEN=your_telegram_bot_token_here
API_URL=your_target_api_url_here

Start the bot:
npm start

📦 Dependencies
{
  "dependencies": {
    "axios": "^1.6.8",
    "dotenv": "^16.4.5",
    "telegraf": "^4.16.3"
  }
}

🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

📝 License
This project is MIT licensed.
