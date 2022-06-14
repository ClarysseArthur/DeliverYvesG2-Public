function init() {
    console.log("Dom geladen")
    var current_page = document.querySelector('.title').innerHTML;
    highlightCurrentPage(current_page);
    fetch_data()
}

function highlightCurrentPage(current_page) {
    if (current_page == "Bottle detector") {
        var nav_items = document.getElementsByClassName('navigator_item');
        var current = nav_items[0];
        current.style = 'color: var(--abzg)';
        nav_items[1].classList.add('current_page');
    }
    if (current_page == "Bottle crate overview") {
        var nav_items = document.getElementsByClassName('navigator_item');
        var current = nav_items[1];
        current.style = 'color: var(--abzg)';
        nav_items[0].classList.add('current_page');
    }
}

function fetch_data() {
    var myHeaders = new Headers();
    myHeaders.append("authorization", "**IOT HUB SAS TOKEN**");
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "methodName": "count_bottles",
        "responseTimeoutInSeconds": 300,
        "payload": {}
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://dyHub.azure-devices.net/twins/rpi01/methods?api-version=2021-04-12", requestOptions)
        .then(response => response.text())
        .then(result => processData(result))
        .catch(error => console.log('error', error));
}

function processData(data) {
    var loading_content = document.querySelector('.wrapper')
    var table_content = document.querySelector('.crate_table_container')
    var footer = document.querySelector('.footer')
    document.getElementsByTagName("html")[0].style = 'background-image: url(/SVG/Background.svg);'
    loading_content.style = 'display: none;'
    table_content.style = 'display: flex;'
    footer.style = 'position: relative;'
    data = JSON.parse(data)
    data = data.payload
    var crateID = 88
    for (let obj of data.Response)
    {
        obj = JSON.parse(obj)
        res = getBottleData(obj,crateID)
        console.log(res)
        if (res.customer){
            dummydata.push(getBottleData(obj,crateID))
        }
        crateID += 1
    }
    console.log(dummydata)
    dummydata.sort( compareCustomerDown );
    insertDummydata(dummydata)
}

function getBottleData(data,crateID)
{
  data = data['crates']
  var result = {}
  var keys = Object.keys(data);
  keys.forEach(function(key){
    var crate = data[key]
    var keys = Object.keys(crate)
    var full_bottles = 0
    var empty_bottles = 0
    keys.forEach(function(key){
      var bottle = crate[key][6]
      if (bottle == "empty"){
        empty_bottles += 1
      }
      else{
        full_bottles += 1
      }
    })
    crateID += 1
    result = {'customer':"Dyg2",'crateID':crateID,'full_bottles':full_bottles,'empty_bottles':empty_bottles}
    
});
  return result
}

