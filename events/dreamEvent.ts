type DreamEvents = {
  dreamCreated: undefined;
  dreamUpdated: { id: string };
  dreamDeleted: { id: string };
};

export const dreamEventEmitter = new TypedEventEmitter<DreamEvents>();
