import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AdminHome } from './admin-home';

describe('AdminHome', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminHome],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
  });

  it('muestra accesos a los módulos de administración', async () => {
    const fixture = TestBed.createComponent(AdminHome);
    await fixture.whenStable();
    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain('Servicios');
    expect(html.textContent).toContain('Profesionales');
    expect(html.textContent).toContain('Usuarios');
  });
});
