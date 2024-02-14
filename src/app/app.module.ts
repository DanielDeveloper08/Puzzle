import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { DragDropComponent } from './components/drag-drop/drag-drop.component';
import { ListImagesComponent } from './pages/list-images/list-images.component';
import { PuzzleComponent } from './pages/puzzle/puzzle.component';

@NgModule({
  declarations: [
    AppComponent,
    DragDropComponent,
    ListImagesComponent,
    PuzzleComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, DragDropModule, CommonModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
