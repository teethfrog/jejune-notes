/** Setup code & Anything related to application's windows and background operations (e.g. file system access, handling app events.)  */

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, '..', 'preload', 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.loadURL(`file://${path.join(__dirname, '../renderer/index.html')}`);
}

ipcMain.handle('dialog:openFile', async () => {
    console.log('IPC Request received to open file');
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Text Files', extensions: ['txt', 'md'] }]
    });

    if (result.canceled) {
        return null;
    }

    const filePath = result.filePaths[0];
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return { path: filePath, content: fileContent };
});

ipcMain.handle('dialog:saveFile', async (event, content, filePath) => {
    console.log('IPC Request received to save file');
    console.log(filePath);
    fs.writeFileSync(filePath, content);
    return { filePath };
});

ipcMain.handle('dialog:saveFileAs', async (event, content) => {
    const result = await dialog.showSaveDialog({
        filters: [{ name: 'Text Files', extensions: ['txt', 'md'] }]
    });

    if (result.canceled) {
        return null;
    }

    fs.writeFileSync(result.filePath, content);
    event.sender.send('file-saved', result.filePath);
    return { filePath: result.filePath };
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});