import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Registro } from '../models/registro.model';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  private _storage: Storage | null = null;
  savesRegs: Registro[] = [];

  constructor(private storage: Storage) {
    this.init();
   }

   async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    const regsStorage = await this._storage.get('registros');
    this.savesRegs = regsStorage ? regsStorage : [];
  }

  async saveRegistro(format: string, text: string) {
    const newReg = new Registro(format, text);
    this.savesRegs.unshift(newReg);
    this._storage?.set('registros', this.savesRegs);
  }
}
