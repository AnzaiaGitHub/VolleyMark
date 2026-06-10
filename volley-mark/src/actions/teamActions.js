import { getLabel } from "../Utils/Labels";

/**
 * Generate a unique ID for a team
 */
const generateTeamId = () => {
  return `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Create a new team object
 * @param {string} name - Team name
 * @param {Array} players - Array of player objects
 * @returns {Object} New team object
 */
export const createTeam = (name, players = []) => {
  return {
    id: generateTeamId(),
    name,
    players,
    createdAt: Date.now(),
  };
};

/**
 * Create a new player object
 * @param {string} tshirt - Player jersey number/identifier
 * @param {number} id - Player ID
 * @returns {Object} New player object
 */
export const createPlayer = (tshirt, id) => {
  return {
    tshirt,
    id,
  };
};

export const teamActions = {
  /**
   * Add a new team
   * @param {Array} teams - Current teams array
   * @param {Object} teamData - { name, players }
   * @returns {Array} Updated teams array
   */
  addTeam: (teams, teamData) => {
    const { name, players } = teamData;

    if (!name || name.trim() === "") {
      throw new Error(getLabel("name_cannot_be_empty") || "Team name cannot be empty");
    }

    const newTeam = createTeam(name, players || []);
    return [...teams, newTeam];
  },

  /**
   * Update an existing team
   * @param {Array} teams - Current teams array
   * @param {string} teamId - Team ID to update
   * @param {Object} updates - Object with properties to update
   * @returns {Array} Updated teams array
   */
  updateTeam: (teams, teamId, updates) => {
    return teams.map(team => 
      team.id === teamId 
        ? { ...team, ...updates, id: team.id, createdAt: team.createdAt } 
        : team
    );
  },

  /**
   * Delete a team
   * @param {Array} teams - Current teams array
   * @param {string} teamId - Team ID to delete
   * @returns {Array} Updated teams array
   */
  deleteTeam: (teams, teamId) => {
    return teams.filter(team => team.id !== teamId);
  },

  /**
   * Get a team by ID
   * @param {Array} teams - Current teams array
   * @param {string} teamId - Team ID to find
   * @returns {Object|null} Team object or null
   */
  getTeamById: (teams, teamId) => {
    return teams.find(team => team.id === teamId) || null;
  },

  /**
   * Add a player to a team
   * @param {Array} teams - Current teams array
   * @param {string} teamId - Team ID
   * @param {Object} player - Player object { tshirt, id }
   * @returns {Array} Updated teams array
   */
  addPlayerToTeam: (teams, teamId, player) => {
    return teams.map(team => 
      team.id === teamId
        ? { 
            ...team, 
            players: [...team.players, player] 
          }
        : team
    );
  },

  /**
   * Remove a player from a team
   * @param {Array} teams - Current teams array
   * @param {string} teamId - Team ID
   * @param {number} playerId - Player ID to remove
   * @returns {Array} Updated teams array
   */
  removePlayerFromTeam: (teams, teamId, playerId) => {
    return teams.map(team => 
      team.id === teamId
        ? { 
            ...team, 
            players: team.players.filter(p => p.id !== playerId) 
          }
        : team
    );
  },

  /**
   * Update a player in a team
   * @param {Array} teams - Current teams array
   * @param {string} teamId - Team ID
   * @param {number} playerId - Player ID to update
   * @param {Object} updates - Player properties to update
   * @returns {Array} Updated teams array
   */
  updatePlayerInTeam: (teams, teamId, playerId, updates) => {
    return teams.map(team => 
      team.id === teamId
        ? { 
            ...team, 
            players: team.players.map(p => 
              p.id === playerId ? { ...p, ...updates } : p
            ) 
          }
        : team
    );
  },

  /**
   * Duplicate a team (useful for creating a copy with same players)
   * @param {Array} teams - Current teams array
   * @param {string} teamId - Team ID to duplicate
   * @returns {Array} Updated teams array with duplicated team
   */
  duplicateTeam: (teams, teamId) => {
    const teamToDuplicate = teams.find(team => team.id === teamId);
    if (!teamToDuplicate) {
      throw new Error("Team not found");
    }

    const duplicatedTeam = createTeam(
      teamToDuplicate.name + " (Copy)",
      [...teamToDuplicate.players]
    );

    return [...teams, duplicatedTeam];
  },
};
