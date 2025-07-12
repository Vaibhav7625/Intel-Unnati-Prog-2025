// API service for connecting frontend to FastAPI backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface ChatMessage {
  message: string;
  subject: string;
  message_type: 'text' | 'voice' | 'visual';
  conversation_history?: any[];
}

export interface ChatResponse {
  response: string;
  analysis: {
    subject: string;
    confidence: number;
    query_type: string;
    needs_visual: boolean;
    complexity: string;
    educational_level: string;
  };
  image_url?: string;
  processing_time: number;
  success: boolean;
  error?: string;
}

export interface HealthResponse {
  status: string;
  ai_models_ready: boolean;
  timestamp: string;
  // Add more detailed status info
  initialization_status?: string;
  models_loaded?: boolean;
  error_message?: string;
}

export interface AnalyticsResponse {
  total_queries: number;
  subjects: Record<string, number>;
  query_types: Record<string, number>;
  average_processing_time: number;
}

// Configuration for different timeout scenarios
export interface TimeoutConfig {
  health: number;
  chat: number;
  voice: number;
  connection: number;
  longProcess: number;
}

class APIService {
  private baseURL: string;
  private healthCheckCache: { response: HealthResponse; timestamp: number } | null = null;
  private readonly CACHE_DURATION = 5000; // 5 seconds cache for health checks
  
  // Configurable timeouts - defaults allow for long processing
  private timeouts: TimeoutConfig = {
    health: 10000,      // 10 seconds for health checks
    chat: 1800000,       // 30 minutes for chat (increased from 30 seconds)
    voice: 1800000,      // 30 minutes for voice processing (increased from 60 seconds)
    connection: 5000,   // 5 seconds for connection tests
    longProcess: 2700000 // 45 minutes for very long processes
  };

  constructor(baseURL: string = API_BASE_URL, customTimeouts?: Partial<TimeoutConfig>) {
    this.baseURL = baseURL;
    if (customTimeouts) {
      this.timeouts = { ...this.timeouts, ...customTimeouts };
    }
  }

  // Method to update timeouts dynamically
  setTimeouts(timeouts: Partial<TimeoutConfig>): void {
    this.timeouts = { ...this.timeouts, ...timeouts };
  }

  // Method to disable timeouts for extremely long processes
  disableTimeout(): void {
    this.timeouts = {
      health: 0,
      chat: 0,
      voice: 0,
      connection: 5000, // Keep connection test timeout
      longProcess: 0
    };
  }

