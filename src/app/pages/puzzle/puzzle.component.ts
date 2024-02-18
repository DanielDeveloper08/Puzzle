import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { map } from 'rxjs';
import Swal from 'sweetalert2';
import * as confetti from 'canvas-confetti';
import { Tile } from '@/models/tile';
import { Neighbors } from '@/models/neighbors';
import { PuzzleImgEnum } from '@/enums/puzzle.enum';
import { ImagePuzzleService } from '@/services/image-puzzle.service';

@Component({
  selector: 'app-puzzle',
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.scss'],
})
export class PuzzleComponent implements OnInit {
  private readonly dimensions = 2;

  public tiles: Tile[] = [];
  public imgPieces: string[] = [];
  private currentPuzzle: string = '';

  constructor(
    private readonly _router: Router,
    private readonly _imagPuzzleSrv: ImagePuzzleService,
    private readonly _activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.initTiles();
    this.loadImagesPiece();

    this.shuffle(this.tiles);

    this._activatedRoute.paramMap.pipe(
      map((params) => params.get('name'))
    )
    .subscribe((name) => {
      if (!name) return;
      this.currentPuzzle = name;
    });
  }

  private async loadImagesPiece() {
    const pieces = await this._imagPuzzleSrv.getImagePieces();
    this.imgPieces = pieces;
    this.imgPieces.length <= 0 && this._router.navigateByUrl('/home');
  }

  public get puzzleTitle(): string {
    const titles: Record<PuzzleImgEnum, string> = {
      [PuzzleImgEnum.AREA]: 'Área',
      [PuzzleImgEnum.NUMEROS_PARES]: 'Números pares',
      [PuzzleImgEnum.SALUDO]: 'Saludo',
      [PuzzleImgEnum.SUMA_RESTA]: 'Suma / Resta',
    };

    return titles[this.currentPuzzle as PuzzleImgEnum] ?? '';
  }

  public async shuffle(tiles: Tile[]) {
    for (let i = tiles.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = tiles[i];
      tiles[i] = tiles[j];
      tiles[j] = temp;
      await this.switchItemsInArray(tiles[i], tiles[j]);
    }
    this.handleNeighbors();
  }

  public dragEnd(event: CdkDragEnd): void {
    const blankTile = this.tiles.find((tile) => tile.blank) as Tile;
    this.switchItemsInArray(event.source.data, blankTile);
    this.handleNeighbors();
    event.source.element.nativeElement.style.transform = 'none';

    if (this.isGameFinished()) {
      this.celebrate();
    }
  }

  private isGameFinished(): boolean {
    let correctOrder = true;

    this.tiles.forEach((tile, index) => {
      if (parseInt(tile.label!) !== index + 1) {
        correctOrder = false;
      }
    });

    return correctOrder;
  }

  public celebrate() {
    this.playAudio();

    confetti.create()({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 },
    });

    const answerTemplate = this.getAnswer()
      .split('-')
      .map(answer => `<p style="font-family: inherit;">${answer}</p>`)
      .join(' ');

