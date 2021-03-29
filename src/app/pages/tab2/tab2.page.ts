import { Component } from '@angular/core';
import { DataLocalService } from '../../services/data-local.service';
import { Registro } from '../../models/registro.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(
    public dataLocal: DataLocalService,
  ) {}

  sendEmail() {
    this.dataLocal.sendEmail();
  }

  openReg(reg: Registro) {
    this.dataLocal.openReg(reg);
  }

}