function filterData(element)
{

    if(element.innerHTML == `<div class="table_header">Customer</div>` || element.innerHTML == `<div class="table_header">Customer<svg class="arrow_down" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 15.4 6 9.4 7.4 8 12 12.6 16.6 8 18 9.4Z"></path></svg></div>`)
    {
        d3.selectAll("svg").remove()
        dummydata.sort( compareCustomerUp );
        insertDummydata(dummydata);
        element.innerHTML = `<div class="table_header">Customer<svg class="arrow_up" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 15.4 6 9.4 7.4 8 12 12.6 16.6 8 18 9.4Z"></path></svg></div>`
        return;
    }
    if(element.innerHTML == `<div class="table_header">Customer<svg class="arrow_up" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 15.4 6 9.4 7.4 8 12 12.6 16.6 8 18 9.4Z"></path></svg></div>`)
    {
        dummydata.sort( compareCustomerDown );
        insertDummydata(dummydata);
        element.innerHTML = `<div class="table_header">Customer<svg class="arrow_down" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 15.4 6 9.4 7.4 8 12 12.6 16.6 8 18 9.4Z"/></svg></div>`
        return;
    }

    if(element.innerHTML == `<div class="table_header">Crate ID</div>` || element.innerHTML == `<div class="table_header">Crate ID<svg class="arrow_up" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 15.4 6 9.4 7.4 8 12 12.6 16.6 8 18 9.4Z"></path></svg></div>`)
    {
        d3.selectAll("svg").remove()
        dummydata.sort( compareCrateIDUp );
        insertDummydata(dummydata);
        element.innerHTML = `<div class="table_header">Crate ID<svg class="arrow_down" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 15.4 6 9.4 7.4 8 12 12.6 16.6 8 18 9.4Z"></path></svg></div>`
        return;
    }
    if(element.innerHTML == `<div class="table_header">Crate ID<svg class="arrow_down" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 15.4 6 9.4 7.4 8 12 12.6 16.6 8 18 9.4Z"></path></svg></div>`)
    {
        dummydata.sort( compareCrateIDDown );
        insertDummydata(dummydata);
        element.innerHTML = `<div class="table_header">Crate ID<svg class="arrow_up" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 15.4 6 9.4 7.4 8 12 12.6 16.6 8 18 9.4Z"/></svg></div>`
        return;
    }

    if(element.innerHTML == `<div class="table_header">Full Bottles</div>` || element.innerHTML == `<div class="table_header">Full Bottles<svg class="arrow_up" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 15.4 6 9.4 7.4 8 12 12.6 16.6 8 18 9.4Z"></path></svg></div>`)
    {
        d3.selectAll("svg").remove()
        dummydata.sort( compareFullBottlesUp );
        insertDummydata(dummydata);
        element.innerHTML = `<div class="table_header">Full Bottles<svg class="arrow_down" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 15.4 6 9.4 7.4 8 12 12.6 16.6 8 18 9.4Z"></path></svg></div>`
        return;
    }
    if(element.innerHTML == `<div class="table_header">Full Bottles<svg class="arrow_down" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 15.4 6 9.4 7.4 8 12 12.6 16.6 8 18 9.4Z"></path></svg></div>`)
    {
        dummydata.sort( compareFullBottlesDown );
        insertDummydata(dummydata);
        element.innerHTML = `<div class="table_header">Full Bottles<svg class="arrow_up" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 15.4 6 9.4 7.4 8 12 12.6 16.6 8 18 9.4Z"/></svg></div>`
        return;
    }

    if(element.innerHTML == `<div class="table_header">Empty Bottles</div>` || element.innerHTML == `<div class="table_header">Empty Bottles<svg class="arrow_up" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 15.4 6 9.4 7.4 8 12 12.6 16.6 8 18 9.4Z"></path></svg></div>`)
    {
        d3.selectAll("svg").remove()
        dummydata.sort( compareEmptyBottlesUp );
        insertDummydata(dummydata);
        element.innerHTML = `<div class="table_header">Empty Bottles<svg class="arrow_down" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 15.4 6 9.4 7.4 8 12 12.6 16.6 8 18 9.4Z"></path></svg></div>`
        return;
    }
    if(element.innerHTML == `<div class="table_header">Empty Bottles<svg class="arrow_down" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 15.4 6 9.4 7.4 8 12 12.6 16.6 8 18 9.4Z"></path></svg></div>`)
    {
        dummydata.sort( compareEmptyBottlesDown );
        insertDummydata(dummydata);
        element.innerHTML = `<div class="table_header">Empty Bottles<svg class="arrow_up" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 15.4 6 9.4 7.4 8 12 12.6 16.6 8 18 9.4Z"/></svg></div>`
        return;
    }
    
    if(element.innerHTML == `<div class="table_header">Total Bottles</div>` || element.innerHTML == `<div class="table_header">Total Bottles<svg class="arrow_up" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 15.4 6 9.4 7.4 8 12 12.6 16.6 8 18 9.4Z"></path></svg></div>`)
    {
        d3.selectAll("svg").remove()
        dummydata.sort( compareTotalBottlesUp );
        insertDummydata(dummydata);
        element.innerHTML = `<div class="table_header">Total Bottles<svg class="arrow_down" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 15.4 6 9.4 7.4 8 12 12.6 16.6 8 18 9.4Z"></path></svg></div>`
        return;
    }
    if(element.innerHTML == `<div class="table_header">Total Bottles<svg class="arrow_down" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 15.4 6 9.4 7.4 8 12 12.6 16.6 8 18 9.4Z"></path></svg></div>`)
    {
        dummydata.sort( compareTotalBottlesDown );
        insertDummydata(dummydata);
        element.innerHTML = `<div class="table_header">Total Bottles<svg class="arrow_up" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 15.4 6 9.4 7.4 8 12 12.6 16.6 8 18 9.4Z"/></svg></div>`
        return;
    }

    if(element.innerHTML == `<div class="table_header">Status</div>` || element.innerHTML == `<div class="table_header">Status<svg class="arrow_up" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 15.4 6 9.4 7.4 8 12 12.6 16.6 8 18 9.4Z"></path></svg></div>`)
    {
        d3.selectAll("svg").remove()
        dummydata.sort( compareRatioUp );
        insertDummydata(dummydata);
        element.innerHTML = `<div class="table_header">Status<svg class="arrow_down" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 15.4 6 9.4 7.4 8 12 12.6 16.6 8 18 9.4Z"></path></svg></div>`
        return;
    }
    if(element.innerHTML == `<div class="table_header">Status<svg class="arrow_down" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 15.4 6 9.4 7.4 8 12 12.6 16.6 8 18 9.4Z"></path></svg></div>`)
    {
        dummydata.sort( compareRatioDown );
        insertDummydata(dummydata);
        element.innerHTML = `<div class="table_header">Status<svg class="arrow_up" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 15.4 6 9.4 7.4 8 12 12.6 16.6 8 18 9.4Z"/></svg></div>`
        return;
    }

    
}

