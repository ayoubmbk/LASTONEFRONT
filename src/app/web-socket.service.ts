import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private notificationSubject: BehaviorSubject<any> = new BehaviorSubject<any>('');
  webSocketEndPoint: string = 'http://localhost:8082/ws';
  topic: string = '/topic/socket';
  stompClient: any;


  public connect1() {
    let socket = new SockJS(`http://localhost:8082/ws`);

    let stompClient = Stomp.over(socket);

    return stompClient;

}

  _connect() {
    console.log('Initialize WebSocket Connection');
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;
   _this.stompClient.connect(
      {},
      function (frame) {
        debugger;
        console.log('Connected to WebSocket');
        _this.stompClient.subscribe(_this.topic, function (sdkEvent) {
          console.log('Received message from WebSocket:', sdkEvent);
          _this.onMessageReceived(sdkEvent);
        });
        console.log('Subscribed to the topic:', _this.topic);
      },
      this.errorCallBack 
    );
  }
  _disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log('Disconnected');
  }

  errorCallBack(error) {
    console.log('errorCallBack -> ' + error);
    setTimeout(() => {
      this._connect();
    }, 5000);
  }

  _send(message) {
    console.log('calling logout API via WebSocket');
    this.stompClient.send('/topic/socket', {}, JSON.stringify(message));
  }

  private onMessageReceived(sdkEvent: any) {
    const message = sdkEvent.body;
    this.notificationSubject.next(message);
  }
  
 
  _isConnected() {
    return this.stompClient.connected;
  }
  public getNotificationSubject(): Observable<string> {
    return this.notificationSubject.asObservable();
  }
}
