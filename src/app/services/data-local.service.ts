import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  savesRegs: Registro[] = [];

  constructor() { }

  saveRegistro( format: string, text: string ) {
    const newReg = new Registro(format, text);
    this.savesRegs.unshift(newReg);
    console.log(this.savesRegs);
  }
}