function compareCustomerDown( a, b ) {
    if ( a.customer < b.customer ){
      return -1;
    }
    if ( a.customer > b.customer ){
      return 1;
    }
    return 0;
}

function compareCustomerUp( a, b ) {
    if ( a.customer < b.customer ){
      return 1;
    }
    if ( a.customer > b.customer ){
      return -1;
    }
    return 0;
}

function compareCrateIDDown( a, b ) {
    if ( a.crateID < b.crateID ){
      return -1;
    }
    if ( a.crateID > b.crateID ){
      return 1;
    }
    return 0;
}

function compareCrateIDUp( a, b ) {
    if ( a.crateID < b.crateID ){
      return 1;
    }
    if ( a.crateID > b.crateID ){
      return -1;
    }
    return 0;
}

function compareFullBottlesDown( a, b ) {
    if ( a.full_bottles < b.full_bottles ){
      return -1;
    }
    if ( a.full_bottles > b.full_bottles ){
      return 1;
    }
    return 0;
}

function compareFullBottlesUp( a, b ) {
    if ( a.full_bottles < b.full_bottles ){
      return 1;
    }
    if ( a.full_bottles > b.full_bottles ){
      return -1;
    }
    return 0;
}
function compareEmptyBottlesDown( a, b ) {
    if ( a.empty_bottles < b.empty_bottles ){
      return -1;
    }
    if ( a.empty_bottles > b.empty_bottles ){
      return 1;
    }
    return 0;
}

function compareEmptyBottlesUp( a, b ) {
    if ( a.empty_bottles < b.empty_bottles ){
      return 1;
    }
    if ( a.empty_bottles > b.empty_bottles ){
      return -1;
    }
    return 0;
}
function compareTotalBottlesDown( a, b ) {
    if ( a.total_bottles < b.total_bottles ){
      return -1;
    }
    if ( a.total_bottles > b.total_bottles ){
      return 1;
    }
    return 0;
}

function compareTotalBottlesUp( a, b ) {
    if ( a.total_bottles < b.total_bottles ){
      return 1;
    }
    if ( a.total_bottles > b.total_bottles ){
      return -1;
    }
    return 0;
}

function compareRatioDown( a, b ) {
    if ( a.ratio < b.ratio ){
      return -1;
    }
    if ( a.ratio > b.ratio ){
      return 1;
    }
    return 0;
}

function compareRatioUp( a, b ) {
    if ( a.ratio < b.ratio ){
      return 1;
    }
    if ( a.ratio > b.ratio ){
      return -1;
    }
    return 0;
}
  
