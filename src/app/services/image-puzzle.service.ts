import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImagePuzzleService {
  private _imagePieces: string[] = []; // Rutas de las imágenes divididas
  private imageSelected: string = '';

  ngOnInit() {}
  get imgPieces() {
    return this._imagePieces;
  }

  public getImagePieces(numberOfPieces: number = 9): Promise<string[]> {
    console.log('image', this.imageSelected);
    const image = localStorage.getItem('image');
    return new Promise<string[]>((resolve) => {
      this._imagePieces = [];
      const imageUrl = image ?? this.imageSelected;

      if (!imageUrl) {
        resolve([]);
        return;
      }

      const img = new Image();
      img.src = imageUrl;

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

  async setImage(newValue: string) {
    this.imageSelected = newValue;
    localStorage.setItem('image', newValue);
  }
}
