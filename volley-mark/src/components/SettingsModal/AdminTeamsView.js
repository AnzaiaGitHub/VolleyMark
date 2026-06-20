import { getLabel } from "../../Utils/Labels";
import { Team } from "../../domain/Team";
import { useState } from "react";
import { useInputSheet } from "../Common/InputSheetProvider";

export function AdminTeamsView({teams, setNewTeams}) {
  const handleAddTeam = () => {
    setNewTeams([...teams, Team.createDefault(getLabel("new_team") || "New Team").toJSON()]);
  };

  const handleUpdateTeam = (updatedTeam) => {
    const updatedTeams = teams.map(team => team.id === updatedTeam.id ? updatedTeam : team);
    setNewTeams(updatedTeams);
  };

  return (
    <div className="admin-teams-view inner-view">
      <h2>{getLabel("manage_teams") || "Manage Teams"}</h2>
      {teams && <TeamsList teams={teams} handleUpdateTeam={handleUpdateTeam} />}
      {(!teams || (teams && teams.length === 0)) && <p>{getLabel("no_teams_available") || "No teams available. Please add a team."}</p>}
      <button onClick={handleAddTeam}>{getLabel("add_default_team") || "Add Default Team"}</button>
    </div>
  );
};

function TeamsList({teams, handleUpdateTeam}) {
  const [editingTeam, setEditingTeam] = useState(null);
  const [teamDetail, setTeamDetail] = useState(null);

  return (
    <>
    {
      !editingTeam && 
      !teamDetail &&
      <ul className="teams-list">
        {teams.map(team => (
          <TeamRow key={team.id} team={team} editTeam={() => setEditingTeam(team)} detailTeam={() => setTeamDetail(team)} />
        ))}
      </ul>
    }
    {
      editingTeam &&
      <EditTeam key={editingTeam.id} team={editingTeam} handleUpdateTeam={handleUpdateTeam} onDone={() => setEditingTeam(null)} />
    }
    {
      teamDetail &&
      !editingTeam &&
      <TeamDetail key={teamDetail.id} team={teamDetail} editTeam={() => setEditingTeam(teamDetail)} />
    }
    </>
  );
}

function TeamRow({team, detailTeam, editTeam}) {
  return (
    <li className="team-row">
      <h3 onClick={() => detailTeam(team)}>{team.name}</h3>
      <button onClick={() => editTeam(team)}>{getLabel("edit") || "Edit"}</button>
    </li>
  );
}

function TeamDetail({team, editTeam}) {
  return (
    <div className="team-detail">
      <h2>{team.name}</h2>
      <p>{getLabel("players") || "Players"}: {team.players.map(p => p.tshirt).join(', ')}</p>
      <button onClick={editTeam}>{getLabel("edit") || "Edit"}</button>
    </div>
  );
}

function EditTeam({team, handleUpdateTeam, onDone}) {
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
      <button onClick={handleSave}>{getLabel("save") || "Save"}</button>
    </div>
  );
}
