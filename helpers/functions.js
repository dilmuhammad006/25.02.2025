const fs = require(`node:fs`);

const readFile = (path) => {
  try {
    const data = fs.readFileSync(path, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log("error reading file", error.message);
    return null;
  }
};

const writeFile = (path, data) =>{
    try {
        fs.writeFileSync(path, JSON.stringify(data, null, 4))
    } catch (error) {
        console.log("error while writeing file: ", error.message)
        return null
    }
}

module.exports = {readFile, writeFile}