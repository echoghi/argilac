/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    telegramChatId: process.env.TELEGRAM_CHAT_ID,
    telegramToken: process.env.TELEGRAM_BOT_TOKEN,
    etherscanKey: process.env.ETHERSCAN_KEY,
    bscscanKey: process.env.BSCSCAN_KEY,
    polygonscanKey: process.env.POLYGONSCAN_KEY,
    optimismKey: process.env.OPTIMISM_KEY,
    arbiscanKey: process.env.ARBISCAN_KEY
  }
};

module.exports = nextConfig;
