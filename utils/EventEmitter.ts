export class TypedEventEmitter<Events extends Record<string, any>> {
  private listeners: { [K in keyof Events]?: ((arg: Events[K]) => void)[] } =
    {};

  addListener<K extends keyof Events>(
    event: K,
    listener: (arg: Events[K]) => void
  ) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]?.push(listener);

    return () => this.removeListener(event, listener);
  }

  removeListener<K extends keyof Events>(
    event: K,
    listenerToRemove: (arg: Events[K]) => void
  ) {
    if (!this.listeners[event]) return;

    this.listeners[event] = this.listeners[event]?.filter(
      (listener) => listener !== listenerToRemove
    );
  }

  emit<K extends keyof Events>(
    event: K,
    ...args: Events[K] extends undefined ? [] : [Events[K]]
  ) {
    if (!this.listeners[event]) return;

    this.listeners[event]?.forEach((listener) => {
      listener(args[0] as Events[K]);
    });
  }
}
