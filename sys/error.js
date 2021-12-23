export class ErrorWouldBlock extends Error {
  constructor(message) {
    super(message);
    this.name = 'ErrorWouldBlock';
  }
}
