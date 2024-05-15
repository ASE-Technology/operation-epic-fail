import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { BaseChartDirective } from 'ng2-charts';
import { 
    Chart, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    LineElement, 
    PointElement, 
    Title, 
    Tooltip, 
    Legend, 
    RadarController, 
    ArcElement, 
    RadialLinearScale, 
    BarController, 
    LineController,
    DoughnutController // Import DoughnutController
} from 'chart.js';

// Register the required Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  RadarController,
  ArcElement,
  RadialLinearScale,
  BarController,
  LineController,
  DoughnutController // Register DoughnutController
);

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, BaseChartDirective], // Ensure correct imports
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct chart data for line chart', () => {
    expect(component.lineChartData.datasets.length).toBe(1);
    expect(component.lineChartData.datasets[0].data).toEqual([65, 59, 80, 81, 56, 55, 40]);
    expect(component.lineChartData.labels).toEqual(['January', 'February', 'March', 'April', 'May', 'June', 'July']);
  });

  it('should have correct options for line chart', () => {
    expect(component.lineChartOptions.responsive).toBe(false);
  });

  it('should have initialized bar chart data correctly', () => {
    expect(component.barChartData.labels).toEqual(['2006', '2007', '2008', '2009', '2010', '2011', '2012']);
    expect(component.barChartData.datasets.length).toBe(2);
    expect(component.barChartData.datasets[0].data).toEqual([65, 59, 80, 81, 56, 55, 40]);
  });

  it('should have correct radar chart data', () => {
    expect(component.radarChartData.labels).toEqual(['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running']);
    expect(component.radarChartData.datasets[1].data).toEqual([28, 48, 40, 19, 96, 27, 100]);
  });
});
