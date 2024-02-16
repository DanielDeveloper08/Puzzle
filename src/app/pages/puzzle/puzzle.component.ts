import { Neighbors } from '@/models/neighbors';
import { Tile } from '@/models/tile';
import { ImagePuzzleService } from '@/services/image-puzzle.service';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-puzzle',
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.scss'],
})
export class PuzzleComponent implements OnInit {
  private readonly dimensions = 3;

  tiles: Tile[] = [];
  public ímgPieces: string[] = [];

  constructor(
    private _router: Router,
    private readonly _imagPuzzleSrv: ImagePuzzleService,
  ) {}

  ngOnInit(): void {
    this.initTiles();
    this.loadImagesPiece();
    this.shuffle(this.tiles);
  }

  private async loadImagesPiece() {
    const pieces = await this._imagPuzzleSrv.getImagePieces();
    this.ímgPieces = pieces;
  }

  shuffle(tiles: Tile[]): void {
    for (var i = tiles.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = tiles[i];
      tiles[i] = tiles[j];
      tiles[j] = temp;
      this.switchItemsInArray(tiles[i], tiles[j]);
    }
    this.handleNeighbors();
  }

  dragEnd(event: CdkDragEnd): void {
    const blankTile = this.tiles.find((tile) => tile.blank) as Tile;
    this.switchItemsInArray(event.source.data, blankTile);
    this.handleNeighbors();
    event.source.element.nativeElement.style.transform = 'none';
  }

  private initTiles(): void {
    let count = 0;
    for (let row = 0; row < this.dimensions; row++) {
      for (let col = 0; col < this.dimensions; col++) {
        const tile: Tile = new Tile({
          id: `${count + 1}`,
          label: `${count + 1}`,
          point: { row, col },
          disabled: true,
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
  }

  private handleNeighbors(): void {
    const list = this.getBlankTileNeighbors();
    this.tiles.forEach((tile) => {
      tile.disabled = !list.some((item) => item.id === tile.id);
    });
  }

  private getBlankTileNeighbors(): Tile[] {
    const tile = this.tiles.find((tile) => tile.blank) as Tile;
    const tileIndex: number = tile.arrayPosition!.currIndex;
    const tiles = [];
    const neighbors = {} as Neighbors;

    if (tile.point!.row) {
      tiles.push(this.tiles[tileIndex - this.dimensions]); // up
      neighbors.up = this.tiles[tileIndex - this.dimensions]?.id!;
      this.tiles[tileIndex - this.dimensions].lockAxis = 'y';
    }

    if (tile.point!.row < this.dimensions - 1) {
      tiles.push(this.tiles[tileIndex + this.dimensions]); // down
      neighbors.down = this.tiles[tileIndex + this.dimensions]?.id!;
      this.tiles[tileIndex + this.dimensions].lockAxis = 'y';
    }

    if (tile.point!.col) {
      tiles.push(this.tiles[tileIndex - 1]); // left
      neighbors.left = this.tiles[tileIndex - 1]?.id!;
      this.tiles[tileIndex - 1].lockAxis = 'x';
    }

    if (tile.point!.col < this.dimensions - 1) {
      tiles.push(this.tiles[tileIndex + 1]); //right
      neighbors.right = this.tiles[tileIndex + 1]?.id!;
      this.tiles[tileIndex + 1].lockAxis = 'x';
    }

    return tiles.filter((tile) => !!tile);
  }

  private switchItemsInArray(tileA: Tile, tileB: Tile): void {
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

  goToHome() {
    this._router.navigateByUrl('home');
  }
}
