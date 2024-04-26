import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
})
export class LobbyComponent implements OnInit {
  gameId: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  createGame() {
    const uuid = uuidv4();
    this.router.navigate(['/game', 'create-game', uuid]);
  }

  joinGame(){
    this.router.navigate(['/game', 'join-game', this.gameId]);
    console.log('join the game');
  }
}
