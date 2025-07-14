import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mic, MicOff, Send, Bot, User, AlertCircle, CheckCircle } from 'lucide-react';
import { apiService, ChatResponse } from '@/services/api';

interface Message {
  id: string;
  type: 'student' | 'ai';
  content: string;
  timestamp: Date;
  mediaType?: 'text' | 'voice' | 'visual';
  imageUrl?: string;
  analysis?: any;
}

interface AiAssistantProps {
  subject?: string;
  onEngagementChange?: (level: 'high' | 'medium' | 'low') => void;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ subject = "General", onEngagementChange }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: `Hello! I'm your ${subject} Learning Assistant. I can help you understand complex concepts, solve problems, and provide visual explanations. What would you like to learn about today?`,
      timestamp: new Date(),
      mediaType: 'text'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'connecting' | 'connected' | 'error' | 'not_ready'>('connecting');
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [healthCheckAttempts, setHealthCheckAttempts] = useState(0);
  const [lastHealthCheck, setLastHealthCheck] = useState<Date | null>(null);
  const [isProcessing, setIsProcessing] = useState(false); // Track if backend is processing
  // Track if a processing info message is shown
  const processingInfoIdRef = useRef<string | null>(null);
  // Track if a real error should be shown after a second failure
  const [consecutiveTimeout, setConsecutiveTimeout] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const healthCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial health check
    checkBackendStatus();
    
    // Set up more frequent health checks initially, then reduce frequency
    const startHealthCheckInterval = () => {
      if (healthCheckIntervalRef.current) {
        clearInterval(healthCheckIntervalRef.current);
      }
      
      // More frequent checks initially (every 2 seconds for first 30 seconds)
      const interval = backendStatus === 'connected' ? 30000 : 2000;
      
      healthCheckIntervalRef.current = setInterval(() => {
        checkBackendStatus();
      }, interval);
    };
    
    startHealthCheckInterval();
    
    return () => {
      if (healthCheckIntervalRef.current) {
        clearInterval(healthCheckIntervalRef.current);
      }
    };
  }, [backendStatus]);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleSendMessage(transcript, 'voice');
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const checkBackendStatus = async () => {
    if (isProcessing) {
      console.log('🛑 Skipping health check during active processing');
      return;
    }
    try {
      console.log('Checking backend status...');
      const health = await apiService.checkHealth();
      console.log('Health check response:', health);
      
      setLastHealthCheck(new Date());
      setHealthCheckAttempts(prev => prev + 1);
      
      if (health.ai_models_ready) {
        console.log('✅ AI models are ready!');
        setBackendStatus('connected');
        // Reduce frequency of health checks once connected
        if (healthCheckIntervalRef.current) {
          clearInterval(healthCheckIntervalRef.current);
          healthCheckIntervalRef.current = setInterval(checkBackendStatus, 30000);
        }
      } else {
        console.log('⏳ AI models are still loading...');
        setBackendStatus('not_ready');
      }
    } catch (error) {
      console.error('Backend connection error:', error);
      setHealthCheckAttempts(prev => prev + 1);
      if (!isProcessing) {
        // Optional: debounce error marking to avoid false alerts
        setTimeout(() => {
          setBackendStatus(prev => prev === 'connected' ? 'error' : prev);
        }, 2000); // 2 seconds delay
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string, mediaType: 'text' | 'voice' | 'visual' = 'text') => {
    if (!content.trim()) return;

    const studentMessage: Message = {
      id: Date.now().toString(),
      type: 'student',
      content,
      timestamp: new Date(),
      mediaType
    };

    setMessages(prev => [...prev, studentMessage]);
    setInputText('');
    setIsLoading(true);
    setIsProcessing(true);

    try {
      console.log('Sending message to backend...');
      // Send message to backend
      const response: ChatResponse = await apiService.sendMessage({
        message: content,
        subject,
        message_type: mediaType,
        conversation_history: conversationHistory
      });

      // If a processing info message was shown, remove it
      if (processingInfoIdRef.current) {
        setMessages(prev => prev.filter(m => m.id !== processingInfoIdRef.current));
        processingInfoIdRef.current = null;
      }
      setIsProcessing(false);
      setConsecutiveTimeout(false);

      console.log('Received response:', response);

      // Create AI response message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.response,
        timestamp: new Date(),
        mediaType: 'text',
        imageUrl: response.image_url ? apiService.getImageUrl(response.image_url) : undefined,
        analysis: response.analysis
      };

      setMessages(prev => [...prev, aiMessage]);
      // Update conversation history
      setConversationHistory(prev => [...prev, {
        student_message: content,
        ai_response: response.response,
        analysis: response.analysis,
        timestamp: new Date().toISOString()
      }]);

      // Analyze engagement based on backend analysis
      if (response.analysis && onEngagementChange) {
        const engagement = determineEngagementLevel(response.analysis);
        onEngagementChange(engagement);
      }
    } catch (error) {
      setIsProcessing(false);
      console.error('Error sending message:', error);
      // Check if this is a connection error - might need to update status
      if (error instanceof Error && error.message.includes('fetch')) {
        if (!isProcessing) {
          setBackendStatus('error');
        } else {
          console.warn('Fetch error occurred but backend is still processing. Suppressing error state.');
        }
      }
      // Only show a processing info message on first timeout, not an error
      if (error instanceof Error && error.message.toLowerCase().includes('timeout')) {
        if (!consecutiveTimeout) {
          // Show info message, not error
          const infoId = (Date.now() + 1).toString();
          processingInfoIdRef.current = infoId;
          setMessages(prev => [...prev, {
            id: infoId,
            type: 'ai',
            content: "AI is still processing your request. Please wait, you will see the response here when ready.",
            timestamp: new Date(),
            mediaType: 'text'
          }]);
          setConsecutiveTimeout(true);
        } else {
          // On second consecutive timeout, show error
          const errorId = (Date.now() + 1).toString();
          setMessages(prev => [...prev, {
            id: errorId,
            type: 'ai',
            content: "AI failed to respond in time. Please try again later or check your connection.",
            timestamp: new Date(),
            mediaType: 'text'
          }]);
          setConsecutiveTimeout(false);
        }
      } else {
        // Show other errors as before
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: backendStatus === 'error' 
            ? "I'm having trouble connecting to my AI models. Please check if the backend server is running and try again."
            : backendStatus === 'not_ready'
            ? "My AI models are still loading. Please wait a moment and try again."
            : "I encountered an error processing your request. Please try again.",
          timestamp: new Date(),
          mediaType: 'text'
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const determineEngagementLevel = (analysis: any): 'high' | 'medium' | 'low' => {
    if (!analysis) return 'medium';
    
    // Use backend analysis to determine engagement
    const complexity = analysis.complexity?.toLowerCase();
    const confidence = analysis.confidence || 0;
    
    if (complexity === 'high' || confidence > 0.8) return 'high';
    if (complexity === 'medium' || confidence > 0.5) return 'medium';
    return 'low';
  };

  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const getStatusColor = () => {
    switch (backendStatus) {
      case 'connected': return 'text-green-500';
      case 'connecting': return 'text-yellow-500';
      case 'not_ready': return 'text-orange-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (backendStatus) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'connecting': return <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />;
      case 'not_ready': return <AlertCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = () => {
    switch (backendStatus) {
      case 'connected': return 'AI Models Ready';
      case 'connecting': return 'Connecting...';
      case 'not_ready': return 'AI Models Loading...';
      case 'error': return 'Connection Error';
      default: return 'Unknown Status';
    }
  };

  const getDetailedStatusText = () => {
    const timeSinceLastCheck = lastHealthCheck ? 
      Math.floor((Date.now() - lastHealthCheck.getTime()) / 1000) : 0;
    
    switch (backendStatus) {
      case 'connected': return `AI Models Ready (${healthCheckAttempts} checks)`;
      case 'connecting': return `Connecting... (${healthCheckAttempts} attempts)`;
      case 'not_ready': return `AI Models Loading... (${healthCheckAttempts} checks, last: ${timeSinceLastCheck}s ago)`;
      case 'error': return `Connection Error (${healthCheckAttempts} attempts)`;
      default: return 'Unknown Status';
    }
  };

  // Manual retry function
  const retryConnection = () => {
    setBackendStatus('connecting');
    setHealthCheckAttempts(0);
    checkBackendStatus();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              subject === 'Mathematics' ? 'bg-gradient-to-br from-blue-500 to-purple-600' :
              subject === 'Physics' ? 'bg-gradient-to-br from-indigo-500 to-purple-700' :
              subject === 'Biology' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
              'bg-gradient-primary'
            }`}>
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{subject} AI Assistant</h2>
              <div className={`flex items-center gap-2 text-sm ${getStatusColor()}`}>
                {getStatusIcon()}
                <span>{getStatusText()}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={isListening ? "destructive" : "outline"}
              size="sm"
              onClick={toggleVoiceRecognition}
              className="flex items-center gap-2"
              disabled={backendStatus !== 'connected'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isListening ? 'Stop' : 'Voice'}
            </Button>
          </div>
        </div>
      </div>

      {isProcessing && (
        <Alert className="m-4 mb-0">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div>
              AI is processing your request. Please wait, you will see the response here when ready.
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Backend Status Alert */}
      {backendStatus !== 'connected' && !isProcessing && (
        <Alert className="m-4 mb-0">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                {backendStatus === 'error' && 
                  "Unable to connect to AI backend. Please ensure the FastAPI server is running at ${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'} ."
                }
                {backendStatus === 'not_ready' && 
                  "AI models are still loading. This may take a few minutes on first startup."
                }
                {backendStatus === 'connecting' && 
                  "Connecting to AI backend..."
                }
                <div className="text-xs text-muted-foreground mt-1">
                  {getDetailedStatusText()}
                </div>
              </div>
              {backendStatus === 'error' && (
                <Button size="sm" onClick={retryConnection} className="ml-2">
                  Retry
                </Button>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === 'student' ? 'justify-end' : 'justify-start'}`}
          >
            {message.type === 'ai' && (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                subject === 'Mathematics' ? 'bg-gradient-to-br from-blue-500 to-purple-600' :
                subject === 'Physics' ? 'bg-gradient-to-br from-indigo-500 to-purple-700' :
                subject === 'Biology' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                'bg-gradient-primary'
              }`}>
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="flex flex-col max-w-[80%] gap-2">
              <Card className={`p-4 shadow-soft ${
                message.type === 'ai' 
                  ? 'bg-ai-response border-primary/20' 
                  : 'bg-student-message border-secondary/20'
              }`}>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{message.content}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span>{message.timestamp.toLocaleTimeString()}</span>
                  {message.mediaType && (
                    <span className="px-2 py-1 bg-muted rounded-full">
                      {message.mediaType}
                    </span>
                  )}
                  {message.analysis && (
                    <span className="px-2 py-1 bg-muted rounded-full">
                      {message.analysis.confidence && `${Math.round(message.analysis.confidence * 100)}% confidence`}
                    </span>
                  )}
                </div>
              </Card>
              
              {/* Display generated image if available */}
              {message.imageUrl && (
                <Card className="p-2 shadow-soft bg-ai-response border-primary/20">
                  <img 
                    src={message.imageUrl} 
                    alt="AI Generated Visual" 
                    className="w-full max-w-md rounded-lg"
                    onError={(e) => {
                      console.error('Image failed to load:', message.imageUrl);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </Card>
              )}
            </div>
            
            {message.type === 'student' && (
              <div className="w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-secondary-foreground" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              subject === 'Mathematics' ? 'bg-gradient-to-br from-blue-500 to-purple-600' :
              subject === 'Physics' ? 'bg-gradient-to-br from-indigo-500 to-purple-700' :
              subject === 'Biology' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
              'bg-gradient-primary'
            }`}>
              <Bot className="w-5 h-5 text-white" />
            </div>
            <Card className="bg-ai-response border-primary/20 p-4 shadow-soft">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="text-sm text-muted-foreground ml-2">AI is thinking...</span>
              </div>
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-card border-t border-border p-4 shadow-soft">
        <div className="flex gap-3">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isListening ? "Listening..." : `Ask me anything about ${subject}...`}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(inputText);
              }
            }}
            disabled={isListening || backendStatus !== 'connected'}
          />
          <Button 
            onClick={() => handleSendMessage(inputText)}
            disabled={!inputText.trim() || isLoading || backendStatus !== 'connected'}
            className={`transition-all duration-300 ${
              subject === 'Mathematics' ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg' :
              subject === 'Physics' ? 'bg-gradient-to-r from-indigo-500 to-purple-700 hover:shadow-lg' :
              subject === 'Biology' ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg' :
              'bg-gradient-primary hover:shadow-ai'
            }`}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {isListening && (
          <div className="mt-2 text-center">
            <span className="text-sm text-muted-foreground animate-pulse">
              🎤 Listening... Speak now
            </span>
          </div>
        )}
        {backendStatus !== 'connected' && (
          <div className="mt-2 text-center">
            <span className="text-sm text-muted-foreground">
              {backendStatus === 'error' ? 'Backend connection required' : 'Waiting for AI models to load...'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};