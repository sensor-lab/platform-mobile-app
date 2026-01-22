class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;
  private messageListeners: ((message: string) => void)[] = [];
  private connectionListeners: ((connected: boolean) => void)[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private isIntentionallyClosed = false;

  constructor(url: string) {
    this.url = url;
  }

  /**
   * Connect to WebSocket server
   */
  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log(`WebSocket start connecting: ${this.url}`);
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log("✓ WebSocket connected");
          this.reconnectAttempts = 0;
          this.isIntentionallyClosed = false;
          this.notifyConnectionListeners(true);
          resolve();
        };

        this.ws.onmessage = (event) => {
          console.log("📨 Message received:", event.data);
          this.notifyMessageListeners(event.data);
        };

        this.ws.onerror = (error) => {
          console.error("❌ WebSocket error:", error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log("✗ WebSocket disconnected");
          this.notifyConnectionListeners(false);
          this.attemptReconnect();
        };
      } catch (error) {
        console.error("Connection error:", error);
        reject(error);
      }
    });
  }

  /**
   * Send message to server
   */
  public send(data: any): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn("⚠️ WebSocket not connected");
      return false;
    }

    try {
      const message = typeof data === "string" ? data : JSON.stringify(data);
      this.ws.send(message);
      console.log("📤 Message sent:", message);
      return true;
    } catch (error) {
      console.error("Send error:", error);
      return false;
    }
  }

  /**
   * Subscribe to messages
   */
  public onMessage(listener: (message: string) => void): () => void {
    this.messageListeners.push(listener);
    // Return unsubscribe function
    return () => {
      this.messageListeners = this.messageListeners.filter(
        (l) => l !== listener,
      );
    };
  }

  /**
   * Subscribe to connection status changes
   */
  public onConnectionChange(
    listener: (connected: boolean) => void,
  ): () => void {
    this.connectionListeners.push(listener);
    // Return unsubscribe function
    return () => {
      this.connectionListeners = this.connectionListeners.filter(
        (l) => l !== listener,
      );
    };
  }

  /**
   * Check if connected
   */
  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Disconnect from server
   */
  public disconnect(): void {
    this.isIntentionallyClosed = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Attempt to reconnect with exponential backoff
   */
  private attemptReconnect(): void {
    if (this.isIntentionallyClosed) return;

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * this.reconnectAttempts;
      console.log(
        `🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`,
      );

      setTimeout(() => {
        this.connect().catch((error) => {
          console.error("Reconnect failed:", error);
        });
      }, delay);
    } else {
      console.error("❌ Max reconnection attempts reached");
    }
  }

  /**
   * Notify all message listeners
   */
  private notifyMessageListeners(message: string): void {
    this.messageListeners.forEach((listener) => {
      try {
        listener(message);
      } catch (error) {
        console.error("Message listener error:", error);
      }
    });
  }

  /**
   * Notify all connection listeners
   */
  private notifyConnectionListeners(connected: boolean): void {
    this.connectionListeners.forEach((listener) => {
      try {
        listener(connected);
      } catch (error) {
        console.error("Connection listener error:", error);
      }
    });
  }
}

export { WebSocketService };
