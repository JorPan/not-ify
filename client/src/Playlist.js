import React from "react";

function Playlist({ playlist }) {
  return (
    <div className="playlist">
      <div>{playlist.name}</div>
      <img
        className="playlist-image"
        src={playlist.images[0].url}
        href="playlist image"
      />
    </div>
  );
}

export default Playlist;
