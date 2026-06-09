import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { environment } from '@environments/environment';


describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const userUrl = `${environment.apiUrl}/user`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    
    // Flush the constructor fetchUsers call
    const req = httpMock.expectOne(`${environment.apiUrl}/usuarios`);
    req.flush([{ id: '1', name: 'John Doe', email: 'john@doe.com' }]);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch users on init', () => {
    expect(service.getAllUsers().length).toBe(1);
    expect(service.getAllUsers()[0].name).toBe('John Doe');
  });

  it('should search users correctly', () => {
    const results = service.searchUsers('john');
    expect(results.length).toBe(1);
    
    const resultsEmpty = service.searchUsers('alex');
    expect(resultsEmpty.length).toBe(0);
  });
});
