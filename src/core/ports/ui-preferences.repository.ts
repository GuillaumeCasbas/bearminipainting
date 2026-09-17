export interface UiPreferencesRepository {
  getHideDoneTodos(): Promise<boolean>;
  setHideDoneTodos(value: boolean): Promise<void>;
}
