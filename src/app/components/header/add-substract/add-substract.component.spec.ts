import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubstractComponent } from './add-substract.component';

describe('AddSubstractComponent', () => {
  let component: AddSubstractComponent;
  let fixture: ComponentFixture<AddSubstractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSubstractComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSubstractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
