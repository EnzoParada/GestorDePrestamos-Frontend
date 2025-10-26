
const API_URL_CLIENTES = 'http://localhost:8080/api/clientes';
const CREDENCIALES_BASIC = btoa('admin:12345');
const AUTH_HEADERS = {
    'Authorization': `Basic ${CREDENCIALES_BASIC}`,
    'Content-Type': 'application/json'
};

const INTERES_ANUAL_FIJO = 25.0; 

const formPrestamo = document.getElementById('form-prestamo'); 
const formTitulo = document.getElementById('form-titulo');
const btnGuardar = document.getElementById('btn-guardar');
const btnCancelar = document.getElementById('btn-cancelar');
const inputNombre = document.getElementById('nombre');
const inputApellido = document.getElementById('apellido');
const inputDni = document.getElementById('dni');

const seccionPrestamo = document.getElementById('seccion-prestamo');
const selectMonto = document.getElementById('monto');
const selectCuotas = document.getElementById('cuotas');
const calculoDisplay = document.getElementById('calculo-display');
const totalDevolver = document.getElementById('total-devolver');
const pagoMensual = document.getElementById('pago-mensual');

const listaClientes = document.getElementById('lista-clientes');
const btnVerLista = document.getElementById('btn-ver-lista');
const tituloListaClientes = document.getElementById('titulo-lista-clientes');
const separadorLista = document.getElementById('separador-lista');


async function cargarClientes() {
    try {
        const respuesta = await fetch(API_URL_CLIENTES, {
            method: 'GET',
            headers: AUTH_HEADERS
        });
        if (!respuesta.ok) throw new Error('Error al cargar clientes');
        
        const clientes = await respuesta.json();
        listaClientes.innerHTML = '';

        clientes.forEach(cliente => {
            const li = document.createElement('li');
            
            const info = document.createElement('span');
            info.className = 'cliente-info';
            
            let infoHtml = `
                <strong>${cliente.nombre} ${cliente.apellido}</strong> (DNI: ${cliente.dni})
            `;

            if (cliente.prestamos && cliente.prestamos.length > 0) {
                const primerPrestamo = cliente.prestamos[0]; 
                
                infoHtml += `<br><small>Préstamo: $${primerPrestamo.monto} en ${primerPrestamo.plazoMeses} cuotas</small>`;
            }
            
            info.innerHTML = infoHtml;
            
            const botones = document.createElement('div');
            botones.className = 'cliente-botones';
            
            const btnEditar = document.createElement('button');
            btnEditar.className = 'btn-editar';
            btnEditar.textContent = 'Editar';
            btnEditar.dataset.id = cliente.id; 
            
            const btnEliminar = document.createElement('button');
            btnEliminar.className = 'btn-eliminar';
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.dataset.id = cliente.id;
            
            botones.appendChild(btnEditar);
            botones.appendChild(btnEliminar);
            li.appendChild(info);
            li.appendChild(botones);
            listaClientes.appendChild(li);
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

formPrestamo.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const clienteId = formPrestamo.dataset.id;
    let url = API_URL_CLIENTES;
    let method = 'POST';

    let datosCompletos = {
        nombre: inputNombre.value,
        apellido: inputApellido.value,
        dni: inputDni.value,
        prestamos: [] 
    };

    if (clienteId) {
        url = `${API_URL_CLIENTES}/${clienteId}`;
        method = 'PUT';
        delete datosCompletos.prestamos; 

    } else {
        const monto = parseFloat(selectMonto.value);
        const cuotas = parseInt(selectCuotas.value);
        const interes = INTERES_ANUAL_FIJO; 

        if (monto > 0 && cuotas > 0) {
            const primerPrestamo = {
                monto: monto,
                plazoMeses: cuotas,
                tasaInteres: interes
            };
            datosCompletos.prestamos.push(primerPrestamo);
        } else {
             delete datosCompletos.prestamos;
        }
    }
    
    try {
        const respuesta = await fetch(url, {
            method: method,
            headers: AUTH_HEADERS,
            body: JSON.stringify(datosCompletos)
        });

        if (!respuesta.ok) throw new Error('Error al guardar el cliente');

        resetFormulario();
        if (!listaClientes.classList.contains('hidden')) {
            await cargarClientes();
        }

    } catch (error) {
        console.error("Error:", error);
    }
});

listaClientes.addEventListener('click', async (e) => {
    const target = e.target;

    if (target.classList.contains('btn-eliminar')) {
        const id = target.dataset.id;
        if (confirm(`¿Seguro que quieres dar de baja a este cliente?`)) {
            try {
                const respuesta = await fetch(`${API_URL_CLIENTES}/${id}`, {
                    method: 'DELETE',
                    headers: AUTH_HEADERS
                });
                if (respuesta.status !== 204) throw new Error('Error al eliminar');
                await cargarClientes();
            } catch (error) {
                console.error("Error:", error);
            }
        }
    }

    if (target.classList.contains('btn-editar')) {
        const id = target.dataset.id;
        try {
            const respuesta = await fetch(`${API_URL_CLIENTES}/${id}`, {
                method: 'GET',
                headers: AUTH_HEADERS
            });
            if (!respuesta.ok) throw new Error('No se pudo cargar el cliente');
            
            const cliente = await respuesta.json();
            
            inputNombre.value = cliente.nombre;
            inputApellido.value = cliente.apellido;
            inputDni.value = cliente.dni;
            formPrestamo.dataset.id = cliente.id; 

            formTitulo.textContent = 'Editando Cliente';
            btnGuardar.textContent = 'Actualizar';
            btnCancelar.classList.remove('hidden');
            
            seccionPrestamo.classList.add('hidden');
            
            window.scrollTo(0, 0);

        } catch (error) {
            console.error("Error:", error);
        }
    }
});

function calcularPrestamo() {
    const monto = parseFloat(selectMonto.value);
    const cuotas = parseInt(selectCuotas.value);
    const interes = INTERES_ANUAL_FIJO; 

    if (monto > 0 && cuotas > 0) {
        const interesTotal = monto * (interes / 100);
        const totalADevolver = monto + interesTotal;
        const pagoMensualCalc = totalADevolver / cuotas;

        totalDevolver.textContent = `$${totalADevolver.toFixed(2)}`;
        pagoMensual.textContent = `$${pagoMensualCalc.toFixed(2)}`;
        calculoDisplay.classList.remove('hidden');
    } else {
        calculoDisplay.classList.add('hidden');
    }
}
selectMonto.addEventListener('change', calcularPrestamo);
selectCuotas.addEventListener('change', calcularPrestamo);

btnCancelar.addEventListener('click', () => {
    resetFormulario();
});

function resetFormulario() {
    formPrestamo.reset(); 
    formPrestamo.dataset.id = ''; 
    formTitulo.textContent = 'Nuevo Prestamo';
    btnGuardar.textContent = 'Guardar';
    btnCancelar.classList.add('hidden');
    
    seccionPrestamo.classList.remove('hidden');
    calculoDisplay.classList.add('hidden'); 

btnVerLista.addEventListener('click', async () => {
    const estaOculta = listaClientes.classList.contains('hidden');
    if (estaOculta) {
        await cargarClientes();
        separadorLista.classList.remove('hidden');
        tituloListaClientes.classList.remove('hidden');
        listaClientes.classList.remove('hidden');
        btnVerLista.textContent = 'Ocultar lista';
    } else {
        separadorLista.classList.add('hidden');
        tituloListaClientes.classList.add('hidden');
        listaClientes.classList.add('hidden');
        listaClientes.innerHTML = '';
        btnVerLista.textContent = 'Ver lista de clientes';
    }
});
}