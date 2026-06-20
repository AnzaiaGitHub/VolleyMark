import { TeamLibrary } from "../domain/TeamLibrary";

export function createTeamsReducer({ storageManager }) {
  return function teamsReducer(state, action) {
    const library = state instanceof TeamLibrary ? state : TeamLibrary.fromJSON(state);

    const saveTeams = (nextLibrary) => {
      storageManager.saveTeams(nextLibrary);
      return nextLibrary;
    };

    try {
      switch (action.type) {
        case "ADD_TEAM":
          return saveTeams(library.addTeam(action.payload));
        case "UPDATE_TEAM":
          return saveTeams(library.updateTeam(action.payload.teamId, action.payload.updates));
        case "DELETE_TEAM":
          return saveTeams(library.deleteTeam(action.payload));
        case "ADD_PLAYER_TO_TEAM":
          return saveTeams(library.addPlayerToTeam(action.payload.teamId, action.payload.player));
        case "REMOVE_PLAYER_FROM_TEAM":
          return saveTeams(library.removePlayerFromTeam(action.payload.teamId, action.payload.playerId));
        case "UPDATE_PLAYER_IN_TEAM":
          return saveTeams(
            library.updatePlayerInTeam(action.payload.teamId, action.payload.playerId, action.payload.updates)
          );
        case "DUPLICATE_TEAM":
          return saveTeams(library.duplicateTeam(action.payload));
        case "LOAD_TEAMS":
          return storageManager.loadTeams();
        case "SAVE_TEAMS":
          return saveTeams(TeamLibrary.fromJSON(action.payload));
        case "CLEAR_TEAMS":
          storageManager.clearTeams();
          return new TeamLibrary([]);
        default:
          return library;
      }
    } catch (error) {
      console.error("Team action error:", error);
      alert(error.message || "An error occurred with team management");
      return library;
    }
  };
}
