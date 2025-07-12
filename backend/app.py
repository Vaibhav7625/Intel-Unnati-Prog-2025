from fastapi import FastAPI, HTTPException, File, UploadFile, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import asyncio
import uvicorn
import os
import json
import base64
from datetime import datetime
import threading
import time
from ai_models import AdvancedClassroomAI

# Initialize FastAPI app
app = FastAPI(
    title="Advanced Classroom AI API",
    description="AI-powered educational assistant with text, voice, and visual capabilities",
    version="1.0.0"
)

# CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # More permissive for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global AI instance and status tracking
ai_assistant = None
initialization_status = "starting"
initialization_start_time = None
initialization_error = None

# Initialize AI models in background
def initialize_ai():
    global ai_assistant, initialization_status, initialization_start_time, initialization_error
    
    initialization_start_time = time.time()
    initialization_status = "initializing"
    
    try:
        print("🚀 Initializing AI models...")
        print("📝 This may take a few minutes on first run...")
        
        ai_assistant = AdvancedClassroomAI(
            device='cpu',
            save_images=True,
            display_images=False  # Don't display in API mode
        )
        
        # Verify models are actually ready
        if hasattr(ai_assistant, 'models_ready') and ai_assistant.models_ready:
            initialization_status = "ready"
            elapsed_time = time.time() - initialization_start_time
            print(f"✅ AI models initialized successfully in {elapsed_time:.2f} seconds!")
        else:
            initialization_status = "error"
            initialization_error = "Models loaded but not ready"
            print("❌ AI models loaded but not ready")
            
    except Exception as e:
        initialization_status = "error"
        initialization_error = str(e)
        print(f"❌ Failed to initialize AI models: {e}")
        ai_assistant = None

# Start AI initialization in background thread
print("🚀 Starting AI model initialization in background...")
threading.Thread(target=initialize_ai, daemon=True).start()

# Serve generated images
if not os.path.exists("generated_images"):
    os.makedirs("generated_images")
app.mount("/images", StaticFiles(directory="generated_images"), name="images")

# Pydantic models for API
class ChatRequest(BaseModel):
    message: str
    subject: str = "General"
    message_type: str = "text"  # text, voice, visual
    conversation_history: Optional[List[Dict[str, Any]]] = []

class ChatResponse(BaseModel):
    response: str
    analysis: Dict[str, Any]
    image_url: Optional[str] = None
    processing_time: float
    success: bool
    error: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    ai_models_ready: bool
    timestamp: str
    initialization_status: Optional[str] = None
    models_loaded: Optional[bool] = None
    error_message: Optional[str] = None
    initialization_time: Optional[float] = None

# Health check endpoint with detailed status
@app.get("/health", response_model=HealthResponse)
async def health_check():
    global ai_assistant, initialization_status, initialization_start_time, initialization_error
    
    # Calculate initialization time
    init_time = None
    if initialization_start_time:
        init_time = time.time() - initialization_start_time
    
    # Determine if models are ready
    models_ready = (
        ai_assistant is not None and 
        hasattr(ai_assistant, 'models_ready') and 
        ai_assistant.models_ready and
        initialization_status == "ready"
    )
    
    response = HealthResponse(
        status="healthy" if models_ready else "initializing",
        ai_models_ready=models_ready,
        timestamp=datetime.now().isoformat(),
        initialization_status=initialization_status,
        models_loaded=ai_assistant is not None,
        error_message=initialization_error,
        initialization_time=init_time
    )
    
    print(f"Health check: {response.dict()}")
    return response

# Main chat endpoint
@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    global ai_assistant, initialization_status
    
    try:
        # Check if AI is ready with detailed status
        if ai_assistant is None:
            return ChatResponse(
                response="AI models are still loading. Please try again in a moment.",
                analysis={"subject": request.subject, "status": "loading", "initialization_status": initialization_status},
                processing_time=0,
                success=False,
                error="AI models not ready"
            )
        
        if not hasattr(ai_assistant, 'models_ready') or not ai_assistant.models_ready:
            return ChatResponse(
                response="AI models are still initializing. Please wait a moment and try again.",
                analysis={"subject": request.subject, "status": "initializing", "initialization_status": initialization_status},
                processing_time=0,
                success=False,
                error="AI models not ready"
            )
        
        # Process the query using your AI models
        print(f"Processing query: {request.message[:100]}...")
        
        start_time = time.time()
        result = ai_assistant.process_educational_query(request.message)
        processing_time = time.time() - start_time
        
        print(f"Query processed in {processing_time:.2f} seconds")
        
        # Handle image URL if visual was generated
        image_url = None
        if result.get('visual_image'):
            # Get the most recent image from the directory
            images_dir = "generated_images"
            if os.path.exists(images_dir):
                image_files = [f for f in os.listdir(images_dir) if f.endswith('.png')]
                if image_files:
                    # Get the most recent image
                    image_files.sort(key=lambda x: os.path.getctime(os.path.join(images_dir, x)), reverse=True)
                    image_url = f"/images/{image_files[0]}"
        
        return ChatResponse(
            response=result['text_response'],
            analysis=result['analysis'],
            image_url=image_url,
            processing_time=processing_time,
            success=result['success']
        )
        
    except Exception as e:
        print(f"❌ Error in chat endpoint: {e}")
        return ChatResponse(
            response=f"I encountered an error processing your request: {str(e)}",
            analysis={"subject": request.subject, "error": str(e)},
            processing_time=0,
            success=False,
            error=str(e)
        )

