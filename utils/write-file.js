const fs = require("fs");

const writeData = (data, filePath)=>{
    fs.writeFile(filePath, JSON.stringify(data), (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(`Data written to ${filePath}`);
      });
}

module.exports = {writeData}

