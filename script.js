let currentWeek = 4;


function addRow() {
	var table = document.getElementById("weekTable");
	var newRow = table.insertRow(-1);
	var newWeek = newRow.insertCell(0);
	newWeek.innerHTML = currentWeek;
	newWeek.setAttribute("contenteditable", "false");
	var newCatch = newRow.insertCell(1);
	newCatch.innerHTML = "0";
	currentWeek ++;
}

function deleteRow() {
	var table = document.getElementById("weekTable");
	if (table.rows.length > 1) {
		currentWeek --;
	table.deleteRow(-1);
	}
}

function getTableContents() {
	var tab = document.getElementById("weekTable");
	var week = new Array(tab.rows.length - 1);
	var count = new Array(tab.rows.length - 1);
	for(var i=1; i<tab.rows.length; i++) {
		week[i-1] = Number(tab.rows[i].cells[0].innerHTML);
		count[i-1] = Number(tab.rows[i].cells[1].innerHTML);
	}
	return {week, count};

}

function cumsum(values, valueof) {
  var sum = 0, index = 0;
  // return Float64Array.from(values, valueof === undefined
  return Array.from(values, valueof === undefined
    ? v => (sum += +v || 0)
    : v => (sum += +valueof(v, index++, values) || 0));
}

function arr_sqr(arr) {
	return arr.map((a) => Math.pow(a,2))
}
	
function arr_sum(arr) {
	return arr.reduce((a,b) => a + b)
}

function arr_sum2(arr1, arr2) {
	return arr1.map(function (num, idx) {
		return num + arr2[idx];
		})
}

function loss(x, Na) {
	var t = [...Array(Na.length).keys()]
	var a = x[0];
	var N0 = x[1];
	return arr_sum(arr_sqr(arr_sum2(Na, (t.map((y) => -N0*(1-Math.exp(-a*y)))))))
}

function get_params(Na) {
	// Na is the accumulated catch
	l = (x) => loss(x, Na);
	var solution = fmin.nelderMead(l, [1, 2*Math.max(...Na)]);
	return solution.x; // a, N0 = get_params(Na)
}

function T_ext(q, N, a) {
	// a is the chance that a silverfish is caught during per week of its life
	// N is the number of silverfish at present
	// q is the fractile of the distribution for total time to extermination of the N individuals
	return Math.log(1.-Math.pow(q, (1./N)))/Math.log(1.-a);
}



function plotTimeHistory() {
	document.getElementById("resultat").style.visibility = "visible";
	plotwin = document.getElementById('plot');
	let {week, count} = getTableContents();
	// const cumsum = count.map(d=>y+=d);
	var Na = cumsum(count);
	Na.unshift(0);
	let x = get_params(Na)
	let a = x[0]
	let N0 = x[1]
	let t = [...Array(Na.length+1).keys()]
	let Na_fit = t.map((y) => N0*(1-Math.exp(-a*y)))
	Na_fit.shift();
	t.shift();
	Na.shift();
	
	var user_input = {x: week, y: Na, type: 'scatter', name: 'Input'};
	var fit = {x: week, y: Na_fit, type: 'scatter', name: 'Tilpasning'};
	var plot_data = [user_input, fit];
	var layout = {width: 500, height:300, xaxis:{title:{text: 'Uke'}}, yaxis:{title:{text: 'Akkumulert fangst'}}, margin: {l:5, r:5, b:100, t:20, pad:20}};
	
	
	Plotly.newPlot(plotwin, plot_data, layout);
	
	// Print result
	var N0_field = document.getElementById("N0_felt");
	N0_field.innerHTML = String(Math.round(N0));
	var halflife_field = document.getElementById("halveringstid_felt");
	halflife_field.innerHTML = String((-7*Math.log(0.5)/a).toFixed(1)) + ' dager'
	var extermination_field = document.getElementById("utrydningstid_felt");
	var extermination_field2 = document.getElementById("utrydningstid2_felt");
	var extermination_field3 = document.getElementById("utrydningstid3_felt");
	var extermination_field4 = document.getElementById("utrydningstid4_felt");
	var N = N0 - Na[Na.length-1]
	extermination_field.innerHTML = String((T_ext(0.5, N, a)).toFixed(1)) + ' uker'
	extermination_field2.innerHTML = String((T_ext(0.95, N, a)).toFixed(1)) + ' uker'
	extermination_field3.innerHTML = String((T_ext(0.99, N, a)).toFixed(1)) + ' uker'
	extermination_field4.innerHTML = String((T_ext(0.999, N, a)).toFixed(1)) + ' uker'
	
	
}

