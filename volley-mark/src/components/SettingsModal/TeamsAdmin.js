export function TeamsAdmin({ teams, callAction }) {
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamPlayers, setNewTeamPlayers] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerId, setNewPlayerId] = useState("");
  const [editingPlayer, setEditingPlayer] = useState(false);
  const [editingTeam, setEditingTeam] = useState(false);
  
  const handleAddTeam = () => {
    if (newTeamName.trim() === "") {
      alert(getLabel("name_cannot_be_empty"));
      return;
    }
    const players = newTeamPlayers.split(',').map(p => p.trim()).filter(p => p !== "");
    callAction("ADD_TEAM", { name: newTeamName, players });
    setNewTeamName("");
    setNewTeamPlayers("");
  };

  const handleDeleteTeam = (teamId) => {
    if (window.confirm(getLabel("confirm_delete_team"))) {
      callAction("DELETE_TEAM", teamId);
    }
  };

  const handleEditTeam = (teamId) => {
    setSelectedTeam(teamId);
    setEditingTeam(true);
  };

  const handleSaveTeam = () => {
    if (newTeamName.trim() === "") {
      alert(getLabel("name_cannot_be_empty"));
      return;
    }
    const players = newTeamPlayers.split(',').map(p => p.trim()).filter(p => p !== "");
    callAction("UPDATE_TEAM", { id: selectedTeam, name: newTeamName, players });
    setSelectedTeam(null);
    setEditingTeam(false);
    setNewTeamName("");
    setNewTeamPlayers("");
  };

  const handleEditPlayer = (teamId, playerId) => {
    setSelectedTeam(teamId);
    setSelectedPlayer(playerId);
    setEditingPlayer(true);
  };

  const handleSavePlayer = () => {
    if (newPlayerName.trim() === "") {
      alert(getLabel("name_cannot_be_empty"));
      return;
    }
    callAction("UPDATE_PLAYER_IN_TEAM", { teamId: selectedTeam, playerId: selectedPlayer, updates: { name: newPlayerName } });
    setSelectedTeam(null);
    setSelectedPlayer(null);
    setEditingPlayer(false);
    setNewPlayerName("");
  };
  const handleDeletePlayer = (teamId, playerId) => {
    if (window.confirm(getLabel("confirm_delete_player"))) {
      callAction("REMOVE_PLAYER_FROM_TEAM", { teamId, playerId });
    }
  };

  return (
    <div className="teams-admin">
      <h2>{getLabel("teams_management") || "Teams Management"}</h2>
      <div className="add-team-form">
        <input type="text" placeholder={getLabel("team_name") || "Team Name"} value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} />
        <input type="text" placeholder={getLabel("players_comma_separated") || "Players (comma separated)"} value={newTeamPlayers} onChange={(e) => setNewTeamPlayers(e.target.value)} />
        <button onClick={handleAddTeam}>{getLabel("add_team") || "Add Team"}</button>
      </div>
      <div className="teams-list">
        {teams.map(team => (
          <div key={team.id} className="team-item">
            <h3>{team.name}</h3>
            <button onClick={() => handleEditTeam(team.id)}>{getLabel("edit") || "Edit"}</button>
            <button onClick={() => handleDeleteTeam(team.id)}>{getLabel("delete") || "Delete"}</button>
            <ul>
              {team.players.map(player => (
                <li key={player.id}>
                  {player.name} ({player.tshirt})
                  <button onClick={() => handleEditPlayer(team.id, player.id)}>{getLabel("edit") || "Edit"}</button>
                  <button onClick={() => handleDeletePlayer(team.id, player.id)}>{getLabel("delete") || "Delete"}</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {(editingTeam || editingPlayer) && (
        <div className="edit-modal">
          <div className="edit-content">
            <h3>{editingTeam ? getLabel("edit_team") || "Edit Team" : getLabel("edit_player") || "Edit Player"}</h3>
            <input type="text" placeholder={editingTeam ? (getLabel("team_name") || "Team Name") : (getLabel("player_name") || "Player Name")} value={editingTeam ? newTeamName : newPlayerName} onChange={(e) => editingTeam ? setNewTeamName(e.target.value) : setNewPlayerName(e.target.value)} />
            <button onClick={editingTeam ? handleSaveTeam : handleSavePlayer}>{getLabel("save") || "Save"}</button>
          </div>
        </div>
      )}
    </div>
  );
};