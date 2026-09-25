export interface DefaultTodoConfig {
  readonly label: string;
  readonly order: number;
}

// Default todos configuration from CONTEXT.md
export const DEFAULT_TODOS: readonly DefaultTodoConfig[] = [
  { label: 'Assembly', order: 10 },
  { label: 'Primer', order: 20 },
  { label: 'Basecoat', order: 30 },
  { label: 'Effects', order: 40 },
  { label: 'Base', order: 50 },
  { label: 'Varnish', order: 60 },
];
