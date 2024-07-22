import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddKullaniciComponent } from './add-kullanici.component';

describe('AddKullaniciComponent', () => {
  let component: AddKullaniciComponent;
  let fixture: ComponentFixture<AddKullaniciComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddKullaniciComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddKullaniciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
