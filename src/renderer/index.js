/** Code for UI rendering, button clicks and more. (front-end logic) */

function updateLineNumbers() {
    const element = document.getElementById("textbox");
    const range = document.createRange();
    range.selectNodeContents(element);
    const rects = Array.from(range.getClientRects());

    rects.sort((a, b) => a.top - b.top);

    const uniqueLines = [];
    let lastTop = null;

    for (const rect of rects) {
        if (lastTop === null || Math.abs(rect.top - lastTop) > 2) {
            uniqueLines.push(rect.top);
            lastTop = rect.top;
        }
    }

    const lineNumbers = ["1", ...uniqueLines.slice(1).map((_, index) => index + 2)].join("\n");
    document.getElementById("lineCounter").innerText = lineNumbers;
}


document.getElementById("textbox").addEventListener("input", updateLineNumbers);
document.getElementById("textbox").addEventListener("keydown", updateLineNumbers);
document.getElementById("textbox").addEventListener("paste", updateLineNumbers);


function openFile() {
    console.log('Renderer clicked openFileButton');
    window.electron.openFile().then(fileData => {
        if (fileData) {
            document.getElementById("textbox").innerHTML = fileData.content;
            document.getElementById("currentFilePath").innerText = fileData.path;
            updateLineNumbers();
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

function saveFileAs() {
    const content = document.getElementById("textbox").innerHTML;
    console.log("path not provided");
    window.electron.saveFileAs(content);
}

// Clears text area and current path.
function clearFile() {
    const content = document.getElementById("textbox");
    const currentFilePath = document.getElementById("currentFilePath");

    content.innerHTML = null;
    currentFilePath.innerText = null;
    updateLineNumbers();
}

/**  document.getElementById('clear').addEventListener('click', clearFile);
document.getElementById('openFileButton').addEventListener('click', openFile);
document.getElementById('saveFileButton').addEventListener('click', saveFile); */

// Updates currentFilePath after file has been saved.
window.electron.onFileSaved((event, filePath) => {
    document.getElementById("currentFilePath").innerText = filePath;
});



document.addEventListener('keydown', function (event) {
    switch (true) {
        case event.ctrlKey && event.key === 's':
            event.preventDefault();
            saveFile();
            break;
        case event.ctrlKey && event.shiftKey && event.key === 'S':
            event.preventDefault();
            saveFileAs();
            break;
        case event.ctrlKey && event.key === 'o':
            event.preventDefault();
            openFile();
            break;
        case event.ctrlKey && event.key === 'n':
            event.preventDefault();
            clearFile();
            break;
        case event.ctrlKey && event.key === '/':
            event.preventDefault();
            const modal = document.getElementById('modal');
            if (modal.classList.contains('visible')) {
                modal.classList.remove('visible'); 
            } else {
                modal.classList.add('visible'); 
            }
            document.getElementById('textbox').blur();
            break;
        case event.key === 'Escape':
            const modalEscape = document.getElementById('modal');
            if (modalEscape.classList.contains('visible')) {
                modalEscape.classList.remove('visible');  
            }
            break;
        case event.ctrlKey && event.key === 'f':
            console.log("ctrl + f");
            event.preventDefault();
            const searchModal = document.getElementById('searchModal');
            if (searchModal.classList.contains('visible')) {
                searchModal.classList.remove('visible');
            } else {
                searchModal.classList.add('visible'); 
                document.getElementById('searchInput').focus();
            }

    }
});

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('textbox').focus();
});

/**   Auto-save every minute
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
}, 60000); */

function closeWindow() {
    window.electron.closeWindow();
}

function minimizeWindow() {
    window.electron.minimizeWindow();
}

function toggleMaximizeWindow() {
    window.electron.toggleMaximizeWindow();

}

const currentFilePath = document.getElementById('currentFilePath');

function checkWidthAndAnimate() {
    if (window.innerWidth < 750) {
        currentFilePath.classList.add('invisible');
    } else {
        currentFilePath.classList.remove('invisible');
    }
}


document.getElementById('closeButton').addEventListener('click', closeWindow);
document.getElementById('hideButton').addEventListener('click', minimizeWindow);
document.getElementById('maximizeButton').addEventListener('click', toggleMaximizeWindow);
window.addEventListener('resize', updateLineNumbers);
window.addEventListener('resize', checkWidthAndAnimate);

document.addEventListener('DOMContentLoaded', function () {
    const editor = document.querySelector('.editor');
    const lineCounter = document.querySelector('.lineCounter');

    editor.addEventListener('scroll', function () {
        lineCounter.scrollTop = editor.scrollTop;
    });
});

let matchIndex = -1;
let matches = [];

function searchWord() {
    const searchInput = document.getElementById("searchInput").value.trim();
    const textbox = document.getElementById("textbox");
    const searchResults = document.getElementById("searchResults");

    const originalContent = textbox.innerHTML.replace(/<span class="highlight">(.*?)<\/span>/gi, "$1");

    if (searchInput === "") {
        textbox.innerHTML = originalContent;
        searchResults.innerText = "0";
        matchIndex = -1;
        matches = [];
        return;
    }


    const escapedInput = searchInput.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escapedInput, "gi");

    const result = originalContent.match(regex);
    const resultSize = result ? result.length : 0;

    if (resultSize > 0) {
        const highlightedContent = originalContent.replace(regex, match => `<span class="highlight">${match}</span>`);
        textbox.innerHTML = highlightedContent;
    } else {
        textbox.innerHTML = originalContent; 
    }

    searchResults.innerText = resultSize;
}


document.getElementById("searchInput").addEventListener("input", searchWord);
