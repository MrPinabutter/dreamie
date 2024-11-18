import { Dream } from "@/db/schema";
import { TypedEventEmitter } from "@/utils/EventEmitter";

type DreamEvents = {
  dreamCreated: undefined;
  dreamUpdated: { id: string, dream: Partial<Dream> };
  dreamDeleted: { id: string };
};

export const dreamEventEmitter = new TypedEventEmitter<DreamEvents>();
