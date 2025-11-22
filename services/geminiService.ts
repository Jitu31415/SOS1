import { EmergencyType } from '../types';

// OFFLINE ANALYSIS SERVICE
// Replaces cloud-based AI with local keyword heuristics to ensure functionality without internet.

export const analyzeSOSContext = async (userInput: string): Promise<{ type: EmergencyType; priority: string; summary: string }> => {
  // Simulate a brief processing delay for UI feedback (optional, makes interaction feel substantial)
  await new Promise(resolve => setTimeout(resolve, 600));

  const text = userInput.toLowerCase().trim();
  
  // Default Assessment
  let type = EmergencyType.OTHER;
  let priority = 'HIGH';
  
  // Keyword Dictionaries
  const medicalKeywords = ['medical', 'blood', 'heart', 'pain', 'breath', 'unconscious', 'hurt', 'injury', 'broken', 'cut', 'bleed', 'dying', 'leg', 'arm', 'head'];
  const envKeywords = ['fire', 'burn', 'smoke', 'flood', 'water', 'trap', 'stuck', 'cold', 'heat', 'storm', 'earthquake'];
  const securityKeywords = ['gun', 'shoot', 'weapon', 'rob', 'fight', 'attack', 'hostage', 'kidnap', 'danger', 'chase'];

  // Priority Triggers
  const criticalModifiers = ['severe', 'critical', 'dying', 'death', 'massive', 'heavy', 'cannot', 'cant'];

  // Analysis Logic
  if (medicalKeywords.some(k => text.includes(k))) {
    type = EmergencyType.MEDICAL;
  } else if (envKeywords.some(k => text.includes(k))) {
    type = EmergencyType.ENVIRONMENTAL;
  } else if (securityKeywords.some(k => text.includes(k))) {
    type = EmergencyType.SECURITY;
  }

  // Determine Priority
  if (criticalModifiers.some(k => text.includes(k)) || type === EmergencyType.SECURITY) {
    priority = 'CRITICAL';
  }

  // Generate Tactical Summary (First few words or the input itself)
  const words = userInput.split(' ');
  const summary = words.length > 4 
    ? words.slice(0, 4).join(' ') + '...' 
    : (userInput || 'Emergency Beacon');

  return {
    type,
    priority,
    summary
  };
};