const squares = document.querySelectorAll(".square");
const body = document.querySelector("body");
const popupWrapper = document.querySelector(".popup-wrapper");
const popup = document.querySelector(".popup")
const resetButton = document.querySelector(".reset");
var button;
let difficultyGame = "easy";
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
let gameOver = false;

for(const square of squares){
    
    square.addEventListener("click", () =>{
        if(square.innerText !== "" || gameOver) return;
        currentPlayer = "X";
        addContentSquare(currentPlayer, square);
        verifyResult(currentPlayer);

        if(gameOver) return;
        if(verifyAllEmptyPlace().length !== 0){
            currentPlayer = "O"
            const emptySquare = bot(currentPlayer, difficultyGame);
            addContentSquare(currentPlayer, emptySquare);
            verifyResult(currentPlayer);
        }  
    })
}
function addContentSquare(currentPlayer, emptySquare){
    if(currentPlayer == "X"){
        emptySquare.innerText = currentPlayer;
        filledPlaces[currentPlayer].push(emptySquare.value.toString());
        emptySquare.style.color = "rgb(15, 10, 10)"
    }else{
        squares[emptySquare-1].innerText = currentPlayer;
        filledPlaces[currentPlayer].push(emptySquare.toString());
    }
}
function verifyResult(currentPlayer){
    let aux = 0;
    for(let y = 0; y < winning_possibilities.length; y++){
        for(let z = 0; z < winning_possibilities[y].length; z++){
            if(filledPlaces[currentPlayer].includes(winning_possibilities[y][z])){
                aux += 1;
                if(aux == 3){
                    gameOver = true;
                    stylizeWinningPosition(winning_possibilities[y]);
                    setTimeout(showPopup, 1200, currentPlayer);
                    return;
                } 
            }
        }
        aux = 0;
    }
    if(verifyAllEmptyPlace().length === 0){
        setTimeout(showPopup, 1200);
        return;
    }
}
function stylizeWinningPosition(array){
    let x = 0;
    while(x <= 2){
        squares[array[x] - 1].style.color = "#2f2faa";
        x++;
    }
}
function showPopup(currentPlayer){
    if(currentPlayer !== undefined){
        document.querySelector(".winner").innerText = currentPlayer;
    }
    else{
        document.querySelector(".winner").innerText = `VELHA`
    }
    popupWrapper.classList.add("active");
}

function bot(currentPlayer, difficulttGame){
    let emptySquare;
    if(difficultyGame === "easy"){
        emptySquare = randomMove()
    }
    else if(difficultyGame === "hard"){
        currentPlayer = "O";
        const positions = numberOfPositionsOccupied(currentPlayer);
        if(positions.length > 0){
            emptySquare = choosenLocation(positions, currentPlayer);
        }
        else{
            currentPlayer = "X";
            const positions = numberOfPositionsOccupied(currentPlayer);
            if(positions.length > 0){
                emptySquare = choosenLocation(positions, currentPlayer)
            }
            else{
                currentPlayer = "O"
                emptySquare = randomMove();
            }
        }
    }
    
    return emptySquare;  
}
//Retorna um objeto com a quantidade de vezes que o simbolo aparece no jogo
function numberOfPositionsOccupied(currentPlayer){
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
function verifyAllEmptyPlace(){
    const emptySquare = [...squares].filter(index => index.innerText == "");
    const emptySquareValue = emptySquare.map(element =>{
        return element.value;
    })
    return emptySquareValue;
}
function choosenLocation(positions, currentPlayer){
    let emptySquare;
    console.log(`${currentPlayer} e ${positions}`);
    const allEmptySquare = verifyAllEmptyPlace();
    positions.forEach(element =>{
        for(y = 0; y <= 2; y++){
            if((allEmptySquare.includes(element[y]))){
                emptySquare = element[y];
            }
        }
    })
    if(currentPlayer === "O" && emptySquare === undefined){
        emptySquare = choosenLocation(numberOfPositionsOccupied("X"), "X");
    }
    else if(emptySquare === undefined){
        emptySquare = randomMove()
    }
    return emptySquare;
}
function randomMove(){
    console.log("Chamei o randomMove()");
    const allEmptySquare = verifyAllEmptyPlace();
    do{
        var emptySquare = Math.floor(Math.random() * 10);
    }while(emptySquare == 0 || !allEmptySquare.includes(emptySquare.toString()));
    return emptySquare;
}
function restartGame(){
    gameOver = false;
    difficultyGame = document.querySelector('input[name = "difficulty"]:checked').value;
    document.querySelector(".winner").innerText = "";
    filledPlaces["X"] = [];
    filledPlaces["O"] = [];
    for(let y = 0; y < squares.length; y++){
        squares[y].innerText = "";
        squares[y].style.color = "#fff"
    }
}
resetButton.addEventListener("click", () =>{
    popupWrapper.classList.remove("active");
    restartGame();
});

