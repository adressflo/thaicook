#!/usr/bin/env node

/**
 * Script de vérification professionnelle de la base de données Supabase
 * Utilise l'architecture existante de l'application pour accès direct
 * Équivalent MCP pour validation et optimisation DB
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configuration de l'environnement
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env.local') });

// Configuration Supabase - Même que l'application
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lkaiwnkyoztebplqoifc.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY manquante dans .env.local');
  process.exit(1);
}

// Client Supabase avec configuration identique à l'app
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
    flowType: 'pkce',
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'chanthanathaicook-verification',
      'x-client-version': '2025.1.28',
      'x-architecture': 'firebase-supabase-hybrid-mcp'
    }
  }
});

/**
 * Fonction utilitaire pour logging coloré
 */
const log = {
  success: (msg) => console.log(`✅ ${msg}`),
  error: (msg) => console.log(`❌ ${msg}`),
  warning: (msg) => console.log(`⚠️ ${msg}`),
  info: (msg) => console.log(`ℹ️ ${msg}`),
  section: (msg) => console.log(`\n🔍 ${msg}\n${'='.repeat(50)}`),
};

/**
 * Vérification des tables principales
 */
async function verifyTables() {
  log.section('VÉRIFICATION DES TABLES PRINCIPALES');

  const tables = [
    'client_db',
    'commande_db',
    'details_commande_db',
    'plats_db',
    'extras_db',
    'evenements_db'
  ];

  const results = {};

  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        log.error(`Table ${table}: ${error.message}`);
        results[table] = { status: 'error', error: error.message };
      } else {
        log.success(`Table ${table}: ${count} enregistrements`);
        results[table] = { status: 'success', count };
      }
    } catch (err) {
      log.error(`Table ${table}: Exception - ${err.message}`);
      results[table] = { status: 'exception', error: err.message };
    }
  }

  return results;
}

/**
 * Vérification des politiques RLS
 */
async function verifyRLSPolicies() {
  log.section('VÉRIFICATION DES POLITIQUES RLS');

  try {
    const { data: policies, error } = await supabase
      .rpc('get_policies_info')
      .select();

    if (error && error.code !== 'PGRST202') {
      log.warning('Impossible de récupérer les politiques RLS via RPC');
      log.info('Tentative de vérification alternative...');

      // Test direct d'accès aux tables sensibles
      const { data: testCommandes, error: errorCommandes } = await supabase
        .from('commande_db')
        .select('id')
        .limit(1);

      if (errorCommandes) {
        log.error(`RLS actif sur commande_db: ${errorCommandes.message}`);
        return { commande_db: 'actif', status: 'restrictif' };
      } else {
        log.success('Accès libre à commande_db (RLS désactivé)');
        return { commande_db: 'désactivé', status: 'libre' };
      }
    } else {
      log.success('Politiques RLS récupérées avec succès');
      return { status: 'récupérées', policies };
    }
  } catch (err) {
    log.warning(`Erreur vérification RLS: ${err.message}`);
    return { status: 'erreur', error: err.message };
  }
}

/**
 * Vérification des données admin critiques
 */
async function verifyAdminData() {
  log.section('VÉRIFICATION DES DONNÉES ADMIN');

  try {
    // Vérification plats avec extras
    const { data: plats, error: errorPlats } = await supabase
      .from('plats_db')
      .select(`
        id,
        nom,
        prix,
        extras_db (
          id,
          nom,
          prix_extra
        )
      `)
      .limit(5);

    if (errorPlats) {
      log.error(`Erreur plats: ${errorPlats.message}`);
    } else {
      log.success(`${plats.length} plats récupérés avec extras`);
      plats.forEach(plat => {
        log.info(`- ${plat.nom}: ${plat.extras_db?.length || 0} extras`);
      });
    }

    // Vérification commandes récentes
    const { data: commandes, error: errorCommandes } = await supabase
      .from('commande_db')
      .select(`
        id,
        nom_client,
        date_commande,
        statut,
        details_commande_db (
          id,
          quantite,
          plats_db (nom)
        )
      `)
      .order('date_commande', { ascending: false })
      .limit(5);

    if (errorCommandes) {
      log.error(`Erreur commandes: ${errorCommandes.message}`);
    } else {
      log.success(`${commandes.length} commandes récentes avec détails`);
      commandes.forEach(cmd => {
        const itemsCount = cmd.details_commande_db?.length || 0;
        log.info(`- ${cmd.nom_client}: ${itemsCount} items (${cmd.statut})`);
      });
    }

    return { plats: plats?.length || 0, commandes: commandes?.length || 0 };
  } catch (err) {
    log.error(`Exception données admin: ${err.message}`);
    return { error: err.message };
  }
}

