const fs = require('fs/promises');
const path = require('path');

async function copyDir() {
  const initialFolder = path.join(__dirname, 'files');
  const finalFolder = path.join(__dirname, 'files-copy');

  try {
    await fs.mkdir(finalFolder, { recursive: true });

    // Delete all files in files-copy before copy process
    const copiedFiles = await fs.readdir(finalFolder, { withFileTypes: true });
    for (const file of copiedFiles) {
      const copiedFilePath = path.join(finalFolder, file.name);
      await fs.unlink(copiedFilePath);
    }

    const initialFiles = await fs.readdir(initialFolder, {
      withFileTypes: true,
    });
    for (const file of initialFiles) {
      const initialFilePath = path.join(initialFolder, file.name);
      const copiedFilePath = path.join(finalFolder, file.name);

      await fs.copyFile(initialFilePath, copiedFilePath);
    }

    console.log('Directory has been copied.');
  } catch (error) {
    console.error('Error copying directory:', error);
  }
}

copyDir();
