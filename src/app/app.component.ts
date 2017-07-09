import {Component, OnInit, NgZone} from '@angular/core';
import {ToasterService} from 'angular2-toaster';
import {CoreService} from './core/core.service';
import {SettingService} from './core/setting.service';
import {DbConnectService} from './core/db-connect/db-connect.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'app works!';
    public showLogin: boolean = false;

    // Probar con el producto en el constructor
    constructor(private _ngZone: NgZone,
                private coreService: CoreService,
                private dbConnectService: DbConnectService,
                private settingService: SettingService,
                private toasterService: ToasterService) {

        coreService.showToast.subscribe(toast => {
            this.toasterService.pop(toast['type'], toast['title'], toast['body']);
        });

        coreService.getLoginStatus.subscribe(data => {
            this._ngZone.run(() => {
                this.showLogin = data;
            });
        });
    }

    ngOnInit() {

    }


}
