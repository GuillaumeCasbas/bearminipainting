import LocalStorageEncouragementRepository from '../../../../src/adapters/persistence/localstorage/encouragement.repository';


describe('LocalStorageEncouragementRepository', () => {
  let repository: LocalStorageEncouragementRepository;

  beforeEach(() => {
    localStorage.clear();
    repository = new LocalStorageEncouragementRepository();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should save displayed message with timestamp', async () => {
    await repository.markAsDisplayed('enc-1');
    const cache = JSON.parse(localStorage.getItem('minipaint_encouragement_cache') || '{}');
    expect(cache['enc-1']).toBeDefined();
  });

  it('should return recently displayed messages (< 30 min)', async () => {
    await repository.markAsDisplayed('enc-1');
    const recentlyDisplayed = await repository.getRecentlyDisplayed();
    expect(recentlyDisplayed).toContain('enc-1');
  });

  it('should not return messages displayed > 30 min ago', async () => {
    // Save a message 31 minutes ago
    const oldTime = Date.now() - (31 * 60 * 1000);
    localStorage.setItem(
      'minipaint_encouragement_cache',
      JSON.stringify({ 'enc-1': oldTime })
    );

    const recentlyDisplayed = await repository.getRecentlyDisplayed();
    expect(recentlyDisplayed).not.toContain('enc-1');
  });

  it('should clean messages > 30 min old', async () => {
    // Save old and new messages
    const oldTime = Date.now() - (31 * 60 * 1000);
    localStorage.setItem(
      'minipaint_encouragement_cache',
      JSON.stringify({ 'enc-1': oldTime, 'enc-2': Date.now() })
    );

    await repository.cleanOldMessages();

    const cache = JSON.parse(localStorage.getItem('minipaint_encouragement_cache') || '{}');
    expect(cache['enc-1']).toBeUndefined();
    expect(cache['enc-2']).toBeDefined();
  });
});
