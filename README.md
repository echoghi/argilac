![Logo](./src/assets/banner.png)

# ⚡️ Argilac ⚡️

A crypto trading bot that automates buying and selling based on TradingView alerts.

## Setup Instructions

### 1. App Setup

1. Install [Ngrok](https://ngrok.com), create an account, and set up an auth token.
2. Create a `.env` file and add the following variables: `RPC_MAINNET`, `RPC_TESTNET`, `MNEMONIC`.
3. Review and customize your preferences in `config.ts` (e.g., tokens to trade, mainnet or testnet).
   > **Note:** The bot defaults to trading WETH/USDC on the Polygon Mumbai testnet. Any EVM-compatible chain with Uniswap liquidity for your chosen token pair should work. Consider using Polygon or EVM L2s for lower transaction fees.
4. Start the app by running `yarn start`.
5. Launch Ngrok with `yarn ngrok` to expose your server on port 80.
   > **Note:** TradingView only accepts URLs with port numbers 80 and 443. More info [here](https://www.tradingview.com/support/solutions/43000529348-about-webhooks/)

### 2. TradingView Alerts Setup

1. Open a chart with your desired token pair, select an indicator/strategy, and create buy/sell alerts.
2. In the "Settings" tab of each alert, add `{ type: "BUY", price: "{{close}}" }` for buy alerts and `{ type: "SELL", price: "{{close}}" }` for sell alerts.
3. In the "Notifications" tab, add the URL from your Ngrok output and append "/route" to the end.

### 3. Telegram Bot Setup (Optional)

1. Add @BotFather on Telegram and follow the prompts to obtain an API key.
2. Use "Telegram Bot Raw" to get your unique chat ID.
3. Add your API key as `TELEGRAM_BOT_TOKEN` and chat ID as `TELEGRAM_CHAT_ID` in your `.env` file.
4. The bot will send notifications for buys, sells, errors, and insufficient balance (out of gas) to Telegram. If you don't provide an API key or chat ID, Telegram notifications will be disabled.

### 4. Profit!

Your bot should now be up and running at https://localhost:80. Monitor buys/sells from the dashboard or via the optional Telegram bot. You can also receive email notifications directly from TradingView through your alert settings. Trading can be halted via the control panel
