<body>
    <nav>
        <div id="header">
            <ul class="nav">
                <li><a href="/">Inicio</a></li>
                <li>
                    <p class="menu-item">Gráficas</p>
                    <ul>
                        <li><a href="/analytics">de Grupo</a></li>
                        <li><a href="/wris-datasets/graphs">wri</a></li>
                        <li>
                            <a href="/mentalhealth-datasets/graphs"
                                >mentalhealth</a
                            >
                        </li>
                        <li>
                            <a href="/salaries-datasets/graphs">salaries</a>
                        </li>
                    </ul>
                </li>
                <li>
                    <p class="menu-item">Front-ends</p>
                    <ul>
                        <li><a href="/wris-datasets">wri</a></li>
                        <li>
                            <a href="/mentalhealth-datasets">mentalhealth</a>
                        </li>
                        <li><a href="/salaries-datasets">salaries</a></li>
                    </ul>
                </li>
                <li><a href="/integrations">Integraciones</a></li>
                <li><a href="/about">About</a></li>
            </ul>
        </div>
    </nav>
</body>

<style>
    * {
        margin: 0px;
        padding: 0px;
    }

    #header {
        margin: auto;
        width: 600px;
        font-family: Arial, Helvetica, sans-serif;
    }

    ul {
        list-style: none;
    }

    .nav > li {
        display: inline-block;
        vertical-align: middle;
    }

    .nav li a {
        color: #fff;
        text-decoration: none;
        padding: 10px 20px;
        margin: 0 10px;
        transition: all 0.3s ease;
        border-radius: 5px;
        border: 1px solid transparent;
    }

    .nav li p {
        color: #fff;
        text-decoration: none;
        padding: 10px 20px;
        transition: all 0.3s ease;
        border-radius: 5px;
        border: 1px solid transparent;
    }

    .nav li a:hover {
        background-color: #5a5a8b;
        border-color: #fff;
    }

    .nav li p:hover {
        background-color: #5a5a8b;
        border-color: #fff;
    }

    .nav li ul {
        display: none;
        position: absolute;
        padding: 10px;
        min-width: 140px;
    }

    .nav li ul li {
        padding: 10px;
    }

    .nav li:hover > ul {
        display: block;
        background-color: rgb(6, 0, 88);
    }

    body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
    }

    nav {
        background-color: rgb(6, 0, 88); /* Azul oscuro */
        padding: 18px 0;
        padding-bottom: 20px;
        text-align: center;
    }
</style>
