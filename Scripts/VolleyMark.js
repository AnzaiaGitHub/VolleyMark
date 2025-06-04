//Variables
const Modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const gameLog_container = document.getElementById("gameLog");
let gameLog = [];
let Game = null;
let TeamA,TeamB, maxSetPoints;
let RenderTeamA = {
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
let RenderTeamB = {
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
    start();
});

function start() {
    let storedGame = getStoredGame();
    if(storedGame != null){
        loadGame(storedGame);
    }else{
        startNewGame();
    }
}
//write the player number on position n
document.querySelectorAll(".position").forEach(element => {
    element.addEventListener('click',()=>{
        let newPlayer = prompt(`Escriba el numero del jugador en posicion ${parseInt(element.id[1])}`);
        if(newPlayer==null)
            return;
        // if(Number(newPlayer)){
            if(element.id.includes("A")){
                TeamA.TeamPosition[parseInt(element.id[1])-1] = newPlayer;
            }else{
                TeamB.TeamPosition[parseInt(element.id[1])-1] = newPlayer;
            }
            renderGame();
            renderLog(Game);

        // }else{
            // alert("Debe escribir el numero del jugador");
        // }
    });
});
//timeOut checkbox listeners
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
        renderLog(Game);
    });
});
//team onClick change name
document.querySelectorAll(".teamName").forEach(element=>{
    element.addEventListener('click', ()=>{
        let newName = prompt("Escriba el nombre del equipo");
        if(newName!=null && newName!=""){
            if(element.id.includes("A")){
                TeamA.Name = newName;
            }else{
                TeamB.Name = newName;
            }
            renderGame();
            renderLog(Game);
        }
    });
});
//options modal display listener
document.getElementById("editOptions").addEventListener("click",()=>{
    Modal.style.display = "flex";
    editOptions();
});

//Functions
function startNewGame(){
    localStorage.removeItem("VolleyMarkGame");
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
    maxSetPoints = {
        Points: 25,
        diffPoints:true,
        firstReachMax:false,
        sets:5
    };
    renderGame();
    gameLog=[];
    renderLog(Game);
}

function loadGame(gm){
    Game = JSON.parse(gm);
    TeamA = Game[0];
    TeamB = Game[1];
    maxSetPoints = Game[2];
    renderGame();
    renderLog(Game);
}

function create(elementType) {
    return document.createElement(elementType);
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
    renderLog(Game);
    winCondition();
}

function subtractPointTeam(Team){
    if(Team=="A"){
        TeamA.Score = TeamA.Score>0?TeamA.Score-1:0;
    }else{
        TeamB.Score = TeamB.Score>0?TeamB.Score-1:0;
    }
    renderGame();
    renderLog(Game);
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

    Game = [TeamA,TeamB,maxSetPoints];
    localStorage.setItem("Game", JSON.stringify(Game));
}

function renderLog(game){
    gameLog.push(JSON.stringify(game));
    logClean();
    localStorage.setItem("gameLog",JSON.stringify(gameLog));
    let log_data = gameLog.map((curLog)=>{
        return JSON.parse(curLog);
    }).reverse();
    gameLog_container.innerHTML="";
    if(log_data.length){
        log_data.forEach((curLog)=>{
            let li = create("li");
            li.setAttribute("id",gameLog.indexOf(JSON.stringify(curLog)));
            li.classList.add("log");

            let teamA_container = create("div");
            teamA_container.classList.add("teamLog");
            let teamB_container = create("div");
            teamB_container.classList.add("teamLog");

            let timeOutsA = create("span");
            timeOutsA.innerHTML = `T${curLog[0].TimeOuts}`;
            let timeOutsB = create("span");
            timeOutsB.innerHTML = `T${curLog[1].TimeOuts}`;

            let rotationA = create("div");
            rotationA.innerHTML = curLog[0].TeamPosition;
            rotationA.classList.add("rotationLog");
            let rotationB = create("div");
            rotationB.innerHTML = curLog[1].TeamPosition;
            rotationB.classList.add("rotationLog");

            let nameA = create("span");
            nameA.innerHTML = curLog[0].Name;
            let nameB = create("span");
            nameB.innerHTML = curLog[1].Name;
            
            let setsA = create("div");
            setsA.innerHTML = "("+curLog[0].SetsWon+")";
            let setsB = create("div");
            setsB.innerHTML = "("+curLog[1].SetsWon+")";

            let scoreA = create("span");
            scoreA.innerHTML = curLog[0].Score;
            let scoreB = create("span");
            scoreB.innerHTML = curLog[1].Score;

            let divisor = create("span");
            divisor.classList.add("divisor");
            divisor.innerHTML = `${curLog[0].Service?"S":" "}-${curLog[1].Service?"S":" "}`;

            teamA_container = appendChilds(teamA_container, [
                timeOutsA,
                rotationA,
                nameA,
                setsA,
                scoreA
            ]);
            teamB_container = appendChilds(teamB_container, [
                scoreB,
                setsB,
                nameB,
                rotationB,
                timeOutsB
            ]);

            let rollBack = create("button");
            rollBack.innerHTML="Volver";
            rollBack.classList.add("btn","btn-standard");
            rollBack.setAttribute("onclick",`rollBack(${li.id})`);

            let deleteLog = create("button");
            deleteLog.innerHTML="Borrar";
            deleteLog.classList.add("btn","btn-standard", "btn-secondary");
            deleteLog.setAttribute("onclick",`deleteIndex_gameLog(${li.id})`);

            let logInfo = create("span");
            logInfo.classList.add("teamsLog");
            logInfo = appendChilds(logInfo,[
                teamA_container,
                divisor,
                teamB_container
            ]);
            li.appendChild(logInfo);

            let logController = create("span");

            if(li.id<log_data.length-1){
                logController = appendChilds(logController,[
                    rollBack,
                    deleteLog
                ]);
                li.appendChild(logController);
            }
            gameLog_container.appendChild(li);
        });
    }
}

