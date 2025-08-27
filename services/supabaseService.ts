// services/supabaseService.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import type { 
  Client, ClientUI, ClientInputData,
  Plat, PlatUI, 
  Commande, CommandeUI, CommandeInputData,
  DetailCommande,
  Evenement, EvenementInputData
} from '@/types/app'

// Configuration Supabase
const SUPABASE_URL = 'https://lkaiwnkyoztebplqoifc.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrYWl3bmt5b3p0ZWJwbHFvaWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NzM1MTcsImV4cCI6MjA2NTM0OTUxN30.FicSTtfVzfXIEAPawUyHAGf6LeRiTr3OwF_FyG-YCaw'

// Initialisation du client Supabase
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)

class SupabaseService {
  // ========== CLIENTS ==========
  async fetchClients(): Promise<ClientUI[]> {
    const { data, error } = await supabase
      .from('client_db')
      .select('*')
      .order('nom', { ascending: true })

    if (error) throw error
    
    // Transformation pour compatibilité avec l'interface
    return (data || []).map(client => ({
      ...client,
      id: client.firebase_uid, // Pour compatibilité
      Nom: client.nom ?? undefined,
      Prénom: client.prenom ?? undefined,
      'Numéro de téléphone': client.numero_de_telephone ?? undefined,
      'e-mail': client.email ?? undefined,
      'Adresse (numéro et rue)': client.adresse_numero_et_rue ?? undefined,
      'Code postal': client.code_postal ?? undefined,
      Ville: client.ville ?? undefined,
      'Préférence client': client.preference_client ?? undefined,
      'Comment avez-vous connu ChanthanaThaiCook ?': client.comment_avez_vous_connu ?? undefined,
      'Souhaitez-vous recevoir les actualités et offres par e-mail ?': 
        client.souhaitez_vous_recevoir_actualites ? 'Oui' : 'Non/Pas de réponse',
      'Date de naissance': client.date_de_naissance ?? undefined,
      'Photo Client': client.photo_client ? [{ url: client.photo_client }] : undefined,
      FirebaseUID: client.firebase_uid,
      Role: client.role ?? undefined
    }))
  }

