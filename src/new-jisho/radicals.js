var radicalEls = document.querySelectorAll('[data-radical]');

for(var i = 0; i < radicalEls.length; i++) {
	var radicalEl = radicalEls[i];
	var radicalId = radicalEl.getAttribute('data-radical');
	var radicalData = RadicalTable[radicalId];
	if(radicalData) {
		radicalEl.setAttribute('title', 'Name: ' + radicalData.readings[0]);
	} else {
		radicalEl.setAttribute('title', 'Name: ?');
	}
}

var radicalAreaEl = document.getElementById('radical_area');

var radicalFilterForm = document.createElement('form');
radicalFilterForm.innerHTML = '<label>' +
	'<span id="radical-filter-label">Filter radicals:</span> ' +
	'<input id="radical-filter" type="text">' +
'</label>';

var resetRadicalsEl = document.querySelector('#radical_area > .reset_radicals');
radicalAreaEl.insertBefore(radicalFilterForm, resetRadicalsEl);

radicalFilterForm.addEventListener('submit', function(e) {
	if(firstRelevantRadical !== null) {
		var clickEvent = new MouseEvent('click', {
			'view': window,
			'bubbles': true,
			'cancelable': true
		});
		firstRelevantRadical.dispatchEvent(clickEvent);
		radicalFilterInputEl.value = "";
		ResetRadicalFilter();
	}
	
	e.preventDefault();
	return false;
});


var radicalFilterInputEl = document.getElementById('radical-filter');
radicalFilterInputEl.addEventListener('input', function() {
	if(radicalFilterInputEl.value === '') {
		ResetRadicalFilter();
	} else {
		ApplyRadicalFilter(function(radicalId) {
			var radicalData = RadicalTable[radicalId];
			if(radicalData) {
				for(var i = 0; i < radicalData.readings.length; i++) {
					var reading = radicalData.readings[i];
					if(reading.startsWith(radicalFilterInputEl.value)) {
						return true;
					}
				}
			}
			return false;
		});
	}
});

function ApplyRadicalFilter(filterCb) {
	var radicalTableEl = document.querySelector('.radical_table');
	
	var numberEl = null;
	var numberGroupCount = 0;
	
	firstRelevantRadical = null;
	
	for(var i = 0; i < radicalTableEl.children.length; i++) {
		var el = radicalTableEl.children[i];
		if(el.className.indexOf('number') !== -1) {
			if(numberEl !== null) {
				if(numberGroupCount === 0) {
					numberEl.style.display = 'none';
				} else {
					numberEl.style.display = 'block';
				}
			}
			
			numberEl = el;
			numberGroupCount = 0;
		} else {
			var radicalId = el.getAttribute('data-radical');
			var showRadical = filterCb(radicalId);
			
			if(showRadical) {
				if(firstRelevantRadical === null) {
					firstRelevantRadical = el;
				}
				el.style.display = 'block';
				numberGroupCount += 1;
			} else {
				el.style.display = 'none';
			}
		}
	}
	
	if(numberEl !== null) {
			if(numberGroupCount === 0) {
				numberEl.style.display = 'none';
			} else {
				numberEl.style.display = 'block';
			}
		}
}

function ResetRadicalFilter() {
	ApplyRadicalFilter(function(radicalId) {
		return true;
	});
}