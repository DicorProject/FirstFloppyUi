import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivacyPolicyComponent } from './shared/components/privacy-policy/privacy-policy.component';
import { TermsComponent } from './shared/components/terms/terms.component';
import { ReturnPolicyComponent } from './shared/components/return-policy/return-policy.component';
import { ServicesCategoryComponent } from './modules/services/components/services-category/services-category.component';
import { AntiDiscriminationPolicyComponent } from './shared/components/anti-discrimination-policy/anti-discrimination-policy.component';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./modules/home/home.module').then(r=> r.HomeModule)
      },
      {
        path: 'login',
        loadChildren: () => import('./modules/login/login.module').then(r=> r.LoginModule)
      },
      {
        path: 'blog',
        loadChildren: () => import('./modules/blog/blog.module').then(r=> r.BlogModule)
      },
      {
        path: 'services',
        loadChildren: () => import('./modules/services/services.module').then(r=> r.ServicesModule)
      },
      {
        path: 'cart',
        loadChildren: () => import('./modules/cart/cart.module').then(r=> r.CartModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./modules/profile/profile.module').then(r=> r.ProfileModule)
      },
      {
        path: 'about',
        loadChildren: () => import('./modules/about-us/about-us.module').then(r=> r.AboutUSModule)
      },
      {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent
      },
      {
        path: 'terms',
        component: TermsComponent
      },
      {
        path: 'return-policy',
        component: ReturnPolicyComponent
      },
      {
        path: 'anti-discrimination-policy',
        component: AntiDiscriminationPolicyComponent
      },
      {
        path: ':categorySeoUrl',
        component: ServicesCategoryComponent
      },
      {
        path: '**', // Wildcard route to catch any undefined paths
        redirectTo: '', // Redirect to home page
        pathMatch: 'full',
      },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'enabled', // Restores scroll position on navigation
      initialNavigation: 'enabledBlocking', // Ensures SSR handles the initial navigation
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}