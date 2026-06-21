import { getLabel } from "../../Utils/Labels";
import { Team } from "../../domain/Team";
import { useState } from "react";
import { useInputSheet } from "../Common/InputSheetProvider";
import { SIDE } from "../../Constants";

export function AdminTeamsView({teams, setNewTeams, playTeamOnSide}) {
  const handleAddTeam = () => {
    setNewTeams([...teams, Team.createDefault(getLabel("new_team") || "New Team").toJSON()]);
  };

  const handleUpdateTeam = (updatedTeam) => {
    const updatedTeams = teams.map(team => team.id === updatedTeam.id ? updatedTeam : team);
    setNewTeams(updatedTeams);
  };

  const handleDeleteTeam = (teamToDelete) => {
    const updatedTeams = teams.filter(team => team.id !== teamToDelete.id);
    setNewTeams(updatedTeams);
  };

  const handlePlayTeam = (teamAndSide) => {
    playTeamOnSide(teamAndSide);
  };

  const noTeams = !teams || teams.length === 0;

  return (
    <div className="admin-teams-view inner-view">
      <h2>{getLabel("teams") || "Teams"}</h2>
      {teams && <TeamsList teams={teams} handleUpdateTeam={handleUpdateTeam} handleDeleteTeam={handleDeleteTeam} handlePlayTeam={handlePlayTeam} />}
      {noTeams && <p>{getLabel("no_teams_available") || "No teams available. Please add a team."}</p>}
      <button className="add-team-button" onClick={handleAddTeam}>
        {getLabel("add_default_team") || "Add Default Team"}
      </button>
    </div>
  );
};

function TeamsList({teams, handleUpdateTeam, handleDeleteTeam, handlePlayTeam}) {
  const [editingTeam, setEditingTeam] = useState(null);
  const [teamDetail, setTeamDetail] = useState(null);

  const onDone = () => {
    setEditingTeam(null);
    setTeamDetail(null);
  };

  return (
    <>
    {
      !editingTeam && 
      !teamDetail &&
      <ul className="teams-list">
        {teams.map(team => (
          <TeamRow key={team.id} team={team} editTeam={() => setEditingTeam(team)} detailTeam={() => setTeamDetail(team)} deleteTeam={handleDeleteTeam} playTeamOnSide={handlePlayTeam} />
        ))}
      </ul>
    }
    {
      editingTeam &&
      <EditTeam key={editingTeam.id} team={editingTeam} handleUpdateTeam={handleUpdateTeam} onDone={onDone} cancelEdit={() => setEditingTeam(null)} />
    }
    {
      teamDetail &&
      !editingTeam &&
      <TeamDetail key={teamDetail.id} team={teamDetail} editTeam={() => setEditingTeam(teamDetail)} exitDetail={onDone} />
    }
    </>
  );
}

function TeamRow({team, detailTeam, editTeam, deleteTeam, playTeamOnSide}) {

  const handlePlayTeam = () => {
    const chosenSide = window.confirm(getLabel("play_on_left_side") || "Do you want to play this team on the left side?") ? SIDE.LEFT : SIDE.RIGHT;
    playTeamOnSide({team, side: chosenSide});
  }
  return (
    <li className="team-row">
      <h3 onClick={() => detailTeam(team)}>{team.name}</h3>
      <div className="team-controllers">
        <button onClick={() => handlePlayTeam()}>{getLabel("play") || "Play"}</button>
        <button onClick={() => detailTeam(team)}>{getLabel("details") || "Details"}</button>
        <button onClick={() => editTeam(team)}>{getLabel("edit") || "Edit"}</button>
        <button onClick={() => deleteTeam(team)}>{getLabel("delete") || "Delete"}</button>
      </div>
    </li>
  );
}

function TeamDetail({team, editTeam, exitDetail}) {
  return (
    <div className="detail-team">
      <h2>{team.name}</h2>
      <p>{getLabel("players") || "Players"}: {team.players.map(p => p.tshirt).join(', ')}</p>
      <div className="team-detail-controls">
        <button onClick={editTeam}>{getLabel("edit") || "Edit"}</button>
        <button onClick={exitDetail}>{getLabel("close") || "Close"}</button>
      </div>
    </div>
  );
}

function EditTeam({team, handleUpdateTeam, onDone, cancelEdit}) {
  const { openTextSheet } = useInputSheet();
  const [newName, setNewName] = useState(team.name);
  const [playersText, setPlayersText] = useState(team.players.map(p => p.tshirt).join(", "));

  const parsePlayers = (text) => {
    return text.split(",").map((p, index) => ({
      tshirt: p.trim(),
      id: index + 1,
    })).filter(p => p.tshirt !== "");
  };

  const handleSave = () => {
    if (newName.trim() === "") {
      alert(getLabel("name_cannot_be_empty"));
      return;
    }
    const players = parsePlayers(playersText);
    handleUpdateTeam({...team, name: newName.trim(), players});
    onDone();
  };

  const openNameSheet = (event) => {
    openTextSheet({
      title: getLabel("team_name") || "Team Name",
      value: newName,
      triggerElement: event.currentTarget,
      onSave: (value) => setNewName(value.trim()),
    });
  };

  const openPlayersSheet = (event) => {
    openTextSheet({
      title: getLabel("players") || "Players",
      value: playersText,
      triggerElement: event.currentTarget,
      onSave: (value) => setPlayersText(value),
    });
  };

  return (
    <div className="edit-team">
      <button type="button" className="editable-value-row" onClick={openNameSheet}>
        <span className="value-label">{getLabel("team_name") || "Team Name"}</span>
        <span className="value-display">{newName}</span>
      </button>
      <button type="button" className="editable-value-row" onClick={openPlayersSheet}>
        <span className="value-label">{getLabel("players") || "Players"}</span>
        <span className="value-display">{playersText || "—"}</span>
      </button>
      <div className="team-controls">
        <button onClick={handleSave}>{getLabel("save") || "Save"}</button>
        <button onClick={cancelEdit}>{getLabel("cancel") || "Cancel"}</button>
      </div>
    </div>
  );
}
