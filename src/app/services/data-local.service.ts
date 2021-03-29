import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Registro } from '../models/registro.model';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  private _storage: Storage | null = null;
  savesRegs: Registro[] = [];
  nameFile: string = 'registros.csv';

  constructor(
    private storage: Storage,
    private navCtrl: NavController,
    private iab: InAppBrowser,
    private file: File,
    private socialSharing: SocialSharing
  ) {
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
    this.openReg(newReg);
  }

  openReg(reg: Registro) {
    console.log(reg);
    this.navCtrl.navigateForward('/tabs/tab2');

    switch (reg.type) {
      case 'HTTP':
        const browser = this.iab.create(reg.text, '_system');
        break;
      case 'GEO':
        this.navCtrl.navigateForward(`tabs/tab2/mapa/${reg.text}`)
        break;

      default:
        break;
    }
  }

  sendEmail() {

    const arrTemp = [];
    const titulos = 'Tipo, Formato, Creado en, Texto\n';

    arrTemp.push(titulos);

    this.savesRegs.forEach(r => {
      const linea = `${r.type}, ${r.format}, ${r.created}, ${r.text.replace(',', ' ')}\n`;
      arrTemp.push(linea);
    });

    this.createFile(arrTemp.join(''));

  }

  createFile( text: string) {

    this.file.checkFile( this.file.dataDirectory, this.nameFile )
      .then( existe => {
        console.log('Existe archivo?', existe);
        return this.writeFile( text );
      })
      .catch( err => {
        return this.file.createFile( this.file.dataDirectory, this.nameFile, false )
          .then( created => this.writeFile(text))
          .catch( err2 => console.log('Error al crear archivo', err2));
      });

  }

  async writeFile( text: string) {
    await this.file.writeExistingFile( this.file.dataDirectory, this.nameFile, text );
    console.log('Archivo creado!');
    const file = this.file.dataDirectory + this.nameFile;

    this.socialSharing.share('Backup', '', file,);
    
  }
}
