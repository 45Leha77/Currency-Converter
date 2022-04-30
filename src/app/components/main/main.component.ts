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

  firstCurrencyTitle = 'USD';
  secondCurrencyTitle = 'UAH';

  firstCurrencyInputValue!: string;
  secondCurrencyInputValue!: string;

  private currentInput!: 'firstCurrencyInputValue' | 'secondCurrencyInputValue';

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
    if (this.firstCurrencyTitle !== 'UAH') {
      firstCurrencyRate = this.defineCurrency(this.firstCurrencyTitle).rate;
    }
    if (this.secondCurrencyTitle !== 'UAH') {
      secondCurrencyRate = this.defineCurrency(this.secondCurrencyTitle).rate;
    }
    return firstCurrencyRate / secondCurrencyRate;
  }

  calcSecondValue() {
    if (!this.firstCurrencyInputValue) {
      this.secondCurrencyInputValue = '';
      return;
    }
    this.secondCurrencyInputValue = `${(
      Number(this.firstCurrencyInputValue) * this.getCurrenciesRatio()
    ).toFixed(2)}`;
  }

  calcFirstValue() {
    if (!this.secondCurrencyInputValue) {
      this.firstCurrencyInputValue = '';
      return;
    }
    this.firstCurrencyInputValue = `${(
      Number(this.secondCurrencyInputValue) / this.getCurrenciesRatio()
    ).toFixed(2)}`;
  }

  updateInputs() {
    this.currentInput === 'firstCurrencyInputValue'
      ? this.calcSecondValue()
      : this.calcFirstValue();
  }
}
