const fs = require('fs/promises');
const path = require('path');

const distFolderPath = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');

const outputHtmlPath = path.join(distFolderPath, 'index.html');
const outputCssPath = path.join(distFolderPath, 'style.css');
const outputAssetsPath = path.join(distFolderPath, 'assets');

async function buildHtml() {
  let templateContent = await fs.readFile(templatePath, 'utf8');
  const tagRegex = /{{\s*([\w-]+)\s*}}/g;
  let match;

  while ((match = tagRegex.exec(templateContent)) !== null) {
    const tag = match[1];
    const componentFile = path.join(componentsPath, `${tag}.html`);
    try {
      const componentContent = await fs.readFile(componentFile, 'utf8');
      templateContent = templateContent.replace(match[0], componentContent);
    } catch {
      console.warn(`Component not found for tag: ${tag}`);
    }
  }

  await fs.writeFile(outputHtmlPath, templateContent, 'utf8');
}

async function mergeStyles() {
  await fs.mkdir(distFolderPath, { recursive: true });
  const files = await fs.readdir(stylesPath, { withFileTypes: true });

  const allStyles = [];
  for (const file of files) {
    const fileExt = path.extname(file.name).slice(1);
    const filePath = path.join(stylesPath, file.name);
    if (file.isFile() && fileExt === 'css') {
      const fileContent = await fs.readFile(filePath, 'utf8');
      allStyles.push(fileContent);
    }
  }

  await fs.writeFile(outputCssPath, allStyles.join('\n'), 'utf8');
}

async function copyDir(initialFolderPath, outputFolderPath) {
  await fs.mkdir(outputFolderPath, { recursive: true });

  const initialFiles = await fs.readdir(initialFolderPath, {
    withFileTypes: true,
  });

  for (const file of initialFiles) {
    const initialFilePath = path.join(initialFolderPath, file.name);
    const copiedFilePath = path.join(outputFolderPath, file.name);

    if (file.isDirectory()) {
      await copyDir(initialFilePath, copiedFilePath);
    } else {
      await fs.copyFile(initialFilePath, copiedFilePath);
    }
  }
}

async function buildPage() {
  try {
    await fs.mkdir(distFolderPath, { recursive: true });
    await Promise.all([
      buildHtml(),
      mergeStyles(),
      copyDir(assetsPath, outputAssetsPath),
    ]);
    console.log('Page has been built successfully!');
  } catch (error) {
    console.error('Error building page:', error);
  }
}

buildPage();