function logClean(){
    gameLog = deleteRepeateds(gameLog);
}

function rollBack(index){
    let newLog = gameLog.slice(0,index+1);
    loadGame(newLog[newLog.length-1]);
    gameLog = newLog;
    renderLog(Game);
}

function deleteIndex_gameLog(index){
    gameLog = deleteIndex(index,gameLog);
    if(gameLog.length==1)
        gameLog=[];
    renderLog(Game);
}

function deleteIndex(I,Arr){ //returns the new array
    let new_Arr = Arr.map((e)=>{
        return e;
    });
    if(I==0){
        new_Arr.shift();
    }else{
        if(I==(Arr.length-1)){
            new_Arr.pop();
        }else{
            new_Arr = Arr.slice(0,I).concat(Arr.slice(I+1));
        }
    }
    return new_Arr;
}

function deleteRepeateds(Arr){
    Arr.forEach((value)=>{
        if(isRepeated(value,Arr)){
            Arr = deleteIndex(Arr.indexOf(value),Arr);
            Arr = deleteRepeateds(Arr);
        }
    });
    return Arr;
}

function isRepeated(value,Arr){
    return Arr.filter((val)=>{
        return val == value;
    }).length>1;
}

function resetScore(){
    TeamA.Score=0;
    TeamB.Score=0;
    TeamA.TimeOuts=0;
    TeamB.TimeOuts=0;
    renderGame();
}

function reset(){
    Modal.style.display = "flex";
    let re_Text = create("P");
    re_Text.innerHTML = "¿Qué deseas reiniciar?";
    re_Text.style.textAlign = "center";
    re_Text.style.width = "100%";
    let re_Set = create("button");
    re_Set.innerHTML = "Score";
    re_Set = setAttributes(re_Set,[
        ["class","btn btn-standard btn-padding"],
        ["onclick","resetScore()"]
    ]);

    let re_Game = create("button");
    re_Game.innerHTML = "Game";
    re_Game = setAttributes(re_Game,[
        ["class","btn btn-standard btn-padding"],
        ["onclick","startNewGame()"]
    ]);
    let formEnd = create("div");
    formEnd.classList.add("form-end");
    formEnd = appendChilds(formEnd, [
        re_Set,
        re_Game
    ]);

    let form = create("form");
    form = appendChilds(form,[
        re_Text,
        formEnd
    ]);
    setModalContent(form);
}

function changeSide(){
    let TeamAux = TeamA;
    TeamA = TeamB;
    TeamB = TeamAux;
    renderGame();
    renderLog(Game);
}

function setServiceTeam(team){
    TeamB.Service = (team == "B");
    TeamA.Service = (team == "A");
    renderGame();
}

function rotate(team, orientation=1){
    let newTeamRotation=[];
    let lastTeamRotation = team=="A"
        ? TeamA.TeamPosition
        : TeamB.TeamPosition;
    if(orientation==1){
        for(let i=0; i<6;i++){
            if(i<5)
                newTeamRotation[i] = lastTeamRotation[i+1];
            else
                newTeamRotation[i] = lastTeamRotation[0];
        }
    }else{
        for(let i=5; i>=0;i--){
            if(i>0)
                newTeamRotation[i] = lastTeamRotation[i-1];
            else
                newTeamRotation[i] = lastTeamRotation[5];
        }
    }
    if(team == "A"){
        TeamA.TeamPosition = newTeamRotation;
    }else{
        TeamB.TeamPosition = newTeamRotation;
    }
    renderGame();
}

function editScore(){
    let newScore = prompt("Escriba el puntaje de ambos equipos separados por -", `${TeamA.Score}-${TeamB.Score}`);
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
    renderLog(Game);
}

function editPosition(team){
    let P = team=="A"?TeamA.TeamPosition:TeamB.TeamPosition;
    let newPositionStr = prompt("Escriba la formación de 1 a 6 separado por comas", `${P[0]},${P[1]},${P[2]},${P[3]},${P[4]},${P[5]}`);
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
    renderLog(Game);
}

function addSetWonTeam(team){
    if(team=="A"){
        TeamA.SetsWon++;
    }else{
        TeamB.SetsWon++;
    }
    renderGame();
    renderLog(Game);
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
    renderLog(Game);
}