  async getClientByFirebaseUID(firebase_uid: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('client_db')
      .select('*')
      .eq('firebase_uid', firebase_uid)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  async createClient(clientData: ClientInputData): Promise<Client> {
    const { data, error } = await supabase
      .from('client_db')
      .insert({
        firebase_uid: clientData.firebase_uid || '',
        role: 'client',
        nom: clientData.nom,
        prenom: clientData.prenom,
        preference_client: clientData.preference_client,
        numero_de_telephone: clientData.numero_de_telephone,
        email: clientData.email,
        adresse_numero_et_rue: clientData.adresse_numero_et_rue,
        code_postal: clientData.code_postal,
        ville: clientData.ville,
        comment_avez_vous_connu: clientData.comment_avez_vous_connu,
        souhaitez_vous_recevoir_actualites: clientData.souhaitez_vous_recevoir_actualites,
        date_de_naissance: clientData.date_de_naissance,
        photo_client: clientData.photo_client
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateClient(firebase_uid: string, clientData: Partial<ClientInputData>): Promise<Client> {
    const { data, error } = await supabase
      .from('client_db')
      .update(clientData)
      .eq('firebase_uid', firebase_uid)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // ========== PLATS ==========
  async fetchPlats(): Promise<PlatUI[]> {
    const { data, error } = await supabase
      .from('plats_db')
      .select('*')
      .order('plat', { ascending: true })

    if (error) throw error
    
    // Transformation pour compatibilité
    return (data || []).map(plat => ({
      ...plat,
      id: plat.idplats, // Ajouter le champ id requis
      // Champs de compatibilité
      Plat: plat.plat,
      Description: plat.description,
      Prix: plat.prix || 0,
      'Prix vu': plat.prix ? `${plat.prix} €` : '',
      'Photo du Plat': plat.photo_du_plat ? [{ url: plat.photo_du_plat }] : undefined
    }))
  }

  async getPlatById(id: number): Promise<Plat | null> {
    const { data, error } = await supabase
      .from('plats_db')
      .select('*')
      .eq('idplats', id)
      .single()

    if (error) throw error
    return data
  }

  // ========== COMMANDES ==========
  async fetchCommandes(): Promise<CommandeUI[]> {
    const { data, error } = await supabase
      .from('commande_db')
      .select('*')
      .order('date_de_prise_de_commande', { ascending: false })

    if (error) throw error
    
    // Transformation pour compatibilité avec validation des types
    const result: CommandeUI[] = (data || []).map(commande => {
      // Validation du statut de commande
      const statutValide: CommandeUI['statut_commande'] = 
        commande.statut_commande &&
        ['En attente de confirmation', 'Confirmée', 'En préparation', 'Prête à récupérer', 'Récupérée', 'Annulée'].includes(commande.statut_commande)
          ? commande.statut_commande as CommandeUI['statut_commande']
          : 'En attente de confirmation';

      // Validation du statut de paiement
      const statutPaiementValide: CommandeUI['statut_paiement'] = 
        commande.statut_paiement &&
        ['En attente sur place', 'Payé sur place', 'Payé en ligne', 'Non payé', 'Payée'].includes(commande.statut_paiement)
          ? commande.statut_paiement as CommandeUI['statut_paiement']
          : 'En attente sur place';

      // Validation du type de livraison
      const typeLivraisonValide: CommandeUI['type_livraison'] = 
        commande.type_livraison &&
        ['À emporter', 'Livraison', 'Sur place'].includes(commande.type_livraison)
          ? commande.type_livraison as CommandeUI['type_livraison']
          : null;

      return {
        ...commande,
        id: commande.idcommande, // Mappage pour l'UI
        'Numéro de Commande': `CMD-${commande.idcommande}`,
        'Date & Heure de retrait': commande.date_et_heure_de_retrait_souhaitees ?? undefined,
        'Statut Commande': statutValide ?? undefined, // Conversion vers string | undefined
        statut: statutValide ?? undefined, // Conversion vers string | undefined
        statut_commande: statutValide, // Type validé pour CommandeUI
        statut_paiement: statutPaiementValide, // Type validé pour CommandeUI
        type_livraison: typeLivraisonValide, // Type validé pour CommandeUI
        client_r: String(commande.client_r_id ?? commande.client_r ?? ''), // Assurer string
        'Client R': commande.client_r ? [commande.client_r] : [],
        Total: 0, // À calculer avec les détails
        createdTime: commande.date_de_prise_de_commande ?? undefined,
        details: [] // Sera chargé séparément si nécessaire
      };
    });
    
    return result
  }

  async getCommandeById(id: number): Promise<CommandeUI | null> {
    // D'abord récupérer la commande
    const { data: commande, error: commandeError } = await supabase
      .from('commande_db')
      .select('*')
      .eq('idcommande', id)
      .single()

    if (commandeError) throw commandeError
    if (!commande) return null

    // Ensuite récupérer les détails avec les plats
    const { data: details, error: detailsError } = await supabase
      .from('details_commande_db')
      .select(`
        *,
        plat:plats_db (*)
      `)
      .eq('commande_r', id)

    // Validation des détails - gérer les erreurs de relation
    let validatedDetails: Array<DetailCommande & { plat?: Plat }> = []
    
    if (detailsError) {
      console.warn('Erreur lors de la récupération des détails:', detailsError)
      // En cas d'erreur de relation, essayer sans la jointure
      const { data: simpleDetails } = await supabase
        .from('details_commande_db')
        .select('*')
        .eq('commande_r', id)
      
      validatedDetails = (simpleDetails || []).map(detail => ({
        ...detail,
        plat: undefined // Pas de données de plat disponibles
      }))
    } else {
      // Valider que les données sont correctes et filtrer les erreurs de relation
      validatedDetails = (details || [])
        .filter((detail: unknown): detail is DetailCommande & { plat?: Plat } => {
          // Vérifier que l'objet detail est valide
          if (!detail || typeof detail !== 'object') return false;
          
          const detailObj = detail as Record<string, unknown>;
          if (!('iddetails' in detailObj)) return false;
          if (!('commande_r' in detailObj)) return false;
          if (!('plat_r' in detailObj)) return false;
          
          // Vérifier que plat n'est pas une erreur de Supabase
          if (detailObj.plat && typeof detailObj.plat === 'object' && 'error' in detailObj.plat) {
            return false;
          }
          
          return true;
        })
        .map((detail): DetailCommande & { plat?: Plat } => ({
          iddetails: detail.iddetails,
          commande_r: detail.commande_r,
          plat_r: detail.plat_r,
          quantite_plat_commande: detail.quantite_plat_commande,
          plat: detail.plat && detail.plat !== null && typeof detail.plat === 'object' && !('error' in (detail.plat as any)) 
            ? detail.plat as Plat 
            : undefined
        }));
    }

    // Récupérer le client s'il y a un client_r_id
    let client = null
    if (commande.client_r_id) {
      const { data: clientData, error: clientError } = await supabase
        .from('client_db')
        .select('*')
        .eq('idclient', commande.client_r_id)
        .single()
      
      if (!clientError && clientData) {
        client = clientData
      }
    }

    // Calculer le total avec validation des données
    const total = validatedDetails.reduce((sum: number, detail) => {
      // Validation stricte des données de détail
      if (!detail || typeof detail !== 'object') return sum
      
      const prix = detail.plat?.prix ?? 0
      const quantite = detail.quantite_plat_commande ?? 0
      
      // Vérifier que prix et quantité sont des nombres valides
      if (typeof prix === 'number' && typeof quantite === 'number' && !isNaN(prix) && !isNaN(quantite)) {
        return sum + (prix * quantite)
      }
      
      return sum
    }, 0)
    
    // Validation du statut de commande
    const statutValide: CommandeUI['statut_commande'] = 
      commande.statut_commande &&
      ['En attente de confirmation', 'Confirmée', 'En préparation', 'Prête à récupérer', 'Récupérée', 'Annulée'].includes(commande.statut_commande)
        ? commande.statut_commande as CommandeUI['statut_commande']
        : 'En attente de confirmation';

    // Validation du statut de paiement
    const statutPaiementValide: CommandeUI['statut_paiement'] = 
      commande.statut_paiement &&
      ['En attente sur place', 'Payé sur place', 'Payé en ligne', 'Non payé', 'Payée'].includes(commande.statut_paiement)
        ? commande.statut_paiement as CommandeUI['statut_paiement']
        : 'En attente sur place';
    
    // Validation du type de livraison pour le retour final
    const typeLivraisonValideFinal: CommandeUI['type_livraison'] = 
      commande.type_livraison &&
      ['À emporter', 'Livraison', 'Sur place'].includes(commande.type_livraison)
        ? commande.type_livraison as CommandeUI['type_livraison']
        : null;
    
    return {
      ...commande,
      id: commande.idcommande,
      'Numéro de Commande': `CMD-${commande.idcommande}`,
      'Date & Heure de retrait': commande.date_et_heure_de_retrait_souhaitees ?? undefined,
      'Statut Commande': statutValide ?? undefined, // Conversion vers string | undefined
      statut: statutValide ?? undefined, // Conversion vers string | undefined
      statut_commande: statutValide, // Type validé pour CommandeUI
      statut_paiement: statutPaiementValide, // Type validé pour CommandeUI
      type_livraison: typeLivraisonValideFinal, // Type validé pour CommandeUI
      client_r: String(commande.client_r_id ?? commande.client_r ?? ''), // Assurer string
      client: client ?? undefined,
      Total: total,
      createdTime: commande.date_de_prise_de_commande ?? undefined,
      details: validatedDetails
    }
  }

  async createCommande(commandeData: CommandeInputData): Promise<Commande> {
    const { data, error } = await supabase
      .from('commande_db')
      .insert({
        client_r: commandeData.client_r,
        client_r_id: commandeData.client_r_id,
        date_et_heure_de_retrait_souhaitees: commandeData.date_et_heure_de_retrait_souhaitees,
        statut_commande: 'En attente de confirmation',
        demande_special_pour_la_commande: commandeData.demande_special_pour_la_commande,
        statut_paiement: 'En attente sur place',
        type_livraison: commandeData.type_livraison || 'À emporter'
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateCommande(idcommande: number, updates: Partial<Commande>): Promise<Commande> {
    const { data, error } = await supabase
      .from('commande_db')
      .update(updates)
      .eq('idcommande', idcommande)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // ========== DÉTAILS DE COMMANDE ==========
  async createDetailCommande(detailData: {
    commande_r: number
    plat_r: number
    quantite_plat_commande: number
  }): Promise<DetailCommande> {
    const { data, error } = await supabase
      .from('details_commande_db')
      .insert(detailData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // ========== ÉVÉNEMENTS ==========
  async fetchEvenements(): Promise<Evenement[]> {
    const { data, error } = await supabase
      .from('evenements_db')
      .select('*')
      .order('date_evenement', { ascending: false })

    if (error) throw error
    return data || []
  }

  async createEvenement(evenementData: EvenementInputData): Promise<Evenement> {
    const { data, error } = await supabase
      .from('evenements_db')
      .insert({
        ...evenementData,
        statut_evenement: 'Demande initiale',
        statut_acompte: 'Non applicable',
        statut_paiement_final: 'En attente'
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateEvenement(id: number, updates: Partial<Evenement>): Promise<Evenement> {
    const { data, error } = await supabase
      .from('evenements_db')
      .update(updates)
      .eq('idevenements', id)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

export const supabaseService = new SupabaseService()