# Voice processing endpoint
@app.post("/voice", response_model=ChatResponse)
async def process_voice(
    audio: UploadFile = File(...),
    subject: str = "General"
):
    try:
        if ai_assistant is None or not ai_assistant.models_ready:
            return ChatResponse(
                response="AI models are not ready for voice processing.",
                analysis={"subject": subject, "status": "not_ready"},
                processing_time=0,
                success=False,
                error="AI models not ready"
            )
        
        # For now, return a placeholder response
        # In a full implementation, you would:
        # 1. Save the audio file
        # 2. Use speech-to-text to convert audio to text
        # 3. Process the text with your AI models
        
        return ChatResponse(
            response="Voice processing is not fully implemented yet. Please use text input.",
            analysis={"subject": subject, "message_type": "voice"},
            processing_time=0,
            success=False,
            error="Voice processing not implemented"
        )
        
    except Exception as e:
        return ChatResponse(
            response="Error processing voice input.",
            analysis={"subject": subject, "error": str(e)},
            processing_time=0,
            success=False,
            error=str(e)
        )

# Subject-specific endpoints
@app.get("/subjects")
async def get_subjects():
    return {
        "subjects": [
            "Mathematics",
            "Physics", 
            "Biology",
            "Chemistry",
            "History",
            "Geography",
            "Literature",
            "Computer Science",
            "Economics",
            "General"
        ]
    }

# Get conversation analytics
@app.get("/analytics")
async def get_analytics():
    try:
        if ai_assistant is None:
            return {"error": "AI assistant not initialized"}
        
        history = getattr(ai_assistant, 'conversation_history', [])
        
        # Calculate some basic analytics
        total_queries = len(history)
        subjects = {}
        query_types = {}
        
        for conversation in history:
            subject = conversation.get('analysis', {}).get('subject', 'unknown')
            query_type = conversation.get('analysis', {}).get('query_type', 'unknown')
            
            subjects[subject] = subjects.get(subject, 0) + 1
            query_types[query_type] = query_types.get(query_type, 0) + 1
        
        return {
            "total_queries": total_queries,
            "subjects": subjects,
            "query_types": query_types,
            "average_processing_time": sum(c.get('processing_time', 0) for c in history) / max(total_queries, 1)
        }
        
    except Exception as e:
        return {"error": str(e)}

# Clear conversation history
@app.post("/clear-history")
async def clear_history():
    try:
        if ai_assistant is not None:
            if hasattr(ai_assistant, 'conversation_history'):
                ai_assistant.conversation_history = []
            return {"message": "Conversation history cleared successfully"}
        return {"error": "AI assistant not initialized"}
    except Exception as e:
        return {"error": str(e)}

# Get available images
@app.get("/images/list")
async def list_images():
    try:
        images_dir = "generated_images"
        if not os.path.exists(images_dir):
            return {"images": []}
        
        image_files = [f for f in os.listdir(images_dir) if f.endswith(('.png', '.jpg', '.jpeg'))]
        image_files.sort(key=lambda x: os.path.getctime(os.path.join(images_dir, x)), reverse=True)
        
        return {
            "images": [{"filename": f, "url": f"/images/{f}"} for f in image_files]
        }
    except Exception as e:
        return {"error": str(e)}

# Root endpoint with detailed status
@app.get("/")
async def root():
    global ai_assistant, initialization_status, initialization_start_time, initialization_error
    
    # Calculate initialization time
    init_time = None
    if initialization_start_time:
        init_time = time.time() - initialization_start_time
    
    models_ready = (
        ai_assistant is not None and 
        hasattr(ai_assistant, 'models_ready') and 
        ai_assistant.models_ready and
        initialization_status == "ready"
    )
    
    return {
        "message": "Advanced Classroom AI API",
        "status": "running",
        "ai_ready": models_ready,
        "initialization_status": initialization_status,
        "initialization_time": init_time,
        "error_message": initialization_error,
        "models_loaded": ai_assistant is not None,
        "endpoints": {
            "chat": "/chat",
            "voice": "/voice", 
            "health": "/health",
            "subjects": "/subjects",
            "analytics": "/analytics",
            "images": "/images/list"
        }
    }

if __name__ == "__main__":
    print("🚀 Starting Advanced Classroom AI API...")
    port = int(os.environ.get("PORT", 8000))  # Use dynamic port from Render if available
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=port,
        reload=True
    )