function insertDummydata(dummydata) {
    var crate_table = document.querySelector('.js-crate_table')
    var HTMLcrate_table = ``;
    for (record of dummydata) {
        // console.log(record)
        HTMLcrate_table += `<tr>
        <td data-label="Customer">${record.customer}</td>
        <td data-label="CrateID">${record.crateID}</td>
        <td data-label="Full_Bottles">${record.full_bottles}</td>
        <td data-label="Empty_Bottles">${record.empty_bottles}</td>
        <td data-label="Total_Bottles">${record.full_bottles + record.empty_bottles}</td>
        <td data-label="Status"><div class="crate_table_status ${CalculateStatus(record.full_bottles, record.empty_bottles)}"></div></td>
    </tr>`
    // ratio toevoegen aan de dictionary
    record.ratio = (record.full_bottles/(record.full_bottles+record.empty_bottles))*100
    record.total_bottles = record.full_bottles + record.empty_bottles
    }
    crate_table.innerHTML = HTMLcrate_table
}

function CalculateStatus(full, empty) {
    var total = full + empty
    var ratio = (full / total) * 100
    
    // console.log(ratio + "%")
    if (ratio >= 60) {
        return "no_refill_needed"
    }
    if (ratio < 60 && ratio >= 25) {
        return "consider_refill"
    }
    else {
        return "refill_needed"
    }
}


document.addEventListener('DOMContentLoaded', init)

