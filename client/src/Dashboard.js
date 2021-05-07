import { useState, useEffect } from "react";
import useAuth from "./useAuth";
import TrackSearchResult from "./TrackSearchResult";
import Player from "./Player";
import Playlist from "./Playlist";
import CreatePlaylist from "./CreatePlaylist";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";

const spotifyApi = new SpotifyWebApi({
  clientId: "9207087173054e9c80ac65b3ee0a168c",
});

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [user, setUser] = useState("");
  const [playingTrack, setPlayingTrack] = useState();

  //   const [mode, setMode] = "";

  const [search, setSearch] = useState("");
  const [searchBar, setSearchBar] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [lyrics, setLyrics] = useState("");

  const [playlist, setPlaylist] = useState("");
  const [createPlaylist, setCreatePlaylist] = useState(false);
  const [userPlayLists, setUserPlaylists] = useState([]);
  const [viewPlaylists, setViewPlaylists] = useState(false);
  const [addedCurrentSong, setAddedCurrentSong] = useState(false);

  useEffect(() => {
    spotifyApi.getMe().then(
      (data) => {
        setUser(data.body.display_name);
      },
      (err) => {
        console.log(err);
      }
    );
  });

  useEffect(() => {
    if (user) {
      spotifyApi.getUserPlaylists(user).then(
        (data) => {
          if (viewPlaylists === false) {
            setUserPlaylists([]);
          } else {
            setUserPlaylists(data.body.items);
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }, [viewPlaylists]);

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

  function showPlaylists() {
    setViewPlaylists(!viewPlaylists);
    setSearchBar(false);
    setCreatePlaylist(false);
  }

  function showSearchBar() {
    setSearchBar(!searchBar);
    setViewPlaylists(false);
    setCreatePlaylist(false);
  }

  function clearLyrics() {
    setLyrics("");
  }

  function clearSearch() {
    setSearch("");
  }

  function chooseTrack(track) {
    setPlayingTrack(track);
    setLyrics("");
  }

  function createNewPlaylist() {
    setCreatePlaylist(!createPlaylist);
    setSearchBar(false);
    setViewPlaylists(false);
  }

  function selectPlaylist(event) {
    if (event.target.id === playlist) {
      setPlaylist("");
    } else {
      setPlaylist(event.target.id);
    }
  }

  function addCurrentSongToSelectedPlaylist() {
    if (!playingTrack || !playlist) return;
    spotifyApi.addTracksToPlaylist(`${playlist}`, [`${playingTrack.uri}`]).then(
      (data) => {
        console.log("Added tracks to playlist!", data);
      },
      (err) => {
        console.log("Something went wrong!", err);
      }
    );
    setAddedCurrentSong(true);
  }

  return (
    <Container className="dashboard">
      {!playlist ? null : (
        <p className="selected-playlist" onClick={selectPlaylist}>
          Selected playlist ID: {playlist}
        </p>
      )}

      <div className="buttons">
        <Button variant="contained" onClick={showPlaylists}>
          {viewPlaylists === false ? "Show Playlists" : "Hide Playlists"}
        </Button>
        <Button variant="contained" onClick={showSearchBar}>
          {searchBar === false ? "Show Search Bar" : "Hide Search Bar"}
        </Button>
        <Button variant="contained" onClick={createNewPlaylist}>
          {createPlaylist === false
            ? "Create New Playlist"
            : "Cancel New Playlist"}
        </Button>
        {playlist && playingTrack && addedCurrentSong === false ? (
          <Button
            variant="contained"
            onClick={addCurrentSongToSelectedPlaylist}
          >
            Add Current Song to Selected Playlist
          </Button>
        ) : null}
      </div>
      {userPlayLists.length > 0 ? (
        <h3 className="selection-instructions">
          Click on a playlist card to select or de-select it, then you can add a
          currently playing song to it!
        </h3>
      ) : null}
      <div className="playlist-list">
        {userPlayLists.length === 0
          ? null
          : userPlayLists.map((playlist) => (
              <div key={playlist.id} onClick={selectPlaylist}>
                <Playlist key={playlist.id} playlist={playlist} />
              </div>
            ))}
      </div>
      {searchBar === false ? null : (
        <div className="search-section">
          <form className="search-form" noValidate autoComplete="off">
            <TextField
              variant="outlined"
              className="search-bar"
              id="search-bar"
              label="Search Artists/Songs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {!search ? null : (
              <Button variant="contained" onClick={clearSearch}>
                Clear Search
              </Button>
            )}
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
            <div>
              {lyrics ? (
                <Button variant="contained" onClick={clearLyrics}>
                  Clear Lyrics
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      )}
      {createPlaylist === false ? null : (
        <CreatePlaylist spotifyApi={spotifyApi} />
      )}

      <div className="bottom">
        <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
      </div>
    </Container>
  );
}
