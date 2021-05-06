import React from "react";

export default function TrackSearchResult({ track, chooseTrack }) {
  function handlePlay() {
    chooseTrack(track);
  }

  return (
    <div className="search-result" onClick={handlePlay}>
      <img className="album-art" src={track.albumUrl} alt="album-art" />
      <div>
        <div>{track.title}</div>
        <div>{track.artist}</div>
      </div>
    </div>
  );
}
