function savetoIndexDb(transactions) {
  //open index connection
  const request = indexedDB.open("budget", 1);

  // Create schema
  request.onupgradeneeded = (event) => {
    const db = event.target.result;

    // Create object store and keypath
    const budgetStore = db.createObjectStore("budgetStore", {
      keyPath: "budgetId",
      autoIncrement: true,
    });
    // allow name to be indexed.
    budgetStore.createIndex("name", "name");
  };

  // Opens a transaction, accesses the budget objectStore.
  request.onsuccess = () => {
    const db = request.result;
    const transaction = db.transaction(["budgetStore"], "readwrite");
    const budgetStore = transaction.objectStore("budgetStore");

    //add each transaction to budgetStore indexxeddb
    transactions.map((transaction) => {
      budgetStore.add({
        _id: transaction._id,
        name: transaction.name,
        value: transaction.value,
        date: transaction.date,
        __v: transaction.__v,
      });
    });
  };
};
