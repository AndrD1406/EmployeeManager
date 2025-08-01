import { provideRouter, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./shared/components/employee-list/employee-list.component')
        .then(m => m.EmployeeListComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

export const appRouting = provideRouter(routes);