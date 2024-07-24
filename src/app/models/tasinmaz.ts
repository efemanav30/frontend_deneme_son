import { Mahalle } from "./mahalle";

export class Tasinmaz{
    id:number;
    name: string;
    ada: string;
    parsel: string;
    nitelik: string;
    koordinatBilgileri: string;
    adres: string;
    mahalleId:number;
    mahalle:Mahalle;
  il: number;
  ilce: number;
  selected: boolean;
   userId:number;
   


 constructor(mahalleId:number , ada:string, parsel:string, nitelik:string, koordinatBilgileri:string, adres:string, userId:number){
    this.mahalleId = mahalleId;
    this.ada = ada;
    this.parsel = parsel;
    this.nitelik = nitelik;
    this.koordinatBilgileri = koordinatBilgileri;
    this.adres = adres;
    this.userId = userId;
  }
}