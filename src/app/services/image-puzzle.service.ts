import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImagePuzzleService {
  private _imagePieces: string[] = []; // Rutas de las imágenes divididas

  get imgPieces() {
    return this._imagePieces;
  }

  public getImagePieces(numberOfPieces: number = 9): Promise<string[]> {
    return new Promise<string[]>(resolve => {
      const imageUrl = '/assets/kurt_cobain.jpg'; // Reemplaza con la ruta de tu imagen

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
            this._imagePieces.push(dataUrl);

            resolve(this._imagePieces);
          }
        }
      };
    });
  }
}
