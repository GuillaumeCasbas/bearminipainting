export class EncouragementMessage {
  readonly id: string;
  readonly text: string;

  constructor(id: string, text: string) {
    this.id = id;
    this.text = text;
  }
}
