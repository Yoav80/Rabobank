import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { StatementsComponent } from './features/statements/statements.component';
import { ComponentsModule } from './components/components.module';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        StatementsComponent
      ],
      imports: [
        ComponentsModule,
      ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
