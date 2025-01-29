import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: WebSocket | null = null;
  private chatMessagesSubject = new Subject<any[]>();

  constructor() {}

  connectWebSocket(): void {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const serverUrl = `${protocol}://ec2-13-250-46-200.ap-southeast-1.compute.amazonaws.com:3000`;

    this.socket = new WebSocket(serverUrl);

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.chatMessagesSubject.next(data);
    };
  }

  disconnectWebSocket(): void {
    this.socket?.close();
    this.socket = null;
  }

  sendMessage(name: string, message: string): void {
    const payload = { name, message, message_sent_timestamp: new Date().toISOString() };
    this.socket?.send(JSON.stringify(payload));
  }

  getChatMessages(): Observable<any[]> {
    return this.chatMessagesSubject.asObservable();
  }
}
