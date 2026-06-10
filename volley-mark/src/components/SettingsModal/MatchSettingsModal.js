import { getLabel } from "../../Utils/Labels";
import { useState } from "react";
import { AdminTeamsView } from "./AdminTeamsView";
import { MatchSettingsView } from "./MatchSettingsView";

/**
 * settings data
 * settings: {
 *   deuce: object {
 *    allowed: boolean, //default true
 *    howMany: undefined | number //default undefined (meaning no limit)
 *   }
 *   maxSetPoints: number, //default 25
 *   maxSets: number, //default 5
 *   maxTimeOuts: number  //default 2
 * }
 */

export function MatchSettingsModal({settings, teams, callAction}) {
  const [newSettings, setNewSettings] = useState(settings);
  const [newTeams, setNewTeams] = useState(teams || []);
  const [activeView, setActiveView] = useState({id: "matchSettings", label: getLabel("match_settings") || "Match Settings"});

  const handleSave = (newSettings) => {
    callAction("UPDATE_MATCH_SETTINGS", newSettings);
    handleClose();
  }

  const handleReset = () => {
    callAction("RESET_MATCH_SETTINGS", null);
    handleClose();
  }

  const handleClose = () => {
    callAction("CLOSE_MATCH_SETTINGS", null);
  }

  const views = [
    { id: "matchSettings", label: getLabel("match_settings") || "Match Settings" },
    { id: "adminTeams", label: getLabel("manage_teams") || "Manage Teams" },
  ];

  const getActiveView = (view) => {
    switch(view.id) {
      case "adminTeams":
        return <AdminTeamsView teams={newTeams} setNewTeams={setNewTeams} />;
      case "matchSettings":
        return <MatchSettingsView newSettings={newSettings} setNewSettings={setNewSettings} />;
      default:
        return <MatchSettingsView newSettings={newSettings} setNewSettings={setNewSettings} />;
    }
  };

  return (
    <div className="match-settings-modal">
      <div className="modal-settings-header">
        <ul className="settings-view-tabs">
          {views.map(view => (
            <button key={view.id} className={`view-btn ${activeView.id === view.id ? "active" : ""}`} onClick={() => setActiveView(view)}>
              {view.label}
            </button>
          ))}
        </ul>
        <button className="close-button" onClick={() => handleClose()}>{getLabel("close") || "Close"}</button>
      </div>
      {getActiveView(activeView)}
      <div className="modal-actions">
        <button onClick={() => handleSave(newSettings)}>{getLabel("save") || "Save"}</button>
        <button className="secondary" onClick={() => handleReset()}>{getLabel("reset") || "Reset"}</button>
      </div>
    </div>
  );
}