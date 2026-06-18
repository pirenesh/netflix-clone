# Premium Netflix Clone Website

A fully featured, high-performance Netflix Clone built with React.js, Vite, Tailwind CSS, Firebase Authentication, Firestore Database, and TMDB API.

---

## 🚀 Features

- **Netflix-Style Homepage**: Implements a sleek dark UI, featuring a hero video banner and horizontal category rows with sliding controls.
- **Responsive Web Design**: Mobile-first fluid layout optimized for phones, tablets, and desktops.
- **Cinematic Detail Overlays**: Detailed modals for movies and TV shows including poster, release info, IMDB ratings, actor lists, recommendations, and video trailers.
- **Firebase Authentication**: Full user signup, signin, and session logout functionality.
- **Firestore Favorites List**: Synced user bookmarks stored in cloud database to persist customized content.
- **Real-Time Catalog Search**: Instant search filtering matching queries across multi-category media fields.
- **Offline Sandbox Fallback**: Built-in fallback database allowing developers to test signup, login, search, row slider controls, and favorites listing offline without requiring active API keys.
- **Shimmer Skeleton Loaders**: Shimmer transitions to load banners and thumbnails smoothly.

---

## 🛠️ Tech Stack

- **Framework**: [React.js](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend & Database**: [Firebase Auth](https://firebase.google.com/docs/auth) & [Firestore](https://firebase.google.com/docs/firestore)
- **API Client**: [Axios](https://axios-http.com/)
- **Routing**: [React Router DOM](https://reactrouter.com/en/main)

---

## 📁 Project Structure

```text
netflix-clone/
├── public/                 # Static assets
├── src/
│   ├── axios.js            # Axios client configuration for TMDB
│   ├── requests.js         # TMDB API routes matching categories
│   ├── firebase.js         # Firebase client initialization & mock checker
│   ├── mockData.js         # Extensive local dataset for offline fallback
│   ├── App.jsx             # React routing entry point
│   ├── main.jsx            # DOM render entry point
│   ├── index.css           # Tailwind configurations and scroll bars
│   ├── context/
│   │   └── AuthContext.jsx # Firebase Authentication & Firestore list actions
│   ├── components/
│   │   ├── Navbar.jsx      # Header menu bar with search bar & profiles
│   │   ├── Banner.jsx      # Random original movie hero section
│   │   ├── Row.jsx         # Custom sliding category rows
│   │   ├── MovieCard.jsx   # Media thumbnail with hover overlay details
│   │   ├── MoviePopup.jsx  # Modal overlay with trailer player & cast list
│   │   ├── ProtectedRoute.jsx # Secured routes gating
│   │   └── SkeletonLoader.jsx # Shimmer cards templates
│   └── pages/
│       ├── Landing.jsx     # Onboarding landing with FAQ accordions
│       ├── Login.jsx       # Login card with validations
│       ├── Signup.jsx      # Registration card
│       ├── Home.jsx        # Movie dashboard main screen
│       ├── Search.jsx      # Multi-field catalog filter results grid
│       ├── MovieDetails.jsx# Dedicated cinema watch page
│       ├── MyList.jsx      # User saved favorites listing
│       └── Profile.jsx     # Active profile selection & edits manager
├── tailwind.config.js      # Custom theme colors and keyframe configurations
├── vite.config.js          # Port setup & plugins config
├── .env.example            # Environment variables placeholder schema
└── .env                    # Configured environment variables (ignored by Git)
```

---

## ⚙️ Local Setup Guide

Follow these steps to run the application locally on your machine.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (version 18 or higher) installed.

### 1. Download Dependencies

Run the following command in the root folder to install the project dependencies:
```bash
npm install
```

### 2. Configure Environment Keys

Create a file named `.env` in the root folder of the project.
Copy the variables from `.env.example` and replace the placeholder values with your actual TMDB and Firebase credentials.

```env
# TMDB API Configuration
VITE_TMDB_API_KEY=your_tmdb_api_key_here

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

> 💡 **No Keys?** If you run the project without a `.env` file, the application will automatically activate **Offline Sandbox Fallback Mode**, providing pre-populated movies, search, account logins, and saved lists locally for demonstration.

### 3. Run Development Server

Start the local Vite development server:
```bash
npm run dev
```
The site will open automatically at [http://localhost:3000](http://localhost:3000).

### 4. Build Production Bundle

To build and compile the optimized production-ready bundle:
```bash
npm run build
```
The built files will be output to the `/dist` directory.
