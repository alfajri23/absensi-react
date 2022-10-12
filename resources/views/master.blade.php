<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}" />
        <title>Laravel</title>

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css">
        <link rel="stylesheet" href="{{ asset('css/style.css') }}">
        <link rel="stylesheet" href="{{ asset('css/custom.css') }}">
        <link rel="stylesheet" href="{{ asset('css/components.css') }}">
        <style>
            body {
                font-family: 'Nunito', sans-serif;
            }
        </style>

    </head>
    <body class="antialiased">

        <div id="root">
            <div class="main-wrapper">
                <div class="navbar-bg bg-nu" style="height: 80px"></div>
                <nav class="navbar navbar-expand-lg main-navbar">
                    <form class="form-inline mr-auto">
                        <ul class="navbar-nav mr-3">
                            <li><a href="#" data-toggle="sidebar" class="nav-link nav-link-lg">
                                <i class="fas fa-bars"></i>
                                </a>
                            </li>
                        </ul>
                    </form>
                    <ul class="navbar-nav navbar-right">
                        <li class="dropdown"><a href="#" data-toggle="dropdown"
                                class="nav-link dropdown-toggle nav-link-lg nav-link-user">
                                <i class="fas fa-user-circle mr-1"></i>
                                <div class="d-sm-none d-lg-inline-block"></div>
                            </a>
                            <div class="dropdown-menu dropdown-menu-right">
                                <div class="dropdown-title">Logged in 5 min ago</div>
                                <a href="" class="dropdown-item has-icon">
                                    <i class="far fa-user"></i> Profile
                                </a>
                                <a href="" class="dropdown-item has-icon">
                                    <i class="fas fa-cog"></i> Settings
                                </a>
                                <div class="dropdown-divider"></div>
                                <form id="logout-form" action="" method="POST" class="d-none">
                                    @csrf
                                </form>
                                <a href="" onclick="event.preventDefault();
                                    document.getElementById('logout-form').submit();" class="dropdown-item has-icon text-danger">
    
                                    <i class="fas fa-sign-out-alt"></i> Logout
                                </a>
                            </div>
                        </li>
                    </ul>
                </nav>
                <div class="main-sidebar sidebar-style-2">
                    <aside id="sidebar-wrapper">
                        <div className="sidebar-brand my-3">
                            <h4 className="text-nu mb-0">NU</h4>
                            <img src="" alt="logo" width="150" className="rounded-circle"/>
                        </div>
                
                        <div className="sidebar-brand sidebar-brand-sm">
                            <a to='/'>St</a>
                        </div>
                
                        <ul className="sidebar-menu">
                            <li className="menu-header">Dashboard</li>
                            <li className="">
                                <a className="nav-link" to='/'><i
                                        className="fas fa-fire"></i>
                                    <span>Dashboard</span></a>
                            </li>
                            <li className="">
                                <a className="nav-link" to='/about'><i
                                        className="fas fa-fire"></i>
                                    <span>Dashboard</span></a>
                            </li>
                            <li className="">
                                <a className="nav-link" to='/master/jurusan'><i
                                        className="fas fa-fire"></i>
                                    <span>Jurusan</span></a>
                            </li>
                
                           
                        </ul>
                    </aside>
                </div>
    
                <!-- Main Content -->
                <div class="main-content pt-6">
                    <section class="section">
                        @yield('content')
                    </section>
                </div>
                
                @stack('modal')
                <footer class="main-footer">
                    @include('includes.footer')
                </footer>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"
            integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous">
        </script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
            integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous">
        </script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.nicescroll/3.7.6/jquery.nicescroll.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js"></script>
    

    <script src="{{ asset('js/manifest.js') }}"></script>
    <script src="{{ asset('js/vendor.js') }}"></script>
    <script src="{{ asset('js/app.js') }}"></script>
    <script src="{{ asset('js/stisla.js') }}"></script>
    <script src="{{ asset('js/scripts.js') }}"></script>
    <script src="{{ asset('js/custom.js') }}"></script>
    {{-- <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js" defer></script> --}}
    </body>
</html>
