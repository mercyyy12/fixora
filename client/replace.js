const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src');

const replacements = [
  { regex: /text-gray-900 dark:text-white/g, replacement: 'text-ink' },
  { regex: /text-gray-900/g, replacement: 'text-ink' },
  { regex: /text-gray-800 dark:text-gray-100/g, replacement: 'text-ink' },
  { regex: /text-gray-800 dark:text-gray-200/g, replacement: 'text-ink' },
  { regex: /text-gray-800/g, replacement: 'text-ink' },
  { regex: /text-gray-700 dark:text-gray-200/g, replacement: 'text-ink' },
  { regex: /text-gray-700 dark:text-gray-300/g, replacement: 'text-ink-2' },
  { regex: /text-gray-700/g, replacement: 'text-ink-2' },
  { regex: /text-gray-600 dark:text-gray-200/g, replacement: 'text-ink-2' },
  { regex: /text-gray-600 dark:text-gray-300/g, replacement: 'text-ink-2' },
  { regex: /text-gray-600 dark:text-gray-400/g, replacement: 'text-ink-2' },
  { regex: /text-gray-600/g, replacement: 'text-ink-2' },
  { regex: /text-gray-500 dark:text-gray-300/g, replacement: 'text-ink-2' },
  { regex: /text-gray-500 dark:text-gray-400/g, replacement: 'text-ink-2' },
  { regex: /text-gray-500/g, replacement: 'text-ink-2' },
  { regex: /text-gray-400 dark:text-gray-500/g, replacement: 'text-ink-3' },
  { regex: /text-gray-400/g, replacement: 'text-ink-3' },
  { regex: /text-gray-300 dark:text-gray-600/g, replacement: 'text-ink-3' },
  { regex: /bg-white dark:bg-gray-900/g, replacement: 'bg-surface' },
  { regex: /bg-white dark:bg-gray-800/g, replacement: 'bg-surface' },
  { regex: /bg-gray-50 dark:bg-gray-900/g, replacement: 'bg-canvas-alt' },
  { regex: /bg-gray-50 dark:bg-gray-800/g, replacement: 'bg-canvas-alt' },
  { regex: /bg-gray-100 dark:bg-gray-800/g, replacement: 'bg-canvas-alt' },
  { regex: /bg-gray-100 dark:bg-gray-900/g, replacement: 'bg-canvas-alt' },
  { regex: /bg-gray-50/g, replacement: 'bg-canvas' },
  { regex: /bg-brand-50/g, replacement: 'bg-brand/10' },
  { regex: /border-gray-200 dark:border-gray-800/g, replacement: 'border-outline' },
  { regex: /border-gray-200 dark:border-gray-700/g, replacement: 'border-outline' },
  { regex: /border-gray-100 dark:border-gray-800/g, replacement: 'border-outline' },
  { regex: /border-gray-200/g, replacement: 'border-outline' },
  { regex: /border-gray-300/g, replacement: 'border-outline' },
  { regex: /text-brand-600 dark:text-brand-400/g, replacement: 'text-brand hover:text-brand-hover' }
];

function processDir(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      replacements.forEach(({ regex, replacement }) => {
        content = content.replace(regex, replacement);
      });
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDir(dir);
console.log('Done replacing tokens.');
