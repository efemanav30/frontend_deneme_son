import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KullaniciService } from 'src/app/mainPage/services/kullanici.service';

@Component({
  selector: 'app-add-kullanici',
  templateUrl: './add-kullanici.component.html',
  styleUrls: ['./add-kullanici.component.css']
})
export class AddKullaniciComponent implements OnInit {
  kullaniciForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private kullaniciService: KullaniciService
  ) { }

  ngOnInit(): void {
    this.kullaniciForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: ['', Validators.required],
      adress: ['', Validators.required], // 'adress' burada 'address' değil
      role: ['', Validators.required]
    });
  }

  addKullanici(): void {
    if (this.kullaniciForm.valid) {
      this.kullaniciService.add(this.kullaniciForm.value).subscribe(
        response => {
          console.log('Kullanıcı başarıyla eklendi:', response);
          alert('Kullanıcı başarıyla eklendi.');
          window.location.reload();
        },
        error => {
          console.error('Kullanıcı eklenemedi:', error);
          alert('Kullanıcı eklenemedi. Lütfen tekrar deneyin.');
        }
      );
    } else {
      alert('Lütfen formu eksiksiz doldurun.');
    }
  }
}
