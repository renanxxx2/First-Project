
const gameOverScreen = document.getElementById("game-over-screen");
const respawnCounter = document.getElementById("respawn-counter");
const levelUpBanner = document.getElementById("level-up-banner");
const buttons = document.querySelectorAll(".answer-btn");
const question = document.getElementById("question");
const translation = document.getElementById("translation");
const levelUpSound = document.getElementById("level-up-sound");
const answer0 = document.getElementById("answer0");
const answer1 = document.getElementById("answer1");
const answer2 = document.getElementById("answer2");
const answer3 = document.getElementById("answer3");

const timer = document.getElementById("timer");

const correctText = document.getElementById("correct");
const wrongText = document.getElementById("wrong");
const comboText = document.getElementById("combo");

const levelText = document.getElementById("level");
const xpText = document.getElementById("xp");

const xpFill = document.querySelector(".xp-fill");

const hearts = document.querySelectorAll(".heart");
let lives = hearts.length;

let correct = 0;
let wrong = 0;
let combo = 0;

let xp = 0;
let level = 1;

let currentQuestion = 0;

let time = 90;
let countdown;

let respawnTime = 30;
let respawnInterval;
let gamePaused = false;
// ===== SAVE SYSTEM =====

function saveGame() {

    const save = {

        level: level,
        xp: xp,

        correct: correct,
        wrong: wrong,
        combo: combo,

       currentQuestion: Math.min(currentQuestion, questions.length - 1),

        lives: lives

    };

    localStorage.setItem("englishQuestSave", JSON.stringify(save));

}

function loadGame() {

    const save = JSON.parse(localStorage.getItem("englishQuestSave"));

    if (!save) return;

    level = save.level;
    xp = save.xp;

    correct = save.correct;
    wrong = save.wrong;
    combo = save.combo;

    currentQuestion = Math.min(save.currentQuestion, questions.length - 1);

    lives = Math.max(0, Math.min(save.lives, hearts.length));

    hearts.forEach((heart, index) => {

        if(index < lives){

            heart.style.opacity = "1";

        }else{

            heart.style.opacity = "0.2";

        }

    });

if (lives === 0) {
    startRespawnTimer();
}

}

function updateStats(){

    while (xp >= 100) {

        xp -= 100;
        level++;

        levelUpSound.currentTime = 0;
        levelUpSound.play();

        showLevelUp();

    }

    correctText.textContent = `✔ Correct: ${correct}`;
    wrongText.textContent = `❌ Wrong: ${wrong}`;
    comboText.textContent = `🔥 Combo: ${combo}`;

    xpText.textContent = `XP: ${xp}`;
    levelText.textContent = level;

    xpFill.style.width = `${xp}%`;

    saveGame();

}
function startRespawnTimer() {

    gamePaused = true;

    gameOverScreen.classList.add("show");

    clearInterval(countdown);

    buttons.forEach(button => {
        button.disabled = true;
    });

    respawnTime = 30;

    respawnCounter.textContent =
    String(respawnTime).padStart(2,"0");
    respawnInterval = setInterval(() => {

        respawnTime--;

      respawnCounter.textContent =
    String(respawnTime).padStart(2,"0");

        if (respawnTime <= 0) {

            clearInterval(respawnInterval);

           lives = hearts.length;

           hearts.forEach(heart => {
           heart.style.opacity = "1";

           });

            gamePaused = false;
            
         gameOverScreen.classList.remove("show");

            resetButtons();

            startTimer();
            
            saveGame();

        }

    }, 1000);

}

