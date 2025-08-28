export const getDeclineResponse = (userText: string): string => `## 🚨 EMMA Emergency Dispatch Only

**This is EMMA - Evacuation Management and Monitoring Assistant**

I'm specifically designed for **emergency situations and disaster response**. I cannot assist with "${userText}".

### 🆘 **I can dispatch help for:**
• **Natural Disasters**: Typhoons, earthquakes, floods, fires
• **Medical Emergencies**: Heart attacks, injuries, unconscious persons
• **Fire/Safety Emergencies**: Building fires, smoke inhalation, evacuations
• **Emergency Coordination**: Rescue operations, family notifications

### 📞 **IMMEDIATE LIFE THREAT?**
**Call 911 NOW - then return for emergency guidance**

### 💡 **Emergency Examples:**
• "Heart attack emergency"
• "Trapped by flood water"
• "Building collapsed from earthquake"
• "House fire - need evacuation route"

**What is your emergency situation?**`;

export const getRedirectResponse = (userText: string, location: string): string => `## 🚨 EMMA Emergency Dispatch Ready

**Evacuation Management and Monitoring Assistant**

I didn't recognize **"${userText}"** as an emergency situation. 

**I'm EMMA - specialized emergency dispatch for ${location}.**

### 🆘 **I can coordinate response for:**
• **Natural Disasters**: Typhoon emergencies, earthquakes, flooding
• **Medical Emergencies**: Heart attacks, severe injuries, unconscious persons
• **Fire/Safety**: Building fires, gas leaks, structural collapses
• **Emergency Rescue**: Trapped persons, evacuation coordination

### 📞 **IMMEDIATE DANGER?**
**Call 911 NOW - then describe your emergency here**

### 💡 **Emergency Examples:**
• "Heart attack - need ambulance"
• "Trapped by flood water"
• "Building fire - evacuation needed"
• "Earthquake damage - people trapped"
• "Severe bleeding emergency"

**What is your emergency situation?**`;
