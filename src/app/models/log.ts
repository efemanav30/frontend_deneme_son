export interface Log {
    id?: number;
    kullaniciId: number;
    durum: string;
    islemTip: string;
    aciklama: string;
    tarihveSaat: Date;
    kullaniciTip: string;
    selected?: boolean;
  }
  