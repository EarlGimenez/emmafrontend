# Offline Disaster Relief Chatbot Setup

This project provides a complete offline-first disaster relief chatbot designed for emergency situations in areas like Cebu City, Philippines. The chatbot runs entirely on-device using a local AI model, ensuring functionality even without internet connectivity.

## 🚀 Quick Setup Instructions

### Prerequisites
- Node.js and npm installed
- Expo CLI installed (`npm install -g @expo/cli`)
- At least 200MB of free disk space for the AI model

### 1. Install Dependencies
The required package `react-native-llm-mediapipe` has already been installed. If you need to install it manually:

```bash
npm install react-native-llm-mediapipe
```

### 2. Download the AI Model

#### Option A: Using PowerShell (Windows - Recommended)
```powershell
./setup_model.ps1
```

#### Option B: Using Bash (Linux/Mac/WSL)
First, make the script executable:
```bash
chmod +x setup_model.sh
```

Then run the script:
```bash
./setup_model.sh
```

### 3. Integrate the Chatbot Component

Import and use the `LocalChatbot` component in your app:

```tsx
import React from 'react';
import { View } from 'react-native';
import LocalChatbot from './components/LocalChatbot';

export default function DisasterReliefScreen() {
  return (
    <View style={{ flex: 1 }}>
      <LocalChatbot />
    </View>
  );
}
```

## 📱 Component Features

### Core Functionality
- **100% Offline Operation**: No internet required after initial setup
- **Disaster Relief Focus**: Pre-trained responses for emergency situations
- **Mobile Optimized**: Lightweight model designed for mobile devices
- **Real-time Chat Interface**: Professional chat UI with typing indicators

### Specialized Knowledge Areas
- Emergency procedures and safety protocols
- Disaster preparedness and response
- First aid and medical assistance
- Evacuation procedures and safe locations
- Resource locations (shelters, hospitals, emergency services)
- Communication during emergencies
- Water and food safety during disasters

## 🛠 Technical Implementation

### Model Details
- **Model**: Gemma-3-270m (4-bit quantized)
- **Size**: ~150MB
- **Format**: GGUF (optimized for mobile inference)
- **Source**: Hugging Face (TheBloke/gemma-3-270m-GGUF)

### Architecture
- **Frontend**: React Native with TypeScript
- **AI Engine**: react-native-llm-mediapipe
- **Storage**: Local file system via Expo FileSystem
- **UI Framework**: React Native with custom styling

## 📁 Project Structure

```
emmafrontend/
├── assets/
│   └── models/
│       └── gemma-3-270m.q4_k_m.gguf    # AI model (downloaded by script)
├── components/
│   └── LocalChatbot.tsx                # Main chatbot component
├── setup_model.sh                      # Bash setup script
├── setup_model.ps1                     # PowerShell setup script
└── README_CHATBOT.md                   # This file
```

## 🔧 Troubleshooting

### Model Download Issues
1. **Slow Download**: The model is ~150MB, download time depends on your internet speed
2. **Network Errors**: Ensure stable internet connection and try again
3. **Disk Space**: Verify you have at least 200MB free space
4. **Permissions**: On Windows, you may need to run PowerShell as Administrator

### Component Integration Issues
1. **Import Errors**: Ensure the component path is correct relative to your file
2. **Model Loading**: Check that the model file exists in `assets/models/`
3. **Dependencies**: Verify `react-native-llm-mediapipe` is properly installed

### Runtime Issues
1. **Slow Responses**: Normal for mobile inference, responses typically take 2-10 seconds
2. **Memory Usage**: The model uses ~500MB RAM, ensure your device has sufficient memory
3. **Battery Consumption**: AI inference is computationally intensive

## 🌍 Use Cases

### Emergency Scenarios
- **Natural Disasters**: Typhoons, earthquakes, floods
- **Infrastructure Failures**: Power outages, communication blackouts
- **Remote Areas**: Limited or no internet connectivity
- **Crisis Response**: First responders needing quick information

### Sample Interactions
- "What should I do during a typhoon?"
- "How do I perform basic first aid?"
- "Where are the nearest evacuation centers?"
- "What emergency supplies should I prepare?"
- "How can I purify water during an emergency?"

## 🔒 Privacy & Security

- **No Data Transmission**: All processing happens locally
- **No Internet Dependency**: Works completely offline
- **Privacy Focused**: Conversations never leave the device
- **Secure**: No external API calls or data sharing

## 📈 Performance Optimization

### Mobile Optimization
- Quantized 4-bit model for reduced size
- Optimized context window (2048 tokens)
- Efficient batch processing
- Thread optimization for mobile CPUs

### Battery Life
- Configurable inference frequency
- Background processing management
- Optimized model parameters

## 🤝 Contributing

To improve the chatbot:

1. **Model Updates**: Replace with newer or specialized models
2. **UI Enhancements**: Improve the chat interface
3. **Knowledge Base**: Add more disaster relief specific responses
4. **Localization**: Add support for local languages (Cebuano, Tagalog)

## 📄 License

This disaster relief chatbot is designed for humanitarian use. Please ensure compliance with your local regulations and the model's usage terms.

---

**Emergency Contact Information for Cebu City:**
- Emergency Hotline: 911
- Cebu City Disaster Risk Reduction Office: (032) 411-2526
- Philippine Red Cross Cebu: (032) 418-4823

**Remember**: This chatbot is a supplementary tool. Always follow official emergency protocols and contact professional emergency services when needed.
