import { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";

function Playlist({ playlist }) {
  return (
    <div className="playlist" id={playlist.id} key={playlist.name}>
      <div className="playlist-id">{playlist.id}</div>
      <div>{playlist.name}</div>
      <img
        className="playlist-image"
        src={playlist.images.length > 0 ? playlist.images[0].url : null}
        href="playlist image"
      />
      {/* <Button onvariant="contained">View / Edit</Button> */}
      {/* <Button variant="contained">Delete</Button> */}
    </div>
  );
}

export default Playlist;
