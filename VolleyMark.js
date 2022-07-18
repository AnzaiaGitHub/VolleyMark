//Variables
var Game = null;
var TeamA,TeamB;
var RenderTeamA = {
    Name: document.querySelector("#teamNameA"),
    SetsWon: document.querySelector("#setScoreA"),
    Score: document.querySelector("#scoreMarkA"),
    TeamPosition: [document.querySelector("#A1"),
    document.querySelector("#A2"),
    document.querySelector("#A3"),
    document.querySelector("#A4"),
    document.querySelector("#A5"),
    document.querySelector("#A6")],
    TimeOuts: [document.querySelector("#timeOutA1"),
    document.querySelector("#timeOutA2")],
    Service: document.querySelector("#serviceA")
};
var RenderTeamB = {
    Name: document.querySelector("#teamNameB"),
    SetsWon: document.querySelector("#setScoreB"),
    Score: document.querySelector("#scoreMarkB"),
    TeamPosition: [document.querySelector("#B1"),
    document.querySelector("#B2"),
    document.querySelector("#B3"),
    document.querySelector("#B4"),
    document.querySelector("#B5"),
    document.querySelector("#B6")],
    TimeOuts: [document.querySelector("#timeOutB1"),
    document.querySelector("#timeOutB2")],
    Service: document.querySelector("#serviceB")
};

//Listeners
window.addEventListener('load', ()=>{
    let gm = localStorage.getItem("Game");
    if(gm!=null){
        loadGame(gm);
    }else{
        resetGame();
    }
});
document.querySelectorAll(".position").forEach(element => {
    element.addEventListener('click',()=>{
        let newPlayer = prompt(`Escriba el numero del jugador en posicion ${parseInt(element.id[1])}`, 22);
        if(newPlayer==null)
            return;
        // if(Number(newPlayer)){
            if(element.id.includes("A")){
                TeamA.TeamPosition[parseInt(element.id[1])-1] = newPlayer;
            }else{
                TeamB.TeamPosition[parseInt(element.id[1])-1] = newPlayer;
            }
            renderGame();
        // }else{
            // alert("Debe escribir el numero del jugador");
        // }
    });
});
document.querySelectorAll(".check").forEach(element=>{
    element.addEventListener('click',()=>{
        if(element.checked){
            element.checked = true;
            if(element.id.includes("A")){
                TeamA.TimeOuts++;
            }else{
                TeamB.TimeOuts++;
            }
        }else{
            element.checked = false;
            if(element.id.includes("A")){
                TeamA.TimeOuts--;
            }else{
                TeamB.TimeOuts--;
            }
        }
        renderGame();
    });
});
document.querySelectorAll(".teamName").forEach(element=>{
    element.addEventListener('click', ()=>{
        let newName = prompt("Escriba el nombre del equipo");
        if(element.id.includes("A")){
            TeamA.Name = newName!=""?newName:TeamA.Name;
        }else{
            TeamB.Name = newName!=""?newName:TeamB.Name;
        }
        renderGame();
    });
});

//Functions
function setGame(){
    Game = [TeamA,TeamB];
    localStorage.setItem("Game", JSON.stringify(Game));
};

function resetGame(){
    localStorage.removeItem("Game");
    TeamA = {
        Name: "Team A",
        SetsWon: 0,
        Score: 0,
        TeamPosition:["A1","A2","A3","A4","A5","A6"],
        TimeOuts: 0,
        Service: true
    };
    TeamB = {
        Name: "Team B",
        SetsWon: 0,
        Score: 0,
        TeamPosition:["B1","B2","B3","B4","B5","B6"],
        TimeOuts: 0,
        Service: false
    };
    renderGame();
}

function loadGame(gm){
    Game = JSON.parse(gm);
    TeamA = Game[0];
    TeamB = Game[1];
    renderGame();
}

function addPointTeam(Team){
    if(Team=="A"){
        TeamA.Score++;
        if(!TeamA.Service){
            rotate('A');
            setServiceTeam('A');
        }
    }else{
        TeamB.Score++;
        if(!TeamB.Service){
            rotate('B');
            setServiceTeam('B');
        }
    }
    renderGame();
}

function subtractPointTeam(Team){
    if(Team=="A"){
        TeamA.Score = TeamA.Score>0?TeamA.Score-1:0;
    }else{
        TeamB.Score = TeamB.Score>0?TeamB.Score-1:0;
    }
    renderGame();
}

