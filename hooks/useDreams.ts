import { dreamEventEmitter } from "@/events/dreamEvent";
import { useEffect, useState } from "react";
import { database } from "../db";
import type { Dream, NewDream } from "../db/schema";

export function useDreams() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadDreams = async () => {
    try {
      setLoading(true);
      const result = await database.getDreams();
      setDreams(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const addDream = async (dream: Omit<NewDream, "createdAt" | "updatedAt">) => {
    try {
      await database.createDream(dream);
      dreamEventEmitter.emit("dreamCreated");
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateDream = async (
    id: string,
    dream: Partial<Omit<NewDream, "id">>
  ) => {
    try {
      await database.updateDream(id, dream);
      dreamEventEmitter.emit("dreamUpdated", { id });
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const deleteDream = async (id: string) => {
    try {
      await database.deleteDream(id);
      dreamEventEmitter.emit("dreamDeleted", { id });
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  useEffect(() => {
    loadDreams();
  }, []);

  useEffect(() => {
    const listener = async () => {
      await loadDreams();
    };

    dreamEventEmitter.addListener("dreamCreated", listener);

    return () => {
      dreamEventEmitter.removeListener("dreamCreated", listener);
    };
  }, []);

  return {
    dreams,
    loading,
    error,
    addDream,
    updateDream,
    deleteDream,
    refreshDreams: loadDreams,
  };
}
