import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { KullaniciService } from 'src/app/mainPage/services/kullanici.service';
import { LogService } from 'src/app/mainPage/services/log.service';
import { Log } from 'src/app/models/log';
import { User } from 'src/app/models/kullanici';
import { ToastrService } from 'ngx-toastr';
import * as sha256 from 'crypto-js/sha256';

@Component({
  selector: 'app-add-kullanici',
  templateUrl: './add-kullanici.component.html',
  styleUrls: ['./add-kullanici.component.css']
})
export class AddKullaniciComponent {
  kullaniciForm: FormGroup;
  isSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private kullaniciService: KullaniciService,
    private logService: LogService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService
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

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.kullaniciForm.valid) {
      if (confirm('Bu kullanıcıyı eklemek istediğinize emin misiniz?')) {
        const formValues = this.kullaniciForm.value;
        const hashedPassword = sha256(formValues.password).toString();
        const kullanici: User = { ...formValues, password: hashedPassword };

        this.kullaniciService.add(kullanici).subscribe(() => {
          this.toastr.success('Kullanıcı başarıyla eklendi.');
          this.activeModal.close();
        }, error => {
          this.toastr.error('Kullanıcı eklenemedi.', 'Hata', { timeOut: 3000, closeButton: true, progressBar: true });
          console.error('Kullanıcı eklenemedi:', error);
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
      }
    } else {
      this.toastr.error('Lütfen gerekli alanları doldurun.', 'Hata', { timeOut: 3000, closeButton: true, progressBar: true });
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
    return 1;
  }
}