function closeModal(){
    Modal.style.display = "none";
    modalContent.innerHTML = "";
}

function saveOptions(maxPoints_input, pDiff_input, gPoint_input){
    maxSetPoints.Points = isNaN(parseInt(maxPoints_input.value))
        ? maxSetPoints.Points
        : parseInt(maxPoints_input.value);
    maxSetPoints.diffPoints = pDiff_input.checked;
    maxSetPoints.firstReachMax = gPoint_input.checked;
    closeModal();
    renderGame();
}

function editOptions(){
    // win condition - number of points to win
    let maxPoints_input = create("input");
    maxPoints_input = setAttributes(maxPoints_input,[
        ["id","maxPoints"],
        ["type","text"],
        ["placeholder",25],
        ["value",maxSetPoints.Points]
    ]);

    let maxPoints_label = create("label");
    maxPoints_label.innerHTML = "Puntos máximos por Set";
    maxPoints_label.appendChild(maxPoints_input);
    maxPoints_label = setAttributes(maxPoints_label,[["for",maxPoints_input.id]]);

    // win condition - difference of 2 points
    let pDiff_input = create("input");
    pDiff_input = setAttributes(pDiff_input,[
        ["id","pointsDiff"],
        ["type","radio"],
        ["name","winCondition"]
    ]);
    if(maxSetPoints.diffPoints){
        pDiff_input.setAttribute("checked",true);
    }

    let pDiff_label = create("label");
    pDiff_label.innerHTML = "Gana por diferencia de 2 puntos";
    pDiff_label.appendChild(pDiff_input);
    pDiff_label = setAttributes(pDiff_label,[["for",pDiff_input.id]]);

    // win condition - first on reach the max points win
    let gPoint_input = create("input");
    gPoint_input = setAttributes(gPoint_input,[
        ["id","goldenPoint"],
        ["type","radio"],
        ["name","winCondition"]
    ]);
    if(maxSetPoints.firstReachMax){
        gPoint_input.setAttribute("checked",true);
    }

    let gPoint_label = create("label");
    gPoint_label.innerHTML = `Gana el primero con ${maxSetPoints.Points} puntos`;
    gPoint_label.appendChild(gPoint_input);
    gPoint_label = setAttributes(gPoint_label,[
        ["for",gPoint_input.id],
        ["id","goldenPoint_label"],
    ]);

    let formEnd = create("div");
    formEnd.classList.add("form-end");
    let cancelButton = create("button");
    cancelButton.innerHTML = "Cancelar";
    cancelButton = setAttributes(cancelButton,[
        ["class","btn btn-padding btn-secondary"],
        ["onclick","closeModal()"]
    ]);

    let saveButton = create("button");
    saveButton.innerHTML = "Guardar";
    saveButton = setAttributes(saveButton,[
        ["id","saveInfo"],
        ["class","btn btn-standard btn-padding"]
    ]);

    maxPoints_input.addEventListener("input",()=>{
        gPoint_label.innerHTML=`Gana el primero con ${maxPoints_input.value} puntos`;
        gPoint_label.appendChild(gPoint_input);
    });

    saveButton.addEventListener("click",()=>{
        saveOptions(maxPoints_input, pDiff_input, gPoint_input);
    });

    formEnd.appendChild(cancelButton);
    formEnd.appendChild(saveButton);

    let form = create("form");
    form = appendChilds(form,[
        maxPoints_label,
        pDiff_label,
        gPoint_label,
        formEnd
    ]);
    setModalContent(form);
}

function setAttributes(element,attributes){
    attributes.forEach((attribute)=>{
        element.setAttribute(attribute[0],attribute[1])
    });
    return element;
}

function setModalContent(content){
    modalContent.innerHTML = "";
    modalContent.appendChild(content);
}

function appendChilds(element, childs){
    childs.forEach((child)=>{
        element.appendChild(child);
    });
    return element;
}

function winCondition(){
    if(maxSetPoints.firstReachMax){
        if(TeamA.Score==maxSetPoints.Points || TeamB.Score==maxSetPoints.Points){
            if(TeamA.Score>TeamB.Score){
                winTeam('A');
            }else{
                winTeam('B');
            }
        }
    }else{
        if(Math.abs(TeamA.Score-TeamB.Score)>=2 && (TeamA.Score >= maxSetPoints.Points || TeamB.Score >= maxSetPoints.Points)){
            if(TeamA.Score>TeamB.Score){
                winTeam('A');
            }else{
                winTeam('B');
            }
        }
    }
}

function winTeam(team){
    let winnerTeam = TeamA.Score>TeamB.Score?TeamA:TeamB;
    let loserTeam = TeamB.Score>TeamA.Score?TeamA:TeamB;
    alert(`Gana el equipo ${winnerTeam.Name} ${winnerTeam.Score} a ${loserTeam.Score} contra el equipo ${loserTeam.Name}`);
    addSetWonTeam(team);
    resetScore();
    changeSide();
}
