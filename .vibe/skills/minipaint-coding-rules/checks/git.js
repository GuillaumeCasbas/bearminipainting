/**
 * MiniPaint Git Rules Check
 * Verifies compliance with Git conventions (branches and commits).
 */

module.exports = {
  name: "Git Conventions",
  description: "Ensures branches and commits follow the project's conventions.",
  
  // Branch patterns
  branchPatterns: {
    feature: /^linear\/\d+-[a-z0-9-]+$/,
    bugfix: /^fix\/\d+-[a-z0-9-]+$/,
    refactor: /^refactor\/[a-z0-9-]+$/,
    main: /^main$/,
  },
  
  // Commit patterns
  commitPatterns: {
    feat: /^feat: \[Linear #\d+\].+$/,
    fix: /^fix: \[Linear #\d+\].+$/,
    test: /^test: \[Linear #\d+\].+$/,
    refactor: /^refactor: .+$/,
    docs: /^docs: .+$/,
    chore: /^chore: .+$/,
  },
  
  // Check branch name
  checkBranch(branchName) {
    const violations = [];
    
    for (const [type, pattern] of Object.entries(this.branchPatterns)) {
      if (pattern.test(branchName)) {
        return violations; // Valid branch
      }
    }
    
    violations.push(`❌ Branch "${branchName}" does not follow naming conventions. Expected: linear/[id]-description, fix/[id]-description, or refactor/[scope].`);
    return violations;
  },
  
  // Check commit message
  checkCommit(message) {
    const violations = [];
    
    for (const [type, pattern] of Object.entries(this.commitPatterns)) {
      if (pattern.test(message)) {
        return violations; // Valid commit
      }
    }
    
    violations.push(`❌ Commit "${message}" does not follow conventions. Expected: feat: [Linear #X] description, fix: [Linear #X] description, etc.`);
    return violations;
  },
  
  // Check a list of commits
  checkCommits(commits) {
    const violations = [];
    commits.forEach(commit => {
      const commitViolations = this.checkCommit(commit.message);
      violations.push(...commitViolations);
    });
    return violations;
  },
};

// Example usage
if (typeof require !== 'undefined' && require.main === module) {
  const skill = module.exports;
  
  // Test branch
  const branchName = process.argv[2];
  if (branchName) {
    const violations = skill.checkBranch(branchName);
    violations.forEach(v => console.log(v));
  }
  
  // Test commit
  const commitMessage = process.argv[3];
  if (commitMessage) {
    const violations = skill.checkCommit(commitMessage);
    violations.forEach(v => console.log(v));
  }
}
