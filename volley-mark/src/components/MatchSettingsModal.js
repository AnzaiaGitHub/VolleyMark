import { getLabel } from "../Utils/Labels";
import { useState, useEffect } from "react";
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

export function MatchSettingsModal({settings, callAction}) {
  const [newSettings, setNewSettings] = useState(settings);

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

  return (
    <div className="match-settings-modal">
      <button className="close-button" onClick={() => handleClose()}> X </button>

      <h2>{getLabel("match_settings") || "Match Settings"}</h2>

      <div className="settings-form-container">
        <NumberInput
          label={getLabel("max_sets") || "Max Sets"}
          min={1}
          max={10}
          value={newSettings.maxSets}
          onChange={(value) => {
            setNewSettings({...newSettings, maxSets: value});
          }}
        />

        <NumberInput
          label={getLabel("max_set_points") || "Max Set Points"}
          min={1}
          max={25}
          value={newSettings.maxSetPoints}
          onChange={(value) => {
            setNewSettings({...newSettings, maxSetPoints: value});
          }}
        />

        <NumberInput
          label={getLabel("max_timeouts") || "Max Timeouts"}
          min={0}
          max={5}
          value={newSettings.maxTimeOuts}
          onChange={(value) => {
            setNewSettings({...newSettings, maxTimeOuts: value});
          }}
        />

        <DeuceSettings settings={newSettings} setNewSettings={setNewSettings} />
      </div>

      <div className="modal-actions">
        <button onClick={() => handleSave(newSettings)}>{getLabel("save") || "Save"}</button>
        <button className="secondary" onClick={() => handleReset()}>{getLabel("reset") || "Reset"}</button>
      </div>
    </div>
  );
}

function NumberInput({label, value, min, max, onChange}) {
  return (
    <div className="number-input">
      <label>{label}</label>
      <input type="number" min={min} max={max} value={value} onChange={(e) => {
        onChange(parseInt(e.target.value, 10));
      }} />
    </div>
  );
}

function DeuceSettings({settings, setNewSettings}) {
  const [deuce, setDeuce] = useState(settings.deuce);

  useEffect(() => {
    setNewSettings({
      ...settings,
      deuce: deuce
    });
  }, [deuce]);

  return (
    <div className="deuce-settings">
      <div className="deuce-item">
        <label>{getLabel("allow_deuce") || "Allow Deuce?"}</label>
        <input type="checkbox" checked={deuce.allowed} onChange={(e) => {
          setDeuce({...deuce, allowed: e.target.checked});
        }} />
      </div>
      {deuce.allowed && (
        <div className="deuce-item">
          <label>{getLabel("how_many_deuces") || "How many deuces:"}</label>
          <input type="number" min={1} value={deuce.howMany || undefined} placeholder={getLabel("deuce_leave_empty_for_unlimited") || "Empty for Unlimited deuces"} onChange={(e) => {
            const howMany = e.target.value ? parseInt(e.target.value, 10) : undefined;
            setDeuce({...deuce, howMany: howMany});
          }} />
        </div>
      ) && false /** quitar false cuando se implemente la cantidad de deuces limitados */}
    </div>
  );
}