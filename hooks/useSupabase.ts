'use client'

// src/hooks/useSupabase.ts
import { useState, useEffect } from 'react';
import { supabaseService } from '@/services/supabaseService';
import { toast } from '@/hooks/use-toast';
import type { ClientUI, PlatUI, CommandeUI } from '@/types/app';

interface UseSupabaseResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useSupabaseClients(): UseSupabaseResult<ClientUI[]> {
  const [data, setData] = useState<ClientUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const clients = await supabaseService.fetchClients();
      setData(clients);
      setError(null);
    } catch (err) {
      setError(err as Error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les clients",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
}

export function useSupabasePlats(): UseSupabaseResult<PlatUI[]> {
  const [data, setData] = useState<PlatUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const plats = await supabaseService.fetchPlats();
      setData(plats);
      setError(null);
    } catch (err) {
      setError(err as Error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les plats",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
}

export function useSupabaseCommandes(): UseSupabaseResult<CommandeUI[]> {
  const [data, setData] = useState<CommandeUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const commandes = await supabaseService.fetchCommandes();
      setData(commandes);
      setError(null);
    } catch (err) {
      setError(err as Error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les commandes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
}