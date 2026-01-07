# PokéTCG Card Collector 🎴

A Next.js Pokemon TCG card collection tracker built with Tailwind CSS and TypeScript.

## ⚠️ IMPORTANT: Setup Required for Card Images

**The `.env.local` file is NOT included in the repository for security reasons. You MUST create it yourself!**

### Quick Setup (Required!)

1. **Clone the repository**
   ```bash
   git clone https://github.com/sneh-13/poke-tcg.git
   cd poke-tcg
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env.local` file** ← **THIS IS REQUIRED!**

   Create a new file named `.env.local` in the root directory and add:
   ```env
   # Pokemon TCG API Key (REQUIRED for card images)
   # Get your FREE API key from: https://dev.pokemontcg.io/
   NEXT_PUBLIC_POKEMON_TCG_API_KEY=your_api_key_here

   # PokemonPriceTracker API Key (optional, for price data)
   POKEMON_PRICE_TRACKER_API_KEY=your_price_tracker_key_here
   ```

4. **Get your FREE API key**
   - Go to https://dev.pokemontcg.io/
   - Click "Get API Key"
   - Sign up (it's free!)
   - Copy your API key
   - Paste it in your `.env.local` file

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Visit [http://localhost:3000](http://localhost:3000)

## 🎯 Why do I see placeholder images?

If you see gray boxes or placeholder images instead of Pokemon cards, it means:
- ❌ You haven't created the `.env.local` file
- ❌ Your API key is missing or incorrect
- ❌ You're viewing older sets (API only has images for recent sets)

**Solution:** Follow step 3 above to create the `.env.local` file with your API key!

## 📦 Features

- ✅ Browse 1500+ Pokemon TCG sets from all series
- ✅ View **REAL Pokemon card images** from the Pokemon TCG API
- ✅ Filter sets by series, year, and search
- ✅ Track your card collection
- ✅ User authentication system
- ✅ Multi-language support (EN, ES, JA, FR)
- ✅ Fully responsive mobile design

## 🔧 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript
- **API:** Pokemon TCG API SDK
- **State:** React Context API

## 📁 Project Structure

```
├── app/                  # Next.js app directory
│   ├── page.tsx         # Home page (sets grid)
│   ├── set/[id]/        # Individual set page with cards
│   ├── collection/      # User's collection page
│   └── account/         # Account/auth page
├── components/          # Reusable React components
├── contexts/            # React Context providers
├── data/                # Pokemon sets data
├── lib/                 # Utility functions & API
│   └── pokemonApi.ts   # Pokemon TCG API integration
├── types/               # TypeScript types
└── public/images/       # Set logos (180+ MB)
```

## 🐛 Troubleshooting

### "Cards show gray boxes"
→ Create `.env.local` file with your Pokemon TCG API key (see step 3 above)

### "Images not loading"
→ Check your internet connection and API key in `.env.local`

### "Set has no cards"
→ Some older sets aren't available in the Pokemon TCG API

### "npm install fails"
→ Make sure you're using Node.js 18 or higher

## 📄 License

MIT License - Free to use for learning and personal projects!

## 🙏 Credits

- Pokemon TCG data from [Pokemon TCG API](https://pokemontcg.io/)
- Built with [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/)
