import { useState, useEffect } from "react";
import useAuth from "./useAuth";
import TrackSearchResult from "./TrackSearchResult";
import Track from "./Track";
import Player from "./Player";
import Playlist from "./Playlist";
import CreatePlaylist from "./CreatePlaylist";
import EditPlaylist from "./EditPlaylist";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import PlaylistTable from "./PlaylistTable";
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";

const spotifyApi = new SpotifyWebApi({
  clientId: "9207087173054e9c80ac65b3ee0a168c",
});

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [user, setUser] = useState("");
  const [playingTrack, setPlayingTrack] = useState();

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [lyrics, setLyrics] = useState("");

  const [editList, setEditList] = useState(false);
  const [playlist, setPlaylist] = useState("");
  const [playlistObj, setPlaylistObj] = useState("");
  const [createPlaylist, setCreatePlaylist] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [viewPlaylists, setViewPlaylists] = useState(false);
  const [loadPlaylists, setLoadPlaylists] = useState(false);
  const [addedCurrentSong, setAddedCurrentSong] = useState(false);
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const [playlistTable, setPlaylistTable] = useState(false);

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
    // if (userPlaylists.length > 0) setUserPlaylists(userPlaylists);
    if (user) {
      spotifyApi.getUserPlaylists(user).then(
        (data) => {
          setUserPlaylists(data.body.items);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }, [loadPlaylists]);

  //   useEffect(() => {
  //     if (user) {
  //       spotifyApi.getUserPlaylists(user).then(
  //         (data) => {
  //           if (viewPlaylists === false) {
  //             setUserPlaylists([]);
  //           } else {
  //             setUserPlaylists(data.body.items);
  //           }
  //         },
  //         (err) => {
  //           console.log(err);
  //         }
  //       );
  //     }
  //   }, [viewPlaylists, user]);

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
    setLoadPlaylists(true);
    setViewPlaylists(!viewPlaylists);
    setSearchResults([]);
    setSearch("");
    setCreatePlaylist(false);
    setPlaylistTable(false);
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
    setViewPlaylists(false);
  }

  function viewPlaylist(event) {
    setPlaylist(event.target.id);
    const playlist = event.target.id;
    spotifyApi
      .getPlaylistTracks(playlist, {
        offset: 1,
        limit: 50,
        fields: "items",
      })
      .then(
        (data) => {
          setPlaylistSongs(data.body.items);
        },
        (err) => {
          console.log("Something went wrong!", err);
        }
      );
    spotifyApi.getPlaylist(playlist).then(
      function (data) {
        setPlaylistObj(data.body);
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
    setViewPlaylists(false);
    setPlaylistTable(true);
    setAddedCurrentSong(false);
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
    setViewPlaylists(false);
    setPlaylistTable(false);
    setSearchResults([]);
  }

  function editPlaylist() {
    setEditList(!editList);
    setPlaylistTable(false);
    setViewPlaylists(false);
    setLoadPlaylists(true);
    setLoadPlaylists(false);
  }

  function cancelEdit() {
    setEditList(false);
  }

  function removePlaylist() {
    setPlaylistTable(false);
    const playlistToRemove = playlistObj.uri;

    const newPlaylistList = userPlaylists.filter(
      (list) => list.uri !== playlistToRemove
    );

    setUserPlaylists(newPlaylistList);
    setViewPlaylists(true);
  }

  return (
    <Container className="dashboard">
      <div className="buttons">
        <Button variant="contained" onClick={showPlaylists}>
          {viewPlaylists === false ? "Show Playlists" : "Hide Playlists"}
        </Button>
        <Button variant="contained" onClick={createNewPlaylist}>
          {createPlaylist === false
            ? "Create New Playlist"
            : "Cancel New Playlist"}
        </Button>
        {playlist !== "" &&
        playingTrack !== undefined &&
        addedCurrentSong === false ? (
          <Button
            variant="contained"
            onClick={addCurrentSongToSelectedPlaylist}
          >
            Add Current Song to Selected Playlist
          </Button>
        ) : null}
      </div>
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
        {editList === false ? null : (
          <EditPlaylist
            spotifyApi={spotifyApi}
            playlist={playlist}
            playlistObj={playlistObj}
            setEditList={setEditList}
            cancelEdit={cancelEdit}
          />
        )}
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
      <div className="playlist-list">
        {viewPlaylists === false
          ? null
          : userPlaylists.map((playlist) => (
              <div key={playlist.id} onClick={viewPlaylist}>
                <Playlist
                  key={playlist.id}
                  playlist={playlist}
                  editPlaylist={editPlaylist}
                />
              </div>
            ))}
      </div>
      {playlistTable === true &&
      editList === false &&
      playlistSongs.length > 0 ? (
        <div>
          <div className="playlist-info">
            <h1 className="playlist-title">{playlistObj.name}</h1>
            <p className="playlist-title">{playlistObj.description}</p>
            <Button onClick={editPlaylist} variant="outlined">
              Edit Details
            </Button>

            <Button onClick={removePlaylist} variant="outlined">
              Remove
            </Button>
          </div>

          <div className="show-list">
            {playlistSongs.map((track, i) => {
              return (
                <Track
                  id={track.uri}
                  className="track-search-results"
                  track={track}
                  key={i}
                  chooseTrack={chooseTrack}
                />
              );
            })}
          </div>
        </div>
      ) : null}

      {/* {playlistTable === true &&
      editList === false &&
      viewPlaylists == false &&
      playlistSongs.length > 0 ? (
        <PlaylistTable playlist={playlistSongs} />
      ) : null} */}

      {createPlaylist === false ? null : (
        <CreatePlaylist spotifyApi={spotifyApi} />
      )}

      <div className="bottom">
        <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
      </div>
    </Container>
  );
}
