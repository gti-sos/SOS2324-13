<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";

    let API = "/api/v1/salaries-datasets";

    if (dev) API = "http://localhost:10000" + API;

    let dataset = [];
    let newData = {
        country: "country ",
        code: "code",
        schizophrenia: 0,
        bipolar_disorder: 0,
        eating_disorder: 0,
        anxiety_disorder: 0,
        drug_use_disorder: 0,
        depression: 0,
        alcoholism: 0,
        year: 0,
    };

    let errorMsg = "";
    let confirmation = "";

    onMount(() => {
        getData();
    });

    async function loadData() {
        try {
            const response = await fetch(API + "/loadInitialData", { method: "GET" });
            const status = response.status;
            if (status === 201) {
                confirmation = "Datos cargados correctamente";
            } else {
                errorMsg = `Error ${status}: Los datos ya han sido cargados`;
            }
        } catch (error) {
            errorMsg = error.message;
        }
    }

    async function getData() {
        try {
            const response = await fetch(API, { method: "GET" });
            let data = await response.json();
            let status = await response.status;
            if (status == 200) {
                dataset = data;
                confirmation = "Datos obtenidos correctamente";
                errorMsg = "";
            } else if (status == 404) {
                errorMsg = "No hay datos existentes";
                confirmation = "";
                dataset = [];
            }
        } catch (error) {
            errorMsg = error.message;
        }
    }

    async function createData() {
        try {
            const response = await fetch(API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newData)
            });
            const status = response.status;
            if (status === 201) {
                getData();
                confirmation = "Nuevo dato creado";
            } else {
                errorMsg = `Error ${status}: No se pudo crear el dato`;
            }
        } catch (error) {
            errorMsg = error.message;
        }
    }

    async function deleteAllData() {
        try {
            const response = await fetch(API, { method: "DELETE" });
            const status = response.status;
            if (status === 200) {
                dataset = [];
                confirmation = "Todos los datos eliminados";
            } else {
                errorMsg = `Error ${status}: No se pudieron eliminar los datos`;
            }
        } catch (error) {
            errorMsg = error.message;
        }
    }

    async function deleteData(country, year) {
        try {
            const response = await fetch(API + "/" + country + "/" + year, { method: "DELETE" });
            const status = response.status;
            if (status === 200) {
                // Eliminar el dato del conjunto de datos local
                dataset = dataset.filter(data => data.country !== country || data.year !== year);
                confirmation = "Dato eliminado correctamente";
            } else if (status === 404) {
                errorMsg = `Error ${status}: No se encontró el dato a eliminar`;
            } else {
                errorMsg = `Error ${status}: No se pudo eliminar el dato`;
            }
        } catch (error) {
            errorMsg = error.message;
        }
    }
</script>