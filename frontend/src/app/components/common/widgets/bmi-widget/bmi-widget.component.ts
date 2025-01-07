import { Component, OnInit } from '@angular/core';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bmi-widget',
  standalone: true,
  imports: [NgxChartsModule, CommonModule],
  templateUrl: './bmi-widget.component.html',
  styleUrl: './bmi-widget.component.scss',
})
export class BmiWidgetComponent implements OnInit {
  protected bmi: number = 0;
  protected chartData: any[] = [];
  protected view: [number, number] = [300, 200];

  colorScheme: Color = {
    name: 'bmiColors',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5BE12C', '#F5CD19', '#F5CD19', '#EA4228'],
  };

  ngOnInit(): void {
    this.calculateBmi();
    this.updateChartData();
  }

  private calculateBmi() {
    this.bmi = 20.1;
  }

  private updateChartData() {
    this.chartData = [
      {
        name: 'BMI',
        value: this.bmi,
      },
    ];
  }

  formatLabel(value: number): string {
    return `${value.toFixed(1)}`;
  }

}
