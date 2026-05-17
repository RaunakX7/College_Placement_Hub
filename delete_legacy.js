const fs = require("fs");
const path = require("path");

const targetDir = path.join(__dirname, "legacy_src");

function deleteRecursive(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = path.join(dirPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
    console.log(`✓ Deleted directory: ${dirPath}`);
  } else {
    console.log(`Directory ${dirPath} does not exist.`);
  }
}

try {
  deleteRecursive(targetDir);
  console.log("✓ Legacy code cleanup completed successfully.");
} catch (error) {
  console.error("Error during legacy code cleanup:", error);
}
