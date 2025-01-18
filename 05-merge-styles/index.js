const fs = require('fs/promises');
const path = require('path');

async function mergeStyles() {
  const distFolderPath = path.join(__dirname, 'project-dist');
  const stylesFolderPath = path.join(__dirname, 'styles');
  const outputFile = path.join(distFolderPath, 'bundle.css');

  try {
    await fs.mkdir(distFolderPath, { recursive: true });
    const files = await fs.readdir(stylesFolderPath, { withFileTypes: true });

    const allStyles = [];
    for (const file of files) {
      const fileExt = path.extname(file.name).slice(1);
      const filePath = path.join(stylesFolderPath, file.name);
      if (file.isFile() && fileExt === 'css') {
        const fileContent = await fs.readFile(filePath, 'utf8');
        allStyles.push(fileContent);
      }
    }

    await fs.writeFile(outputFile, allStyles.join('\n'), 'utf8');

    console.log('Styles have been merged');
  } catch (error) {
    console.error('Error merging styles:', error);
  }
}

mergeStyles();