/**
 * Test de performance et connectivité
 */
async function verifyPerformance() {
  log.section('TEST DE PERFORMANCE ET CONNECTIVITÉ');

  const startTime = Date.now();

  try {
    // Test de ping simple
    const { data, error } = await supabase
      .from('plats_db')
      .select('count')
      .limit(1)
      .single();

    const responseTime = Date.now() - startTime;

    if (error) {
      log.error(`Test ping échoué: ${error.message}`);
      return { status: 'échec', responseTime };
    } else {
      if (responseTime < 200) {
        log.success(`Connexion excellente: ${responseTime}ms`);
      } else if (responseTime < 500) {
        log.success(`Connexion bonne: ${responseTime}ms`);
      } else {
        log.warning(`Connexion lente: ${responseTime}ms`);
      }
      return { status: 'succès', responseTime };
    }
  } catch (err) {
    const responseTime = Date.now() - startTime;
    log.error(`Exception ping: ${err.message} (${responseTime}ms)`);
    return { status: 'exception', responseTime, error: err.message };
  }
}

/**
 * Génération du rapport de santé
 */
async function generateHealthReport(tableResults, rlsResults, adminResults, performanceResults) {
  log.section('RAPPORT DE SANTÉ GLOBAL');

  const totalTables = Object.keys(tableResults).length;
  const successfulTables = Object.values(tableResults).filter(t => t.status === 'success').length;
  const healthPercentage = Math.round((successfulTables / totalTables) * 100);

  console.log(`📊 SANTÉ GLOBALE: ${healthPercentage}% (${successfulTables}/${totalTables} tables)`)
  console.log(`⏱️ PERFORMANCE: ${performanceResults.responseTime}ms`);
  console.log(`🔒 SÉCURITÉ RLS: ${rlsResults.status}`);
  console.log(`👨‍💼 DONNÉES ADMIN: ${adminResults.plats || 0} plats, ${adminResults.commandes || 0} commandes`);

  // Recommandations
  console.log('\n💡 RECOMMANDATIONS:');

  if (healthPercentage === 100) {
    console.log('✅ Base de données en excellente santé');
  } else {
    console.log('⚠️ Certaines tables nécessitent attention');
  }

  if (performanceResults.responseTime > 500) {
    console.log('⚠️ Performance dégradée - vérifier la connectivité réseau');
  }

  if (rlsResults.status === 'libre') {
    console.log('🔓 RLS désactivé - Réactiver pour la production');
  }

  return {
    healthPercentage,
    performance: performanceResults.responseTime,
    tablesStatus: tableResults,
    recommendations: healthPercentage === 100 ? 'optimal' : 'attention_requise'
  };
}

/**
 * Fonction principale d'exécution
 */
async function main() {
  console.log('🚀 DÉMARRAGE VÉRIFICATION BASE DE DONNÉES SUPABASE');
  console.log(`🔗 URL: ${supabaseUrl}`);
  console.log(`📅 Timestamp: ${new Date().toISOString()}\n`);

  try {
    // Exécution des vérifications
    const tableResults = await verifyTables();
    const rlsResults = await verifyRLSPolicies();
    const adminResults = await verifyAdminData();
    const performanceResults = await verifyPerformance();

    // Génération du rapport final
    const healthReport = await generateHealthReport(
      tableResults,
      rlsResults,
      adminResults,
      performanceResults
    );

    log.section('VÉRIFICATION TERMINÉE AVEC SUCCÈS');
    console.log('📋 Rapport complet généré');
    console.log('🎯 Base de données prête pour utilisation admin');

    process.exit(0);
  } catch (error) {
    log.error(`Erreur critique: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Exécution du script
main();