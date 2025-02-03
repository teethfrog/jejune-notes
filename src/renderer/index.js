/** Code for UI rendering, button clicks and more. (front-end logic) */

function openFile() {
    console.log('Renderer clicked openFileButton');
    window.electron.openFile().then(fileData => {
        if (fileData) {
            document.getElementById("textbox").innerHTML = fileData.content;
            document.getElementById("currentFilePath").innerText = fileData.path;
        } else {
            console.log('No file selected');
        }
    });
}

function saveFile() {
    const content = document.getElementById("textbox").innerHTML;
    const currentFilePath = document.getElementById("currentFilePath").innerText;
    if (currentFilePath) {
        console.log("path provided");
        const filePathString = currentFilePath.toString();
        window.electron.saveFile(content, filePathString);
    } else {
        console.log("path not provided");
        window.electron.saveFileAs(content);
    }
}

// Clears text area and current path.
function clearFile() {
    const content = document.getElementById("textbox");
    const currentFilePath = document.getElementById("currentFilePath");

    content.innerHTML = null;
    currentFilePath.innerText = null;
}

/**  document.getElementById('clear').addEventListener('click', clearFile);
document.getElementById('openFileButton').addEventListener('click', openFile);
document.getElementById('saveFileButton').addEventListener('click', saveFile); */

// Updates currentFilePath after file has been saved.
window.electron.onFileSaved((event, filePath) => {
    document.getElementById("currentFilePath").innerText = filePath;
});



document.addEventListener('keydown', function(event) {
    switch (true) {
        case event.ctrlKey && event.key === 's':
            event.preventDefault();
            saveFile();
            break;
        case event.ctrlKey && event.key === 'o':
            event.preventDefault();
            openFile();
            break;
        case event.ctrlKey && event.key === 'n':
            event.preventDefault();
            clearFile();
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

function closeWindow() {
    window.electron.closeWindow();
}

function minimizeWindow() {
    window.electron.minimizeWindow();
}

function toggleMaximizeWindow() {
    window.electron.toggleMaximizeWindow();
}

document.getElementById('closeButton').addEventListener('click', closeWindow);
document.getElementById('hideButton').addEventListener('click', minimizeWindow);
document.getElementById('maximizeButton').addEventListener('click', toggleMaximizeWindow);