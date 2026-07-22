import { CodeNotUniqueError } from '../../../src/core/errors/project.errors';

describe('CodeNotUniqueError', () => {
  it('should create error with code property', () => {
    const code = 'DUPLICATE-001';
    const error = new CodeNotUniqueError(code);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(CodeNotUniqueError);
    expect(error.code).toBe(code);
    expect(error.name).toBe('CodeNotUniqueError');
    expect(error.message).toContain(code);
  });

  it('should have readonly code property', () => {
    const error = new CodeNotUniqueError('TEST-001');

    // Attempt to modify should not work (TypeScript will catch this at compile time)
    // This test verifies the property exists and is accessible
    expect(error.code).toBe('TEST-001');
    
    // Verify it's a string
    expect(typeof error.code).toBe('string');
  });

  it('should include code in error message', () => {
    const code = 'UNIQUE-CODE';
    const error = new CodeNotUniqueError(code);

    expect(error.message).toContain(code);
    expect(error.message).toContain('not unique');
  });
});
