import { Component, inject } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ImagePuzzleService } from '@/services/image-puzzle.service';

@Component({
  selector: 'jigsaw-game',
  templateUrl: './jigsaw.component.html',
  styleUrls: ['./jigsaw.component.scss'],
})
export class JigsawComponent {
  private readonly imagePuzzleSrv = inject(ImagePuzzleService);

  puzzlePieces: string[] = []; // Piezas del juego
  puzzleBoard: string[] = []; // Piezas del tablero

  ngOnInit() {
    this.loadPuzzlePieces();
  }

  private async loadPuzzlePieces() {
    const imgPieces = await this.imagePuzzleSrv.getImagePieces();
    this.puzzlePieces = imgPieces;
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        this.puzzleBoard,
        event.previousIndex,
        event.currentIndex
      );

      return;
    }

    this.puzzleBoard.splice(
      event.currentIndex,
      0,
      this.puzzlePieces[event.previousIndex]
    );

    this.puzzlePieces.splice(event.previousIndex, 1);
  }

  isSolved(): boolean {
    return false;
  }
}
