/** Code for UI rendering, button clicks and more. (front-end logic) */

// opens File Browser
document.getElementById('openFileButton').addEventListener('click', async () => {
    console.log('Renderer clicked openFileButton');
    const fileData = await window.electron.openFile();
    if (fileData) {
        document.getElementById("textbox").innerHTML = fileData.content;
        document.getElementById("currentFilePath").innerText = fileData.path;
    } else {
        console.log('No file selected');
    }
});

// Saves a file (either to current path or as new file.)
document.getElementById('saveFileButton').addEventListener('click', async () => {
    const content = document.getElementById("textbox").innerHTML;
    const currentFilePath = document.getElementById("currentFilePath").innerText;
    if (currentFilePath) {
        console.log("path provided");
        const filePathString = currentFilePath.toString();
        await window.electron.saveFile(content, filePathString);

    } else {
        console.log("path not provided");
        await window.electron.saveFileAs(content);
    }
});
// Updates currentFilePath after file has been saved.
window.electron.onFileSaved((event, filePath) => {
    document.getElementById("currentFilePath").innerText = filePath;
});

// Clears text area and current path.
document.getElementById('clear').addEventListener('click', async () => {
    const content = document.getElementById("textbox");
    const currentFilePath = document.getElementById("currentFilePath");

    content.innerHTML = null;
    currentFilePath.innerText = null;
})

document.addEventListener('keydown', function(event) {
    switch (true) {
        case event.ctrlKey && event.key === 's':
            event.preventDefault();
            document.getElementById('saveFileButton').click();
            break;
        case event.ctrlKey && event.key === 'o':
            event.preventDefault();
            document.getElementById('openFileButton').click();
            break;
        case event.ctrlKey && event.key === 'n':
            event.preventDefault();
            document.getElementById('clear').click();
            break;
        case event.ctrlKey && event.key === 'w':
            event.preventDefault();
            console.log("hotkeys modal open");
    }
});

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('textbox').focus();
});

// Auto-save every minute
setInterval(async () => {
    const content = document.getElementById("textbox").innerHTML;
    const currentFilePath = document.getElementById("currentFilePath").innerText;
    if (currentFilePath) {
        console.log("Auto-saving to path provided");
        const filePathString = currentFilePath.toString();
        await window.electron.saveFile(content, filePathString);
    } else {
        console.log("No path provided, won't auto-save.")
    }
}, 60000);