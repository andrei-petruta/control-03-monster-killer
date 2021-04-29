// VARIABLES
const attackValue = 10;
const strongAttackValue = 17;
const monsterAttackValue = 14;
const healValue = 7;

const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_STRONG_ATTACK = "STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

let battleLog = [];

// MANUALLY SETTING UP MAXIMUM LIFE 
function getMaxLife() {
    const enteredValue = parseInt(prompt("Maximum life for you and the monster:", "100"));

    if (isNaN(enteredValue) || enteredValue <= 0) {
        throw {message: "Invalid user input, not a number!"};
    }
    return enteredValue;
}

let chosenMaxLife;
try {
    chosenMaxLife = getMaxLife();
} catch (error) {
    console.log(error);
    chosenMaxLife = 100;
    alert("You did not enter a valid number. Life automatically set to 100.");
}




let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);



function writeToLog(event, value, monsterHealth, playerHealth) {
    let logEntry = {
        event: event,
        value: value,
        target: null,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
    };
    if (event === LOG_EVENT_PLAYER_ATTACK) {
        logEntry.target = "MONSTER";
    } else if (event === LOG_EVENT_STRONG_ATTACK) {
        logEntry.target = "MONSTER";
    } else if (event === LOG_EVENT_MONSTER_ATTACK) {
        logEntry.target = "PLAYER";
    } else if (event === LOG_EVENT_PLAYER_HEAL) {
        logEntry.target = "PLAYER";
    }
    battleLog.push(logEntry);
    //console.log(battleLog);
}


// FUNCTION TO RESET GAME; DOES NOT ADD EXTRA LIFE
function reset() {
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}


// FUNCTION FOR ATTACKING MONSTER
function attackMonster(attackTypeValue) {
    const damageMonster = dealMonsterDamage(attackTypeValue);
    currentMonsterHealth -= damageMonster;
    if (attackTypeValue === 10) {
        writeToLog(LOG_EVENT_PLAYER_ATTACK, damageMonster, currentMonsterHealth, currentPlayerHealth);
    } else {
        writeToLog(LOG_EVENT_STRONG_ATTACK, damageMonster, currentMonsterHealth, currentPlayerHealth);
    }
    if (currentMonsterHealth <= 0) {
        alert("You won!");
        writeToLog(LOG_EVENT_GAME_OVER, damageMonster, currentMonsterHealth, currentPlayerHealth);
        reset();
        return;
    }
    attackPlayer();
}


// FUNCTION FOR ATTACKING PLAYER
function attackPlayer() {
    setTimeout(function() {
        const damagePlayer = dealPlayerDamage(monsterAttackValue);
        currentPlayerHealth -= damagePlayer;
        if (currentPlayerHealth <= 0 && hasBonusLife) {
            removeBonusLife();
            hasBonusLife = false;
            setPlayerHealth(chosenMaxLife);
            currentPlayerHealth = chosenMaxLife;
            alert("You would be dead, but the bonus life revived you.");
            writeToLog(LOG_EVENT_MONSTER_ATTACK, damagePlayer, currentMonsterHealth, currentPlayerHealth);
            return;
        }
        if (currentPlayerHealth <= 0) {
            alert("The monster won..");
            writeToLog(LOG_EVENT_MONSTER_ATTACK, damagePlayer, currentMonsterHealth, currentPlayerHealth);
            reset();
            return;
        }
        writeToLog(LOG_EVENT_MONSTER_ATTACK, damagePlayer, currentMonsterHealth, currentPlayerHealth);
    }, 1000); 
}


// FUNCTION FOR ATTACK BUTTON
function attackHandler() {
    attackMonster(attackValue);
}


// FUNCTION FOR STRONG ATTACK BUTTON
function strongAttackHandler() {
    attackMonster(strongAttackValue);
}


// FUNCTION FOR HEALING PLAYER
function healPlayerHandler() {
    currentPlayerHealth += healValue;
    if (currentPlayerHealth > chosenMaxLife) {
        alert("You can't heal to more than your max initial health.");
        currentPlayerHealth = chosenMaxLife;
    }
    increasePlayerHealth(healValue);
    writeToLog(LOG_EVENT_PLAYER_HEAL, healValue, currentMonsterHealth, currentPlayerHealth);
    attackPlayer();
}


// FUNCTION TO SHOW LOG
function printLogHandler() {
    let i = 0;
    for (const element of battleLog) {
        console.log(`${i}`);
        for (const key in element) {
            console.log(`${key} => ${element[key]}`);
        };
        i++;
    }
    //console.log(battleLog);
}


// EVENT HANDLERS FOR BUTTONS
attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
