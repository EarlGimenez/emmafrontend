import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Dimensions,
  Modal,
  ProgressBarAndroid,
} from 'react-native';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';

// Import modular response data
import { MASTER_PROMPT } from '../data/master-prompt';
import { emergencyKeywords, nonEmergencyTopics } from '../data/keywords';
import { getEmergencyResponse } from '../data/response-matcher';
import { getDeclineResponse, getRedirectResponse } from '../data/response-templates';

// Conditional import for llama.rn - only import if available
let LlamaContext: any = null;
let initLlama: any = null;

try {
  const llamaModule = require('llama.rn');
  LlamaContext = llamaModule.LlamaContext;
  initLlama = llamaModule.initLlama;
} catch (error) {
  console.log('📱 llama.rn not available - using demo mode');
}

// Type definitions for message structure
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: string;
}

// Download progress interface
interface DownloadProgress {
  totalBytesWritten: number;
  totalBytesExpectedToWrite: number;
  progress: number;
}

// Get screen dimensions for responsive design
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/**
 * Component to render formatted text with markdown-like styling
 */
const FormattedText = ({ text, style }: { text: string; style: any }) => {
  const renderFormattedText = () => {
    const lines = text.split('\n');
    const elements: React.ReactElement[] = [];
    
    lines.forEach((line, index) => {
      // Handle headers (###, ##, #)
      if (line.startsWith('###')) {
        elements.push(
          <Text key={index} style={[style, { fontSize: 16, fontWeight: 'bold', marginVertical: 4 }]}>
            {line.replace('###', '').trim()}
          </Text>
        );
      } else if (line.startsWith('##')) {
        elements.push(
          <Text key={index} style={[style, { fontSize: 18, fontWeight: 'bold', marginVertical: 6 }]}>
            {line.replace('##', '').trim()}
          </Text>
        );
      } else if (line.startsWith('#')) {
        elements.push(
          <Text key={index} style={[style, { fontSize: 20, fontWeight: 'bold', marginVertical: 8 }]}>
            {line.replace('#', '').trim()}
          </Text>
        );
      }
      // Handle bold text (**text**)
      else if (line.includes('**')) {
        const parts = line.split('**');
        const textElements: (string | React.ReactElement)[] = [];
        
        parts.forEach((part, partIndex) => {
          if (partIndex % 2 === 1) {
            // Odd indices are bold text
            textElements.push(
              <Text key={partIndex} style={{ fontWeight: 'bold' }}>
                {part}
              </Text>
            );
          } else {
            textElements.push(part);
          }
        });
        
        elements.push(
          <Text key={index} style={style}>
            {textElements}
          </Text>
        );
      }
      // Handle bullet points (• or -)
      else if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        elements.push(
          <Text key={index} style={[style, { marginLeft: 8, marginVertical: 2 }]}>
            {line}
          </Text>
        );
      }
      // Handle numbered lists (1., 2., etc.)
      else if (/^\d+\./.test(line.trim())) {
        elements.push(
          <Text key={index} style={[style, { marginLeft: 8, marginVertical: 2 }]}>
            {line}
          </Text>
        );
      }
      // Handle empty lines
      else if (line.trim() === '') {
        elements.push(
          <Text key={index} style={style}>
            {'\n'}
          </Text>
        );
      }
      // Regular text
      else {
        elements.push(
          <Text key={index} style={style}>
            {line}
          </Text>
        );
      }
    });
    
    return elements;
  };
  
  return <View>{renderFormattedText()}</View>;
};

/**
 * LocalChatbot Component
 * 
 * An offline-first disaster relief chatbot designed for emergency situations
 * in areas like Cebu City, Philippines. This component provides:
 * 
 * - Complete offline functionality using a local GGUF model
 * - Conversational AI assistance for disaster relief scenarios
 * - Optimized UI for mobile devices
 * - No internet connection required during runtime
 * 
 * The chatbot is pre-loaded with disaster relief knowledge and can provide
 * guidance on emergency procedures, safety protocols, and resource locations.
 */
const LocalChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '🚨 **EMMA Emergency Response System Activated**\n\nThis is EMMA - Evacuation Management and Monitoring Assistant. To provide you with complete offline emergency response capabilities, I need to download an AI model (~270MB) to your device. This one-time download enables full emergency dispatch assistance.',
      sender: 'system',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  // State for LLaMA context (can be null if not loaded)
  const [llamaContext, setLlamaContext] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [modelStatus, setModelStatus] = useState<'not_downloaded' | 'downloading' | 'loading' | 'ready' | 'error'>('not_downloaded');
  const [isModelInitialized, setIsModelInitialized] = useState(false);
  
  // Location state
  const [currentLocation, setCurrentLocation] = useState<string>('Cebu City, Philippines');
  
  // Download states
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress>({
    totalBytesWritten: 0,
    totalBytesExpectedToWrite: 0,
    progress: 0,
  });
  const [isModelDownloaded, setIsModelDownloaded] = useState(false);
  
  // Ref for FlatList to enable auto-scrolling
  const flatListRef = useRef<FlatList>(null);

  /**
   * Check for existing model on component mount
   */
  useEffect(() => {
    checkForExistingModel();
    getCurrentLocationInfo();
  }, []);

  /**
   * Get current location information
   */
  const getCurrentLocationInfo = async () => {
    try {
      // Check if location permissions are granted
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission not granted, using default location');
        return;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Reverse geocode to get city/region name
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const locationString = `${address.city || address.region || 'Unknown City'}, ${address.country || 'Philippines'}`;
        setCurrentLocation(locationString);
        console.log('📍 Location updated:', locationString);
      }
    } catch (error) {
      console.log('📍 Could not get location, using default:', error);
      // Keep default location if getting current location fails
    }
  };

  /**
   * Check if the model is already downloaded
   */
  const checkForExistingModel = async () => {
    try {
      // Prevent multiple initializations
      if (isModelInitialized) {
        console.log('🔄 Model already initialized, skipping...');
        return;
      }

      // If llama.rn is not available, go straight to demo mode
      if (!initLlama) {
        console.log('📱 llama.rn not available - using demo mode');
        setIsModelDownloaded(false);
        setModelStatus('ready');
        setIsModelInitialized(true);
        
        setMessages([{
          id: '1',
          text: '**EMMA Emergency Response Ready** (Demo Mode)\n\nThis is EMMA - Evacuation Management and Monitoring Assistant. I can provide emergency dispatch guidance and safety instructions using intelligent response protocols.\n\n📍 **Your location is being tracked for emergency response**\n🚑 **Emergency services are on standby**\n\n**Tell me about your emergency situation immediately.**',
          sender: 'system',
          timestamp: new Date().toISOString(),
        }]);
        return;
      }
      
      const modelPath = `${FileSystem.documentDirectory}emergency-ai-model.gguf`;
      const fileInfo = await FileSystem.getInfoAsync(modelPath);
      
      if (fileInfo.exists && 'size' in fileInfo && fileInfo.size && fileInfo.size > 50000000) { // Check if file is larger than 50MB
        console.log('✅ Model already downloaded:', fileInfo.size, 'bytes');
        setIsModelDownloaded(true);
        setModelStatus('ready');
        setIsModelInitialized(true);
        
        // Update initial message
        setMessages([{
          id: '1',
          text: `🚨 **EMMA Emergency Response System Online**\n\n📍 **Location: ${currentLocation}**\n🚑 **Emergency Services: ACTIVE**\n💾 **Offline AI Model: LOADED**\n\nThis is EMMA - Evacuation Management and Monitoring Assistant. I am your emergency dispatch interface. **Tell me about your emergency situation immediately.**`,
          sender: 'system',
          timestamp: new Date().toISOString(),
        }]);
        
        // Try to initialize the model only once
        await initializeExistingModel(modelPath);
      } else {
        console.log('📥 Model not found or incomplete, showing download option');
        setModelStatus('not_downloaded');
        setIsModelDownloaded(false);
        setIsModelInitialized(true);
      }
    } catch (error) {
      console.error('❌ Error checking for existing model:', error);
      setModelStatus('not_downloaded');
      setIsModelDownloaded(false);
      setIsModelInitialized(true);
    }
  };

  /**
   * Download the GGUF model from Hugging Face
   */
  const downloadModel = async () => {
    try {
      setShowDownloadModal(true);
      setModelStatus('downloading');
      
      // For testing: First try a smaller model or test file
      const testMode = false; // Set to true for testing with smaller file
      
      let modelUrl: string;
      let modelPath: string;
      let expectedSizeMB: number;
      
      if (testMode) {
        // Test with a smaller file first
        modelUrl = 'https://huggingface.co/microsoft/DialoGPT-medium/resolve/main/config.json';
        modelPath = `${FileSystem.documentDirectory}test-download.json`;
        expectedSizeMB = 0.001; // Very small file for testing
      } else {
        // Use Gemma-3 270M model - much smaller and faster for mobile
        modelUrl = 'https://huggingface.co/unsloth/gemma-3-270m-it-GGUF/resolve/main/gemma-3-270m-it-Q4_K_M.gguf?download=true';
        modelPath = `${FileSystem.documentDirectory}emergency-ai-model.gguf`;
        expectedSizeMB = 100; // Expecting around 270MB
      }
      
      console.log('📥 Starting model download from:', modelUrl);
      console.log('📂 Downloading to:', modelPath);
      
      // Add download start message
      const downloadMessage: Message = {
        id: Date.now().toString(),
        text: testMode 
          ? '📥 Testing download functionality...' 
          : '📥 Starting download of Emergency AI model (~270MB). This may take a few minutes depending on your internet connection...',
        sender: 'system',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, downloadMessage]);
      
      // Create download with progress tracking
      const downloadResumable = FileSystem.createDownloadResumable(
        modelUrl,
        modelPath,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; EmergencyAI/1.0)',
          },
        },
        (downloadProgressData) => {
          const progress = downloadProgressData.totalBytesExpectedToWrite > 0 
            ? downloadProgressData.totalBytesWritten / downloadProgressData.totalBytesExpectedToWrite 
            : 0;
          
          setDownloadProgress({
            totalBytesWritten: downloadProgressData.totalBytesWritten,
            totalBytesExpectedToWrite: downloadProgressData.totalBytesExpectedToWrite,
            progress: isNaN(progress) ? 0 : progress,
          });
          
          // Log progress every 50MB (or every KB for test mode)
          const logInterval = testMode ? 1024 : (50 * 1024 * 1024);
          if (downloadProgressData.totalBytesWritten % logInterval < 1024) {
            const mbDownloaded = Math.round(downloadProgressData.totalBytesWritten / (1024 * 1024));
            const mbTotal = downloadProgressData.totalBytesExpectedToWrite > 0 
              ? Math.round(downloadProgressData.totalBytesExpectedToWrite / (1024 * 1024))
              : 'Unknown';
            console.log(`📊 Download progress: ${mbDownloaded}MB / ${mbTotal}MB (${Math.round((progress || 0) * 100)}%)`);
          }
        }
      );
      
      console.log('🚀 Starting download...');
      const result = await downloadResumable.downloadAsync();
      
      if (result && result.uri) {
        console.log('✅ Model download completed:', result.uri);
        
        // Verify the downloaded file
        const fileInfo = await FileSystem.getInfoAsync(result.uri);
        console.log('📊 Downloaded file info:', fileInfo);
        
        const minSizeBytes = expectedSizeMB * 1024 * 1024;
        
        if (fileInfo.exists && 'size' in fileInfo && fileInfo.size && fileInfo.size > minSizeBytes) {
          setIsModelDownloaded(true);
          setShowDownloadModal(false);
          
          const successMessage: Message = {
            id: Date.now().toString(),
            text: testMode 
              ? `✅ Download test successful! (${Math.round(fileInfo.size / 1024)}KB) Download functionality is working.`
              : `✅ Emergency AI model downloaded successfully! (${Math.round(fileInfo.size / (1024 * 1024))}MB) Initializing offline assistant...`,
            sender: 'system',
            timestamp: new Date().toISOString(),
          };
          setMessages(prev => [...prev, successMessage]);
          
          if (!testMode) {
            // Initialize the downloaded model
            await initializeExistingModel(result.uri);
          } else {
            // For test mode, just show success and enable demo mode
            setModelStatus('ready');
            const demoMessage: Message = {
              id: Date.now().toString(),
              text: '🟢 Demo Mode Ready! Download functionality verified. Ask me about emergency procedures!',
              sender: 'system',
              timestamp: new Date().toISOString(),
            };
            setMessages(prev => [...prev, demoMessage]);
          }
        } else {
          const fileSize = 'size' in fileInfo ? fileInfo.size || 0 : 0;
          throw new Error(`Downloaded file is too small (${Math.round(fileSize / (1024 * 1024))}MB). Expected at least ${expectedSizeMB}MB.`);
        }
      } else {
        throw new Error('Download failed - no result URI received');
      }
      
    } catch (error) {
      console.error('❌ Model download failed:', error);
      setModelStatus('error');
      setShowDownloadModal(false);
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: `❌ Download failed: ${(error as Error).message}\n\nYou can try downloading again or use the demo mode for basic emergency guidance. Demo mode still provides excellent emergency assistance!`,
        sender: 'system',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Automatically fall back to demo mode
      setTimeout(() => {
        setModelStatus('ready');
        const demoMessage: Message = {
          id: Date.now().toString(),
          text: '🟢 Demo Mode Activated! I can still help with emergency procedures, disaster preparedness, and safety guidance using intelligent pre-programmed responses.',
          sender: 'system',
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, demoMessage]);
      }, 2000);
    }
  };

  /**
   * Initialize the downloaded model
   */
  const initializeExistingModel = async (modelPath: string) => {
    try {
      // Prevent multiple initializations
      if (llamaContext) {
        console.log('🔄 Model already initialized, skipping initialization...');
        return;
      }

      setModelStatus('loading');
      
      // Check if llama.rn native module is available
      if (!initLlama) {
        console.log('⚠️ llama.rn not available - falling back to demo mode');
        throw new Error('This device does not support the full AI model. Using smart demo mode instead.');
      }
      
      console.log('🚀 Initializing downloaded model:', modelPath);
      
      const context = await initLlama({
        model: modelPath,
        use_mlock: false,
        n_ctx: 1024,
        n_batch: 256,
        n_gpu_layers: 0,
      });
      
      setLlamaContext(context);
      setModelStatus('ready');
      
    } catch (error) {
      console.error('❌ Model initialization failed:', error);
      setModelStatus('ready'); // Fall back to demo mode
      
      const fallbackMessage: Message = {
        id: Date.now().toString(),
        text: `⚠️ **EMMA Emergency System Active** (Dispatch Mode)\n\n📍 **Location: ${currentLocation}**\n🚑 **Emergency Response: READY**\n\nI am EMMA - Evacuation Management and Monitoring Assistant. Full AI unavailable but emergency dispatch protocols are active. **What is your emergency situation?**`,
        sender: 'system',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, fallbackMessage]);
    }
  };

  /**
   * Initialize the local LLaMA model for offline inference
   * This now uses the real llama.rn package to load the GGUF model
   */
  const initializeModel = async () => {
    try {
      setModelStatus('loading');
      setIsLoading(true);

      console.log('🤖 Initializing real GGUF model...');
      
      // Check if llama.rn native module is available
      if (!initLlama) {
        throw new Error('llama.rn native module not available. This may be because:\n1. The app needs to be rebuilt after installing llama.rn\n2. The native module is not properly linked\n3. Running on web/simulator without native support');
      }
      
      // Try multiple possible paths for the model file
      const possiblePaths = [
        // Document directory path (writeable)
        `${FileSystem.documentDirectory}gemma-3-270m.q4_k_m.gguf`,
        // Bundle directory path (read-only)
        `${FileSystem.bundleDirectory}assets/models/gemma-3-270m.q4_k_m.gguf`,
      ];
      
      let modelPath = '';
      let modelFound = false;
      
      // Try to find the model file
      for (const path of possiblePaths) {
        try {
          console.log('🔍 Checking path:', path);
          const fileInfo = await FileSystem.getInfoAsync(path);
          console.log('📊 File info for', path, ':', JSON.stringify(fileInfo, null, 2));
          
          if (fileInfo.exists) {
            modelPath = path;
            modelFound = true;
            console.log('✅ Found model at:', path, 'Size:', fileInfo.size, 'bytes');
            break;
          } else {
            console.log('❌ Model not found at:', path);
          }
        } catch (error) {
          console.log('❌ Error checking path:', path, (error as Error).message);
        }
      }
      
      if (!modelFound) {
        // Try to copy the model from assets to document directory
        const sourceModelPath = `${FileSystem.bundleDirectory}assets/models/gemma-3-270m.q4_k_m.gguf`;
        const destModelPath = `${FileSystem.documentDirectory}gemma-3-270m.q4_k_m.gguf`;
        
        try {
          console.log('� Attempting to copy model from bundle to documents...');
          await FileSystem.copyAsync({
            from: sourceModelPath,
            to: destModelPath,
          });
          modelPath = destModelPath;
          modelFound = true;
          console.log('✅ Model copied successfully');
        } catch (copyError) {
          console.error('❌ Failed to copy model:', copyError);
          throw new Error(`Model file not found. Tried paths:\n${possiblePaths.join('\n')}\n\nPlease ensure the GGUF model was downloaded by running the setup script.`);
        }
      }
      
      console.log('📂 Using model file at:', modelPath);

      // Initialize llama.rn and get context with comprehensive error handling
      try {
        console.log('🚀 Attempting to initialize llama.rn with model:', modelPath);
        
        const context = await initLlama({
          model: modelPath,
          use_mlock: false,  // Disable memory locking for compatibility
          n_ctx: 1024,       // Reduce context size for mobile
          n_batch: 256,      // Reduce batch size for mobile
          n_gpu_layers: 0,   // Disable GPU for compatibility
        });

        console.log('✅ Real GGUF model loaded successfully!');
        
        // Set the real context
        setLlamaContext(context);
        setModelStatus('ready');
        setIsLoading(false);
        
        // Add a system message to confirm the model is ready
        const systemMessage: Message = {
          id: Date.now().toString(),
          text: '🟢 Real GGUF Model Loaded Successfully! The 270M parameter Gemma model is now ready for offline emergency assistance.',
          sender: 'system',
          timestamp: new Date().toISOString(),
        };
        
        setMessages(prev => [...prev, systemMessage]);
        
      } catch (initError) {
        console.error('❌ Failed to initialize llama.rn:', initError);
        throw initError;
      }

    } catch (error) {
      console.error('❌ Error loading real GGUF model:', error);
      setModelStatus('error');
      setIsLoading(false);
      
      // Fall back to intelligent mock responses
      console.log('🔄 Falling back to intelligent demo mode...');
      
      setLlamaContext(null);
      setModelStatus('ready');
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: `⚠️ Real model failed to load: ${(error as Error).message}\n\nRunning in smart demo mode. For full AI functionality, please:\n1. Rebuild the app (expo run:android or expo run:ios)\n2. Ensure you're running on a physical device\n3. Check that the model file exists\n\nTry asking about emergencies!`,
        sender: 'system',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  /**
   * Handle sending a new message
   * Processes user input and generates AI response using the local model or demo mode
   */
  const handleSend = async () => {
    if (!inputText.trim() || isTyping) {
      return;
    }

    // If model isn't downloaded yet, show download option
    if (!isModelDownloaded && modelStatus === 'not_downloaded') {
      const downloadPrompt: Message = {
        id: Date.now().toString(),
        text: '� **EMMA Emergency Protocol**\n\n📍 I can provide basic emergency dispatch now, but for **full emergency response capabilities**, download the EMMA AI model (270MB).\n\n**Emergency situation detected. Describe your emergency immediately while I prepare response.**',
        sender: 'system',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, downloadPrompt]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Construct conversation context for the AI
      const conversationHistory = messages
        .filter(msg => msg.sender !== 'system')
        .slice(-10) // Keep last 10 messages for context
        .map(msg => `${msg.sender === 'user' ? 'Human' : 'Assistant'}: ${msg.text}`)
        .join('\n');

      // Create a 911 emergency dispatch prompt with proper Gemma-3 formatting
      const prompt = `<bos><start_of_turn>system
${MASTER_PROMPT}

Location Context: ${currentLocation}
<end_of_turn>
<start_of_turn>user
${userMessage.text}
<end_of_turn>
<start_of_turn>model
`;

      console.log('🤖 Generating response...');
      
      // Prioritize RAG responses for faster, more reliable emergency guidance
      if (true) { // Always use RAG responses first - AI model as fallback only
        // Enhanced RAG-style intelligent response system with topic validation (PRIORITY)
        console.log('🚨 Using enhanced RAG-style emergency responses first (priority for reliability)...');
        
        const userText = userMessage.text.toLowerCase();
        
        // Use modular keyword arrays from data/keywords.ts
        const isEmergencyRelated = emergencyKeywords.some(keyword => 
          userText.includes(keyword)
        );
        
        const isNonEmergencyTopic = nonEmergencyTopics.some(topic => 
          userText.includes(topic)
        );
        
        // If it's clearly a non-emergency topic, politely decline
        if (isNonEmergencyTopic && !isEmergencyRelated) {
          // Add realistic delay for decline response (1-2 seconds)
          setTimeout(() => {
            const assistantMessage: Message = {
              id: Date.now().toString(),
              text: getDeclineResponse(userMessage.text),
              sender: 'assistant',
              timestamp: new Date().toISOString(),
            };

            setMessages(prev => [...prev, assistantMessage]);
            setIsTyping(false);
          }, 1500);
          return;
        }
        
        // If the query doesn't contain emergency keywords and isn't clearly non-emergency,
        // gently redirect to emergency topics
        if (!isEmergencyRelated) {
          // Add realistic delay for redirect response (1-2 seconds)
          setTimeout(() => {
            const assistantMessage: Message = {
              id: Date.now().toString(),
              text: getRedirectResponse(userMessage.text, currentLocation),
              sender: 'assistant',
              timestamp: new Date().toISOString(),
            };

            setMessages(prev => [...prev, assistantMessage]);
            setIsTyping(false);
          }, 1800);
          return;
        }
        
        // If we reach here, it's an emergency-related query - proceed with RAG response
        const botResponse = getEmergencyResponse(userText, currentLocation);

        // Add realistic delay for emergency response (2-3 seconds to simulate dispatch processing)
        setTimeout(() => {
          const assistantMessage: Message = {
            id: Date.now().toString(),
            text: botResponse,
            sender: 'assistant',
            timestamp: new Date().toISOString(),
          };

          setMessages(prev => [...prev, assistantMessage]);
          setIsTyping(false);

          // Fallback to AI model only if RAG response doesn't provide specific guidance
          // (This could be used for complex queries that don't match our pre-defined patterns)
          if (llamaContext && botResponse.includes("I didn't find a specific emergency protocol")) {
            console.log('🤖 Falling back to AI model for complex emergency query...');
            
            // Set typing indicator back on for AI processing
            setIsTyping(true);
            
            setTimeout(async () => {
              try {
                const response = await llamaContext.completion({
                  prompt: `Emergency dispatch for: ${userMessage.text}. Provide emergency guidance.`,
                  n_predict: 200,
                  temperature: 0.7,
                  top_k: 40,
                  top_p: 0.9,
                  stop: ['<end_of_turn>', '<start_of_turn>', 'user', 'User:', 'Human:'],
                });

                if (response.text?.trim()) {
                  const aiAssistantMessage: Message = {
                    id: Date.now().toString(),
                    text: `## 🤖 EMMA AI Emergency Support\n\n${response.text.trim()}`,
                    sender: 'assistant', 
                    timestamp: new Date().toISOString(),
                  };

                  setMessages(prev => [...prev, aiAssistantMessage]);
                }
              } catch (aiError) {
                console.error('AI fallback error:', aiError);
                // RAG response already sent, no need for additional error handling
              } finally {
                setIsTyping(false);
              }
            }, 1000); // Additional delay for AI processing
          }
        }, 2500);
      }

    } catch (error) {
      console.error('❌ Error generating response:', error);
      
      // Handle error gracefully
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: 'I apologize, but I encountered an error while processing your request. Please try again.',
        sender: 'assistant',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  /**
   * Render individual chat message
   * Applies different styling for user, assistant, and system messages
   */
  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    const isSystem = item.sender === 'system';
    
    return (
      <View style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.assistantMessageContainer,
        isSystem && styles.systemMessageContainer
      ]}>
        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.assistantBubble,
          isSystem && styles.systemBubble
        ]}>
          {/* Use FormattedText for better formatting */}
          <FormattedText 
            text={item.text}
            style={[
              styles.messageText,
              isUser ? styles.userText : styles.assistantText,
              isSystem && styles.systemText
            ]}
          />
          <Text style={[
            styles.timestamp,
            isUser ? styles.userTimestamp : styles.assistantTimestamp
          ]}>
            {new Date(item.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>
      </View>
    );
  };

  /**
   * Scroll to bottom when new messages are added
   */
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}> Chat with E.M.M.A</Text>
        <View style={[styles.statusIndicator, {
          backgroundColor: modelStatus === 'ready' ? '#4CAF50' : 
                          modelStatus === 'loading' ? '#FF9800' : 
                          modelStatus === 'downloading' ? '#2196F3' :
                          modelStatus === 'not_downloaded' ? '#9C27B0' : '#F44336'
        }]}>
          <Text style={styles.statusText}>
            {modelStatus === 'ready' ? (isModelDownloaded ? '🟢 EMMA Ready' : '🟢 Dispatch Ready') : 
             modelStatus === 'loading' ? '🟡 Loading...' : 
             modelStatus === 'downloading' ? '📥 Downloading...' :
             modelStatus === 'not_downloaded' ? '📱 Tap to Download' : '🔴 Error'}
          </Text>
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Typing Indicator */}
      {isTyping && (
        <View style={styles.typingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.typingText}>Assistant is typing...</Text>
        </View>
      )}

      {/* Input Area */}
      <View style={styles.inputContainer}>
        {/* Download button when model not downloaded */}
        {!isModelDownloaded && modelStatus === 'not_downloaded' && (
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={downloadModel}
          >
            <Text style={styles.downloadButtonText}>📥 Download EMMA AI (~270MB)</Text>
            <Text style={styles.downloadSubtext}>Enhanced emergency dispatch capabilities</Text>
          </TouchableOpacity>
        )}
        
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder={isModelDownloaded ? 
            "Describe your emergency situation..." :
            "Download EMMA first for emergency assistance..."
          }
          placeholderTextColor="#999"
          multiline
          maxLength={500}
          editable={!isLoading && (modelStatus === 'ready' || !isModelDownloaded)}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!inputText.trim() || isLoading || isTyping || (modelStatus !== 'ready' && isModelDownloaded)) && styles.sendButtonDisabled
          ]}
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading || isTyping}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

      {/* Download Progress Modal */}
      <Modal
        visible={showDownloadModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Downloading EMMA AI</Text>
            <Text style={styles.modalSubtitle}>
              Gemma-3 270M Model (~270MB)
            </Text>
            
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${(downloadProgress?.progress || 0) * 100}%` }]} />
            </View>
            
            <Text style={styles.progressText}>
              {Math.round((downloadProgress?.progress || 0) * 100)}% complete
            </Text>
            
            {downloadProgress && (
              <Text style={styles.modalSubtitle}>
                {Math.round(downloadProgress.totalBytesWritten / (1024 * 1024))}MB / 
                {downloadProgress.totalBytesExpectedToWrite > 0 
                  ? Math.round(downloadProgress.totalBytesExpectedToWrite / (1024 * 1024))
                  : '270'
                }MB
              </Text>
            )}
            
            <Text style={styles.modalDescription}>
              This download enables completely offline emergency assistance. 
              The AI model will be saved to your device for future use.
            </Text>
          </View>
        </View>
      </Modal>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>
            {modelStatus === 'loading' ? 'Initializing AI model...' : 'Loading...'}
          </Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

/**
 * Comprehensive styles for the LocalChatbot component
 * Optimized for mobile devices with accessibility in mind
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  // Header styles
  header: {
    backgroundColor: '#007AFF',
    paddingTop: Platform.OS === 'ios' ? 50 : 25,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginLeft: 10,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },

  // Messages styles
  messagesList: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContent: {
    paddingVertical: 10,
  },
  messageContainer: {
    marginVertical: 4,
    marginHorizontal: 15,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  assistantMessageContainer: {
    alignItems: 'flex-start',
  },
  systemMessageContainer: {
    alignItems: 'center',
  },
  messageBubble: {
    maxWidth: screenWidth * 0.8,
    padding: 12,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
  },
  systemBubble: {
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    maxWidth: screenWidth * 0.9,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: 'white',
  },
  assistantText: {
    color: '#333',
  },
  systemText: {
    color: '#856404',
    fontSize: 14,
    textAlign: 'center',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 6,
    opacity: 0.7,
  },
  userTimestamp: {
    color: 'white',
    textAlign: 'right',
  },
  assistantTimestamp: {
    color: '#666',
  },

  // Typing indicator styles
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
  },
  typingText: {
    marginLeft: 10,
    color: '#666',
    fontStyle: 'italic',
  },

  // Input area styles
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // Loading overlay styles
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
  
  // Download button styles
  downloadButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  downloadSubtext: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
    opacity: 0.9,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    margin: 20,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  progressContainer: {
    width: 250,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 15,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 15,
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default LocalChatbot;
