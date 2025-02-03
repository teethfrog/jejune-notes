/** Safely exposing APIs to the renderer. */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    saveFile: (content, filePath) => ipcRenderer.invoke('dialog:saveFile', content, filePath),
    saveFileAs: (content) => ipcRenderer.invoke('dialog:saveFileAs', content),
    onFileSaved: (callback) => ipcRenderer.on('file-saved', callback)
});