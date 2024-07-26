import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { KullaniciService } from 'src/app/mainPage/services/kullanici.service';
import { LogService } from 'src/app/mainPage/services/log.service';
import { Log } from 'src/app/models/log';
import { User } from 'src/app/models/kullanici';
import * as sha256 from 'crypto-js/sha256';

@Component({
  selector: 'app-add-kullanici',
  templateUrl: './add-kullanici.component.html',
  styleUrls: ['./add-kullanici.component.css']
})
export class AddKullaniciComponent {
  kullaniciForm: FormGroup;
  

  constructor(
    private fb: FormBuilder,
    private kullaniciService: KullaniciService,
    private logService: LogService,
    public activeModal: NgbActiveModal
  ) {
    this.kullaniciForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      phone: ['', Validators.required],
      adress: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (!value) {
      return null;
    }
    const hasNumber = /[0-9]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const validLength = value.length >= 8;

    const passwordValid = hasNumber && hasUpper && hasLower && hasSpecial && validLength;
    return !passwordValid ? { 'passwordInvalid': true } : null;
  }

  addKullanici(): void {
    if (this.kullaniciForm.valid) {
      const kullanici: User = this.kullaniciForm.value;
      // Hash the password using SHA-256
      kullanici.password = sha256(kullanici.password).toString();

      this.kullaniciService.add(kullanici).subscribe(() => {
        console.log("Kullanıcı başarıyla eklendi.")
        alert('Kullanıcı başarıyla eklendi.');
        this.activeModal.close();
      }, error => {
        console.error('Kullanıcı eklenemedi:', error);
        alert('Kullanıcı eklenemedi.');
        const log: Log = {
          kullaniciId: this.getUserId(),
          durum: "Başarısız",
          islemTip: "Kullanıcı Ekleme",
          aciklama: "Kullanıcı eklenemedi: " + error.message,
          tarihveSaat: new Date(),
          kullaniciTip: "User"
        };
        this.logService.add(log).subscribe(() => {
          console.log('Hata loglandı.');
        }, logError => {
          console.error('Loglama sırasında hata oluştu:', logError);
        });
      });
    } else {
      // Handle the case when the form is invalid
      alert('Lütfen gerekli alanları doldurun.');
      console.error('Form geçersiz:', this.kullaniciForm.errors);
      const log: Log = {
        kullaniciId: this.getUserId(),
        durum: "Başarısız",
        islemTip: "Kullanıcı Ekleme",
        aciklama: "Kullanıcı eklenemedi: Form geçersiz.",
        tarihveSaat: new Date(),
        kullaniciTip: "User"
      };
      this.logService.add(log).subscribe(() => {
        console.log('Hata loglandı.');
      }, logError => {
        console.error('Loglama sırasında hata oluştu:', logError);
      });
    }
  }

  getUserId(): number {
    // Replace this with the actual logic to get the user ID
    return 1;
  }
}
