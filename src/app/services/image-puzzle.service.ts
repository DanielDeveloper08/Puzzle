import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImagePuzzleService {
  private _imagePieces: string[] = [];
  private readonly puzzleTypeKey: string = 'puzzle_type';
  private _imageSelected: string = '';

  public getImagePieces(numberOfPieces: number = 9): Promise<string[]> {
    const puzzleTypeStored = localStorage.getItem(this.puzzleTypeKey);

    return new Promise<string[]>(resolve => {
      this._imagePieces = [];
      const puzzleType = puzzleTypeStored ?? this._imageSelected;

      if (!puzzleType) return resolve([]);

      const img = new Image();
      img.src = this.getFormatImg(puzzleType);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const pieceWidth = img.width / Math.sqrt(numberOfPieces);
        const pieceHeight = img.height / Math.sqrt(numberOfPieces);

        for (let i = 0; i < Math.sqrt(numberOfPieces); i++) {
          for (let j = 0; j < Math.sqrt(numberOfPieces); j++) {
            canvas.width = pieceWidth;
            canvas.height = pieceHeight;

            if (!ctx) continue;

            ctx.drawImage(
              img,
              j * pieceWidth,
              i * pieceHeight,
              pieceWidth,
              pieceHeight,
              0,
              0,
              pieceWidth,
              pieceHeight
            );

            const dataUrl = canvas.toDataURL('image/jpeg');
            this._imagePieces = [...this._imagePieces, dataUrl];
          }
        }

        resolve(this._imagePieces);
      };
    });
  }

  public getFormatImg(img: string): string {
    return `assets/${img}.png`;
  }

  public setImage(newValue: string) {
    this._imageSelected = newValue;
    localStorage.setItem(this.puzzleTypeKey, newValue);
  }
}
