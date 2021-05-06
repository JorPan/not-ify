import { useState, useEffect } from "react";
import useAuth from "./useAuth";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: "9207087173054e9c80ac65b3ee0a168c",
});

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    spotifyApi.searchTracks(search);
  }, [search, accessToken]);

  return (
    <Container>
      <form className="search-form" noValidate autoComplete="off">
        <TextField
          variant="outlined"
          className="search-bar"
          id="search-bar"
          label="Search Artists/Songs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
    </Container>
  );
}
