import { 
  greetingResponse,
  typhoonResponse,
  earthquakeResponse,
  floodResponse,
  fireResponse,
  medicalResponse,
  preparednessResponse
} from './emergency-responses';

export const getEmergencyResponse = (query: string, location: string): string => {
  const lowerQuery = query.toLowerCase();
  
  // Greeting patterns
  if (/\b(hello|hi|hey|good morning|good afternoon|start|begin)\b/.test(lowerQuery)) {
    return greetingResponse(location);
  }
  
  // Typhoon/Storm responses
  if (/\b(typhoon|storm|cyclone|hurricane|bagyo|wind|weather|rain)\b/.test(lowerQuery)) {
    return typhoonResponse;
  }
  
  // Earthquake responses  
  if (/\b(earthquake|tremor|shake|quake|lindol|seismic)\b/.test(lowerQuery)) {
    return earthquakeResponse;
  }
  
  // Flood responses
  if (/\b(flood|flooding|water|baha|inundation)\b/.test(lowerQuery)) {
    return floodResponse;
  }
  
  // Fire responses
  if (/\b(fire|smoke|burn|burning|flame|sunog|blaze)\b/.test(lowerQuery)) {
    return fireResponse;
  }
  
  // Medical emergency responses
  if (/\b(heart attack|chest pain|stroke|unconscious|bleeding|injury|medical|first aid|ambulance|hospital)\b/.test(lowerQuery)) {
    return medicalResponse;
  }
  
  // Emergency preparedness
  if (/\b(supplies|kit|prepare|preparation|emergency bag|go bag)\b/.test(lowerQuery)) {
    return preparednessResponse;
  }
  
  // Default response for unmatched queries
  return `## 🚨 EMMA Emergency Dispatch Available

**Evacuation Management and Monitoring Assistant**

I didn't find a specific emergency protocol for **"${query}"**, but I can coordinate emergency response for:

### 🌊 **Natural Disaster Emergencies:**
• Typhoon/storm emergency response
• Earthquake rescue coordination
• Flood evacuation and water rescue

### 🚑 **Medical Emergency Dispatch:**
• Heart attacks, strokes, severe injuries
• Unconscious persons, choking emergencies
• Medical team coordination and hospital routing

### 🔥 **Fire/Safety Emergency Response:**
• Building fires and smoke inhalation
• Gas leaks and structural emergencies
• Emergency evacuation coordination

### 🆘 **Emergency Examples:**
• "Heart attack - need ambulance NOW"
• "Trapped by typhoon flooding"
• "Building collapse from earthquake"
• "House fire - need evacuation route"

### 📞 **LIFE-THREATENING EMERGENCY?**
**Call 911 immediately, then return for guidance**

**What is your emergency situation?**`;
};
