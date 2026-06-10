import { getLabel } from "../../Utils/Labels";
import { getDefaultTeam } from "../../Utils/defaults";
import { useState } from "react";

export function AdminTeamsView({teams, setNewTeams}) {
  const handleAddTeam = () => {
    setNewTeams([...teams, getDefaultTeam(getLabel("new_team") || "New Team")]);
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
          <TeamRow team={team} editTeam={() => setEditingTeam(team)} detailTeam={() => setTeamDetail(team)} />
        ))}
      </ul>
    }
    {
      editingTeam &&
      <EditTeam key={editingTeam.id} team={editingTeam} handleUpdateTeam={handleUpdateTeam} />
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

function EditTeam({team, handleUpdateTeam}) {
  const [newName, setNewName] = useState(team.name);
  const [newPlayers, setNewPlayers] = useState(team.players);
  const handleSave = () => {
    if (newName.trim() === "") {
      alert(getLabel("name_cannot_be_empty"));
      return;
    }
    const players = newPlayers.split(',').map(p => p.trim()).filter(p => p !== "");
    handleUpdateTeam({...team, name: newName, players: players});
  };

  return (
    <div className="edit-team">
      <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} autoFocus />
      <input type="text" value={newPlayers} onChange={(e) => setNewPlayers(e.target.value)} />
      <button onClick={handleSave}>{getLabel("save") || "Save"}</button>
    </div>
  );
}