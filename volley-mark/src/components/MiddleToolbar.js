import { getLabel } from "../Utils/Labels";
import { fullscreenSVG } from "../icons/fullscreen";
import { restartSVG } from "../icons/restart";
import { crossedArrowsSVG } from "../icons/crossedArrows";
import { settingsSVG } from "../icons/settings";

export function MiddleToolbar({callAction}) {
  const handleAction = (type, value) => {
    callAction(type, value);
  }
  const toolBarItems = [
    // Add toolbar items here
    <FullScreenBtn key="fullscreen" />,
    <ChangeSideBtn key="changeSides" handleAction={handleAction} />,
    <RestartGameBtn key="restartGame" handleAction={handleAction} />,
    <MatchSettingsBtn key="matchSettings" handleAction={handleAction}/>
  ];
  return (
    <ul className="middle-toolbar-list">
      {toolBarItems.map((item, index) => (
        <li key={index} className="toolbar-item">
          {item}
        </li>
      ))}
    </ul>
  );
};

function FullScreenBtn() {
  const toggleFullScreen = () => {
    const docElement = document.documentElement;
    // Check if the document is already in fullscreen mode
    if (document.fullscreenElement || 
        document.mozFullScreenElement || 
        document.webkitFullscreenElement || 
        document.msFullscreenElement) {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
      }
      return;
    } else {
      // Enter fullscreen
      if (docElement.requestFullscreen) {
        docElement.requestFullscreen();
      } else if (docElement.mozRequestFullScreen) { // Firefox
        docElement.mozRequestFullScreen();
      } else if (docElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
        docElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      } else if (docElement.msRequestFullscreen) { // IE/Edge
        docElement.msRequestFullscreen();
      }
    }
  };

  return (
    <button className="fullscreen-btn" onClick={toggleFullScreen}>
      {fullscreenSVG()}
    </button>
  );
}

function ChangeSideBtn({handleAction}) {
  const handleChangeSides = () => {
    // Logic to change sides
    handleAction("CHANGE_SIDES", null);
  };
  return (
    <button className="change-side-btn" onClick={handleChangeSides}>
      {crossedArrowsSVG()}
    </button>
  );
}

function RestartGameBtn({handleAction}) {
  const handleRestart = () => {
    // Logic to restart the game
    const restart = window.confirm(getLabel("sure_restart"));
    if(!restart) {
      return;
    }

    const preserveInfo = window.confirm(getLabel("restart_and_preserve_info"));
    handleAction("RESTART_GAME", preserveInfo);
  };

  return (
    <button className="restart-game-btn" onClick={handleRestart}>
      {restartSVG()}
    </button>
  );
}

function MatchSettingsBtn({handleAction}) {
  const handleOpenSettings = () => {
    handleAction("OPEN_MATCH_SETTINGS", null);
  };

  return (
    <button className="match-settings-btn" onClick={handleOpenSettings}>
      {settingsSVG()}
    </button>
  );
}