function renderGame(){
    RenderTeamA.Name.innerHTML = TeamA.Name;
    RenderTeamB.Name.innerHTML = TeamB.Name;

    RenderTeamA.SetsWon.innerHTML = TeamA.SetsWon;
    RenderTeamB.SetsWon.innerHTML = TeamB.SetsWon;

    RenderTeamA.Score.innerHTML = TeamA.Score;
    RenderTeamB.Score.innerHTML = TeamB.Score;

    for(let i=0; i<6; i++){
        RenderTeamA.TeamPosition[i].innerHTML = TeamA.TeamPosition[i];
        RenderTeamB.TeamPosition[i].innerHTML = TeamB.TeamPosition[i];
    };
    let count=0;
    document.querySelectorAll(".check").forEach(element=>{
        if(element.id.includes("A")){
            if(count<TeamA.TimeOuts){
                element.checked = true;
                count++;
            }else{
                element.checked = false;
            }
        }
    });
    count=0;
    document.querySelectorAll(".check").forEach(element=>{
        if(element.id.includes("B")){
            if(count<TeamB.TimeOuts){
                element.checked = true;
                count++;
            }else{
                element.checked = false;
            }
        }
    });
    count=0;
    
    if(TeamA.Service){
        if(!RenderTeamA.Service.classList.contains("service")){
            RenderTeamA.Service.classList.add("service");
        }
        if(RenderTeamB.Service.classList.contains("service")){
            RenderTeamB.Service.classList.remove("service");
        }
    }else{
        if(!RenderTeamB.Service.classList.contains("service")){
            RenderTeamB.Service.classList.add("service");
        }
        if(RenderTeamA.Service.classList.contains("service")){
            RenderTeamA.Service.classList.remove("service");
        }
    }

    Game = [TeamA,TeamB];
    localStorage.setItem("Game", JSON.stringify(Game));
}

function resetScore(){
    TeamA.Score=0;
    TeamB.Score=0;
    renderGame();
}

function reset(){
    let opt = prompt("1.Reiniciar set, 2.Reiniciar todo el partido");
    switch(opt){
        case '1':
            resetScore();
        break;
        case '2':
            resetGame();
        break;
        default:
            alert("Opcion invalida");
        break;
    }
}

function changeSide(){
    let TeamAux = TeamA;
    TeamA = TeamB;
    TeamB = TeamAux;
    renderGame();
}

function setServiceTeam(team){
    if(team == "A"){
        TeamB.Service=false;
        TeamA.Service=true;
    }else{
        TeamA.Service=false;
        TeamB.Service=true;
    }
    renderGame();
}

function rotate(team){
    let newTeamRotation=[];
    if(team == "A"){
        let lastTeamRotation = TeamA.TeamPosition;
        for(let i=0; i<6;i++){
            if(i<5)
                newTeamRotation[i] = lastTeamRotation[i+1];
            else
                newTeamRotation[i] = lastTeamRotation[0];
        }
        TeamA.TeamPosition = newTeamRotation;
    }else{
        let lastTeamRotation = TeamB.TeamPosition;
        for(let i=0; i<6;i++){
            if(i<5)
                newTeamRotation[i] = lastTeamRotation[i+1];
            else
                newTeamRotation[i] = lastTeamRotation[0];
        }
        TeamB.TeamPosition = newTeamRotation;
    }
    renderGame();
}

function editScore(){
    let newScore = prompt("Escriba el puntaje de ambos equipos separados por -", "0-0");
    if(newScore==null)
        return;
    if(isNaN(parseInt(newScore.split("-")[0]))){
        TeamA.Score=TeamA.Score;
    }else{
        TeamA.Score=Math.abs(parseInt(newScore.split("-")[0]));
    }
    if(isNaN(parseInt(newScore.split("-")[1]))){
        TeamB.Score=TeamB.Score;
    }else{
        TeamB.Score=Math.abs(parseInt(newScore.split("-")[1]));
    }
    renderGame();
}

function editPosition(team){
    let newPositionStr = prompt("Escriba la formación de 1 a 6 separado por comas", "1,2,3,4,5,6");
    if(newPositionStr == null)
        return;
    if(newPositionStr.split(",").length!=6)
        alert("No ingresaste todas las posiciones");
    let newPosition = newPositionStr.split(",");
    if(team == "A")
        TeamA.TeamPosition = newPosition;
    else
        TeamB.TeamPosition = newPosition;
    renderGame();
}

function addSetWonTeam(team){
    if(team=="A"){
        TeamA.SetsWon++;
    }else{
        TeamB.SetsWon++;
    }
    renderGame();
}

function subtractSetWonTeam(team){
    if(team=="A"){
        if(TeamA.SetsWon>0)
            TeamA.SetsWon--;
    }else{
        if(TeamB.SetsWon>0)
            TeamB.SetsWon--;
    }
    renderGame();
}