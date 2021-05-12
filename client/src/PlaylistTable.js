import { DataGrid, GridRowsProp, GridColDef } from "@material-ui/data-grid";
// import { useEffect } from "react";

const columns: GridColDef[] = [
  { field: "col1", headerName: "ID", width: 150 },
  { field: "col2", headerName: "Track", width: 150 },
  { field: "col3", headerName: "Artist", width: 150 },
  { field: "col4", headerName: "Play", width: 150 },
];

export default function PlaylistTable({ playlist }) {
  const playlistRows: GridRowsProp = [];

  playlist.map((track, i) => {
    playlistRows.push({
      id: i,
      col1: i,
      col2: track.track.name,
      col3: track.track.artists[0].name,
      col4: track.uri,
    });
  });

  return (
    <div style={{ height: 300, width: "100%" }}>
      <DataGrid rows={playlistRows} columns={columns} />
    </div>
  );
}
