import { Component } from '@angular/core';
import { User } from 'src/app/models/kullanici';
import { KullaniciService } from 'src/app/mainPage/services/kullanici.service';

@Component({
  selector: 'app-add-kullanici',
  templateUrl: './add-kullanici.component.html',
  styleUrls: ['./add-kullanici.component.css']
})
export class AddKullaniciComponent {
  kullanici: User = {
    id: 0,
    name: '',
    surname: '',
    email: '',
    password: '',
    phone: '',
    adress: '',
    role: '' // Role olarak kalacak
  };

  constructor(private kullaniciService: KullaniciService) { }

  addKullanici(): void {
    this.kullaniciService.add(this.kullanici).subscribe(
      response => {
        console.log('Kullanıcı başarıyla eklendi:', response);
        alert('Kullanıcı başarıyla eklendi.');
      },
      error => {
        console.error('Kullanıcı eklenemedi:', error);
        alert('Kullanıcı eklenemedi. Lütfen tekrar deneyin.');
      }
    );
  }
}
