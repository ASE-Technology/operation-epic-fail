import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PortalLayoutComponent } from './portal-layout.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('PortalLayoutComponent', () => {
  let component: PortalLayoutComponent;
  let fixture: ComponentFixture<PortalLayoutComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PortalLayoutComponent, // Import the standalone component directly
        RouterTestingModule.withRoutes([]) // Use RouterTestingModule to mock router
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PortalLayoutComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    // Spy on router navigation and local storage
    spyOn(router, 'navigate').and.stub(); // Ensuring navigation is stubbed
    spyOn(localStorage, 'removeItem').and.stub(); // Ensuring local storage removal is stubbed
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home on logout', () => {
    component.onLogout();
    expect(localStorage.removeItem).toHaveBeenCalledWith('token'); // Check if token is removed
    expect(router.navigate).toHaveBeenCalledWith(['/']); // Check navigation to home
  });
});
