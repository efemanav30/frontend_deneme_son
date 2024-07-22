export class User {
    id: number;
    name: string;
    surname: string;
    email: string;
    password: string;
    phone: string;
    adress: string;
    role: string;
    selected?: boolean; // Checkbox için kullanacağız

  
    constructor(id: number, name: string, surname: string, email: string, password: string, phone: string, adress:string, role: string) {
      this.id = id;
      this.name = name;
      this.surname = surname;
      this.email = email;
      this.password = password;
      this.phone = phone;
      this.adress = adress;
      this.role = role;
    }
  }
  