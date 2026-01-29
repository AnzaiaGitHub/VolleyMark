const labels = {
  EN: {
    match_settings: "Match Settings",
    max_sets: "Max Sets",
    max_timeouts: "Max Timeouts",
    manage_team: "Manage Team",
    used_time_outs: "Used Time Outs",
    save: "Save",
    close: "Close",
    sure_restart: "Are you sure you want to restart the match?",
    restart_and_preserve_info: "Do you want to preserve team information like (name, sets and positions)?",
    name_cannot_be_empty: "Team name cannot be empty",
    type_six_positions: "Please enter exactly 6 positions, separated by commas.",
    sets:"Sets",
    score:"Score",
    date:"Date",
    there_is_saved_game: "There is a saved game with this information",
    want_to_restore_it: "Do you want to restore it?",
    game_not_restored:"The game was not restored. it will be deleted for ever.",
    team_reached_max_timeouts: "This team has reached the max of timeOuts allowed",
    allow_deuce: "Allow Deuce?",
    how_many_deuces: "How many deuces:",
    deuce_leave_empty_for_unlimited: "Leave empty for unlimited deuces",
    max_set_points: "Max Set Points",
    reset: "Reset",
    won_set: "won the set",
    want_restart_and_change_sides: "Do you want to restart and change sides?"
  },
  SPN: {
    match_settings: "Configuracion del Partido",
    max_sets: "Sets Maximos",
    max_timeouts: "Tiempos Maximos",
    manage_team: "Administrar Equipo",
    used_time_outs: "Tiempos Usados",
    close: "Cerrar",
    save: "Guardar",
    sure_restart: "Seguro quieres reiniciar el Juego?",
    restart_and_preserve_info: "Quieres conservar informacion de los equipos como (nombre, posiciones y sets ganados)?",
    name_cannot_be_empty: "El nombre no puede quedar vacio.",
    type_six_positions: "Ingrese 6 posiciones separadas por 1 coma",
    sets:"Sets",
    score:"Marcador",
    date:"Fecha",
    there_is_saved_game: "Hay un juego guardado con esta informacion",
    want_to_restore_it: "Deseas restaurarlo?",
    game_not_restored:"El juego se ha descartado y sera borrado para siempre.",
    team_reached_max_timeouts: "El equipo ha alcanzado la cantidad maxima de tiempos fuera",
    allow_deuce: "Permitir Deuce?",
    how_many_deuces: "Cuantos deuces:",
    deuce_leave_empty_for_unlimited: "Dejar vacio para deuces ilimitados",
    max_set_points: "Puntos Maximos por Set",
    reset: "Reiniciar",
    won_set: "ha ganado el set",
    want_restart_and_change_sides: "Quieres reiniciar y cambiar de lado?"
  }
};

const getBrowserLang = () => {
  const lang = document.documentElement.lang;
  if(lang && lang === 'en') {
    return "EN";
  }

  //return spanish by default
  return "SPN";
};

export const getLabel = (labelKey) => {
  const browserLanguage = getBrowserLang();
  return labels[browserLanguage][labelKey];
};