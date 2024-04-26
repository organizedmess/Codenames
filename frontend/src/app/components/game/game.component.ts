import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocketioService } from '../../services/socketio.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  gameId: string | null = null;
  mode: string | null = null;
  role = 'operative';
  words: any;

  constructor(
    private socketIoService: SocketioService,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
      
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.mode = this.route.snapshot.paramMap.get('mode');
    this.socketIoService.connect(this.gameId, this.mode);

    if(this.mode === 'join-game')
      this.joinGame();
    
    this.recieveCreateGameAck();
    this.recieveJoinedPlayers();
    this.recieveStartGame();
    this.recieveGameUpdate();
  }

  nextGame() {
    this.socketIoService.startGame(this.gameId);
  }

  startGame() {
    this.socketIoService.startGame(this.gameId);
  }

  joinGame(){
    this.socketIoService.joinGame(this.gameId);
  }

  clickWord(word: any) {
    word.selected = true;
    this.socketIoService.sendGameUpdate(this.gameId, this.words);
  }

  copyToClipboard(gameId: string | null) {
    if (gameId == null) return;
    
    gameId = gameId.trim();
    navigator.clipboard.writeText(gameId);

    this.snackbar.open('Link copied to clipboard', '', {
      duration: 3000,
    });
  }

  recieveCreateGameAck() {
    this.socketIoService.recieveCreateGameAck().subscribe((message: any) => {
      this.snackbar.open(message, '', {
        duration: 3000,
      });
    });
  }

  recieveJoinedPlayers() {
    this.socketIoService.recieveJoinedPlayers().subscribe((message: any) => {
      this.snackbar.open(message, '', {
        duration: 3000,
      });
    });
  }

  recieveStartGame() {
    this.socketIoService.recieveStartGame().subscribe((words) => {
      this.role = 'operative';
      this.words = words;
    });
  }

  recieveGameUpdate() {
    this.socketIoService.recieveGameUpdate(this.gameId).subscribe((words) => {
      console.log(words);
      this.words = words;
    });
  }
}
