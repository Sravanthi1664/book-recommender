const { spawn } = require("child_process");
const path = require("path");

function recommend(title) {
  return new Promise((resolve, reject) => {
    // Use python3 from the environment
    const pythonPath = "python3";

    // Relative path to recommend.py inside the server folder
    const scriptPath = path.join(__dirname, "recommend.py");

    // Spawn Python process
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
        // Parse the JSON output from Python
        const result = JSON.parse(data);
        resolve(result);
      } catch (e) {
        reject("Failed to parse Python output: " + e.message);
      }
    });
  });
}

module.exports = recommend;
