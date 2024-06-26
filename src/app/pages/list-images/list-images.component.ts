import { ImagePuzzleService } from '@/services/image-puzzle.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-images',
  templateUrl: './list-images.component.html',
  styleUrls: ['./list-images.component.scss'],
})
export class ListImagesComponent implements OnInit {
  imageSources: string[] = [
    'assets/mario.jpg',
    'assets/stitch.jpg',
    'assets/boss.jpeg',
    'assets/doraemon.jpeg',
  ];

  constructor(
    private _imagePuzzleService: ImagePuzzleService,
    private _router: Router
  ) {}

  ngOnInit() {}

  selectImage(imageSrc: string) {
    this._imagePuzzleService.setImage(imageSrc);
    this._router.navigate(['puzzle', this.getName(imageSrc)]);
  }

  getName(route: string) {
    return route.split('/')[1].split('.')[0];
  }
}
