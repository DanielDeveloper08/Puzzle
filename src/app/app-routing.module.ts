import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PuzzleComponent } from './pages/puzzle/puzzle.component';
import { ListImagesComponent } from './pages/list-images/list-images.component';

const routes: Routes = [
  {
    path: 'home',
    component: ListImagesComponent,
  },
  {
    path: 'puzzle/:name',
    component: PuzzleComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
