const { spawn } = require("child_process");
const path = require("path");

function recommend(title) {
  return new Promise((resolve, reject) => {
    // Use generic Python installed on the server
    const pythonPath = "python3";

    // Use relative path to recommend.py
    const scriptPath = path.join(__dirname, "recommend.py");

    const py = spawn(pythonPath, [scriptPath, title]);

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
