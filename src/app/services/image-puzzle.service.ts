import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImagePuzzleService {
  private imagePieces: string[] = []; // Rutas de las imágenes divididas

  constructor() {
    this.loadImagePieces();
  }

  private loadImagePieces() {
    const imageUrl = '/assets/kurt_cobain.jpg'; // Reemplaza con la ruta de tu imagen
    const numberOfPieces = 9; // Número de piezas, ajusta según tu necesidad

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
          this.imagePieces.push(dataUrl);

        }
      }
    };
  }

  getImagePieces(): string[] {
    return this.imagePieces;
  }

  shuffleImagePieces(): void {
    // Lógica para mezclar las imágenes divididas.
  }
}
