// loader.mjs
import { resolve as resolveTs } from 'ts-node/esm';
import * as tsNode from 'ts-node';
import { fileURLToPath } from 'url';
import { dirname, resolve as pathResolve } from 'path';
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const require = createRequire(import.meta.url);

register('ts-node/esm', pathToFileURL('./'));

// Create ts-node compiler
const tsNodeCompiler = tsNode.create({
  compilerOptions: {
    module: 'NodeNext',
    moduleResolution: 'NodeNext',
  },
});

export async function resolve(specifier, context, nextResolve) {
  const { parentURL = null } = context;

  // If the file ends with .ts or .mts, let ts-node handle it
  if (specifier.endsWith('.ts') || specifier.endsWith('.mts')) {
    return resolveTs(specifier, context, nextResolve);
  }

  // Let Node.js handle all other specifiers
  return nextResolve(specifier);
}

export async function load(url, context, nextLoad) {
  // If it's a TypeScript file
  if (url.endsWith('.ts') || url.endsWith('.mts')) {
    // Get the file path from the URL
    const filePath = fileURLToPath(url);
    
    // Read and transpile the file
    const { source } = tsNodeCompiler.compile(filePath, filePath);
    
    return {
      format: 'module',
      source,
    };
  }
  
  // Let Node.js handle all other URLs
  return nextLoad(url, context);
}

