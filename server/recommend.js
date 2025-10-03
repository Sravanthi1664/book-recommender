const { spawn } = require("child_process");
const path = require("path");

function recommend(title) {
  return new Promise((resolve, reject) => {
    const pythonPath = path.join("C:\\Users\\sivas\\miniconda3\\envs\\bookrec\\python.exe"); // your conda env python
    const py = spawn(pythonPath, ["recommend.py", title], { cwd: __dirname });

    let data = "";
    let error = "";

    py.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    py.stderr.on("data", (chunk) => {
      error += chunk.toString();
    });

    py.on("close", (code) => {
      if (code !== 0) return reject(error || "Python script failed");
      try {
        const result = JSON.parse(data);
        resolve(result);
      } catch (e) {
        reject("Failed to parse Python output");
      }
    });
  });
}

module.exports = recommend;

