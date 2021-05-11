import { useState, useEffect } from "react";
import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";

function EditPlaylist({ spotifyApi, playlist, playlistObj, setEditList }) {
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    setNewPlaylistName(playlistObj.name);
    setDescription(playlistObj.description);
    setIsPublic(playlistObj.public);
  }, []);

  const editPlaylist = () => {
    console.log(playlist, newPlaylistName, description, isPublic);
    spotifyApi
      .changePlaylistDetails(playlist, {
        name: newPlaylistName,
        description: description,
        public: isPublic,
      })
      .then(
        function (data) {
          console.log("Playlist updated successfully!", data);
        },
        function (err) {
          console.log("Something went wrong!", err);
        }
      );
    setEditList(false);
  };

  const changePublicity = () => {
    setIsPublic(!isPublic);
  };

  return (
    <div>
      <form className="playlist-form" noValidate autoComplete="off">
        <TextField
          variant="outlined"
          className="playlist-bar"
          id="playlist-bar"
          label="Playlist Name"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
        />
        <TextField
          variant="outlined"
          className="description-bar"
          id="description-bar"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label className="publicity">Public</label>
        <Checkbox
          label="Public"
          value={isPublic}
          onChange={changePublicity}
          inputProps={{ "aria-label": "Checkbox A" }}
        />

        <Button variant="contained" onClick={editPlaylist}>
          Save Playlist
        </Button>
      </form>
    </div>
  );
}

export default EditPlaylist;
