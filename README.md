# 🎵 My Spotify Dashboard

A React TypeScript application that displays your Spotify listening data including top tracks, top artists, and recently played songs.

## ⚠️ Security Notice

**IMPORTANT**: This project requires Spotify API credentials that must be kept secure.

### 🔐 Environment Variables Setup

1. **Copy the example file**:
   ```bash
   cp .env.example .env
   ```

2. **Add your Spotify credentials to `.env`**:
   ```
   VITE_CLIENT_ID=your_spotify_client_id_here
   VITE_CLIENT_SECRET=your_spotify_client_secret_here
   ```

3. **Never commit your `.env` file** - it's already in `.gitignore`

### 🎯 Getting Spotify API Credentials

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Note down your Client ID and Client Secret
4. Add redirect URI: `http://127.0.0.1:5192/`

## 🚀 Installation & Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables** (see Security Notice above)

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and go to `http://127.0.0.1:5192/`

## 🎨 Features

- **Spotify OAuth Authentication**
- **Top Tracks** - Your most listened songs  
- **Top Artists** - Your favorite artists
- **Recently Played** - Your recent listening history
- **Dark Theme** - Clean, modern design matching Spotify
- **Responsive Layout** - Works on desktop and mobile

## 🛠️ Tech Stack

- React 19
- TypeScript  
- Vite
- Spotify Web API

## 📝 Usage

1. Click "Login with Spotify"
2. Grant permissions to the app
3. Click "Load My Music Data"  
4. View your personalized dashboard!

## 🔒 Security Notes

- ✅ API credentials loaded from environment variables
- ✅ `.env` file is gitignored
- ✅ No hardcoded secrets in source code
- ⚠️ Frontend-only implementation (client secret still exposed to browser)

## 📖 Future Improvements

- Implement backend server for secure token handling
- Add more time range options
- Add playlist management
- Add currently playing track
- Add music controls

## 📄 License

MIT License