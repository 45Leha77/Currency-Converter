import { Component, OnInit } from '@angular/core';
import { Currency } from 'src/app/model';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  constructor(private httpService: HttpService) {}
  allCurrencies!: Currency[];

  currencyForm = {
    first: {
      title: 'USD',
      value: '',
    },
    second: {
      title: 'UAH',
      value: '',
    },
  };

  private currentInput!: 'firstCurrencyValue' | 'secondCurrencyValue';

  ngOnInit(): void {
    this.httpService.getCurrentNBUData().subscribe((data) => {
      this.allCurrencies = data;
    });
  }

  private defineCurrency(cc: string) {
    let targetCurrency = this.allCurrencies.find(
      (currency: Currency) => currency.cc === cc
    );
    if (!targetCurrency) {
      throw new Error('Wrong currency code');
    }
    return targetCurrency;
  }

  setCurrentInput(event: any) {
    return (this.currentInput = event.target.name);
  }

  private getCurrenciesRatio() {
    let firstCurrencyRate = 1;
    let secondCurrencyRate = 1;
    if (this.currencyForm.first.title !== 'UAH') {
      firstCurrencyRate = this.defineCurrency(
        this.currencyForm.first.title
      ).rate;
    }
    if (this.currencyForm.second.title !== 'UAH') {
      secondCurrencyRate = this.defineCurrency(
        this.currencyForm.second.title
      ).rate;
    }
    return firstCurrencyRate / secondCurrencyRate;
  }

  calcSecondValue() {
    if (!this.currencyForm.first.value) {
      this.currencyForm.second.value = '';
      return;
    }
    this.currencyForm.second.value = `${(
      Number(this.currencyForm.first.value) * this.getCurrenciesRatio()
    ).toFixed(2)}`;
  }

  calcFirstValue() {
    if (!this.currencyForm.second.value) {
      this.currencyForm.first.value = '';
      return;
    }
    this.currencyForm.first.value = `${(
      Number(this.currencyForm.second.value) / this.getCurrenciesRatio()
    ).toFixed(2)}`;
  }

  updateInputs() {
    this.currentInput === 'firstCurrencyValue' ? this.calcSecondValue() : this.calcFirstValue();
  }
}
