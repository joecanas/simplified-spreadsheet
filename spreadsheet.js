/*
    Hacker Noon Coding Test
    Joe Canas (joecanas1@gmail.com)
    10/14/18
*/

'use strict';

// Initialize spreadsheet after DOM loads
document.addEventListener('DOMContentLoaded', initSpreadsheet);

// Spreadsheet app container ID
const app = document.getElementById('app');

// Spreadsheet table ID
const spreadsheet = 'spreadsheet';

// Default grid dimensions
const initialRows = 5; // entry rows
const initialColumns = 5;

// Set default content for entry and tally cells
const entryCell = '<div class="entry" contenteditable="true"></div>';

const tallyCell = `<div class='toggle sum' data-next='avg'><div class='label'>SUM</div> <div class='result'>0</div></div>
<div class='toggle avg' data-next='min'><div class='label'>AVG</div> <div class='result'>0</div></div>
<div class='toggle min' data-next='max'><div class='label'>MIN</div> <div class='result'>0</div></div>
<div class='toggle max' data-next='sum'><div class='label'>MAX</div> <div class='result'>0</div></div>`;

// SUM, AVG, MIN, MAX array functions
const arrSum = arr => arr.reduce((a,b) => a + b, 0).toLocaleString(); 

const arrAvg = arr => {
    if (arr.length === 0) {
        return 0;
    } else {
        return (arr.reduce((a,b) => a + b, 0) / arr.length).toLocaleString(
            undefined,
            { minimumFractionDigits: 1, 
              maximumFractionDigits: 1 }
        );
    }
}

const arrMin = arr => {
    if (arr.length === 0) {
        return 0;
    } else {
        return Math.min(...arr).toLocaleString();
    }
}

const arrMax = arr => {
    if (arr.length === 0) {
        return 0;
    } else {
        return Math.max(...arr).toLocaleString();
    }
}

// Table reference variable, populated in initSpreadsheet()
let tableRef;

function initSpreadsheet() {
    // Create starter table with one entry row plus tally row
    const table = document.createElement('table');
    table.setAttribute('id', spreadsheet);
    table.insertRow(0).insertCell(0).innerHTML = entryCell;
    table.insertRow(1).insertCell(0).innerHTML = tallyCell;
    table.rows[1].setAttribute('id', 'tally');

    // Add event listener to entry cell DIV
    addCellSentience(table.rows[0].cells[0].firstChild, 0);

    // Add toggling functionality to tally cell DIV
    addTallyTogglers(table.rows[1].cells[0]);

    // Insert starter table into container DIV
    app.appendChild(table);

    // Store table reference for use by other functions
    tableRef = document.getElementById(spreadsheet);

    // Expand starter table to default grid dimensions
    for (let i = 1; i < initialRows; i++) {
        addRow(spreadsheet);
    }

    for (let i = 1; i < initialColumns; i++) {
        addColumn(spreadsheet);
    }

    // Display spreadsheet content area to JavaScript-enabled browsers
    document.getElementById('content').style.display = 'block';
}

function addRow() {
    const totalRows = tableRef.rows.length;
    const totalColumns = tableRef.rows[0].cells.length;

    // Insert a row at the end, before the 'tally' row
    const newRow = tableRef.insertRow(totalRows - 1);

    let newCell;

    // Insert editable column cells in the new row
    for (let column = 0; column < totalColumns; column++) {
        newCell = newRow.insertCell(column);
        newCell.innerHTML = entryCell;
        addCellSentience(newCell.firstChild, column);
    }
}

function addColumn() {
    const totalRows = tableRef.rows.length;
    const totalColumns = tableRef.rows[0].cells.length;

    // Add entry cell at the end of each row except last row
    for (let i = 0; i < totalRows - 1; i++) {
        tableRef.rows[i].insertCell(totalColumns).innerHTML = entryCell;
        addCellSentience(tableRef.rows[i].cells[totalColumns].firstChild, totalColumns);
    }

    // add tally cell as the last row
    tableRef.rows[totalRows - 1].insertCell(totalColumns).innerHTML = tallyCell;

    // Add toggling functionality to tally cell DIV
    addTallyTogglers(tableRef.rows[totalRows - 1].cells[totalColumns]);
}

function resetTable() {
    app.removeChild(tableRef);
    initSpreadsheet();
}

function addCellSentience(entryCellDiv, column) {
    // Add event listener to an entry cell DIV to update its column tally values 
    entryCellDiv.onkeyup = function() {
        let cellValue;
        let columnValues = [];

        // Get all entry values in the current column
        for (let row = 0; row < tableRef.rows.length - 1; row++) {
            cellValue = parseFloat(tableRef.rows[row].cells[column].firstChild.innerHTML);

            // Only push numbers to the array
            if (!isNaN(cellValue)) {
                columnValues.push(cellValue);
            }
        }

        // Update SUM, AVG, MIN, MAX tally fields
        tableRef.querySelector(`#tally td:nth-child(${column + 1}) .sum .result`).innerHTML = arrSum(columnValues);
        tableRef.querySelector(`#tally td:nth-child(${column + 1}) .avg .result`).innerHTML = arrAvg(columnValues);
        tableRef.querySelector(`#tally td:nth-child(${column + 1}) .min .result`).innerHTML = arrMin(columnValues);
        tableRef.querySelector(`#tally td:nth-child(${column + 1}) .max .result`).innerHTML = arrMax(columnValues);
    }
}

function addTallyTogglers(tallyCell) {
    tallyCell.addEventListener('click', function (event) {
        const toggles = tallyCell.querySelectorAll('.toggle');

        for (let toggle of toggles) {
            if (window.getComputedStyle(toggle).display === 'block') {

                // Get the next referenced toggle class name
                const nextToggle = '.' + toggle.dataset.next;

                // Hide the currently displayed toggle
                toggle.style.display = 'none';

                // Show the next referenced toggle
                tallyCell.querySelector(nextToggle).style.display = 'block';
                break;
            }
        }
    });
}
