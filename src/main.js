const { app, BrowserWindow, screen, ipcMain } = require("electron");
const path = require("path");

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        fullscreen: false,
    });

    win.loadFile("./render/menu/index.html");

    win.on("close", () => {
        pop.close();
    });

    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    const pop = new BrowserWindow({
        width: 400,
        height: 80,
        x: width - 400,
        y: height - 80,
        alwaysOnTop: true,
        frame: false,
        skipTaskbar: true,
        autoHideMenuBar: true,
        transparent: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        fullscreen: false,
    });

    pop.loadFile("./render/popup/popup.html");

    ipcMain.on("createPopup", (event, arg) => {
        pop.webContents.send("createPopup2", arg);
    });
};

app.once("ready", () => {
    createWindow();
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
