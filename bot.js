// bot.js
require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');
const axios = require('axios'); // Gunakan axios untuk memanggil API
const urlApi = process.env.API_URL
const geminiApi = process.env.BOT_API_KEY_SERVER

// Inisialisasi bot dengan intent yang dibutuhkan
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const API_URL = `${urlApi}/api/generate`; // URL API

// Saat bot siap, log pesan ke konsol
client.once(Events.ClientReady, c => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Dengarkan setiap pesan yang dibuat
client.on(Events.MessageCreate, async message => {
  // Abaikan pesan dari bot lain
  if (message.author.bot) return;

  // Cek jika pesan dimulai dengan prefix, misal '!'
  if (message.content.startsWith('!generate')) {
    const userPrompt = message.content.slice('!generate'.length).trim();
    
    // Tampilkan pesan "sedang berpikir..."
    const thinkingMessage = await message.reply('Menganalisis permintaan Anda...');

    try {
      // Panggil API backend Anda
      const response = await axios.post(API_URL, {
        prompt: userPrompt,
        template: 'react', // Contoh, ini bisa dibuat dinamis
        model: 'gemini-1.5-flash',
        apiKey: geminiApi, // Gunakan API Key yang disimpan di server
      });

      const { code, reasoning } = response.data;
      
      // Kirim hasilnya dalam format code block
      if (code) {
        await thinkingMessage.edit(`Berikut adalah kode yang diminta:\n\`\`\`jsx\n${code}\n\`\`\`\n**Reasoning:**\n${reasoning}`);
      } else {
        await thinkingMessage.edit('Maaf, gagal membuat kode.');
      }

    } catch (error) {
      console.error(error);
      await thinkingMessage.edit('Terjadi kesalahan saat menghubungi AI.');
    }
  }
});

// Login ke Discord dengan token
client.login(process.env.DISCORD_BOT_TOKEN);