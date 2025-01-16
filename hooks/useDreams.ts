import { dreamEventEmitter } from "@/events/dreamEvent";
import { useEffect, useState } from "react";
import { database } from "../db";
import type { Dream, NewDream } from "../db/schema";

export function useDreams() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(0);
  const pageSize = 20;

  const loadDreams = async (
    search?: string,
    date?: string,
    favorite?: boolean
  ) => {
    try {
      setLoading(true);
      const result = await database.getDreams({
        limit: pageSize,
        offset: 0,
        search,
        date,
        favorite,
      });
      setDreams(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setPage(1);
      setLoading(false);
    }
  };

  const loadDream = async (id: string) => {
    return database.getDreamById(id);
  };

  const getAllDreamsDates = () => {
    return database.getAllDreamsDates();
  };

  const loadMoreDreams = async () => {
    try {
      setLoading(true);
      const result = await database.getDreams({
        offset: page * pageSize,
        limit: pageSize,
      });
      setDreams((old) => [...old, ...result]);
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
      dreamEventEmitter.emit("dreamUpdated", { id, dream });
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

  const toggleFavoriteDream = async (id: string) => {
    try {
      const dream = database.getDreamById(id);
      if (dream.favorite) {
        await updateDream(id, { favorite: 0 });
      } else {
        await updateDream(id, { favorite: 1 });
      }
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

  useEffect(() => {
    const listener = async ({ id }: { id: string }) => {
      setDreams((old) => old.filter((it) => it.id !== id));
    };

    dreamEventEmitter.addListener("dreamDeleted", listener);

    return () => {
      dreamEventEmitter.removeListener("dreamDeleted", listener);
    };
  }, []);

  useEffect(() => {
    const listener = async ({
      id,
      dream,
    }: {
      id: string;
      dream: Partial<Dream>;
    }) => {
      setDreams((old) =>
        old.map((it) => (it.id === id ? { ...it, ...dream } : it))
      );
    };

    dreamEventEmitter.addListener("dreamUpdated", listener);

    return () => {
      dreamEventEmitter.removeListener("dreamUpdated", listener);
    };
  }, []);

  useEffect(() => {
    if (page > 0) loadMoreDreams();
  }, [page]);

  return {
    dreams,
    loading,
    error,
    addDream,
    updateDream,
    toggleFavoriteDream,
    getAllDreamsDates,
    deleteDream,
    loadDream,
    setPage,
    refreshDreams: loadDreams,
  };
}
