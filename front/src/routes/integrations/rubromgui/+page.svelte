<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";

    let API = "/api/v2/wris-datasets";
    let APIproxy = "/proxyRRG";

    if (dev) API = "http://localhost:10000" + API;

    let dataset = [];

    // Mensajes
    let errorMsg = "";
    let confirmation = "";

    // Cargar los datos cuando se cargue la pagina
    onMount(() => {
        //getData --> backend
        //getData1 --> proxy
        //getData2
        //getData3
        //getData4
        //getGraph1
        //getGraph2
        //getGraph3
        //getGraph4
    });

    // Mi API, para la integración
    async function getData() {
        try {
            const response = await fetch(API);
            data = await response.json();

            return data;
        } catch (error) {
            console.error(error);
        }
    }

    // API externa 1, con proxy
    async function getData1() {
        try {
            const res = await fetch(APIproxy, {
                headers: {
                    "X-Api-Key": "rellenar",
                },
            });
            return await res.json();
        } catch (error) {
            console.error(error);
        }
    }

    // API externa 2

    // API externa 3

    // API externa 4
</script>

<h2>Integraciones de rubromgui</h2>
<h3>Integración con proxy de API ""nombre1""</h3>
Gráfica 1

<h3>Integración con API ""nombre2""</h3>
Gráfica 2

<h3>Integración con API ""nombre3""</h3>
Gráfica 3

<h3>Integración con API ""nombre4""</h3>
Gráfica 4
