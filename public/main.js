// Focus div based on nav button click
document.getElementById("homenav").onclick = function(){
    document.getElementById("home").className="";
    document.getElementById("single").className="hidden";
    document.getElementById("multi").className="hidden";
    document.getElementById("guess").className="hidden";
};

document.getElementById("singlenav").onclick = function(){
    document.getElementById("home").className="hidden";
    document.getElementById("single").className="";
    document.getElementById("multi").className="hidden";
    document.getElementById("guess").className="hidden";
};

document.getElementById("multinav").onclick = function(){
    document.getElementById("home").className="hidden";
    document.getElementById("single").className="hidden";
    document.getElementById("multi").className="";
    document.getElementById("guess").className="hidden";
};

document.getElementById("guessnav").onclick = function(){
    document.getElementById("home").className="hidden";
    document.getElementById("single").className="hidden";
    document.getElementById("multi").className="hidden";
    document.getElementById("guess").className="";
};
// Flip one coin and show coin image to match result when button clicked
function coinFlip() {
    fetch("http://localhost:5000/app/flip/")
        .then((response) => {
            return response.json();
        })
        .then(result => {
            console.log(result);
            document.getElementById("result").innerHTML = result.flip;
            document.getElementById("coin").setAttribute("src", "./assets/img/" + result.flip + ".png");
        })
}

// Flip multiple coins and show coin images in table as well as summary results
// Enter number and press button to activate coin flip series

function flipManyCoins() {
    //gets number from form
    let num = document.getElementById("number").value;
    fetch("http://localhost:5000/app/flips/" + num)
    .then((response) => {
        return response.json();
    })
    .then(result => {
        console.log(result);
        // gets summary count
        const headCount = result.summary.heads;
        const tailCount = result.summary.tails;
        // handles if the summary is undefined AKA 0 of that type
        if (headCount === undefined) {
            headCount = 0;
        }
        if (tailCount === undefined) {
            tailCount = 0;
        }
        // sets the summary 
        document.getElementById("heads").innerHTML = "Heads: " + headCount;
        document.getElementById("tails").innerHTML = "Tails: " + tailCount;
        // display the images
        const raw = result.raw;
        document.getElementById("picFlips").innerHTML = "";
        for (let i = 0; i < raw.length; i++) {
            document.getElementById("picFlips").innerHTML += `
                <img id = "coin" src="./assets/img/${raw[i]}.png" height="200" width="200"></img>
                <p>${raw[i]}</p>
            `
        }
    })
}

// Guess a flip by clicking either heads or tails button
