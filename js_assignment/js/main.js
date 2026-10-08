/* MEMORY MATCH JAVASCRIPT
Author: [Sharon Babatunde]
Date: March 16th 2026
Description: This JavaScript file controls the Memory Match game logic, including card flipping,
matching pairs, tracking score and moves, and switching between screens. */

window.addEventListener('load', () => {

    // ELEMENT SELECTION 
    const splashScreen = document.getElementById('splashScreen'); 
    const gameScreen = document.getElementById('gameScreen');     
    const endScreen = document.getElementById('endScreen');       

    const startBtn = document.getElementById('startBtn');         
    const helpBtn = document.getElementById('helpBtn');      
    const playAgainBtn = document.getElementById('playAgainBtn');
    const helpText = document.getElementById('helpText');   

    const progressBar = document.getElementById("progressBar");  
    const scoreDisplay = document.getElementById("score");       
    const movesDisplay = document.getElementById("moves");        

    const board = document.getElementById("board");               

    // GAME DATA INITIALIZATION 
    let symbols = []; 
    let imageFiles = [
        "images/apple.jpeg",
        "images/banana.jpeg",
        "images/cherry.jpeg",
        "images/grape.jpeg",
        "images/orange.jpeg",
        "images/pear.jpeg",
        "images/pineapple.jpeg",
        "images/watermelon.jpeg",
        "images/lemon.jpeg"
    ];

    for(let i = 0; i < imageFiles.length; i++){
        let img = new Image();
        img.src = imageFiles[i];
        symbols.push(img);
    }

    /* GAME STATE VARIABLES */
    let firstCard = null;  
    let secondCard = null;  
    let lockBoard = false;  
    let matches = 0;   
    let moves = 0;          
    let score = 0;         

    /* START GAME FUNCTION */
    function startGame() {
        board.innerHTML = "";           // clear existing cards
        firstCard = secondCard = null;
        lockBoard = false;
        matches = 0;
        moves = 0;
        score = 0;

        // Reset scoreboard
        movesDisplay.textContent = 0;
        scoreDisplay.textContent = 0;
        progressBar.value = 0;

        // Create shuffled deck (two of each symbol)
        let cards = symbols.concat(symbols);
        cards.sort(() => Math.random() - 0.5);

        // Create card elements
        cards.forEach(symbol => {
            const card = document.createElement("div");
            card.classList.add("card");

            const img = document.createElement("img");
            img.src = symbol.src;
            img.style.display = "none";   
            img.classList.add("card-image");
            card.appendChild(img);

            // Card click event
            card.addEventListener('click', () => {

                // Prevent invalid clicks
                if (lockBoard) return;
                if (card === firstCard) return;
                if (card.classList.contains("matched")) return;

                // Show card image
                img.style.display = "block";
                card.classList.add("flipped");

                // Handle first and second card logic
                if (!firstCard) {
                    firstCard = card;
                    return;
                }

                secondCard = card;
                moves++;
                movesDisplay.textContent = moves;

                const firstImg = firstCard.querySelector("img");
                const secondImg = secondCard.querySelector("img");

                // Check for match
                if (firstImg.src === secondImg.src) {
                    firstCard.classList.add("matched");
                    secondCard.classList.add("matched");
                    matches++;
                    progressBar.value = matches;

                    // Update score
                    score += Math.max(50 - moves, 5);
                    scoreDisplay.textContent = score;

                    // Reset selection
                    firstCard = secondCard = null;

                    // Check if all matches are found
                    if (matches === symbols.length) {
                        endGame();
                    }

                } else {
                    // Lock board while flipping back unmatched cards
                    lockBoard = true;

                    setTimeout(() => {
                        firstImg.style.display = "none";
                        secondImg.style.display = "none";
                        firstCard.classList.remove("flipped");
                        secondCard.classList.remove("flipped");

                        firstCard = secondCard = null;
                        lockBoard = false;
                    }, 600);
                }
            });

            // Add card to board
            board.appendChild(card);
        });
    }

    /* INITIAL SCREEN SETUP */
    splashScreen.style.display = 'block';
    gameScreen.style.display = 'none';
    endScreen.style.display = 'none';

    // Show start button after short delay
    setTimeout(() => {
        startBtn.style.display = "block";
    }, 1000);

    // Start button click handler
    startBtn.addEventListener('click', () => {
        setTimeout(() => {
            splashScreen.style.display = 'none';
            gameScreen.style.display = 'block';
            startGame();
        }, 400);
    });

    // Play again button click handler
    playAgainBtn.addEventListener("click", () => {
        endScreen.style.display = "none";
        gameScreen.style.display = "block";
        startGame();
    });

    // Help button toggle
    helpBtn.addEventListener('click', () => {
        if (helpText.style.display === "none") {
            helpText.style.display = "block";
        } else {
            helpText.style.display = "none";
        }
    });

    /* CANVAS ANIMATION (SPLASH SCREEN) */
    const canvas = document.getElementById("splashCanvas");
    const ctx = canvas.getContext("2d");

    // Set canvas size
    canvas.width = 1300;
    canvas.height = 540;

    let fruits = [];
    let blink = 0;

    const emojis = ["🍓","🍊","🍌","🍉","🍒"];

    // Initialize fruit objects for animation
    for(let i=0;i<25;i++){
        fruits.push({
            x: Math.random()*canvas.width,
            y: Math.random()*canvas.height,
            speed: Math.random()*0.6 + 0.2,
            emoji: emojis[Math.floor(Math.random()*emojis.length)]
        });
    }

    // Draw and move fruit emojis
    function drawFruits(){
        ctx.font = "50px serif";

        fruits.forEach(f=>{
            ctx.fillText(f.emoji,f.x,f.y);
            f.y -= f.speed;

            // Reset fruit to bottom if it goes off top
            if(f.y < -30){
                f.y = canvas.height + 30;
                f.x = Math.random()*canvas.width;
            }
        });
    }

    // Draw animated title and blinking "Press Start"
    function drawTitle(){
        ctx.textAlign = "center";
        ctx.font = "bold 70px Verdana";
        ctx.fillStyle = "#ff4d7fff";
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;
        ctx.fillText("Memory Match Game", canvas.width/2, canvas.height/2 - 50);

        blink++;
        if(Math.floor(blink/40) % 2 === 0){
            ctx.font = "30px Verdana";
            ctx.fillStyle = "#333";
            ctx.fillText("Press Start to Play", canvas.width/2, canvas.height/2 + 40);
        }
    }

    // Animation loop
    function animate(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        drawFruits();
        drawTitle();
        requestAnimationFrame(animate);
    }
    animate();

    /* END GAME FUNCTION */
    function endGame() {
        gameScreen.style.display = "none";
        endScreen.style.display = "block";

        // Display final score and moves
        document.getElementById("finalScore").textContent = score;
        document.getElementById("finalMoves").textContent = moves;

        // Store score history in localStorage
        let history = JSON.parse(localStorage.getItem("memoryMatchHistory")) || [];
        history.push(score);
        localStorage.setItem("memoryMatchHistory", JSON.stringify(history));

        document.getElementById("history").textContent = "Previous scores: " + history.join(" | ");
    }
});