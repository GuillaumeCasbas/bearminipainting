/**
 * MiniPaint Naming Rules Check
 * Verifies compliance with naming conventions.
 */

const FILE_PATTERN = /^[a-z0-9-]+\.tsx?$/;
const CLASS_PATTERN = /^export class [A-Z][a-zA-Z0-9]+/;
const INTERFACE_PATTERN = /^export interface [A-Z][a-zA-Z0-9]+/;
const FUNCTION_PATTERN = /^\s*(public\s+)?(async\s+)?[a-z][a-zA-Z0-9]+/;
const CONSTANT_PATTERN = /^export const [A-Z_]+/;
const VARIABLE_PATTERN = /^\s*(public|private|const|let)\s+[a-z][a-zA-Z0-9]+/;

module.exports = {
  name: "Naming Conventions",
  description: "Ensures all names follow the project's conventions.",
  
  rules: [
    {
      id: "FILE_KEBAB_CASE",
      name: "Files must be kebab-case.ts",
      pattern: FILE_PATTERN,
      error: (filePath) => {
        return `❌ [${filePath}] Files must be in kebab-case (e.g., 'create-projet.usecase.ts').`;
      },
    },
    {
      id: "CLASS_PASCAL_CASE",
      name: "Classes must be PascalCase",
      pattern: CLASS_PATTERN,
      error: (filePath, match) => {
        return `❌ [${filePath}] Class name must be PascalCase. Found: ${match}`;
      },
    },
    {
      id: "INTERFACE_PASCAL_CASE",
      name: "Interfaces must be PascalCase",
      pattern: INTERFACE_PATTERN,
      error: (filePath, match) => {
        return `❌ [${filePath}] Interface name must be PascalCase. Found: ${match}`;
      },
    },
    {
      id: "FUNCTION_CAMEL_CASE",
      name: "Functions must be camelCase",
      pattern: FUNCTION_PATTERN,
      error: (filePath, match) => {
        return `❌ [${filePath}] Function name must be camelCase. Found: ${match}`;
      },
    },
    {
      id: "CONSTANT_UPPER_SNAKE_CASE",
      name: "Constants must be UPPER_SNAKE_CASE",
      pattern: CONSTANT_PATTERN,
      error: (filePath, match) => {
        return `❌ [${filePath}] Constant name must be UPPER_SNAKE_CASE. Found: ${match}`;
      },
    },
    {
      id: "VARIABLE_CAMEL_CASE",
      name: "Variables must be camelCase",
      pattern: VARIABLE_PATTERN,
      error: (filePath, match) => {
        return `❌ [${filePath}] Variable name must be camelCase. Found: ${match}`;
      },
    },
  ],
  
  // Check a single file
  check(filePath, fileContent) {
    const violations = [];
    
    // Check file name
    const fileName = filePath.split('/').pop();
    if (!FILE_PATTERN.test(fileName)) {
      violations.push(this.rules[0].error(filePath));
    }
    
    // Check content for other rules
    const lines = fileContent.split('\n');
    lines.forEach((line, lineNumber) => {
      this.rules.slice(1).forEach(rule => {
        if (rule.pattern.test(line)) {
          const match = line.match(rule.pattern);
          if (match && match[0]) {
            // Extract the name to check
            const nameMatch = line.match(/(class|interface|function|const)\s+([a-zA-Z_0-9]+)/);
            if (nameMatch) {
              const name = nameMatch[2];
              const ruleId = rule.id;
              
              if (ruleId === "CLASS_PASCAL_CASE" && !/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
                violations.push(rule.error(filePath, name));
              } else if (ruleId === "INTERFACE_PASCAL_CASE" && !/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
                violations.push(rule.error(filePath, name));
              } else if (ruleId === "CONSTANT_UPPER_SNAKE_CASE" && !/^[A-Z_]+$/.test(name)) {
                violations.push(rule.error(filePath, name));
              } else if ((ruleId === "FUNCTION_CAMEL_CASE" || ruleId === "VARIABLE_CAMEL_CASE") && !/^[a-z][a-zA-Z0-9]*$/.test(name)) {
                violations.push(rule.error(filePath, name));
              }
            }
          }
        }
      });
    });
    
    return violations;
  },
};

// Example usage
if (typeof require !== 'undefined' && require.main === module) {
  const fs = require('fs');
  const path = require('path');
  
  const skill = module.exports;
  const srcDir = path.join(__dirname, '../../../src');
  
  function checkDirectory(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        checkDirectory(filePath);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        const content = fs.readFileSync(filePath, 'utf8');
        const violations = skill.check(filePath, content);
        violations.forEach(v => console.log(v));
      }
    });
  }
  
  console.log('Checking naming rules...\n');
  checkDirectory(srcDir);
}