  // Health check with better error handling and caching
  async checkHealth(): Promise<HealthResponse> {
    try {
      // Check cache first to avoid overwhelming the backend
      if (this.healthCheckCache) {
        const now = Date.now();
        if (now - this.healthCheckCache.timestamp < this.CACHE_DURATION) {
          return this.healthCheckCache.response;
        }
      }

      const controller = new AbortController();
      let timeoutId: NodeJS.Timeout | undefined;
      
      if (this.timeouts.health > 0) {
        timeoutId = setTimeout(() => controller.abort(), this.timeouts.health);
      }

      const response = await fetch(`${this.baseURL}/health`, {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (timeoutId) clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
      }

      const healthData = await response.json();
      
      // Cache the response
      this.healthCheckCache = {
        response: healthData,
        timestamp: Date.now()
      };

      console.log('Health check successful:', healthData);
      return healthData;
    } catch (error) {
      console.error('Health check error:', error);
      
      // Clear cache on error
      this.healthCheckCache = null;
      
      // Return a proper error response instead of throwing
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Health check timed out - backend may be starting up');
        }
        if (error.message.includes('fetch')) {
          throw new Error('Cannot connect to backend - ensure FastAPI server is running on http://localhost:8000');
        }
      }
      throw error;
    }
  }

  // Send chat message with support for long processing times
  async sendMessage(
    chatMessage: ChatMessage, 
    options?: { 
      timeout?: number;
      onProgress?: (message: string) => void;
    }
  ): Promise<ChatResponse> {
    try {
      const controller = new AbortController();
      const timeout = options?.timeout || this.timeouts.chat;
      let timeoutId: NodeJS.Timeout | undefined;

      if (timeout > 0) {
        timeoutId = setTimeout(() => {
          controller.abort();
          if (options?.onProgress) {
            options.onProgress('Request timed out - the AI is taking too long to respond');
          }
        }, timeout);
      }

      // Notify about long processing
      if (options?.onProgress) {
        options.onProgress('Processing your request... This may take several minutes for complex tasks.');
      }

      const response = await fetch(`${this.baseURL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chatMessage),
        signal: controller.signal
      });

      if (timeoutId) clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Chat API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Chat response:', result);
      
      if (options?.onProgress) {
        options.onProgress('Processing complete!');
      }
      
      return result;
    } catch (error) {
      console.error('Chat API error:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out - the AI is taking too long to respond');
        }
        if (error.message.includes('fetch')) {
          throw new Error('Cannot connect to backend - check your connection');
        }
      }
      throw error;
    }
  }

  // Process voice input with extended timeout
  async processVoice(
    audioFile: File, 
    subject: string,
    options?: { 
      timeout?: number;
      onProgress?: (message: string) => void;
    }
  ): Promise<ChatResponse> {
    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('subject', subject);

      const controller = new AbortController();
      const timeout = options?.timeout || this.timeouts.voice;
      let timeoutId: NodeJS.Timeout | undefined;

      if (timeout > 0) {
        timeoutId = setTimeout(() => {
          controller.abort();
          if (options?.onProgress) {
            options.onProgress('Voice processing timed out');
          }
        }, timeout);
      }

      if (options?.onProgress) {
        options.onProgress('Processing voice input... This may take several minutes.');
      }

      const response = await fetch(`${this.baseURL}/voice`, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });

      if (timeoutId) clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Voice API error: ${response.status}`);
      }

      const result = await response.json();
      
      if (options?.onProgress) {
        options.onProgress('Voice processing complete!');
      }

      return result;
    } catch (error) {
      console.error('Voice API error:', error);
      throw error;
    }
  }

  // Long-running process with streaming support
  async processLongRunningTask(
    endpoint: string,
    data: any,
    options?: {
      timeout?: number;
      onProgress?: (message: string) => void;
      onData?: (chunk: any) => void;
    }
  ): Promise<any> {
    try {
      const controller = new AbortController();
      const timeout = options?.timeout || this.timeouts.longProcess;
      let timeoutId: NodeJS.Timeout | undefined;

      if (timeout > 0) {
        timeoutId = setTimeout(() => {
          controller.abort();
          if (options?.onProgress) {
            options.onProgress('Long-running task timed out');
          }
        }, timeout);
      }

      if (options?.onProgress) {
        options.onProgress('Starting long-running task... This may take up to 10+ minutes.');
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal
      });

      if (timeoutId) clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Long process API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      // Handle streaming response if the response is a stream
      if (response.headers.get('content-type')?.includes('text/plain') || 
          response.headers.get('content-type')?.includes('text/event-stream')) {
        
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let result = '';

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value);
            result += chunk;
            
            if (options?.onData) {
              options.onData(chunk);
            }
            
            if (options?.onProgress) {
              options.onProgress('Processing... (receiving data)');
            }
          }
        }

        return { response: result, success: true };
      }

      const result = await response.json();
      
      if (options?.onProgress) {
        options.onProgress('Long-running task complete!');
      }
      
      return result;
    } catch (error) {
      console.error('Long process API error:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Long-running task was cancelled or timed out');
        }
        if (error.message.includes('fetch')) {
          throw new Error('Cannot connect to backend - check your connection');
        }
      }
      throw error;
    }
  }

  // Get available subjects
  async getSubjects(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseURL}/subjects`);
      if (!response.ok) {
        throw new Error(`Subjects API error: ${response.status}`);
      }
      const data = await response.json();
      return data.subjects;
    } catch (error) {
      console.error('Subjects API error:', error);
      throw error;
    }
  }

  // Get analytics
  async getAnalytics(): Promise<AnalyticsResponse> {
    try {
      const response = await fetch(`${this.baseURL}/analytics`);
      if (!response.ok) {
        throw new Error(`Analytics API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Analytics API error:', error);
      throw error;
    }
  }

  // Clear conversation history
  async clearHistory(): Promise<{ message: string }> {
    try {
      const response = await fetch(`${this.baseURL}/clear-history`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`Clear history API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Clear history API error:', error);
      throw error;
    }
  }

  // Get list of generated images
  async getImages(): Promise<{ images: Array<{ filename: string; url: string }> }> {
    try {
      const response = await fetch(`${this.baseURL}/images/list`);
      if (!response.ok) {
        throw new Error(`Images API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Images API error:', error);
      throw error;
    }
  }

  // Get full URL for image
  getImageUrl(imagePath: string): string {
    return `${this.baseURL}${imagePath}`;
  }

  // Test connection with better error handling
  async testConnection(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeouts.connection);

      const response = await fetch(`${this.baseURL}/`, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  // Clear health check cache (useful for forcing fresh checks)
  clearHealthCache(): void {
    this.healthCheckCache = null;
  }

  // Get detailed status for debugging
  async getDetailedStatus(): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/`);
      if (!response.ok) {
        throw new Error(`Status check failed: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Detailed status check failed:', error);
      throw error;
    }
  }

  // Utility method to get current timeout configuration
  getTimeoutConfig(): TimeoutConfig {
    return { ...this.timeouts };
  }
}

// Export singleton instance with long processing support
export const apiService = new APIService();

// Export for testing with different base URLs
export { APIService };