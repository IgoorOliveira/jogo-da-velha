const squares = document.querySelectorAll(".square");
let possibilities = [
    ["1", "2", "3"],
    ["4", '5', "6"], 
    ["7", "8", "9"], 
    ['1', "4", '7'],
    ["2", "5", "8"], 
    ["3", "6", "9"], 
    ['1', '5', "9"], 
    ["3", '5', '7']
];
let filledPlaces = [];

for(const square of squares){
    square.addEventListener("click", () =>{
        
        if(square.innerText === ""){
            addContentSquare(square);
            opponent(square);
        }
    })
}
function addContentSquare(square){
    square.innerText = "X";
    filledPlaces.push(square.value);
    
}
function opponent(square){
    counts = {};
    possibilities.forEach(element =>{
        element.forEach(i =>{
            for(let x = 0; x <= 2; x++){
               filledPlaces.forEach(place =>{
                    if(place == i[x]){
                        counts[element] = (counts[element] || 0) + 1;
                    }
               })
            }
        })
    })
    console.log(counts)
}