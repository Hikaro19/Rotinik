import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/feature/layout/layout.component';

export const appRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
            import('@features/welcome/splash/splash.component').then((m) => m.SplashComponent),
    },
    {
        path: 'onboarding',
        loadComponent: () =>
            import('@features/welcome/onboarding/onboarding.component').then((m) => m.OnboardingComponent),
    },
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                loadComponent: () =>
                    import('@features/auth/login/login.component').then((m) => m.LoginComponent),
            },
            {
                path: 'register',
                loadComponent: () =>
                    import('@features/auth/register/register.component').then((m) => m.RegisterComponent),
            },
            {
                path: 'success',
                loadComponent: () =>
                    import('./features/auth/register-success/register-success.component').then((m) => m.RegisterSuccessComponent),
            },
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full',
            },
        ],
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'home',
                loadComponent: () =>
                    import('@features/home/home.component').then((m) => m.HomeComponent),
            },
            {
                path: 'routines',
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('@features/routines/routines.component').then((m) => m.RoutinesComponent),
                    },
                    {
                        path: ':id',
                        loadComponent: () =>
                            import('@features/routines/routine-detail/routine-detail.component').then(
                                (m) => m.RoutineDetailComponent
                            ),
                    },
                ],
            },
            {
                path: 'routine/:id',
                loadComponent: () =>
                    import('@features/routines/routine-detail/routine-detail.component').then(
                        (m) => m.RoutineDetailComponent
                    ),
            },
            {
                path: 'tasks',
                children: [
                    {
                        path: ':id',
                        loadComponent: () =>
                            import('@features/tasks/tasks.component').then((m) => m.TasksComponent),
                    },
                ],
            },
            {
                path: 'shop',
                loadComponent: () =>
                    import('@features/shop/shop.component').then((m) => m.ShopComponent),
            },
            {
                path: 'profile',
                loadComponent: () =>
                    import('@features/profile/profile.component').then((m) => m.ProfileComponent),
            },
            {
                path: 'friends',
                children: [
                    {
                        path: 'leaderboard',
                        loadComponent: () =>
                            import('@features/friends/leaderboard/leaderboard.component').then(
                                (m) => m.LeaderboardComponent
                            ),
                    },
                    {
                        path: 'feed',
                        loadComponent: () =>
                            import('@features/friends/feed/feed.component').then(
                                (m) => m.FeedComponent
                            ),
                    },
                    {
                        path: 'profile/:id',
                        loadComponent: () =>
                            import('@features/friends/friend-profile/friend-profile.component').then(
                                (m) => m.FriendProfileComponent
                            ),
                    },
                    {
                        path: '',
                        loadComponent: () =>
                            import('@features/friends/friends.component').then((m) => m.FriendsComponent),
                    },
                ],
            },
            {
                path: 'options',
                loadComponent: () =>
                    import('@features/options/options.component').then((m) => m.OptionsComponent),
            },
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full',
            },
        ],
    },
    {
        path: '**',
        redirectTo: '',
    },
];
