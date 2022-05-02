const { ipcRenderer } = require("electron")

export const showAlert = (text) => {
    ipcRenderer.send("createPopup",text);
};