    Swal.fire({
      title: 'Felicitaciones, ¡Has ganado! 🎉🎊',
      html: `
        <div style="font-family: monospace;">
          Print:
          ${answerTemplate}
        </div>
      `,
      width: 600,
      padding: '2rem',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Jugar de nuevo',
      cancelButtonText: 'Ir al inicio',
      didOpen: this.handleSwalBtns.bind(this),
    });
  }

  private getAnswer(): string {
    const answers: Record<PuzzleImgEnum, string> = {
      [PuzzleImgEnum.AREA]: 'Area = 6.0',
      [PuzzleImgEnum.NUMEROS_PARES]:
        'La suma de los números pares hasta 1000 es: 500',
      [PuzzleImgEnum.SALUDO]:
        'Hola, ¿Cuál es tu nombre? - Josue - Mucho gusto, Josue',
      [PuzzleImgEnum.SUMA_RESTA]: 'La suma es = 9 - La resta es = 1',
    };

    return answers[this.currentPuzzle as PuzzleImgEnum] ?? '';
  }

  private handleSwalBtns() {
    const confirmBtn = Swal.getConfirmButton();
    const cancelBtn = Swal.getCancelButton();

    if (confirmBtn) {
      confirmBtn.addEventListener('click', this.tryAgain.bind(this));
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', this.navigateToList.bind(this));
    }
  }

  private playAudio() {
    const audio = new Audio();
    audio.src = '/assets/finish-game.mp3';
    audio.volume = 0.5;

    audio.play();
  }

  private async tryAgain() {
    await this.shuffle(this.tiles);
  }

  private navigateToList(): void {
    this._router.navigateByUrl('/home');
  }

  private async initTiles() {
    const pieces = await this._imagPuzzleSrv.getImagePieces(
      Math.pow(this.dimensions, 2)
    );

    let count = 0;

    for (let row = 0; row < this.dimensions; row++) {
      for (let col = 0; col < this.dimensions; col++) {
        const tile: Tile = new Tile({
          id: `${count + 1}`,
          label: `${count + 1}`,
          point: { row, col },
          disabled: true,
          image: pieces[count],
          arrayPosition: {
            currIndex: count,
            prevIndex: null,
          },
          boundary: { row: `${row + 1}`, column: `${col + 1}` },
        });

        count++;
        this.tiles.push(tile);
      }
    }

    const blankTile = this.tiles.pop() as Tile;
    blankTile.blank = true;

    this.tiles.push(blankTile);
    this.handleNeighbors();

    this.shuffle(this.tiles);
  }

  private handleNeighbors(): void {
    const list = this.getBlankTileNeighbors();
    this.tiles.forEach((tile) => {
      tile.disabled = !list.some((item) => item.id === tile.id);
    });
  }

  private getBlankTileNeighbors(): Tile[] {
    const tile = this.tiles.find((tile) => tile.blank) as Tile;
    const tileIndex = tile?.arrayPosition?.currIndex!;

    const tiles = [];
    const neighbors = {} as Neighbors;

    if (tile?.point?.row) {
      tiles.push(this.tiles[tileIndex - this.dimensions]); // up
      neighbors.up = this.tiles[tileIndex - this.dimensions]?.id!;
      this.tiles[tileIndex - this.dimensions].lockAxis = 'y';
    }

    if (tile?.point?.row! < this.dimensions - 1) {
      tiles.push(this.tiles[tileIndex + this.dimensions]); // down
      neighbors.down = this.tiles[tileIndex + this.dimensions]?.id!;
      this.tiles[tileIndex + this.dimensions].lockAxis = 'y';
    }

    if (tile?.point!.col) {
      tiles.push(this.tiles[tileIndex - 1]); // left
      neighbors.left = this.tiles[tileIndex - 1]?.id!;
      this.tiles[tileIndex - 1].lockAxis = 'x';
    }

    if (tile?.point!.col < this.dimensions - 1) {
      tiles.push(this.tiles[tileIndex + 1]); //right
      neighbors.right = this.tiles[tileIndex + 1]?.id!;
      this.tiles[tileIndex + 1].lockAxis = 'x';
    }

    return tiles.filter((tile) => !!tile);
  }

  private async switchItemsInArray(tileA: Tile, tileB: Tile) {
    const prevBlankTilePoint = tileB.point;

    tileB.arrayPosition!.prevIndex = tileB.arrayPosition!.currIndex;
    tileB.arrayPosition!.currIndex = tileA.arrayPosition!.currIndex;
    tileB.point = tileA.point;

    tileA.arrayPosition!.prevIndex = tileA.arrayPosition!.currIndex;
    tileA.arrayPosition!.currIndex = tileB.arrayPosition!.prevIndex;
    tileA.point = prevBlankTilePoint;

    this.tiles.sort(
      (a, b) => a.arrayPosition!.currIndex - b.arrayPosition!.currIndex
    );
  }

  public goToHome() {
    this._router.navigateByUrl('/home');
  }
}
