import { getLabel } from "../../Utils/Labels";
import { useEffect, useState } from "react";
import { useInputSheet } from "../Common/InputSheetProvider";

export function MatchSettingsView({newSettings, setNewSettings}) {
  return(
    <div className="settings-form-container inner-view">
      <NumberInputRow
        label={getLabel("max_sets") || "Max Sets"}
        min={1}
        max={10}
        value={newSettings.maxSets}
        onChange={(value) => {
          setNewSettings({...newSettings, maxSets: value});
        }}
      />

      <NumberInputRow
        label={getLabel("max_set_points") || "Max Set Points"}
        min={1}
        max={99}
        value={newSettings.maxSetPoints}
        onChange={(value) => {
          setNewSettings({...newSettings, maxSetPoints: value});
        }}
      />

      <NumberInputRow
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
  );
};

function NumberInputRow({label, value, min, max, onChange}) {
  const { openNumberSheet } = useInputSheet();

  const handleOpen = (event) => {
    openNumberSheet({
      title: label,
      value,
      min,
      max,
      triggerElement: event.currentTarget,
      onSave: onChange,
    });
  };

  return (
    <div className="number-input">
      <span>{label}</span>
      <button type="button" className="editable-value-row" onClick={handleOpen}>
        <span className="value-label">{label}</span>
        <span className="value-display">{value}</span>
      </button>
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
  }, [deuce, setNewSettings]);

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
