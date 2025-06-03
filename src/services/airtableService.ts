// src/services/airtableService.ts
import { AirtableConfig, AirtableResponse, AirtableRecord } from '@/types/airtable';

class AirtableService {
  private baseUrl = 'https://api.airtable.com/v0';

  private async handleError(response: Response): Promise<Error> {
    let errorMessage = `Erreur Airtable: ${response.status} ${response.statusText}`;
    try {
      const errorBody = await response.json();
      if (errorBody && errorBody.error) {
        if (typeof errorBody.error === 'string') {
          errorMessage = `Erreur Airtable (${response.status}): ${errorBody.error}`;
        } else if (errorBody.error.message) {
          errorMessage = `Erreur Airtable (${response.status}): ${errorBody.error.type} - ${errorBody.error.message}`;
        }
        // Logguer le corps complet de l'erreur pour un débogage plus approfondi
        console.error('Corps de l\'erreur Airtable:', JSON.stringify(errorBody, null, 2));
      }
    } catch (e) {
      // Impossible de parser le corps de l'erreur JSON, on garde le message par défaut
      console.error('Impossible de parser le corps de l\'erreur JSON Airtable:', e);
    }
    return new Error(errorMessage);
  }

  async fetchRecords(config: AirtableConfig): Promise<AirtableResponse> {
    const { apiKey, baseId, tableName } = config;

    const response = await fetch(`${this.baseUrl}/${baseId}/${encodeURIComponent(tableName)}`, { // encodeURIComponent pour le nom de la table
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw await this.handleError(response);
    }
    return await response.json();
  }

  async createRecord(config: AirtableConfig, fields: Record<string, any>): Promise<AirtableRecord> {
    const { apiKey, baseId, tableName } = config;

    const response = await fetch(`${this.baseUrl}/${baseId}/${encodeURIComponent(tableName)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields // Airtable attend un objet fields, ou un objet records contenant un tableau d'objets avec fields
      })
    });

    if (!response.ok) {
      throw await this.handleError(response);
    }
    // Airtable renvoie un seul enregistrement pour une création réussie, ou un objet avec un tableau 'records' si vous envoyez un tableau
    const data = await response.json();
    return data.records ? data.records[0] : data; // Adapter si createRecord peut créer plusieurs enregistrements
  }

  async updateRecord(config: AirtableConfig, recordId: string, fields: Record<string, any>): Promise<AirtableRecord> {
    const { apiKey, baseId, tableName } = config;

    const response = await fetch(`${this.baseUrl}/${baseId}/${encodeURIComponent(tableName)}/${recordId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields
      })
    });

    if (!response.ok) {
      throw await this.handleError(response);
    }
    const data = await response.json();
    return data;
  }
}

export const airtableService = new AirtableService();