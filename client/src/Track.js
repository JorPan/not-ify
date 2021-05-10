import React from "react";

export default function TrackSearchResult({ track, chooseTrack }) {
  function handlePlay() {
    chooseTrack(track.track);
  }

  return (
    <div className="search-result" onClick={handlePlay} key={track.track.uri}>
      <img
        className="album-art"
        src={track.track.album.images[0].url}
        alt="album-art"
      />
      <div>
        <div className="song-title">{track.track.name}</div>
        <div className="artist-name">{track.track.artists[0].name}</div>
      </div>
    </div>
  );
}
