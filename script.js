chartShown = 0;

function calc() {

    // reset arrays
    let yvals = [];
    let minvals = [];
    let xvals = [];
    
    // inputs

    let L = document.getElementById('pipe_length').value                // pipe length in m
    let d_p = document.getElementById('pipe_diameter').value            // diameter in m
    let epsylon = document.getElementById('pipe_roughness').value       // roughness in m
    let dh = document.getElementById('pipe_elevation').value            // elevation change in m
    let v = document.getElementById('fluid_v').value                    // fluid velocity in z direction (superficial) in m/s
    let rho = document.getElementById('fluid_density').value            // density in kg/m3
    let mu = document.getElementById('fluid_viscosity').value           // viscosity in kg*s          
    let P_in = document.getElementById('P_in').value*100000             // inlet pressure in Pa
    let P_req = document.getElementById('P_required').value*100000      // required pressure at outlet in bar
    
    // calculations

    let dP = 'error';   // default
    let f = 0;     

    let regime = '';
    let Re = (rho*v*d_p)/mu;

    if(Re <= 0 ){
        regime = 'ERROR';
    }
    else if(Re < 2000 ){
        regime = 'Laminar';
        f = 16/Re;
    }
    else if (Re > 4000 ){
        regime = 'Turbulent'
        f = (1/(-3.6*Math.log10( ((epsylon/d_p)/3.7)**1.11 + 6.9/Re)))**2;
    }
    else{
        regime = 'Transition region (turbulent assumed)';
        f = (1/(-3.6*Math.log10( ((epsylon/d_p)/3.7)**1.11 + 6.9/Re)))**2;
    }

    dP = (f * (L/(d_p/2))*rho*v**2)+(rho*9.81*dh);

    // graph
    yvals = [(P_in)/100000];
    minvals = [P_req/100000];
    xvals = [0];
    nsteps = 10

    for (let i = 1; i <= nsteps; i++){
        xvals.push(L/nsteps * i);
        yvals.push((P_in-(dP/nsteps * i))/100000);
        minvals.push(P_req/100000);
    }    

    if (chartShown==1){
        myChart.destroy();
    }

    myChart = new Chart(document.getElementById('myChart'), {
        type: 'line',
        data: {
            labels: xvals,
            datasets: [
            {
                label: 'Pressure (Bar)',
                data: yvals,
                borderWidth: 2,
                pointStyle: false,
                borderColor: '#36A2EB',
            },
            {
                label: 'Minimum Required Pressure (Bar)',
                data: minvals,
                borderWidth: 2,
                pointStyle: false,
                borderColor: '#FFCCCB',
            },
            ]
        },
        options: {
            scales: {
                x: {
                title: { display: true, text: 'Length of Pipe (m)' }
                },
                y: {
                title: { display: true, text: 'Pressure (bar)'}
                }
            },   
            plugins: {
                title: {
                    display: true,
                    text: 'Frictional Pressure Drop ('+regime+')'
                }
            }
        }
    });

    chartShown = 1;

    // outputs

    document.getElementById('reynolds').innerHTML = Re.toFixed(0);

    document.getElementById('flow-regime').innerHTML = regime;

    document.getElementById('f-output').innerHTML = (f).toFixed(6)+'';
    
    document.getElementById('f-dm').innerHTML = (f*4).toFixed(6)+'';

    document.getElementById('f-transmission').innerHTML = (1/Math.sqrt(f)).toFixed(6)+'';

    document.getElementById('pdrop-output').innerHTML = ((dP/L)/100000).toFixed(5)+' bar';

    document.getElementById('totalp-output').innerHTML = (dP/100000).toFixed(5)+' bar';

    document.getElementById('p_out-output').innerHTML = ((P_in-dP)/100000).toFixed(3)+' bar';
}

function reload() {
    window.location.reload()
}

function printpdf() {
    window.print();
}
