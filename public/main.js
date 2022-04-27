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

// Flip multiple coins and show coin images in table as well as summary results
// Enter number and press button to activate coin flip series

// Guess a flip by clicking either heads or tails button
