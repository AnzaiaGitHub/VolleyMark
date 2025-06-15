import { getLabel } from "../Utils/Labels";
export function MiddleToolbar({callAction}) {
  const handleAction = (type, value) => {
    callAction(type, value);
  }
  const toolBarItems = [
    // Add toolbar items here
    <FullScreenBtn key="fullscreen" />,
    <ChangeSideBtn key="changeSides" handleAction={handleAction} />,
    <RestartGameBtn key="restartGame" handleAction={handleAction} />
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
      <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier"></g><g id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"></path> </g></svg>
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
      <svg version="1.1" id="ios7_x5F_arrows_1_" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 128 128"><g id="_x33_4_1_"><path d="M33.8 53.3 30 49.5-.1 79.7 30 109.9l3.8-3.8L10 82.3h63.2v-5.2H10l23.8-23.8zm94.1-5.1L97.8 18.1 94 21.9l23.8 23.8h-63v5.2h63L94.1 74.8l3.8 3.8L128 48.5v-.3h-.1z" id="icon_8_" strokeWidth="4"/></g></svg>
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
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier"></g><g id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"><path d="M22.719 12A10.719 10.719 0 0 1 1.28 12h.838a9.916 9.916 0 1 0 1.373-5H8v1H2V2h1v4.2A10.71 10.71 0 0 1 22.719 12z"></path><path fill="none" d="M0 0h24v24H0z" strokeWidth="0"></path></g></svg>
    </button>
  );
}