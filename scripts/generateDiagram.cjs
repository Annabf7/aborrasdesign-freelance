const fs = require('fs');
const path = require('path');

// Directori base del projecte
const COMPONENTS_DIR = path.join(__dirname, '../src');
const OUTPUT_FILE = path.join(__dirname, 'component-diagram.puml');

// Funció per llegir recursivament tots els fitxers d'un directori
function getAllFiles(dir, extension = '.jsx') {
  let files = [];
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      files = files.concat(getAllFiles(filePath, extension));
    } else if (file.endsWith(extension)) {
      files.push(filePath);
    }
  });
  return files;
}

// Funció per analitzar un fitxer i identificar els components importats
function analyzeComponent(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const componentName = path.basename(filePath, '.jsx');
  const imports = [...content.matchAll(/import\s+.*?from\s+['"](.*?)['"]/g)].map(match => {
    const importPath = match[1];
    if (importPath.startsWith('.')) {
      return path.basename(importPath); // Nom del fitxer importat
    }
    return null;
  }).filter(Boolean);
  return { componentName, imports };
}

// Generar el diagrama en format PlantUML
function generateDiagram(components) {
  let diagram = '@startuml Aborrasdesign\n\nskinparam rectangle {\n  BackgroundColor #333\n  BorderColor #d7b46a\n  FontColor #d7b46a\n}\n\n';

  // Crear un set per evitar definicions duplicades
  const definedComponents = new Set();

  // Definir els rectangles primer
  components.forEach(({ componentName }) => {
    if (!definedComponents.has(componentName)) {
      diagram += `rectangle "${componentName}" as ${componentName}\n`;
      definedComponents.add(componentName);
    }
  });

  diagram += '\n';

  // Ara definir les relacions
  components.forEach(({ componentName, imports }) => {
    imports.forEach(imported => {
      if (definedComponents.has(imported)) {
        diagram += `${componentName} --> ${imported}\n`;
      }
    });
  });

  diagram += '\n@enduml';
  return diagram;
}

// Flux principal
function main() {
  const files = getAllFiles(COMPONENTS_DIR);
  const components = files.map(analyzeComponent);
  const diagram = generateDiagram(components);
  fs.writeFileSync(OUTPUT_FILE, diagram, 'utf-8');
  console.log(`Diagrama generat correctament a: ${OUTPUT_FILE}`);
}

main();
