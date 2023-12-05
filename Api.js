const express = require("express");
const bodyParser = require("body-parser");
const compiler = require('compilex')
const compilerOptions = { status: true }
const PORT = process.env.PORT || 4500;
const path = require("path")

compiler.init(compilerOptions);
const app = express();
app.use("/codemirror", express.static(path.join(__dirname, "codemirror")))
app.use("/script.js", express.static(path.join(__dirname, "script.js")))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false,
}));

app.get('/', (req, res) => {
    compiler.flush(() => {
        console.log("Deleted");
    })
    res.sendFile(path.join(__dirname, "index.html"))
})

app.post("/compile", (req, res) => {
    const code = req.body.code;
    const input = req.body.input;
    const lang = req.body.lang;

    try {
        if (lang === "Cpp") {
            if (!input) {
                var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } }; // (uses g++ command to compile )
                // var envData = { OS: "linux", cmd: "gcc" }; // ( uses gcc command to compile )
                compiler.compileCPP(envData, code, function (data) {
                    res.send((data.output) ? data : { output: "error" });
                });
            } else {
                var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } }; // (uses g++ command to compile )
                // var envData = { OS: "linux", cmd: "gcc" }; // ( uses gcc command to compile )
                compiler.compileCPPWithInput(envData, code, input, function (data) {
                    res.send((data.output) ? data : { output: "error" });
                });
            }
        }
        else if (lang === "Java") {
            if (!input) {
                var envData = { OS: "windows" };
                // var envData = { OS: "linux" }; // (Support for Linux in Next version)
                compiler.compileJava(envData, code, function (data) {
                    res.send((data.output) ? data : { output: "error" });
                });
            } else {
                var envData = { OS: "windows" };
                // var envData = { OS: "linux" }; // (Support for Linux in Next version)
                compiler.compileJavaWithInput(envData, code, input, function (data) {
                    res.send((data.output) ? data : { output: "error" });
                });
            }
        }
        else if (lang === "Python") {
            if (!input) {
                var envData = { OS: "windows" };
                // var envData = { OS: "linux" };
                compiler.compilePython(envData, code, function (data) {
                    res.send((data.output) ? data : { output: "error" });
                });
            } else {
                var envData = { OS: "windows" };
                // var envData = { OS: "linux" };
                compiler.compilePythonWithInput(envData, code, input, function (data) {
                    res.send((data.output) ? data : { output: "error" });
                });
            }
        }
    } catch (error) {
        console.log("error: ", error);
    }
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})