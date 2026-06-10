# Teams Management System

## Architecture Overview

The teams management system is now completely **separated from GameState** using a dedicated `teamActions` handler. This allows you to:

- ✅ Create and manage team templates independently
- ✅ Reuse teams across multiple matches
- ✅ Persist team rosters without match data
- ✅ Manage team players (add, remove, update)

## Structure

### 1. **App.js** - Dual State Management
```javascript
const [state, dispatch] = useReducer(gameReducer, initialGame);      // Match state
const [teams, dispatchTeams] = useReducer(teamsReducer, ...);       // Team library
```

Both states persist independently to localStorage:
- **Game State**: `volley-mark-game-state` (current match)
- **Teams**: `volley-mark-saved-teams` (team library)

### 2. **teamActions.js** - Team Operations
Provides functional methods for all team operations:
- `addTeam(teams, teamData)` - Create new team
- `updateTeam(teams, teamId, updates)` - Modify team
- `deleteTeam(teams, teamId)` - Remove team
- `addPlayerToTeam()` - Add player to roster
- `removePlayerFromTeam()` - Remove player from roster
- `duplicateTeam()` - Copy team with same players

### 3. **storageManager.js** - Persistence
Existing methods handle team storage:
- `saveTeams(teams)` - Persist teams to localStorage
- `loadTeams()` - Load teams from localStorage
- `clearTeams()` - Remove all saved teams

## Usage Examples

### Adding a Team
```javascript
dispatchTeams({
  type: "ADD_TEAM",
  payload: {
    name: "Volleyball Pro",
    players: [
      { tshirt: "1", id: 1 },
      { tshirt: "2", id: 2 },
      // ... up to 12-14 players
    ]
  }
});
```

### Updating Team Name
```javascript
dispatchTeams({
  type: "UPDATE_TEAM",
  payload: {
    teamId: "team_1708000000000_abc123def",
    updates: { name: "New Team Name" }
  }
});
```

### Adding Player to Team
```javascript
dispatchTeams({
  type: "ADD_PLAYER_TO_TEAM",
  payload: {
    teamId: "team_1708000000000_abc123def",
    player: { tshirt: "7", id: 7 }
  }
});
```

### Removing Player
```javascript
dispatchTeams({
  type: "REMOVE_PLAYER_FROM_TEAM",
  payload: {
    teamId: "team_1708000000000_abc123def",
    playerId: 7
  }
});
```

### Duplicating a Team
```javascript
dispatchTeams({
  type: "DUPLICATE_TEAM",
  payload: "team_1708000000000_abc123def"
});
```

### Starting Match with Saved Teams
```javascript
// Get team from library
const leftTeam = teams.find(t => t.id === selectedTeamId);
const rightTeam = teams.find(t => t.id === selectedTeam2Id);

// Initialize game with those teams (in defaults.js)
const gameState = getGameFromTeams(leftTeam, rightTeam);
dispatch({ type: "SET_GAME", payload: gameState });
```

## Team Object Structure

```javascript
{
  id: "team_1708000000000_abc123def",      // Unique identifier
  name: "Team Name",                        // Team name
  players: [
    { tshirt: "1", id: 1 },
    { tshirt: "2", id: 2 },
    // ... more players
  ],
  createdAt: 1708000000000                 // Timestamp
}
```

## Benefits Over Embedding Teams in GameState

| Aspect | Before | Now |
|--------|--------|-----|
| Team Reusability | ❌ Tied to one match | ✅ Reuse across matches |
| Team Library | ❌ Not possible | ✅ Full team management |
| Player Roster | ❌ Only 6 starters | ✅ Up to 14+ players |
| Data Coupling | ❌ Teams + Match state | ✅ Separate concerns |
| Storage Size | ❌ Larger (redundant) | ✅ Optimized |

## Error Handling

All team actions include `try-catch` in the reducer with user-friendly alerts:

```javascript
dispatchTeams({
  type: "ADD_TEAM",
  payload: { name: "" }  // Invalid - will trigger alert
});
// Error: "Team name cannot be empty"
```

## Next Steps

To fully integrate teams, you'll want to create:

1. **TeamManager Component** - UI for CRUD operations on teams
2. **Team Selector Modal** - Pick teams before starting a match
3. **Player Editor** - Add/edit players in team roster

These components can dispatch actions using the `dispatchTeams` handler passed as props.