var dummydata = [
    {
        "customer": "Chadwick Randall",
        "crateID": 1,
        "full_bottles": 2,
        "empty_bottles": 0
    },
    {
        "customer": "Kieran Cannon",
        "crateID": 2,
        "full_bottles": 11,
        "empty_bottles": 7
    },
    {
        "customer": "Candace Short",
        "crateID": 3,
        "full_bottles": 12,
        "empty_bottles": 1
    },
    {
        "customer": "Baker Meyer",
        "crateID": 4,
        "full_bottles": 21,
        "empty_bottles": 22
    },
    {
        "customer": "Ryder Carney",
        "crateID": 5,
        "full_bottles": 19,
        "empty_bottles": 8
    },
    {
        "customer": "Lacy Juarez",
        "crateID": 6,
        "full_bottles": 11,
        "empty_bottles": 0
    },
    {
        "customer": "Carter Johnson",
        "crateID": 7,
        "full_bottles": 15,
        "empty_bottles": 6
    },
    {
        "customer": "Scott West",
        "crateID": 8,
        "full_bottles": 2,
        "empty_bottles": 24
    },
    {
        "customer": "Moses Marsh",
        "crateID": 9,
        "full_bottles": 10,
        "empty_bottles": 6
    },
    {
        "customer": "Lane Rocha",
        "crateID": 10,
        "full_bottles": 4,
        "empty_bottles": 20
    },
    {
        "customer": "Valentine Evans",
        "crateID": 11,
        "full_bottles": 2,
        "empty_bottles": 5
    },
    {
        "customer": "Lunea Stone",
        "crateID": 12,
        "full_bottles": 14,
        "empty_bottles": 12
    },
    {
        "customer": "Nyssa Warner",
        "crateID": 13,
        "full_bottles": 7,
        "empty_bottles": 1
    },
    {
        "customer": "Gareth Moses",
        "crateID": 14,
        "full_bottles": 12,
        "empty_bottles": 8
    },
    {
        "customer": "Daniel Osborn",
        "crateID": 15,
        "full_bottles": 1,
        "empty_bottles": 23
    },
    {
        "customer": "Jade Davenport",
        "crateID": 16,
        "full_bottles": 10,
        "empty_bottles": 10
    },
    {
        "customer": "Ila Harrell",
        "crateID": 17,
        "full_bottles": 0,
        "empty_bottles": 16
    },
    {
        "customer": "Mia Orr",
        "crateID": 18,
        "full_bottles": 1,
        "empty_bottles": 10
    },
    {
        "customer": "Hadassah Dalton",
        "crateID": 19,
        "full_bottles": 24,
        "empty_bottles": 15
    },
    {
        "customer": "Kylie Hyde",
        "crateID": 20,
        "full_bottles": 12,
        "empty_bottles": 10
    },
    {
        "customer": "Caryn Reeves",
        "crateID": 21,
        "full_bottles": 20,
        "empty_bottles": 5
    },
    {
        "customer": "Lacy Palmer",
        "crateID": 22,
        "full_bottles": 19,
        "empty_bottles": 17
    },
    {
        "customer": "Ulric Monroe",
        "crateID": 23,
        "full_bottles": 12,
        "empty_bottles": 0
    },
    {
        "customer": "Tad Hancock",
        "crateID": 24,
        "full_bottles": 8,
        "empty_bottles": 4
    },
    {
        "customer": "Aurelia Wilson",
        "crateID": 25,
        "full_bottles": 10,
        "empty_bottles": 1
    },
    {
        "customer": "Zeph Meyers",
        "crateID": 26,
        "full_bottles": 9,
        "empty_bottles": 14
    },
    {
        "customer": "Keiko Osborn",
        "crateID": 27,
        "full_bottles": 11,
        "empty_bottles": 16
    },
    {
        "customer": "Mariko Hoover",
        "crateID": 28,
        "full_bottles": 9,
        "empty_bottles": 8
    },
    {
        "customer": "Rahim Anderson",
        "crateID": 29,
        "full_bottles": 10,
        "empty_bottles": 7
    },
    {
        "customer": "Hyacinth Lane",
        "crateID": 30,
        "full_bottles": 9,
        "empty_bottles": 22
    },
    {
        "customer": "Iris Page",
        "crateID": 31,
        "full_bottles": 16,
        "empty_bottles": 3
    },
    {
        "customer": "Mason Jennings",
        "crateID": 32,
        "full_bottles": 7,
        "empty_bottles": 21
    },
    {
        "customer": "Pearl Barlow",
        "crateID": 33,
        "full_bottles": 7,
        "empty_bottles": 5
    },
    {
        "customer": "Tucker Delaney",
        "crateID": 34,
        "full_bottles": 4,
        "empty_bottles": 4
    },
    {
        "customer": "Jenette Shepherd",
        "crateID": 35,
        "full_bottles": 8,
        "empty_bottles": 19
    },
    {
        "customer": "Julian Baldwin",
        "crateID": 36,
        "full_bottles": 6,
        "empty_bottles": 11
    },
    {
        "customer": "Jonah Swanson",
        "crateID": 37,
        "full_bottles": 3,
        "empty_bottles": 10
    },
    {
        "customer": "Aristotle Morris",
        "crateID": 38,
        "full_bottles": 24,
        "empty_bottles": 15
    },
    {
        "customer": "Isaac Buchanan",
        "crateID": 39,
        "full_bottles": 22,
        "empty_bottles": 5
    },
    {
        "customer": "Pascale Shepherd",
        "crateID": 40,
        "full_bottles": 7,
        "empty_bottles": 22
    },
    {
        "customer": "Kevin White",
        "crateID": 41,
        "full_bottles": 2,
        "empty_bottles": 18
    },
    {
        "customer": "Graham Moore",
        "crateID": 42,
        "full_bottles": 23,
        "empty_bottles": 8
    },
    {
        "customer": "Flavia Harrison",
        "crateID": 43,
        "full_bottles": 7,
        "empty_bottles": 4
    },
    {
        "customer": "Callie Baird",
        "crateID": 44,
        "full_bottles": 12,
        "empty_bottles": 9
    },
    {
        "customer": "Zahir Wong",
        "crateID": 45,
        "full_bottles": 18,
        "empty_bottles": 13
    },
    {
        "customer": "Wyatt Collier",
        "crateID": 46,
        "full_bottles": 23,
        "empty_bottles": 11
    },
    {
        "customer": "Louis Ray",
        "crateID": 47,
        "full_bottles": 23,
        "empty_bottles": 9
    },
    {
        "customer": "Madeson Osborn",
        "crateID": 48,
        "full_bottles": 14,
        "empty_bottles": 14
    },
    {
        "customer": "Serena Duke",
        "crateID": 49,
        "full_bottles": 6,
        "empty_bottles": 1
    },
    {
        "customer": "Beau Rosario",
        "crateID": 50,
        "full_bottles": 5,
        "empty_bottles": 6
    },
    {
        "customer": "Rhonda Kramer",
        "crateID": 51,
        "full_bottles": 3,
        "empty_bottles": 9
    },
    {
        "customer": "Silas Gordon",
        "crateID": 52,
        "full_bottles": 9,
        "empty_bottles": 17
    },
    {
        "customer": "MacKensie Mcgowan",
        "crateID": 53,
        "full_bottles": 23,
        "empty_bottles": 10
    },
    {
        "customer": "Joseph Morgan",
        "crateID": 54,
        "full_bottles": 3,
        "empty_bottles": 2
    },
    {
        "customer": "Cara Freeman",
        "crateID": 55,
        "full_bottles": 11,
        "empty_bottles": 9
    },
    {
        "customer": "Judith Owen",
        "crateID": 56,
        "full_bottles": 18,
        "empty_bottles": 5
    },
    {
        "customer": "Carter Hancock",
        "crateID": 57,
        "full_bottles": 12,
        "empty_bottles": 11
    },
    {
        "customer": "Rose Green",
        "crateID": 58,
        "full_bottles": 14,
        "empty_bottles": 0
    },
    {
        "customer": "Tate Walker",
        "crateID": 59,
        "full_bottles": 0,
        "empty_bottles": 19
    },
    {
        "customer": "Salvador Underwood",
        "crateID": 60,
        "full_bottles": 4,
        "empty_bottles": 15
    }
]
/* filteren want dit was niet mogelijk in de online data generator */
dummydata = dummydata.filter(data => data['full_bottles'] + data['empty_bottles'] < 24);

