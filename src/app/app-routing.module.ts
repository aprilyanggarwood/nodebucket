/*
Title: app-routing.module.ts
Author: Professor Krasso
Date: 01/03/2023
Modified By: April Yang
Description: Application routing module
*/



import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BaseLayoutComponent} from "./shared/base-layout/base-layout.component";
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from './pages/login/login.component';
import { AuthLayoutComponent } from './shared/auth-layout/auth-layout.component';
import { AuthGuard } from './auth.guard';
import { ContactComponent } from './pages/contact/contact.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AboutComponent } from './pages/about/about.component';


const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        canActivate:[AuthGuard] // use auth guard
      },
      {
        path: 'contact',
        component: ContactComponent,
        canActivate:[AuthGuard] // use auth guard
      },
       {
        path:'about',
         component: AboutComponent,
        canActivate:[AuthGuard] // use auth guard
       }
      ]
    // ], canActivate: [AuthGuard]  //  can use it at end of ] for all children path need AuthGuard
  },
  {
    path: 'session',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component:LoginComponent
      },
      {
        path: 'not-found',
        component: NotFoundComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'session/not-found' // when user login with unidentified empId, page will redirect to not-found page.
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, enableTracing: false, scrollPositionRestoration: 'enabled', relativeLinkResolution: 'legacy'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
