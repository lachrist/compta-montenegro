
const shares = {
  Mohamed: 45 + 180,
  Malika: 195 + 90,
  Silvina: 195,
  Laurent: 195,
  Anna: 100
};

const names = Object.keys(shares);

const align = (s, l) => {
  while (s.length < l)
    s = " "+s;
  return s;
}

const underline = (string) => string + "\n" + "=".repeat(string.length);

const printers = {
  number: (number) => {
    var sign = number < 0 ? "-" : "";
    number = Math.abs(number);
    if (number < 10)
      return sign+"0.0"+number;
    if (number < 100)
      return sign+"0."+number;
    const string = ""+number;
    return sign+string.substring(0, string.length-2)+"."+string.substring(string.length-2);
  },
  transfer: (transfer) => align(printers.number(transfer.amount), 8)+" ("+transfer.date+" "+transfer.origin+" "+(transfer.comment||"")+")"
};

const format = (transfer) => ({
  date: transfer[0],
  origin: transfer[1],
  comment: transfer[2],
  amount: parseInt(transfer[3].replace(".", ""))
});

// TODO add compteur de passage
// ["2017-05-19", "malika", 1075.50 * shares["malika"] / (shares["malika"] + shares["mohamed"])],
// ["2017-05-19", "mohamed", 1075.50 * shares["mohamed"] / (shares["malika"] + shares["mohamed"])],
const transfers1 = [
  ["2017-04-10", "Belfius",     "frais-compte",  "   -2.94"],
  ["2017-05-18", "Silvina",     null,            "  411.25"],
  ["2017-05-19", "Malika",      null,            " 1075.50"],
  ["2017-01-01", "Ethias",      "assurance",     " -803.52"],
  ["2017-05-22", "Laurent",     null,            "  157.00"],
  ["2017-05-22", "Laurent",     null,            "  233.00"],
  ["2017-05-22", "Laurent",     null,            "   20.00"],
  ["2017-05-30", "Anna",        null,            "  209.71"],
  ["2017-06-19", "Laurent",     null,            " 1250.87"],
  ["2017-06-20", "Laurent",     null,            "  300.00"],
  ["2017-06-22", "City-Facade", "corniche",      "-2389.24"],
  ["2017-06-22", "Malika",      null,            " 1797.16"],
  ["2017-07-03", "Anna",        null,            "  851.73"],
  ["2018-07-10", "Belfius",     "frais-compte",  "   -5.89"],
  ["2018-07-10", "Belfius",     "timbre",        "   -0.15"],
  ["2018-07-10", "Belfius",     "interet",       "   -0.06"],
  ["2017-07-19", "Laurent",     null,            "   -6.84"],
  ["2018-07-19", "City-Facade", "corniche",      "  867.08"],
  ["2018-07-20", "City-Facade", "corniche",      "-2663.78"],
  ["2017-07-24", "Laurent",     null,            "    6.84"],
  ["2017-09-19", "Anna",        null,            " -209.71"],
  ["2017-12-13", "Laurent",     null,            "  570.00"],
  ["2017-12-14", "City-Facade", "corniche",      " -814.08"],
  ["2018-01-09", "Belfius",     "frais-compte",  "   -5.89"],
  ["2018-01-04", "Ethias",      "assurance",     " -825.89"],
  ["2018-01-28", "Laurent",     null,            "  510.00"]
].map(format);

((() => {
  console.log(underline("\na) Bank transfers:"));
  const total = transfers1.reduce((sum, transfer) => {
    console.log(printers.transfer(transfer));
    return sum + transfer.amount;
  }, 0);
  console.log(Array(8+1).join("-"));
  console.log(align(printers.number(total), 8));
}) ());

const transfers2 = [
  ["2017-06-20", "Silvina", "liquide",    " 300.00"],
  ["2017-06-20", "Laurent", "liquide",    "-300.00"],
  ["2017-12-05", "Laurent", "debouchage", " 252.80"],
  ["2017-12-05", "Mohamed", "debouchage", " 150.00"],
  ["2017-12-13", "Silvina", "liquide",    " 570.00"],
  ["2017-12-13", "Laurent", "liquide",    "-570.00"],
  ["2018-01-05", "Laurent", "compteur",   " 127.30"]
].map(format);

console.log(underline("\nb) Other transfers:"));
transfers2.forEach((transfer) => console.log(printers.transfer(transfer)));

const transfers = transfers1.concat(transfers2);

((() => {
  const total = transfers.filter((transfer) => !names.includes(transfer.origin)).reduce((sum, transfer) => sum - transfer.amount, 0);
  console.log(underline("\nc) Balance ("+printers.number(total)+")"));
  names.forEach((name) => {
    var target = Math.ceil(total * shares[name] / 1000);
    console.log("\n"+name+" ("+printers.number(target)+")");
    var balance = transfers.filter((transfer) => transfer.origin === name).reduce((sum, transfer) => {
      console.log(align(printers.number(transfer.amount), 8)+" ("+transfer.date+")");
      return sum + transfer.amount;
    }, 0);
    console.log(Array(8+1).join("-"));
    console.log(align(printers.number(balance), 8)+" (remain: "+printers.number(target - balance)+")");
  });
}) ());
