# 🎵 Spotify Personal Dashboard

A sleek React TypeScript application that displays your personalized Spotify listening data with a beautiful dark theme interface. Connect your Spotify account to see your top tracks, favorite artists, and recently played songs in a clean dashboard layout.

![Spotify Dashboard](https://img.shields.io/badge/React-19.2.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue) ![Vite](https://img.shields.io/badge/Vite-7.2.4-purple) ![Spotify API](https://img.shields.io/badge/Spotify-Web%20API-green)

## ✨ Features

### 📊 **Dashboard Sections**
- 🎵 **Top Tracks** - Your 3 most listened songs (medium-term)
- 🎤 **Top Artists** - Your 3 favorite artists with follower counts
- 🕒 **Recently Played** - Your 3 most recent tracks (updates in near real-time)

### 🔐 **Authentication & Security**
- **Spotify OAuth 2.0** - Secure login with Spotify account
- **Token persistence** - Stays logged in with localStorage
- **Environment variables** - Secure credential management
- **Proper scopes** - Only requests necessary permissions

### 🎨 **User Experience**
- **Dark theme** - Spotify-inspired design
- **Responsive layout** - Works on all screen sizes
- **Loading states** - Smooth user feedback
- **Error handling** - Clear error messages and retry options
- **Clean logout** - Easy session management

## 🚀 Quick Start

### Prerequisites
- Node.js (18+ recommended)
- A Spotify account
- Spotify Developer App credentials

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd spotify-dashboard
npm install
```

### 2. Set Up Spotify App
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click **"Create App"**
3. Fill in app details:
   - **App name**: My Spotify Dashboard
   - **App description**: Personal dashboard for Spotify data
   - **Redirect URI**: `http://127.0.0.1:5191/`
   - **API/SDKs**: Web API
4. Save your **Client ID** and **Client Secret**

### 3. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
VITE_CLIENT_ID=your_spotify_client_id_here
VITE_CLIENT_SECRET=your_spotify_client_secret_here
```

### 4. Run the Application
```bash
npm run dev
```

Visit `http://127.0.0.1:5191/` in your browser.

## 📱 How to Use

1. **🔑 Login**: Click "Login with Spotify" and authorize the app
2. **📊 Load Data**: Click "Load My Spotify Data" to fetch your stats
3. **👀 Explore**: Browse your top tracks, artists, and recent plays
4. **🚪 Logout**: Use the logout button to clear your session

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | Frontend framework with latest features |
| **TypeScript** | Type safety and better developer experience |
| **Vite** | Fast build tool and dev server |
| **Spotify Web API** | Music data and authentication |

## 🔧 API Endpoints Used

- `/me/top/tracks` - User's top tracks
- `/me/top/artists` - User's top artists  
- `/me/player/recently-played` - Recently played tracks
- `/authorize` - OAuth authentication
- `/api/token` - Token exchange

## 📊 Spotify Data Refresh

- **Recently Played**: Updates after listening to 30+ seconds of a song
- **Top Tracks/Artists**: Based on medium-term listening (last 6 months)
- **Real-time**: Data fetches fresh from Spotify API each time you load

## 🔒 Security & Privacy

### ✅ What's Secure
- Environment variables for credentials
- No hardcoded API keys in source code
- `.env` file is gitignored
- OAuth 2.0 authentication flow

### ⚠️ Important Notes
- This is a **frontend-only** implementation
- Client secret is exposed to browser (for demo purposes)
- For production use, implement a backend server

### 🛡️ Permissions Requested
- `user-read-private` - Basic profile access
- `user-read-email` - Email address
- `user-top-read` - Top artists and tracks
- `user-read-recently-played` - Recently played tracks
- `user-read-currently-playing` - Current playback state

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── Dashboard.tsx    # Main dashboard logic
│   ├── TopTracks.tsx    # Top tracks display
│   ├── TopArtists.tsx   # Top artists display
│   └── RecentlyPlayed.tsx # Recent tracks display
├── types/
│   └── spotify.ts       # TypeScript interfaces
├── utils/
│   └── spotify.ts       # API functions
└── App.tsx              # Main app component
```

## 🚀 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🔮 Future Enhancements

- [ ] **Backend Integration** - Secure token handling
- [ ] **Time Range Selection** - Short/medium/long term options
- [ ] **More Data Points** - Playlists, albums, genres
- [ ] **Currently Playing** - Real-time playback info
- [ ] **Music Controls** - Play/pause/skip integration
- [ ] **Data Export** - Download your stats
- [ ] **Sharing** - Share your music taste

## 🐛 Troubleshooting

### Common Issues

**❌ "MISSING" Client ID/Secret**
- Check your `.env` file exists and has the correct variable names
- Restart the dev server after adding environment variables

**❌ "Failed to authenticate"**
- Verify your Spotify app redirect URI is exactly: `http://127.0.0.1:5191/`
- Check your Client ID and Secret are correct

**❌ "Failed to load Spotify data"**
- Make sure you've granted all required permissions
- Try logging out and logging back in

### Getting Help
1. Check the browser console for error messages
2. Verify your Spotify Developer Dashboard settings
3. Ensure you're using the correct redirect URI

## 📄 License

MIT License - feel free to use this project for your own Spotify dashboard!