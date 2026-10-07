import { supabase } from '../supabaseClient.js';
import {
  ApplicationJourney,
  ApplicationStage,
  JourneyReminder,
  DocumentReadinessState,
} from '../types';

/**
 * 1. APPLICATION JOURNEYS (CRUD)
 */

// Load all application journeys for the authenticated user
export async function loadUserJourneys(userId: string): Promise<ApplicationJourney[] | null> {
  try {
    const { data, error } = await supabase
      .from('application_journeys')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase loadUserJourneys notice (table may need creation):', error.message);
      return null;
    }

    if (!data) return [];

    return data.map((row: any) => ({
      id: row.id,
      serviceId: row.service_id,
      serviceName: row.service_name,
      category: row.category,
      state: row.state,
      referenceNumber: row.reference_number || undefined,
      currentStage: row.current_stage as ApplicationStage,
      stageDate: row.stage_date || row.created_at,
      notes: row.notes || undefined,
      documentsStatus: row.documents_status || {},
      reminderDeadline: row.reminder_deadline || undefined,
      createdDate: row.created_at,
      lastUpdatedDate: row.updated_at || row.created_at,
    }));
  } catch (err) {
    console.warn('Failed to load user journeys from Supabase:', err);
    return null;
  }
}

// Create new application journey
export async function createUserJourney(userId: string, journey: ApplicationJourney): Promise<boolean> {
  try {
    const { error } = await supabase.from('application_journeys').insert({
      id: journey.id,
      user_id: userId,
      service_id: journey.serviceId,
      service_name: journey.serviceName,
      category: journey.category,
      state: journey.state,
      reference_number: journey.referenceNumber || null,
      current_stage: journey.currentStage,
      stage_date: journey.stageDate,
      notes: journey.notes || null,
      documents_status: journey.documentsStatus || {},
      reminder_deadline: journey.reminderDeadline || null,
    });

    if (error) {
      console.warn('Supabase createUserJourney error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to create journey in Supabase:', err);
    return false;
  }
}

// Update journey stage & reference docket number
export async function updateJourneyStageInDb(
  userId: string,
  journeyId: string,
  newStage: ApplicationStage,
  referenceNumber?: string
): Promise<boolean> {
  try {
    const updatePayload: any = {
      current_stage: newStage,
      stage_date: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (referenceNumber !== undefined) {
      updatePayload.reference_number = referenceNumber;
    }

    const { error } = await supabase
      .from('application_journeys')
      .update(updatePayload)
      .eq('id', journeyId)
      .eq('user_id', userId);

    if (error) {
      console.warn('Supabase updateJourneyStage error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to update journey stage in Supabase:', err);
    return false;
  }
}

// Update reminder deadline
export async function updateJourneyReminderInDb(
  userId: string,
  journeyId: string,
  reminder: JourneyReminder | null
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('application_journeys')
      .update({
        reminder_deadline: reminder || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', journeyId)
      .eq('user_id', userId);

    if (error) {
      console.warn('Supabase updateJourneyReminder error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to update journey reminder in Supabase:', err);
    return false;
  }
}

// Delete an application journey
export async function deleteUserJourney(userId: string, journeyId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('application_journeys')
      .delete()
      .eq('id', journeyId)
      .eq('user_id', userId);

    if (error) {
      console.warn('Supabase deleteUserJourney error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to delete journey in Supabase:', err);
    return false;
  }
}

/**
 * 2. SAVED SERVICES (CRUD)
 */

// Load all saved service IDs for user
export async function loadSavedServices(userId: string): Promise<string[] | null> {
  try {
    const { data, error } = await supabase
      .from('saved_services')
      .select('service_id')
      .eq('user_id', userId);

    if (error) {
      console.warn('Supabase loadSavedServices notice:', error.message);
      return null;
    }

    return (data || []).map((row: any) => row.service_id);
  } catch (err) {
    console.warn('Failed to load saved services from Supabase:', err);
    return null;
  }
}

// Add a saved service
export async function addSavedService(userId: string, serviceId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('saved_services').upsert({
      user_id: userId,
      service_id: serviceId,
    });

    if (error) {
      console.warn('Supabase addSavedService error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to add saved service in Supabase:', err);
    return false;
  }
}

// Remove a saved service
export async function removeSavedService(userId: string, serviceId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('saved_services')
      .delete()
      .eq('user_id', userId)
      .eq('service_id', serviceId);

    if (error) {
      console.warn('Supabase removeSavedService error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to remove saved service in Supabase:', err);
    return false;
  }
}

/**
 * 3. CITIZEN DOCUMENT READINESS (CRUD)
 */

// Load citizen document statuses
export async function loadUserDocuments(
  userId: string
): Promise<Record<string, DocumentReadinessState> | null> {
  try {
    const { data, error } = await supabase
      .from('user_documents')
      .select('doc_id, status')
      .eq('user_id', userId);

    if (error) {
      console.warn('Supabase loadUserDocuments notice:', error.message);
      return null;
    }

    const result: Record<string, DocumentReadinessState> = {};
    (data || []).forEach((row: any) => {
      result[row.doc_id] = row.status as DocumentReadinessState;
    });
    return result;
  } catch (err) {
    console.warn('Failed to load user documents from Supabase:', err);
    return null;
  }
}

// Upsert a document readiness status
export async function saveUserDocumentStatus(
  userId: string,
  docId: string,
  status: DocumentReadinessState
): Promise<boolean> {
  try {
    const { error } = await supabase.from('user_documents').upsert(
      {
        user_id: userId,
        doc_id: docId,
        status,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,doc_id' }
    );

    if (error) {
      console.warn('Supabase saveUserDocumentStatus error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to save document status in Supabase:', err);
    return false;
  }
}

/**
 * 4. CITIZEN QUERIES (Voice input, document uploads & search history)
 */
export async function recordCitizenQuery(
  userId: string,
  queryText: string,
  inputType: 'text' | 'voice' | 'document_upload' = 'text',
  documentName?: string
): Promise<void> {
  try {
    const { error } = await supabase.from('citizen_queries').insert({
      user_id: userId,
      query_text: queryText,
      input_type: inputType,
      document_name: documentName || null,
    });

    if (error) {
      console.warn('Supabase recordCitizenQuery error:', error.message);
    }
  } catch (err) {
    console.warn('Failed to record citizen query in Supabase:', err);
  }
}
