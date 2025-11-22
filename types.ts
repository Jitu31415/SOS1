export enum AppMode {
  LANDING = 'LANDING',
  SENDER = 'SENDER',
  RECEIVER = 'RECEIVER'
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export enum EmergencyType {
  MEDICAL = 'MEDICAL',
  ENVIRONMENTAL = 'ENVIRONMENTAL',
  SECURITY = 'SECURITY',
  OTHER = 'OTHER'
}

export interface SOSMessage {
  id: string;
  timestamp: number;
  location: GeoLocation;
  message: string;
  type: EmergencyType;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  batteryLevel: number;
}

export interface DetectedSignal extends SOSMessage {
  signalStrength: number; // -100 to 0 dBm
  distance: number; // estimated meters
  lastSeen: number;
}
