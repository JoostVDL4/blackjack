var dealerSum = 0;
var yourSum = 0;

var dealerAceCount = 0;
var yourAceCount = 0;

var hidden;
var deck;

var canHit = true;

var chips = 100;

var restart = document.getElementById("js--restart");

restart.style.display = "none";

window.onload = function () {
    buildDeck();
    shuffleDeck();
    startGame();
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); // A-c -> K-C, A-D -> K-D
        }
    }

    //console.log(deck);
}
function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
        let temp = deck[i]
        deck[i] = deck[j];
        deck[j] = temp;

    }

    console.log(deck);
}

function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden)
    // console.log(hidden);
    // console.log(dealerSum);

    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./img/" + card + ".png"
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("js--dealer-cards").append(cardImg);
    }

    console.log(dealerSum);

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./img/" + card + ".png"
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("js--your-cards").append(cardImg);
    }

    console.log(yourSum);
    document.getElementById("your-sum").innerText = yourSum;

    document.getElementById("js--hit").addEventListener("click", hit);
    document.getElementById("js--stand").addEventListener("click",stand);

}


function hit() {
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./img/" + card + ".png"
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("js--your-cards").append(cardImg);

    if(reduceAce(yourSum, yourAceCount) > 21){
        canHit=false;
    }
    document.getElementById("your-sum").innerText = yourSum;

}

function stand() {
    canHit = false; 

    document.getElementById("hidden").src = "./img/" + hidden + ".png";

    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./img/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        dealerSum = reduceAce(dealerSum, dealerAceCount); 
        document.getElementById("js--dealer-cards").append(cardImg);
    }

    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    let message = "";
    if (yourSum > 21) {
        message = "You went bust!";
    } else if (dealerSum > 21) {
        message = "Dealer went bust! You win!";
    } else if (yourSum == dealerSum) {
        message = "Push (It's a tie)!";
    } else if (yourSum > dealerSum) {
        message = "You win!";
    } else {
        message = "You lose!";
    }

    restart.style.display = "block";
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;
}


function getValue(card) {
    let data = card.split("-"); // 4-C -> ["4". "C"]
    let value = data[0];

    if (isNaN(value)) {
        if (value == "A") {
            return 11
        }

        return 10;
    }

    return parseInt(value);

}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;

    }
    return 0;
}

function reduceAce(playerSum, playerAceCount){
    while(playerSum > 21 && playerAceCount > 0){
        playerSum -=10;
        playerAceCount -= 1;

    }

    return playerSum;
}


function restartGame(){
    resetVariables();
    resetScreen();


    buildDeck();
    shuffleDeck();
    startGame();
}


function resetVariables(){
    dealerSum = 0;
    yourSum = 0;
    dealerAceCount = 0;
    yourAceCount = 0;
    canHit = true;
}

function resetScreen(){
    document.getElementById("js--dealer-cards").innerHTML = '<img id="hidden" src="img/BACK.png" alt="">'; 
    document.getElementById("js--your-cards").innerHTML = ''; 
    document.getElementById("dealer-sum").innerText = "";
    document.getElementById("your-sum").innerText = "";
    document.getElementById("results").innerText = "";
    restart.style.display = "none";
}