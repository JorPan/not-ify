import { useState, useEffect } from "react";
import useAuth from "./useAuth";
import TrackSearchResult from "./TrackSearchResult";
import Player from "./Player";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";

const spotifyApi = new SpotifyWebApi({
  clientId: "9207087173054e9c80ac65b3ee0a168c",
});

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setLyrics] = useState("");
  //   const [userPlayLists, setUserPlaylists] = useState([]);

  function chooseTrack(track) {
    setPlayingTrack(track);
    setLyrics("");
  }

  useEffect(() => {
    if (!playingTrack) return;

    axios
      .get("http://localhost:3001/lyrics", {
        params: {
          track: playingTrack.title,
          artist: playingTrack.artist,
        },
      })
      .then((res) => {
        setLyrics(res.data.lyrics);
      });
  }, [playingTrack]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false;
    spotifyApi.searchTracks(search).then((res) => {
      if (cancel) return;
      setSearchResults(
        res.body.tracks.items.map((track) => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image;
              return smallest;
            },
            track.album.images[0]
          );

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          };
        })
      );
    });

    return () => (cancel = true);
  }, [search, accessToken]);

  //   useEffect(() => {
  //     spotifyApi.getMe().then(
  //       function (data) {
  //         console.log("Some information about the authenticated user", data.body);
  //       },
  //       function (err) {
  //         console.log("Something went wrong!", err);
  //       }
  //     );
  //   }, []);

  //   useEffect(() => {
  //     spotifyApi.getUserPlaylists("pandasaywhat").then(
  //       function (data) {
  //         console.log("Retrieved playlists", data.body);
  //       },
  //       function (err) {
  //         console.log("Something went wrong!", err);
  //       }
  //     );
  //   }, []);

  return (
    <Container className="dashboard">
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
      <div className="search-results">
        {searchResults.map((track) => {
          return (
            <TrackSearchResult
              className="track-search-results"
              track={track}
              key={track.uri}
              chooseTrack={chooseTrack}
            />
          );
        })}
      </div>
      <div className="lyric-section">
        <div></div>
        <div className="lyrics">{lyrics}</div>
        <div></div>
      </div>

      <div className="bottom">
        <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
      </div>
    </Container>
  );
}
