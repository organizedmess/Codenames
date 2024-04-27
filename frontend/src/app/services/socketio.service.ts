import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ObserversModule } from '@angular/cdk/observers';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketioService {
  socket!: Socket;

  constructor() {}

  connect(gameId: string | null, mode: string | null) {
    if(!gameId || !mode) return;
    this.socket = io(environment.SOCKET_ENDPOINT);
    if(mode === 'create-game'){
      this.socket.emit('creategame', { gameId: gameId });
    } 
    
    return ;
  }

  startGame(gameId : string | null) {
    this.socket.emit('startGame', { gameId: gameId });
  }

  sendGameUpdate(gameId: string | null, words: any) {
    this.socket.emit('gameUpdate', { gameId: gameId, words: words });
  }

  joinGame(gameId: string | null) {
    this.socket.emit('joingame', { gameId: gameId });
  }

  recieveJoinedPlayers() {
    return new Observable((observer) => {
      this.socket.on('joingame', (message) => {
        observer.next(message);
      });
    });
  }

  recieveCreateGameAck(){
    return new Observable((observer) => {
      this.socket.on('creategame', (message) => {
        observer.next(message);
      });
    });
  }

  recieveStartGame() {
    return new Observable((observer) => {
      this.socket.on('startGame', (words) => {
        console.log(words)
        observer.next(words);
      });
    });
  }

  recieveGameUpdate(gameId : string | null) {
    if(gameId === null) return new Observable((observer) => {});
    return new Observable((observer) => {
      this.socket.on('gameUpdate', (words) => {
        console.log('recieveGameUpdate');
        observer.next(words); 
      });
    });
  }

  updateBoard(blueScore: number, redScore: number, gameId: string | null){
    if(!gameId) return;
    this.socket.emit('updateBoard', { blueScore: blueScore, redScore: redScore, gameId: gameId });
  }

  recieveUpdateBoard() {
    return new Observable((observer) => {
      this.socket.on('updateBoard', (data) => {
        observer.next(data);
      });
    });
  }

}
