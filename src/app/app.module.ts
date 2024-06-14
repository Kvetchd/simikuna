import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { WordleComponent } from './components/wordle/wordle.component';
import { KeyboardComponent } from './components/wordle/keyboard/keyboard.component';
import { EntryComponent } from './components/wordle/entry/entry.component';
import { FooterComponent } from './components/footer/footer.component';
import { AddSubstractComponent } from './components/header/add-substract/add-substract.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    WordleComponent,
    KeyboardComponent,
    EntryComponent,
    FooterComponent,
    AddSubstractComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
