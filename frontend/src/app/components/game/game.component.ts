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

  currTeam = 'blue';
  winner: string = '';

  blueScore: number = 0;
  redScore: number = 0;

  clientAnimal: any;
  yourAnimal: any;

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
    this.AssignAnimal();
  }

  nextGame() {
    this.blueScore = 0;
    this.redScore = 0;
    this.winner = '';
    this.currTeam = 'blue';

    let gameBoard = document.querySelector('.game') as HTMLElement;
    gameBoard.style.display = 'block';

    let element = document.querySelector('.ack') as HTMLElement;
    element.style.display = 'none';
  
    this.socketIoService.nextGame(this.gameId);
  }

  startGame() {
    this.socketIoService.startGame(this.gameId);
  }

  joinGame(){
    this.socketIoService.joinGame(this.gameId);
  }

  clickWord(word: any) {
    let clickedWordColor = word.color;

    if(clickedWordColor === 'blue'){
      this.blueScore++;
    }
    else if(clickedWordColor === 'red'){
      this.redScore++;
    }
    word.selected = true;
    this.socketIoService.sendGameUpdate(this.gameId, this.words);
    this.currTeam = this.currTeam === 'blue' ? 'red' : 'blue';
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
      this.words = words;
      this.updateScoreBoard(this.words);
    });
  }

  updateScoreBoard(words: any) {

    let blueScore = 0;
    let redScore = 0;

    for(let i = 0; i < words.length; i++){
      if(words[i].selected){
        if(words[i].color === 'blue'){
          blueScore++;
        }
        else if(words[i].color === 'red'){
          redScore++;
        }
        else if(words[i].color === 'black' ){
          if(this.currTeam === 'blue'){
            this.winner = 'blue';
          }
          else{
            this.winner = 'red';
          }
          this.winner = this.winner.toUpperCase();
          this.showResultCard(this.winner);
          return ;
        }
      }

      this.blueScore = blueScore;
      this.redScore = redScore;

      if(blueScore === 8){
        this.winner = 'blue';
      }
      else if(redScore === 9){
        this.winner = 'red';
      }
    }

  }

  showResultCard(winner: string) {
    let gameBoard = document.querySelector('.game') as HTMLElement;
    gameBoard.style.display = 'none';


    let element = document.querySelector('.ack') as HTMLElement;
    element.style.display = 'block';
    return ;
  }

  AssignAnimal() {
    this.socketIoService.AssignAnimal().subscribe((data: any) => {
      this.clientAnimal = data.clients
      this.yourAnimal = data.yourAnimal;
    });
  }

  
}
