import { showAlert } from "../util.js";

const fs = require("fs/promises");

const cardForm = document.getElementById("card-form");
const questionInput = document.getElementById("question-input");
const answerInput = document.getElementById("answer-input");
const mainButton = document.getElementById("main-btn");

let saveData;
const getSaveData = async () => {
    try {
        await fs.access("./save.json");
    } catch {
        saveData = { cards: [] };
    }

    if (!saveData) {
        saveData = JSON.parse(await fs.readFile("./save.json", "utf8"));
    }
};

getSaveData();

mainButton.addEventListener("click", () => {
    if (saveData.cards.length === 0) {
        showAlert("There are no cards, create some to start a session.");
        return;
    }

    location.href = "../session/index.html";
});

cardForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    saveData.cards.push({
        question: questionInput.value,
        answer: answerInput.value,
        canShowAt: null,
        correctCount: 0,
    });
    await fs.writeFile("./save.json", JSON.stringify(saveData));

    questionInput.value = "";
    answerInput.value = "";

    showAlert("Card created.");
});
