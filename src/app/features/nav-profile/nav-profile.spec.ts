import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavProfile } from './nav-profile';

describe('NavProfile', () => {
  let component: NavProfile;
  let fixture: ComponentFixture<NavProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
