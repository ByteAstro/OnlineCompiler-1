const option = document.getElementById("autoSizingSelect");
const run = document.getElementById("run");
const input = document.getElementById("input");
const output = document.getElementById("output");
let code;

const editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    // mode: "text/x-c++src",
    theme: "dracula",
    lineNumbers: true,
    autoCloseBrackets: true,
})
const width = window.innerWidth;
editor.setSize(0.7 * width, "500");

option.addEventListener("change", () => {
    if (option.value === "Java") {
        editor.setOption("mode", "text/x-java")
    }
    else if (option.value === "Cpp") {
        editor.setOption("mode", "text/x-c++src")
    }
    else if (option.value === "Python") {
        editor.setOption("mode", "text/x-python")
    }
})

run.addEventListener('click', async () => {
    code = {
        code: editor.getValue(),
        input: input.value,
        lang: option.value
    }
    const oData = await fetch("http://localhost:4500/compile", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(code)
    })
    const d = await oData.json();
    output.value = d.output;
})