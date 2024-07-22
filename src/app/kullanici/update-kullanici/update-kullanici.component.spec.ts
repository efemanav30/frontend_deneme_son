import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateKullaniciComponent } from './update-kullanici.component';

describe('UpdateKullaniciComponent', () => {
  let component: UpdateKullaniciComponent;
  let fixture: ComponentFixture<UpdateKullaniciComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateKullaniciComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateKullaniciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