function startTimer(){

    clearInterval(countdown);

    time = 90;

    countdown = setInterval(() => {

        let minutes = Math.floor(time / 60);
        let seconds = time % 60;

        timer.textContent =
            `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;

        if(time <= 0){

            clearInterval(countdown);

            loseLife();

            changeTeacher(reactions.timeout);

        }

        time--;

    },1000);

}
function showLevelUp(){

    levelUpBanner.classList.remove("show");

    void levelUpBanner.offsetWidth;

    levelUpBanner.classList.add("show");

}

const avatars = document.querySelectorAll(".avatar-option");
const playerAvatar = document.getElementById("player-avatar");

avatars.forEach(avatar => {

    avatar.addEventListener("click", () => {

        // Remove a seleção dos outros
        avatars.forEach(a => a.classList.remove("selected"));

        // Seleciona o avatar clicado
        avatar.classList.add("selected");

        // Atualiza o avatar do perfil
        playerAvatar.src = avatar.src;

    });

});


const teacher = document.getElementById("teacher");
const reactions = {

    correct: [
        "./reactions/mario.gif",
        "./reactions/potato-happy.gif"
    ],

    wrong: [
        "./reactions/potato-funny.gif",
        "./reactions/potatosad.gif"
    ],

    thinking:"./reactions/calcule.gif",

    timeout:"./reactions/potato-rage.gif",

    gameover:"./reactions/patrick.gif"

};

function changeTeacher(img, time = 2000){

    teacher.src = img;

    setTimeout(() => {

        teacher.src = "./iimagens/bmo.gif";

    }, time);


}

function loseLife(){

    if (lives <= 0) return;

    lives--;

    if (hearts[lives]) {
        hearts[lives].style.opacity = "0.2";
    }

    saveGame();

    if (lives === 0) {
        startRespawnTimer();
    }

}


function loadQuestion() {

    question.textContent = questions[currentQuestion].question;

    translation.textContent = questions[currentQuestion].translation;

    answer0.textContent = questions[currentQuestion].answers[0];

    answer1.textContent = questions[currentQuestion].answers[1];

    answer2.textContent = questions[currentQuestion].answers[2];

    answer3.textContent = questions[currentQuestion].answers[3];

}
function resetButtons() {

    buttons.forEach(button => {

        button.style.background = "#1A1A35";
        button.style.borderColor = "#4CC9F0";
        button.disabled = false;

    });

}
function nextQuestion(){

    currentQuestion++;

    if(currentQuestion >= questions.length){

        alert("Congratulations! You finished English Quest!");

        localStorage.removeItem("englishQuestSave");

        return;
    }
     resetButtons();
     
    loadQuestion();

    startTimer();

    saveGame();

}
loadGame();

updateStats();

loadQuestion();

startTimer();

console.log(currentQuestion);

buttons.forEach((button, index) => {

    button.addEventListener("click", () => {
        
    buttons.forEach(btn => btn.disabled = true);

        clearInterval(countdown);

        const correctAnswer = questions[currentQuestion].correct;

if(index === correctAnswer){

    button.style.background = "#2ecc71";
    button.style.borderColor = "#2ecc71";

correct++;
combo++;
xp += 20;

updateStats();

    changeTeacher(
        reactions.correct[
            Math.floor(Math.random() * reactions.correct.length)
        ]
    );

}else{

    button.style.background = "#e74c3c";
    button.style.borderColor = "#e74c3c";

   buttons[correctAnswer].style.background = "#2ecc71";
   buttons[correctAnswer].style.borderColor = "#2ecc71";

wrong++;
combo = 0;

updateStats();

    loseLife();

    changeTeacher(
        reactions.wrong[
            Math.floor(Math.random() * reactions.wrong.length)
        ]
    );

}

setTimeout(() => {

    if (!gamePaused) {
        nextQuestion();
    }

}, 1800);
    });

});

// ===== MUSIC PLAYER =====

const player = document.getElementById("player");
const musicSelect = document.getElementById("music-select");


const playBtn = document.getElementById("play-btn");
const pauseBtn = document.getElementById("pause-btn");

const musicGif = document.getElementById("music-gif");

musicSelect.addEventListener("change", () => {

    player.src = musicSelect.value;

    
});
   

pauseBtn.addEventListener("click", () => {

    player.pause();

  

});

musicSelect.addEventListener("change", () => {

    player.src = musicSelect.value;

    player.play();

   

});
console.log(player);
console.log(musicGif);
console.log(playBtn);
console.log(pauseBtn);
console.log(musicSelect);

const wallpapers = [
    "./background/wallpaper project.gif",
    "./background/wallpaper-1.gif",
    "./background/wallpaper-2.gif",
    "./background/wallpaper-3.gif"
];

let currentWallpaper = -1;

function changeWallpaper(){

    let random;

    do{

        random = Math.floor(Math.random() * wallpapers.length);

    }while(random === currentWallpaper);

    currentWallpaper = random;

    document.body.style.backgroundImage =
        `url('${wallpapers[random]}')`;

    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";

}

changeWallpaper();

setInterval(changeWallpaper, 60000);

function resetGame(){

    if(confirm("Deseja apagar todo o progresso?")){

        localStorage.removeItem("englishQuestSave");

        location.reload();

    }

}