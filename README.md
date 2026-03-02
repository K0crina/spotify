📁 Project: Spotify Dashboard App

📌 General Description
The project consists of an interactive web application (HTML, CSS, Vanilla JavaScript) that connects to the user's Spotify account. The focus is on integrating with the Spotify Web API through the secure OAuth 2.0 (PKCE) authentication flow directly from the browser, asynchronous data processing and dynamic DOM manipulation to display musical statistics.

▶️ Setup and Run
1. Obtain a `Client ID` by creating an application in the Spotify Developer Dashboard.
2. Set the application's Redirect URI to your local server (e.g., `http://127.0.0.1:5500/index.html`).
3. Update the `CLIENT_ID` in the `src/config.js` and `src/auth.js` files.
4. Run the `index.html` file using a local server (e.g., the Live Server extension in VS Code).

📂 Module 1 – Secure Authentication (PKCE)

📘 Description:
Handles user login via redirect to the Spotify platform and the exchange of cryptographic codes to obtain the access token. It does not require a separate backend, as session data is securely stored in localStorage.

🧪 Functionality:
Access `index.html` -> Generate PKCE challenge -> Redirect login -> Validate and Save token.

📂 Module 2 – Profile & Playlist Management

📘 Description:
Displays account data, top musical genres and recent listening history (Recently Played). It includes an interactive sidebar menu through which the user can access their playlists and delete songs directly via API requests (`DELETE`).

🧪 Functionality:
Access `profile.html` -> Dynamic UI rendering -> Sidebar Playlists interaction.

📂 Module 3 – Personal Music Charts

📘 Description:
Extracts and displays, on dedicated pages with responsive grids, the top 5 positions from the user's medium-term preferences.

🧪 Functionality:
Navigate to `artists.html` / `albums.html` / `tracks.html` -> Categorized API requests.

📂 Module 4 – Real-Time Search Engine

📘 Description:
Simulates the native search function from Spotify. It takes the user's input and asynchronously queries the database, returning and simultaneously displaying results split into three columns: Tracks, Artists and Albums.

🧪 Functionality:
Access `search.html` -> Enter text in Search Bar -> Fetch and parse complex JSON object.
