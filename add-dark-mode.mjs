import fs from 'fs';
import path from 'path';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  const replacements = {
    'bg-white': 'bg-white dark:bg-gray-900',
    'bg-gray-50': 'bg-gray-50 dark:bg-gray-950',
    'bg-gray-100': 'bg-gray-100 dark:bg-gray-800',
    'text-gray-900': 'text-gray-900 dark:text-white',
    'text-gray-800': 'text-gray-800 dark:text-gray-100',
    'text-gray-700': 'text-gray-700 dark:text-gray-200',
    'text-gray-600': 'text-gray-600 dark:text-gray-300',
    'text-gray-500': 'text-gray-500 dark:text-gray-400',
    'border-gray-50': 'border-gray-50 dark:border-gray-800',
    'border-gray-100': 'border-gray-100 dark:border-gray-800',
    'border-gray-200': 'border-gray-200 dark:border-gray-700',
    'bg-blue-50': 'bg-blue-50 dark:bg-blue-900/20',
    'bg-red-50': 'bg-red-50 dark:bg-red-900/20',
    'bg-green-50': 'bg-green-50 dark:bg-green-900/20',
    'bg-rose-50': 'bg-rose-50 dark:bg-rose-900/20',
    'bg-emerald-50': 'bg-emerald-50 dark:bg-emerald-900/20',
    'bg-indigo-50': 'bg-indigo-50 dark:bg-indigo-900/20',
    'bg-purple-50': 'bg-purple-50 dark:bg-purple-900/20',
    'bg-amber-50': 'bg-amber-50 dark:bg-amber-900/20',
  };

  let modified = false;

  for (const [key, value] of Object.entries(replacements)) {

    const regex = new RegExp(`\\b${key}\\b`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, value);
      modified = true;
    }
  }

  if (modified) {

    content = content.replace(/dark:bg-gray-900 dark:bg-gray-[0-9]+/g, (match) => {
      return match.split(' ')[1]; 
    });
    content = content.replace(/dark:text-white dark:text-white/g, 'dark:text-white');
    content = content.replace(/dark:bg-gray-900 dark:bg-gray-900/g, 'dark:bg-gray-900');
    content = content.replace(/dark:bg-gray-950 dark:bg-gray-900/g, 'dark:bg-gray-900');
    
    fs.writeFileSync(filePath, content);
    console.log(`Modified ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkDir(filePath);
    } else if (filePath.endsWith('.tsx')) {
      processFile(filePath);
    }
  }
}

walkDir('./src');
