Array.prototype.move = function (from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
};

var swapArrayElements = function(arr, indexA, indexB, property) {
  var tempPrintOrder = arr[indexA].printOrder;
  var temp = arr[indexA];
  arr[indexA].printOrder = arr[indexB].printOrder;
  arr[indexB].printOrder = tempPrintOrder;
  arr[indexA] = arr[indexB];
  arr[indexB] = temp;
};

Array.prototype.swap = function(indexA, indexB) {
   swapArrayElements(this, indexA, indexB);
};