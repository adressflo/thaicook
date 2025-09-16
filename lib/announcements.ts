// lib/announcements.ts
import { supabase } from './supabase';

export interface Announcement {
  id?: number;
  message: string;
  is_active: boolean;
  type: 'info' | 'warning' | 'error' | 'success';
  priority: 'low' | 'normal' | 'high';
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export interface RestaurantSettings {
  restaurant_name: string;
  restaurant_address: string;
  restaurant_phone: string;
  restaurant_email: string;
  restaurant_hours: string;
  restaurant_days: string;
  restaurant_description: string;
}

export interface SystemSettings {
  maintenance_mode: boolean;
  allow_new_orders: boolean;
  max_orders_per_day: number;
  order_lead_time: number;
  notifications_enabled: boolean;
  site_title: string;
  welcome_message: string;
}

// Configuration par défaut de l'annonce
export const defaultAnnouncement: Announcement = {
  message: "Bienvenue chez ChanthanaThaiCook - Cuisine thaïlandaise authentique",
  is_active: false,
  type: 'info',
  priority: 'normal'
};

// =====================================
// FONCTIONS POUR LES ANNONCES
// =====================================

// Récupérer l'annonce active
export const getActiveAnnouncement = async (): Promise<Announcement | null> => {
  try {
    const { data, error } = await (supabase as any)
      .rpc('get_active_announcement');

    if (error) {
      console.error('Erreur lors de la récupération de l\'annonce:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    return data[0] as Announcement;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'annonce:', error);
    return null;
  }
};

// Récupérer toutes les annonces
export const getAllAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const { data, error } = await (supabase as any)
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des annonces:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des annonces:', error);
    return [];
  }
};

// Créer une nouvelle annonce
export const createAnnouncement = async (announcement: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
  try {
    const { error } = await (supabase as any)
      .from('announcements')
      .insert([announcement]);

    if (error) {
      console.error('Erreur lors de la création de l\'annonce:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de la création de l\'annonce:', error);
    return false;
  }
};

// Mettre à jour une annonce
export const updateAnnouncement = async (id: number, announcement: Partial<Announcement>): Promise<boolean> => {
  try {
    const { error } = await (supabase as any)
      .from('announcements')
      .update(announcement)
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la mise à jour de l\'annonce:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'annonce:', error);
    return false;
  }
};

// Activer une seule annonce (désactive toutes les autres)
export const activateSingleAnnouncement = async (id: number): Promise<boolean> => {
  try {
    const { error } = await (supabase as any)
      .rpc('activate_single_announcement', { announcement_id: id });

    if (error) {
      console.error('Erreur lors de l\'activation de l\'annonce:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de l\'activation de l\'annonce:', error);
    return false;
  }
};

// Supprimer une annonce
export const deleteAnnouncement = async (id: number): Promise<boolean> => {
  try {
    const { error } = await (supabase as any)
      .from('announcements')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la suppression de l\'annonce:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'annonce:', error);
    return false;
  }
};

// =====================================
// FONCTIONS POUR LES PARAMÈTRES RESTAURANT
// =====================================

// Récupérer tous les paramètres du restaurant
export const getRestaurantSettings = async (): Promise<RestaurantSettings | null> => {
  try {
    const { data, error } = await (supabase as any)
      .from('v_restaurant_info')
      .select('*')
      .single();

    if (error) {
      console.error('Erreur lors de la récupération des paramètres restaurant:', error);
      return null;
    }

    return {
      restaurant_name: data.name || '',
      restaurant_address: data.address || '',
      restaurant_phone: data.phone || '',
      restaurant_email: data.email || '',
      restaurant_hours: data.hours || '',
      restaurant_days: data.days || '',
      restaurant_description: data.description || ''
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres restaurant:', error);
    return null;
  }
};

// Mettre à jour les paramètres du restaurant
export const updateRestaurantSettings = async (settings: Partial<RestaurantSettings>): Promise<boolean> => {
  try {
    const updates = Object.entries(settings).map(([key, value]) => ({
      setting_key: key,
      setting_value: value,
      updated_at: new Date().toISOString()
    }));

    const { error } = await (supabase as any)
      .from('restaurant_settings')
      .upsert(updates, { onConflict: 'setting_key' });

    if (error) {
      console.error('Erreur lors de la mise à jour des paramètres restaurant:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres restaurant:', error);
    return false;
  }
};

// =====================================
// FONCTIONS POUR LES PARAMÈTRES SYSTÈME
// =====================================

// Récupérer les paramètres système
export const getSystemSettings = async (): Promise<SystemSettings | null> => {
  try {
    const { data, error } = await (supabase as any)
      .from('system_settings')
      .select('setting_key, setting_value');

    if (error) {
      console.error('Erreur lors de la récupération des paramètres système:', error);
      return null;
    }

    const settings: Record<string, boolean | number | string> = {};
    data?.forEach((item: { setting_key: string; setting_value: string }) => {
      const value = item.setting_value;
      // Conversion selon le type
      if (value === 'true' || value === 'false') {
        settings[item.setting_key] = value === 'true';
      } else if (!isNaN(Number(value))) {
        settings[item.setting_key] = Number(value);
      } else {
        settings[item.setting_key] = value;
      }
    });

    return settings as unknown as SystemSettings;
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres système:', error);
    return null;
  }
};

// Mettre à jour les paramètres système
export const updateSystemSettings = async (settings: Partial<SystemSettings>): Promise<boolean> => {
  try {
    const updates = Object.entries(settings).map(([key, value]) => ({
      setting_key: key,
      setting_value: String(value),
      updated_at: new Date().toISOString()
    }));

    const { error } = await (supabase as any)
      .from('system_settings')
      .upsert(updates, { onConflict: 'setting_key' });

    if (error) {
      console.error('Erreur lors de la mise à jour des paramètres système:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres système:', error);
    return false;
  }
};

// =====================================
// CONFIGURATION DES TYPES D'ANNONCES
// =====================================

export const announcementTypeConfig = {
  info: {
    bgColor: 'bg-blue-600/90',
    textColor: 'text-white',
    iconColor: 'text-white',
    label: 'Information'
  },
  warning: {
    bgColor: 'bg-orange-600/90',
    textColor: 'text-white',
    iconColor: 'text-white',
    label: 'Attention'
  },
  error: {
    bgColor: 'bg-red-600/90',
    textColor: 'text-white',
    iconColor: 'text-white',
    label: 'Urgent/Fermeture'
  },
  success: {
    bgColor: 'bg-green-600/90',
    textColor: 'text-white',
    iconColor: 'text-white',
    label: 'Promotion/Bonne nouvelle'
  }
};

// Messages prédéfinis pour faciliter la création d'annonces
export const predefinedAnnouncementMessages = [
  {
    message: "Fermeture exceptionnelle lundi - Merci de votre compréhension",
    type: 'warning' as const,
    priority: 'high' as const
  },
  {
    message: "Nouveau menu disponible ! Découvrez nos spécialités d'automne",
    type: 'success' as const,
    priority: 'normal' as const
  },
  {
    message: "Promotion spéciale : -10% sur toutes les commandes ce week-end",
    type: 'success' as const,
    priority: 'normal' as const
  },
  {
    message: "Attention : délais de livraison rallongés en raison de l'affluence",
    type: 'warning' as const,
    priority: 'normal' as const
  },
  {
    message: "Joyeuses fêtes ! Pensez à commander à l'avance pour les fêtes de fin d'année",
    type: 'info' as const,
    priority: 'normal' as const
  }
];
