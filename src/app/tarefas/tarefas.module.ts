import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TarefasPageRoutingModule } from './tarefas-routing.module';

import { TarefasPage } from './tarefas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TarefasPageRoutingModule
  ],
  declarations: [TarefasPage]
})
export class TarefasPageModule {}
