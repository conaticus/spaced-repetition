const fs = require("fs/promises");
import { showAlert } from "../util.js";

const cardQuestionEl = document.getElementById("card-question");
const cardAnswerEl = document.getElementById("card-answer");
const showAnswerBtn = document.getElementById("show-answer-btn");
const answerStatusContainer = document.getElementById(
    "answer-status-container"
);
const correctStatusBtn = document.getElementById("correct-btn");
const incorrectStatusBtn = document.getElementById("incorrect-btn");

const dateHasPast = (date) => {
    return date < new Date();
};

let saveData;

const getSaveData = async () => {
    saveData = JSON.parse(await fs.readFile("./save.json", "utf8"));
};

const createCard = async () => {
    cardQuestionEl.innerText = "";
    cardAnswerEl.innerText = "";
    answerStatusContainer.style.display = "none";

    if (!saveData) {
        await getSaveData();
    }

    const showableCards = saveData.cards.filter((card) => {
        if (card.canShowAt === null) return true;
        return dateHasPast(new Date(card.canShowAt));
    });

    if (showableCards.length === 0) {
        showAnswerBtn.remove();
        showAlert("No more cards left, come back later!");
        return;
    }

    const prioritisedCards = saveData.cards.filter((card) => {
        if (card.canShowAt === null) return false;
        return dateHasPast(new Date(card.canShowAt));
    });

    let card;
    let cardIdx;

    if (prioritisedCards.length === 0) {
        cardIdx = Math.floor(Math.random() * showableCards.length);
        card = showableCards[cardIdx];
    } else {
        cardIdx = Math.floor(Math.random() * prioritisedCards.length);
        card = prioritisedCards[cardIdx];
    }

    cardQuestionEl.innerText = card.question;

    showAnswerBtn.onclick = () => {
        cardAnswerEl.innerText = card.answer;
        answerStatusContainer.style.display = "block";
        const idx = saveData.cards.indexOf(card);

        correctStatusBtn.onclick = async () => {
            saveData.cards[idx].correctCount++;
            const card = saveData.cards[idx];
            card.correctCount++;

            let showAtDate = new Date();

            switch (card.correctCount) {
                case 1:
                    showAtDate.setDate(showAtDate.getDate() + 1);
                    break;
                case 2:
                    showAtDate.setDate(showAtDate.getDate() + 7);
                    break;
                case 3:
                    showAtDate.setDate(showAtDate.getMonth() + 1);
                    break;
                case 4:
                    showAtDate.setDate(showAtDate.getFullYear() + 1);
                    break;
                default:
                    showAtDate.setDate(showAtDate.getFullYear() + 1);
                    break;
            }

            card.canShowAt = showAtDate.getTime();
            saveData.cards[idx] = card;

            showableCards.splice(cardIdx, 1);
            if (prioritisedCards.length > 0) {
                prioritisedCards.splice(cardIdx, 1);
            }
            createCard();

            await fs.writeFile("./save.json", JSON.stringify(saveData));
        };

        incorrectStatusBtn.onclick = async () => {
            card.canShowAt = new Date(
                new Date().getTime() + 60000
            ).getTime();
            
            card.correctCount = 0;

            saveData.cards[idx] = card;

            showableCards.splice(cardIdx, 1);
            if (prioritisedCards.length > 0) {
                prioritisedCards.splice(cardIdx, 1);
            }
            createCard();

            await fs.writeFile("./save.json", JSON.stringify(saveData));
        };
    };
};

createCard();
