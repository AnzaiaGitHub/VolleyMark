import { useState } from 'react';
import { Team } from './components/Team';
import './App.css';

function App() {
  const [teamA, setTeamA] = useState(
    {
      side:'LEFT',
      name: "Team A",
      setsWon: 0,
      score: 0,
      positions:["A1","A2","A3","A4","A5","A6"],
      usedTimeOuts: 0,
      hasService: true
    }
  );
  const [teamB, setTeamB] = useState(
    {
      side:'RIGHT',
      name: "Team B",
      setsWon: 0,
      score: 0,
      positions:["B1","B2","B3","B4","B5","B6"],
      usedTimeOuts: 0,
      hasService: false
    }
  );

  // const [gameInfo,setGameInfo] = useState(
  // {
  //   setPoints: 25,
  //   diffPoints:true,
  //   firstReachSetPoints:false,
  //   numberOfSets:5
  // });

  return (
    <div className="volley-mark">
      <Team team={teamA} side={'LEFT'} updateInfo={(newInfo)=>setTeamA(newInfo)}/>
      <Team team={teamB} side={'RIGHT'} updateInfo={(newInfo)=>setTeamB(newInfo)}/>
    </div>
  );
}

export default App;
