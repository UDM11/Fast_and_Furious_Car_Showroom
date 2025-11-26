const API_BASE_URL = 'http://localhost:8000';

export interface ChatRequest {
  question: string;
}

export interface ChatResponse {
  answer?: string;
  error?: string;
}

export const chatAPI = {
  async sendMessage(question: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return data.answer || 'No response received';
    } catch (error) {
      console.error('Chat API error:', error);
      throw error;
    }
  },

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      return response.ok;
    } catch {
      return false;
    }
  }
};