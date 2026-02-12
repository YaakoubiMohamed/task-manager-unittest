import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  describe('Component Initialization', () => {
    it('should create the app', () => {
      expect(component).toBeTruthy();
    });

    it('should have title signal with value "task-manager"', () => {
      expect(component['title']()).toBe('task-manager');
    });
  });

  describe('Template Rendering', () => {
    it('should render TaskList component', async () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.querySelector('app-task-list')).toBeTruthy();
    });
  });

  describe('Signal Behavior', () => {
    it('should maintain title signal reactivity', () => {
      const initialTitle = component['title']();
      expect(initialTitle).toBe('task-manager');

      // Signal should be consistent across multiple reads
      expect(component['title']()).toBe(initialTitle);
    });
  });
});
