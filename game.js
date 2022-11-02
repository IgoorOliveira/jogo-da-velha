const squares = document.querySelectorAll(".square");
const body = document.querySelector("body");
var button;
const winning_possibilities = [
    ["1", "2", "3"],
    ["4", '5', "6"], 
    ["7", "8", "9"], 
    ['1', "4", '7'],
    ["2", "5", "8"], 
    ["3", "6", "9"], 
    ['1', '5', "9"], 
    ["3", '5', '7']
];
let filledPlaces = {
    X:[], O:[]
};
let currentPlayer = "";
let finishGame = false;

for(const square of squares){

    square.addEventListener("click", () =>{
        if(square.innerText !== "" || finishGame === true) return;
        currentPlayer = "X";
        addContentSquare(currentPlayer, square);
        checkResult(currentPlayer);

        if(checkAllEmptyPlace().length !== 0){
            currentPlayer = "O"
            const emptySquare = bot(currentPlayer);
            addContentSquare(currentPlayer, emptySquare);
            checkResult("O");
        }  
    })
}
function addContentSquare(currentPlayer, emptySquare){
    if(currentPlayer == "X"){
        emptySquare.innerText = currentPlayer;
        filledPlaces[currentPlayer].push(emptySquare.value.toString());
    }else{
        squares[emptySquare-1].innerText = currentPlayer;
        filledPlaces[currentPlayer].push(emptySquare.toString());
    }
}
function checkResult(currentPlayer){
    console.log(filledPlaces[currentPlayer])
    let aux = 0;
    for(let y = 0; y < winning_possibilities.length; y++){
        for(let z = 0; z < winning_possibilities[y].length; z++){
            if(filledPlaces[currentPlayer].includes(winning_possibilities[y][z])){
                aux += 1;
                if(aux == 3){
                    finishGame = true;
                    restartGame();
                    return alert(`${currentPlayer} GANHOU!!!`);
                } 
            }
        }
        aux = 0;
    }
    if(checkAllEmptyPlace().length === 0){
        restartGame();
        return alert("VELHA!!!")
    }
}
function bot(currentPlayer){
    currentPlayer = "O";
    const positions = numberOfPositionsOccupations(currentPlayer);
    if(positions.length > 0){
        var emptySquare = choosenLocation(positions);
    }
    else{
        currentPlayer = "X";
        const positions = numberOfPositionsOccupations(currentPlayer);
        if(positions.length > 0){
            var emptySquare = choosenLocation(positions)
        }
        else{
            currentPlayer = "O"
            var emptySquare = randomMove();
        }
    }
    return emptySquare;  
}
//Retorna um objeto com a quantidade de vezes que o simbolo aparece no jogo
function numberOfPositionsOccupations(currentPlayer){
    const counts = {};
    winning_possibilities.forEach(possibilities =>{
        possibilities.forEach(index =>{
            for(let x = 0; x <= 2; x++){
                filledPlaces[currentPlayer].forEach(element =>{
                    if(element == index[x]){
                        counts[possibilities] = (counts[possibilities] || 0) + 1;
                    }
                })
            }
        })
    })
    return greaterChanceWinning(counts);
}
//Retorna as combinações que o símbolo ocupa duas posições.
function greaterChanceWinning(counts){
    const countsArray = Object.entries(counts);
    const filterCounts = countsArray.filter(s => s[1] == 2)
    const occupiesMoreThanTwoPositions = filterCounts.map(element => element[0].split(","))
    return occupiesMoreThanTwoPositions;
}
//Retorna os quadrados vazios jogo.
function checkAllEmptyPlace(){
    const emptySquare = [...squares].filter(index => index.innerText == "");
    const emptySquareValue = emptySquare.map(element =>{
        return element.value;
    })
    return emptySquareValue;
}
function choosenLocation(positions){
    let emptySquare;
    const allEmptySquare = checkAllEmptyPlace();
    positions.forEach(element =>{
        for(y = 0; y <= 2; y++){
            if((allEmptySquare.includes(element[y]))){
                emptySquare = element[y];
            }
        }
    })
    return emptySquare || randomMove();
}
function randomMove(){
    const allEmptySquare = checkAllEmptyPlace();
    do{
        var emptySquare = Math.floor(Math.random() * 10);
    }while(emptySquare == 0 || !allEmptySquare.includes(emptySquare.toString()));
    return emptySquare;
}
function restartGame(){
    button = document.createElement("button");
    button.innerText = "RESET";
    button.classList.add("reset")
    body.appendChild(button);
    
    button.addEventListener("click", () =>{
        finishGame = false;
        filledPlaces["X"] = [];
        filledPlaces["O"] = [];
        for(let y = 0; y < squares.length; y++){
            squares[y].innerText = "";
        }
        button.remove();
    })
}
