import { Component, Input } from '@angular/core';
import { KullaniciService } from 'src/app/mainPage/services/kullanici.service';
import { User } from 'src/app/models/kullanici';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-update-kullanici',
  templateUrl: './update-kullanici.component.html',
  styleUrls: ['./update-kullanici.component.css']
})
export class UpdateKullaniciComponent {
  @Input() kullanici: User;

  constructor(private kullaniciService: KullaniciService, public activeModal: NgbActiveModal) { }

  updateKullanici(): void {
    this.kullaniciService.update(this.kullanici.id, this.kullanici).subscribe(
      () => {
        alert('Kullanıcı başarıyla güncellendi.');
        this.activeModal.close();
      },
      error => {
        alert('Kullanıcı güncellenirken bir hata oluştu: ' + error.message);
        console.error(error);
      }
    );
  }
}
