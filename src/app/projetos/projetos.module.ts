import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjetosPageRoutingModule } from './projetos-routing.module';

import { ProjetosPage } from './projetos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProjetosPageRoutingModule
  ],
  declarations: [ProjetosPage]
})
export class ProjetosPageModule {}
