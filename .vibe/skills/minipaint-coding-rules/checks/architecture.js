/**
 * MiniPaint Architecture Rules Check
 * Verifies compliance with Hexagonal Architecture.
 */

module.exports = {
  name: "Hexagonal Architecture Compliance",
  description: "Ensures Core, Adapters, and UI layers are properly separated.",
  
  // Rules to enforce
  rules: [
    {
      id: "CORE_NO_ADAPTERS_UI",
      name: "Core must not depend on Adapters or UI",
      paths: ["src/core/**"],
      forbiddenPatterns: [
        /from ['"]@adapters\//,
        /from ['"].*adapters\//,
        /from ['"]@ui\//,
        /from ['"].*ui\//,
        /localStorage/,
        /import.*React/,
        /import.*zustand/,
      ],
      error: (file, match) => {
        return `❌ [${file}] Core cannot depend on Adapters/UI. Found: ${match}`;
      },
    },
    {
      id: "ADAPTERS_IMPLEMENT_PORTS",
      name: "Adapters must implement Core ports",
      paths: ["src/adapters/**"],
      requiredPatterns: [
        /implements.*Repository/,
        /implements.*Port/,
      ],
      error: (file) => {
        return `⚠️ [${file}] Adapters should implement interfaces from core/ports/`;
      },
    },
    {
      id: "UI_NO_DIRECT_CORE",
      name: "UI must not depend on Core directly",
      paths: ["src/ui/**"],
      forbiddenPatterns: [
        /from ['"]@core\//,
        /from ['"].*core\//,
      ],
      error: (file, match) => {
        return `❌ [${file}] UI must use Adapters, not Core directly. Found: ${match}`;
      },
    },
    {
      id: "ADAPTERS_NO_BUSINESS_LOGIC",
      name: "Adapters must not contain business logic",
      paths: ["src/adapters/**"],
      forbiddenPatterns: [
        /if.*isValid/,
        /throw.*Error.*must be unique/,
        /getCompletionRate/,
      ],
      error: (file, match) => {
        return `❌ [${file}] Business logic belongs in Core, not Adapters. Found: ${match}`;
      },
    },
    {
      id: "DEPENDENCY_INJECTION",
      name: "Use cases must use dependency injection",
      paths: ["src/core/usecases/**"],
      requiredPatterns: [
        /constructor.*private.*Repository/,
        /constructor.*private.*Port/,
      ],
      error: (file) => {
        return `❌ [${file}] Use cases must receive dependencies via constructor injection.`;
      },
    },
  ],
  
  // Run checks (manual or automated)
  check(filePath, fileContent) {
    const violations = [];
    
    this.rules.forEach(rule => {
      rule.paths.forEach(pathPattern => {
        const pathRegex = new RegExp(pathPattern.replace(/\*/g, '.*').replace(/\//g, '/'));
        if (pathRegex.test(filePath)) {
          // Check forbidden patterns
          if (rule.forbiddenPatterns) {
            rule.forbiddenPatterns.forEach(pattern => {
              const match = fileContent.match(pattern);
              if (match) {
                violations.push(rule.error(filePath, match[0]));
              }
            });
          }
          // Check required patterns
          if (rule.requiredPatterns) {
            let hasMatch = false;
            rule.requiredPatterns.forEach(pattern => {
              if (fileContent.match(pattern)) {
                hasMatch = true;
              }
            });
            if (!hasMatch) {
              violations.push(rule.error(filePath));
            }
          }
        }
      });
    });
    
    return violations;
  },
};

// Example usage (for agents with Node.js access):
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
      } else if (file.endsWith('.ts') && !file.endsWith('.test.ts')) {
        const content = fs.readFileSync(filePath, 'utf8');
        const violations = skill.check(filePath, content);
        violations.forEach(v => console.log(v));
      }
    });
  }
  
  console.log('Checking architecture rules...\n');
  checkDirectory(srcDir);
}
