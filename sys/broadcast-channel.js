export class BroadcastChannel {
  postMessage(message) {
    this.onmessage(message);
  }
}
