import React from "react";

const AUTH_URL =
  "https://accounts.spotify.com/authorize&client_id=9207087173054e9c80ac65b3ee0a168c&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20playlist-modify-public%20playlist-read-private%20playlist-modify-private%20playlist-read-collaborative%20user-read-recently-played%20user-top-read%20app-remote-control%20streaming%20user-read-playback-position%20user-read-playback-state%20user-modify-playback-state";

export default function Login() {
  return <p>Log In Page</p>;
}
