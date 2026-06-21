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

      <NumberInputRow
        label={getLabel("max_substitutions") || "Max Substitutions per Set"}
        min={0}
        max={15}
        value={newSettings.setSubstitutions}
        onChange={(value) => {
          setNewSettings({...newSettings, setSubstitutions: value});
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
      <ConditionalInput condition={deuce.allowed}>
        <div className="deuce-item">
          <label>{getLabel("deuce_point_difference") || "Deuce Point Difference:"}</label>
          <input type="number" min={1} value={deuce.howMany || undefined} placeholder={getLabel("set_deuce_point_difference") || "Set deuce point difference"} onChange={(e) => {
            const howMany = e.target.value ? parseInt(e.target.value, 10) : undefined;
            setDeuce({...deuce, howMany});
          }} />
        </div>
      </ConditionalInput>
    </div>
  );
}


function ConditionalInput({condition, children}) {
  if (!condition) {
    return null;
  }
  return children;
}