//Variables
const Modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
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
    let gm = localStorage.getItem("Game");
    if(gm!=null){
        loadGame(gm);
    }else{
        resetGame();
    }
});
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
        if(newName!=null && newName!=""){
            if(element.id.includes("A")){
                TeamA.Name = newName;
            }else{
                TeamB.Name = newName;
            }
            renderGame();
        }
    });
});
document.getElementById("editOptions").addEventListener("click",()=>{
    Modal.style.display = "flex";
    editOptions();
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
    maxSetPoints = {
        Points: 25,
        diffPoints:true,
        firstReachMax:false,
        sets:5
    };
    renderGame();
}

function loadGame(gm){
    Game = JSON.parse(gm);
    TeamA = Game[0];
    TeamB = Game[1];
    maxSetPoints = Game[2];
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
    winCondition();
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

    Game = [TeamA,TeamB,maxSetPoints];
    localStorage.setItem("Game", JSON.stringify(Game));
}

function resetScore(){
    TeamA.Score=0;
    TeamB.Score=0;
    TeamA.TimeOuts=0;
    TeamB.TimeOuts=0;
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

function rotate(team, orientation=1){
    let newTeamRotation=[];
    let lastTeamRotation = team=="A"?TeamA.TeamPosition:TeamB.TeamPosition;
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

function closeModal(){
    Modal.style.display = "none";
    modalContent.innerHTML = "";
}

function editOptions(){
    let maxPoints_input = document.createElement("input");
    maxPoints_input = setAttributes(maxPoints_input,[
        ["id","maxPoints"],
        ["type","text"],
        ["placeholder",25],
        ["value",maxSetPoints.Points]
    ]);

    let maxPoints_label = document.createElement("label");
    maxPoints_label.innerHTML = "Puntos máximos por Set";
    maxPoints_label.appendChild(maxPoints_input);
    maxPoints_label = setAttributes(maxPoints_label,[["for",maxPoints_input.id]]);

    let pDiff_input = document.createElement("input");
    pDiff_input = setAttributes(pDiff_input,[
        ["id","pointsDiff"],
        ["type","radio"],
        ["name","winCondition"]
    ]);
    let pDiff_label = document.createElement("label");
    pDiff_label.innerHTML = "Gana por diferencia de 2 puntos";
    pDiff_label.appendChild(pDiff_input);
    pDiff_label = setAttributes(pDiff_label,[["for",pDiff_input.id]]);

    let gPoint_input = document.createElement("input");
    gPoint_input = setAttributes(gPoint_input,[
        ["id","goldenPoint"],
        ["type","radio"],
        ["name","winCondition"]
    ]);
    let gPoint_label = document.createElement("label");
    gPoint_label.innerHTML = `Gana el primero con ${maxSetPoints.Points} puntos`;
    gPoint_label.appendChild(gPoint_input);
    gPoint_label = setAttributes(gPoint_label,[
        ["for",gPoint_input.id],
        ["id","goldenPoint_label"],
    ]);

    let formEnd = document.createElement("div");
    formEnd.classList.add("form-end");
    let cancelButton = document.createElement("button");
    cancelButton.innerHTML = "Cancelar";
    cancelButton = setAttributes(cancelButton,[
        ["class","btn btn-padding btn-secondary"],
        ["onclick","closeModal()"]
    ]);

    let saveButton = document.createElement("button");
    saveButton.innerHTML = "Guardar";
    saveButton = setAttributes(saveButton,[
        ["id","saveInfo"],
        ["class","btn btn-standard btn-padding"]
    ]);

    maxPoints_input.addEventListener("input",()=>{
        gPoint_label.innerHTML=`Gana el primero con ${maxPoints_input.value} puntos`;
        gPoint_label.appendChild(gPoint_input);
    });
    if(maxSetPoints.diffPoints)
        pDiff_input.setAttribute("checked",true);
    else
        gPoint_input.setAttribute("checked",true);

    saveButton.addEventListener("click",()=>{
        maxSetPoints.Points=isNaN(parseInt(maxPoints_input.value))?maxSetPoints.Points:parseInt(maxPoints_input.value);
        maxSetPoints.diffPoints = pDiff_input.checked;
        maxSetPoints.firstReachMax = gPoint_input.checked;
        closeModal();
        renderGame();
    });

    formEnd.appendChild(cancelButton);
    formEnd.appendChild(saveButton);

    let form = document.createElement("form");
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