// var data = {"status":200,"payload":{"Response": ["{\"py/object\": \"Models.Return.Return\", \"url\": \"https://stdeliveryves.blob.core.windows.net/input-data/1655122560.3879454_output.jpg\", \"crates\": [[[0.34345072507858276, 0.7222388982772827, 0.4030418395996094, 0.7906782627105713, 0.7763397097587585, 0, \"empty\"], [0.34316378831863403, 0.8058097958564758, 0.39633598923683167, 0.875668466091156, 0.7753203511238098, 0, \"empty\"], [0.40178173780441284, 0.7235931158065796, 0.4599761962890625, 0.788183331489563, 0.7654493451118469, 0, \"empty\"], [0.3430737853050232, 0.8853455781936646, 0.39607375860214233, 0.9572799801826477, 0.7578093409538269, 0, \"empty\"], [0.4582105576992035, 0.8016638159751892, 0.5145354270935059, 0.8677352666854858, 0.7499237060546875, 0, \"empty\"], [0.4025038182735443, 0.8007925748825073, 0.4541643559932709, 0.8668038845062256, 0.7496790289878845, 0, \"empty\"], [0.6334792375564575, 0.7903108596801758, 0.6863499283790588, 0.8553394675254822, 0.7458721399307251, 0, \"empty\"], [0.513073205947876, 0.7963097095489502, 0.5721633434295654, 0.8621093034744263, 0.7445312738418579, 0, \"empty\"], [0.45609012246131897, 0.7195249795913696, 0.5166282057762146, 0.7837502360343933, 0.7425137162208557, 0, \"empty\"], [0.4022587239742279, 0.8872867226600647, 0.45215266942977905, 0.9537646770477295, 0.7396490573883057, 0, \"empty\"], [0.4619309902191162, 0.8819962739944458, 0.5157843828201294, 0.9495618343353271, 0.7321506142616272, 0, \"empty\"], [0.5779822468757629, 0.8777235746383667, 0.6357821226119995, 0.9439337253570557, 0.7296658754348755, 0, \"empty\"], [0.6273378729820251, 0.7109848260879517, 0.6865675449371338, 0.7751220464706421, 0.7260454893112183, 0, \"empty\"], [0.6386986970901489, 0.873977541923523, 0.6928467750549316, 0.9413837194442749, 0.7230486273765564, 0, \"empty\"], [0.5112568736076355, 0.7150744795799255, 0.5701351165771484, 0.7756567001342773, 0.7201924324035645, 0, \"empty\"], [0.5716334581375122, 0.7133475542068481, 0.6296491026878357, 0.7738335132598877, 0.7181940078735352, 0, \"empty\"], [0.5221900939941406, 0.881439745426178, 0.5759795308113098, 0.9476315975189209, 0.713470995426178, 0, \"empty\"], [0.5736563801765442, 0.7937695980072021, 0.6316974759101868, 0.8594213128089905, 0.7115991711616516, 0, \"empty\"]]]}", "{\"py/object\": \"Models.Return.Return\", \"url\": \"https://stdeliveryves.blob.core.windows.net/input-data/1655122591.8871179_output.jpg\", \"crates\": [[[0.30055394768714905, 0.3773769736289978, 0.3959713578224182, 0.47279202938079834, 0.7531337141990662, 0, \"empty\"], [0.20963534712791443, 0.5464649796485901, 0.313502699136734, 0.6626812815666199, 0.7516043782234192, 0, \"empty\"], [0.22356517612934113, 0.46125146746635437, 0.31534916162490845, 0.5592711567878723, 0.7384001016616821, 0, \"empty\"], [0.3709656596183777, 0.37507668137550354, 0.46664515137672424, 0.4661760926246643, 0.7381886839866638, 0, \"empty\"], [0.2988632023334503, 0.45996078848838806, 0.3879692852497101, 0.552698016166687, 0.7297273278236389, 0, \"empty\"], [0.2314988076686859, 0.37629029154777527, 0.32358112931251526, 0.4709263741970062, 0.7246360778808594, 0, \"empty\"], [0.5833195447921753, 0.5322973132133484, 0.6823002099990845, 0.6268514394760132, 0.7170044183731079, 0, \"empty\"], [0.4390103816986084, 0.3781833052635193, 0.5220097899436951, 0.45571663975715637, 0.7143462896347046, 0, \"empty\"], [0.3617826998233795, 0.5485364198684692, 0.46139654517173767, 0.6460410952568054, 0.712476909160614, 0, \"empty\"], [0.2785629630088806, 0.5463602542877197, 0.38867393136024475, 0.6553524136543274, 0.7116315364837646, 0, \"empty\"], [0.5140440464019775, 0.3767089545726776, 0.5927609801292419, 0.45054253935813904, 0.6961820125579834, 0, \"empty\"], [0.3743283152580261, 0.46225807070732117, 0.4566216468811035, 0.5438511371612549, 0.686733603477478, 0, \"empty\"], [0.43952637910842896, 0.5531151294708252, 0.5273996591567993, 0.639866054058075, 0.6780989170074463, 0, \"empty\"], [0.5840515494346619, 0.4510684907436371, 0.6680053472518921, 0.5301640033721924, 0.6729378700256348, 0, \"empty\"], [0.5838642120361328, 0.37004226446151733, 0.6622757911682129, 0.4455339014530182, 0.6690953969955444, 0, \"empty\"], [0.43501076102256775, 0.4587916433811188, 0.5260881781578064, 0.5395945310592651, 0.6354004740715027, 0, \"empty\"]]]}", "{\"py/object\": \"Models.Return.Return\", \"url\": \"https://stdeliveryves.blob.core.windows.net/input-data/1655122623.396047_output.jpg\", \"crates\": []}", "{\"py/object\": \"Models.Return.Return\", \"url\": \"https://stdeliveryves.blob.core.windows.net/input-data/1655122635.4118044_output.jpg\", \"crates\": [[[0.6697338819503784, 0.8723852634429932, 0.799514651298523, 1.0, 0.6741887927055359, 1, \"full\"], [0.20460398495197296, 0.8681318163871765, 0.3337356746196747, 1.0, 0.6386542320251465, 1, \"full\"]]]}"]}}
