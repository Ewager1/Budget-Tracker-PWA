/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ (() => {

eval("//get mongoDB Post request to work\n// get dist folder to work\n//add manifest webpack plugin\nvar transactions = [];\nvar myChart; //creates objectStore for indexxedDb if it does not exist\n\nfunction createRecordIfNoRecord() {\n  var request = indexedDB.open(\"budget\", 1); // Create schema\n\n  request.onupgradeneeded = function (event) {\n    var db = event.target.result; // Create object store and keypath\n\n    var budgetStore = db.createObjectStore(\"budgetStore\", {\n      keyPath: \"budgetId\",\n      autoIncrement: true\n    }); // allow name to be indexed.\n\n    budgetStore.createIndex(\"name\", \"name\");\n  };\n} //if Online, send indexxed db data to mongodb, then empty indexxedb\n\n\nwindow.addEventListener(\"online\", updateMongoDb);\nfetch(\"/api/transaction\").then(function (response) {\n  return response.json();\n}).then(function (data) {\n  // save db data on global variable\n  transactions = data;\n  populateTotal();\n  populateTable();\n  populateChart();\n  console;\n});\n\nfunction populateTotal() {\n  // reduce transaction amounts to a single total value\n  var total = transactions.reduce(function (total, t) {\n    return total + parseInt(t.value);\n  }, 0);\n  var totalEl = document.querySelector(\"#total\");\n  totalEl.textContent = total;\n}\n\nfunction populateTable() {\n  var tbody = document.querySelector(\"#tbody\");\n  tbody.innerHTML = \"\";\n  transactions.forEach(function (transaction) {\n    // create and populate a table row\n    var tr = document.createElement(\"tr\");\n    tr.innerHTML = \"\\n      <td>\".concat(transaction.name, \"</td>\\n      <td>\").concat(transaction.value, \"</td>\\n    \");\n    tbody.appendChild(tr);\n  });\n}\n\nfunction populateChart() {\n  // copy array and reverse it\n  var reversed = transactions.slice().reverse();\n  var sum = 0; // create date labels for chart\n\n  var labels = reversed.map(function (t) {\n    var date = new Date(t.date);\n    return \"\".concat(date.getMonth() + 1, \"/\").concat(date.getDate(), \"/\").concat(date.getFullYear());\n  }); // create incremental values for chart\n\n  var data = reversed.map(function (t) {\n    sum += parseInt(t.value);\n    return sum;\n  }); // remove old chart if it exists\n\n  if (myChart) {\n    myChart.destroy();\n  }\n\n  var ctx = document.getElementById(\"myChart\").getContext(\"2d\");\n  myChart = new Chart(ctx, {\n    type: \"line\",\n    data: {\n      labels: labels,\n      datasets: [{\n        label: \"Total Over Time\",\n        fill: true,\n        backgroundColor: \"#6666ff\",\n        data: data\n      }]\n    }\n  });\n}\n\nfunction sendTransaction(isAdding) {\n  var nameEl = document.querySelector(\"#t-name\");\n  var amountEl = document.querySelector(\"#t-amount\");\n  var errorEl = document.querySelector(\".form .error\"); // validate form\n\n  if (nameEl.value === \"\" || amountEl.value === \"\") {\n    errorEl.textContent = \"Missing Information\";\n    return;\n  } else {\n    errorEl.textContent = \"\";\n  } // create record\n\n\n  var transaction = {\n    name: nameEl.value,\n    value: amountEl.value,\n    date: new Date().toISOString()\n  }; // if subtracting funds, convert amount to negative number\n\n  if (!isAdding) {\n    transaction.value *= -1;\n  } // add to beginning of current array of data\n\n\n  transactions.unshift(transaction); // re-run logic to populate ui with new record\n\n  populateChart();\n  populateTable();\n  populateTotal(); // also send to server\n\n  fetch(\"/api/transaction\", {\n    method: \"POST\",\n    body: JSON.stringify(transaction),\n    headers: {\n      Accept: \"application/json, text/plain, */*\",\n      \"Content-Type\": \"application/json\"\n    }\n  }).then(function (response) {\n    return response.json();\n  }).then(function (data) {\n    if (data.errors) {\n      errorEl.textContent = \"Missing Information\";\n    } else {\n      // clear form\n      nameEl.value = \"\";\n      amountEl.value = \"\";\n    }\n  })[\"catch\"](function (err) {\n    // fetch failed, so save in indexed db\n    saveRecord(transaction); // clear form\n\n    nameEl.value = \"\";\n    amountEl.value = \"\";\n  });\n}\n\ndocument.querySelector(\"#add-btn\").onclick = function () {\n  sendTransaction(true);\n};\n\ndocument.querySelector(\"#sub-btn\").onclick = function () {\n  sendTransaction(false);\n};\n\nfunction saveRecord(budgetTransaction) {\n  var request = indexedDB.open(\"budget\", 1); // Create schema\n\n  request.onupgradeneeded = function (event) {\n    var db = event.target.result; // Create object store and keypath\n\n    var budgetStore = db.createObjectStore(\"budgetStore\", {\n      keyPath: \"budgetId\",\n      autoIncrement: true\n    }); // allow name to be indexed.\n\n    budgetStore.createIndex(\"name\", \"name\");\n  }; // Opens a transaction, accesses the budget objectStore.\n\n\n  request.onsuccess = function () {\n    var db = request.result;\n    var transaction = db.transaction([\"budgetStore\"], \"readwrite\");\n    var budgetStore = transaction.objectStore(\"budgetStore\"); //add each transaction to budgetStore indexxeddb\n\n    budgetStore.add({\n      name: budgetTransaction.name,\n      value: budgetTransaction.value,\n      date: budgetTransaction.date\n    });\n  };\n} //\n\n\nfunction updateMongoDb() {\n  console.log('I work'); //open index connection\n\n  var request = indexedDB.open(\"budget\", 1); // Opens a transaction, accesses the budget objectStore.\n\n  request.onsuccess = function () {\n    var db = request.result;\n    var transaction = db.transaction([\"budgetStore\"], \"readwrite\");\n    var budgetStore = transaction.objectStore(\"budgetStore\");\n    var grabAll = budgetStore.getAll();\n\n    grabAll.onsuccess = function (event) {\n      var answer = grabAll.result;\n      budgetStore.clear();\n      fetch(\"/api/transaction/bulk\", {\n        method: \"POST\",\n        body: JSON.stringify(answer),\n        headers: {\n          Accept: \"application/json, text/plain, */*\",\n          \"Content-Type\": \"application/json\"\n        }\n      });\n    };\n  };\n}\n\n;\n\n//# sourceURL=webpack://src/./index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./index.js"]();
/******/ 	
/******/ })()
;