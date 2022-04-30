import { Component, OnInit } from '@angular/core';
import { Currency } from 'src/app/model';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private httpService: HttpService) {}
  USDdata!: Currency;
  EURdata!: Currency;

  ngOnInit(): void {
    this.httpService.getCurrentNBUData().subscribe((data) => {
      data.forEach((currency: Currency) => {
        if (currency.cc === 'USD') {
          this.USDdata = currency;
        }
        if (currency.cc === 'EUR') {
          this.EURdata = currency;
        }
      });
    });
  }
}
