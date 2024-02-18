import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PuzzleImgEnum } from '@/enums/puzzle.enum';
import { ImagePuzzleService } from '@/services/image-puzzle.service';

@Component({
  selector: 'app-list-images',
  templateUrl: './list-images.component.html',
  styleUrls: ['./list-images.component.scss'],
})
export class ListImagesComponent implements OnInit {
  public imageSources: PuzzleImgEnum[] = [
    PuzzleImgEnum.AREA,
    PuzzleImgEnum.NUMEROS_PARES,
    PuzzleImgEnum.SALUDO,
    PuzzleImgEnum.SUMA_RESTA,
  ];

  constructor(
    private readonly _imagePuzzleService: ImagePuzzleService,
    private readonly _router: Router
  ) {}

  ngOnInit() {
    localStorage.clear();
  }

  getFormatImg(img: string): string {
    return this._imagePuzzleService.getFormatImg(img);
  }

  selectImage(imageSrc: string) {
    this._imagePuzzleService.setImage(imageSrc);
    this._router.navigate(['puzzle', imageSrc]);
  }
}
