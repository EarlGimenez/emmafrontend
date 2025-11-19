#!/bin/bash

# Setup script for downloading the offline LLM model for disaster relief chatbot
# This script downloads a lightweight Gemma model optimized for mobile deployment
# The model will be stored locally to enable offline functionality

set -e  # Exit on any error

# Model configuration
MODEL_URL="https://huggingface.co/TheBloke/gemma-3-270m-GGUF/resolve/main/gemma-3-270m.q4_k_m.gguf"
TARGET_DIR="assets/models"
MODEL_FILE="gemma-3-270m.q4_k_m.gguf"
FULL_PATH="$TARGET_DIR/$MODEL_FILE"

echo "🚀 Starting offline chatbot model setup..."
echo "📍 Target directory: $TARGET_DIR"
echo "📦 Model file: $MODEL_FILE"

# Create the models directory if it doesn't exist
if [ ! -d "$TARGET_DIR" ]; then
    echo "📁 Creating models directory..."
    mkdir -p "$TARGET_DIR"
    echo "✅ Directory created successfully"
else
    echo "📁 Models directory already exists"
fi

# Check if model already exists
if [ -f "$FULL_PATH" ]; then
    echo "⚠️  Model file already exists. Do you want to re-download? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "✅ Using existing model file"
        exit 0
    fi
    echo "🗑️  Removing existing model file..."
    rm "$FULL_PATH"
fi

# Download the model
echo "⬬ Downloading model from Hugging Face..."
echo "📊 Model size: ~150MB (optimized for mobile)"
echo "⏳ This may take a few minutes depending on your connection..."

if curl -L --fail --show-error --progress-bar -o "$FULL_PATH" "$MODEL_URL"; then
    echo "✅ Model downloaded successfully!"
    echo "📍 Model location: $FULL_PATH"
    
    # Verify the download
    if [ -f "$FULL_PATH" ]; then
        # Get file size in a portable way
        if [[ "$OSTYPE" == "darwin"* ]]; then
            file_size=$(stat -f%z "$FULL_PATH")
        else
            file_size=$(stat -c%s "$FULL_PATH")
        fi
        echo "📊 Downloaded file size: $file_size bytes"
        echo "🎉 Setup complete! Your offline chatbot is ready to use."
        echo ""
        echo "Next steps:"
        echo "1. Import the LocalChatbot component in your app"
        echo "2. The model will be automatically loaded when the component mounts"
        echo "3. No internet connection required for inference!"
    else
        echo "❌ Error: Model file not found after download"
        exit 1
    fi
else
    echo "❌ Error: Failed to download model"
    echo "🔧 Troubleshooting:"
    echo "   - Check your internet connection"
    echo "   - Verify the Hugging Face URL is accessible"
    echo "   - Ensure you have sufficient disk space (~200MB)"
    exit 1
fi

echo ""
echo "🌍 Offline disaster relief chatbot setup complete!"
echo "💡 This model works entirely offline - perfect for emergency situations."
