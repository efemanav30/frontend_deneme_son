import { Component, Input, OnInit } from '@angular/core';
import { KullaniciService } from 'src/app/mainPage/services/kullanici.service';
import { User } from 'src/app/models/kullanici';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-kullanici',
  templateUrl: './update-kullanici.component.html',
  styleUrls: ['./update-kullanici.component.css']
})
export class UpdateKullaniciComponent implements OnInit {
  @Input() kullanici: User;
  kullaniciForm: FormGroup;
  isSubmitted = false;

  constructor(
    private kullaniciService: KullaniciService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit() {
    if (this.kullanici) {
      this.updateForm();
    }
  }

  createForm() {
    this.kullaniciForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      adress: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  updateForm() {
    this.kullaniciForm.patchValue({
      name: this.kullanici.name,
      surname: this.kullanici.surname,
      email: this.kullanici.email,
      phone: this.kullanici.phone,
      adress: this.kullanici.adress,
      role: this.kullanici.role
    });
  }

  updateKullanici(): void {
    this.isSubmitted = true;
    if (this.kullaniciForm.valid) {
      if (confirm('Bu kullanıcıyı güncellemek istediğinize emin misiniz?')) {
        const updatedUser = { ...this.kullanici, ...this.kullaniciForm.value };
        this.kullaniciService.update(this.kullanici.id, updatedUser).subscribe(
          () => {
            //this.toastr.success('Kullanıcı başarıyla güncellendi.');
            this.activeModal.close();
          },
          error => {
            this.toastr.error('Kullanıcı güncellenirken bir hata oluştu: ' + error.message);
            console.error(error);
          }
        );
      }
    } else {
      this.markFormGroupTouched(this.kullaniciForm);
      this.toastr.error('Lütfen tüm gerekli alanları doldurun.');
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }
}
