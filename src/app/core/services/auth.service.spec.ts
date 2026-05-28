import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '@environments/environment';


describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call login and store token properly', () => {
    const loginPayload = { email: 'test@test.com', password: 'password123' };
    const mockLoginResponse = {
      data: { accessToken: 'fake-token', refreshToken: 'fake-refresh-token' },
      message: 'Success'
    };
    const mockUserResponse = {
      id: 1,
      name: 'Test',
      email: 'test@test.com'
    };

    service.login(loginPayload).subscribe((session) => {
      expect(session.token).toBe('fake-token');
      expect(session.user).toEqual(mockUserResponse);
      expect(localStorage.getItem(environment.tokenStorageKey)).toBe('fake-token');
      expect(localStorage.getItem('rotinik_auth_user')).toBeTruthy();
    });

    const req1 = httpMock.expectOne(`${environment.apiUrl}/user/login`);
    expect(req1.request.method).toBe('POST');
    req1.flush(mockLoginResponse);

    const req2 = httpMock.expectOne(`${environment.apiUrl}/user/me`);
    expect(req2.request.method).toBe('GET');
    req2.flush(mockUserResponse);
  });

  it('should clear localStorage on logout', () => {
    localStorage.setItem(environment.tokenStorageKey, 'some-token');
    localStorage.setItem('rotinik_auth_user', '{}');

    service.logout();

    expect(localStorage.getItem(environment.tokenStorageKey)).toBeNull();
    expect(localStorage.getItem('rotinik_auth_user')).toBeNull();
  });

  it('should return token from getToken()', () => {
    localStorage.setItem(environment.tokenStorageKey, 'my-token');
    expect(service.getToken()).toBe('my-token');
  });

  it('should evaluate isAuthenticated() correctly', () => {
    expect(service.isAuthenticated()).toBeFalsy();

    localStorage.setItem(environment.tokenStorageKey, 'my-token');
    localStorage.setItem('rotinik_auth_user', JSON.stringify({ user: { email: 'test' } }));

    expect(service.isAuthenticated()).toBeTruthy();
  });
});
