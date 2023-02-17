const fs = require('fs');

async function readJSONFile(filePath) {
  try {
    const data = await fs.promises.readFile(filePath);
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
    throw error;
  }
}

module.exports = readJSONFile;
