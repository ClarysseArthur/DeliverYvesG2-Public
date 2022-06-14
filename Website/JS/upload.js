// ************************ Drag and drop ***************** //
let dropArea, srcEncoded, content, loader, footer, mobile_upload_btn;

function preventDefaults (e) {
  console.log('PreventDefaults');
  e.preventDefault()
  e.stopPropagation()
}

function highlight(e) {
    console.log('highlight');
  dropArea.classList.add('highlight')
}

function unhighlight(e) {
    console.log('unhighlight');
  dropArea.classList.remove('highlight')
}

function handleDrop(e) {
    console.log('handledrop');
  var dt = e.dataTransfer
  var files = dt.files

  previewFile(files)
}

function previewFile(files) {
    console.log('Preview file');
    mobile_upload_btn = document.querySelector('.browse_button')
    if (mobile_upload_btn){
      mobile_upload_btn.style = 'display:none;'
    }
  var file = files[0]
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = function (event) {
    const imgElement = document.createElement("img");
    imgElement.src = event.target.result;

    imgElement.onload = function (e) {
      const canvas = document.createElement("canvas");
      const MAX_WIDTH = 800
      const scaleSize = MAX_WIDTH / e.target.width;
      canvas.width = MAX_WIDTH;
      canvas.height = e.target.height * scaleSize;

      const ctx = canvas.getContext("2d");

      ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);
      srcEncoded = ctx.canvas.toDataURL(e.target, "image/png");

    }
  }
  reader.onloadend = function(progressevent) {
    let img = document.createElement('img')
    img.src = reader.result
    var gallery = document.getElementById("gallery")
    gallery.innerHTML = `<img class="gallery_img" id="${progressevent.target.result}" style="border-radius: 5px; margin-bottom: 8px" src="${img.src}" alt="">`
    var cloud_svg = document.querySelector('.upload-svg')
    cloud_svg.style = 'display:none';
    var submit_btn = document.querySelector('.submit_btn');
    submit_btn.style = 'display:block;'
    var cancel_icon = document.querySelector('.cancel')
    cancel_icon.style = 'display: block;'
  }
}

function refresh(){
  window.location.reload()
}

function cancelFile(){
  console.log("Cancel")
  var gallery = document.getElementById("gallery")
  gallery.innerHTML = ``
  var cloud_svg = document.querySelector('.upload-svg')
  cloud_svg.style = 'display:block';
  var submit_btn = document.querySelector('.submit_btn');
  submit_btn.style = 'display:none;'
  var cancel_icon = document.querySelector('.cancel')
  cancel_icon.style = 'display: none;'
  mobile_upload_btn = document.querySelector('.browse_button')
  if (mobile_upload_btn){
    mobile_upload_btn.style = 'display:block;'
  }
}

function getBottleData(data)
{
  var accuracy;
  data = data['crates']
  var result = {}
  var keys = Object.keys(data);
  var crateID = 1
  keys.forEach(function(key){
    var crate = data[key]
    var keys = Object.keys(crate)
    var full_bottles = 0
    var empty_bottles = 0
    keys.forEach(function(key){
      accuracy = crate[key][4]
      var bottle = crate[key][6]
      if (bottle == "empty"){
        empty_bottles += 1
      }
      else{
        full_bottles += 1
      }
    })
    result[crateID] = {'empty':empty_bottles,'full':full_bottles,'accuracy':accuracy}
    crateID += 1
});
  return result
}

function showResult(data){
  console.log(data)
  loader.style = 'display:none;'
  content.style = "display:block;"
  document.querySelector('.back-arrow-container').style = 'display: block;'
  let HTMLContent = `<div class="back-arrow-container">
  <img onclick="refresh()" class="back-arrow" src="/IMG/left-arrow.png" alt="">
</div><div class="result-img-div">
  <img class="result-img" style="max-width: 100%;" src="${data['url']}" alt="example result">
</div><div class="table_container">
  <table class="table">
      <thead>
          <th>CrateID</th>
          <th>Full Bottles</th>
          <th>Empty Bottles</th>
          <th>Total Bottles</th>
          <th>Accuracy</th>
      </thead>
      <tbody>`;
  var bottle_data = getBottleData(data)
  console.log(bottle_data)
  for(var data in bottle_data){
    var crate = bottle_data[data]
    HTMLContent += `
            <tr>
                <td data-label="CrateID">${data}</td>
                <td data-label="Full_Bottles">${crate['full']}</td>
                <td data-label="Empty_Bottles">${crate['empty']}</td>
                <td data-label="Total_Bottles">${parseInt(crate['empty']) + parseInt(crate['full'])}</td>
                <td data-label="Accuracy">${Math.round(crate['accuracy']*100)} %</td>
            </tr>`
  }
      HTMLContent+= `
        </tbody>
    </table>
  </div>`;
  content.innerHTML = HTMLContent;
  var wrapper = document.querySelector('.wrapper')
  wrapper.style = 'margin-bottom: 48px; min-height: calc(100vh - 80px - 48px);'
  };

  function changeFooter(x) {
    if (x.matches) { // If media query matches
      footer.innerHTML = `<div class="footer_links">
    <div class="footer_end">DeliverYves 2022</div>
    </div>`
    }
    else{
      footer.innerHTML = `<div class="footer_links">
      <a class="footer_link" href="https://deliveryves.be/privacy-policy/" target="_blank">Privacy Policy</a>
      <a class="footer_link" href="https://deliveryves.be/algemene-voorwaarden/" target="_blank">Terms And Conditions</a>
    <div class="footer_end">DeliverYves 2022</div>
    </div>`
    }
  }

function callbackUploadBlob(data) {
  data = JSON.parse(data);
  showResult(data)
}

function upload(){
  console.log('Upload')
  let base64String = document.querySelector('.gallery_img').id;
  let position = base64String.search("base64,") + 7
  base64String = base64String.slice(position)
  jsonobject = { "image_base64": base64String }
  handleData('https://api.dyg2.be/detectbottles', callbackUploadBlob, null, 'POST', JSON.stringify(jsonobject));
  loader.style = 'display:block;'
  dropArea.style = 'display: none;';
}

function removeDragAndDrop(y){
  var upload_container = document.querySelector('.upload-container')
  if (y.matches){
    console.log("remove drag and drop")           
    upload_container.innerHTML = `<div onclick ="getFile()" for="fileElem" id="upload_btn"  class="browse_button">Browse</div><div class="submit_btn" onclick="upload()">
    Submit
</div>`;
  }
  else{
    upload_container.innerHTML = `<p class="upload-expl-title">Drag & drop </p>
    <span class="upload-expl">your file here, or </span><span onclick="getFile()" for="fileElem" id="upload_btn" class="browse">browse</span>
    <div class="submit_btn" onclick="upload()">
        Submit
    </div>`
  }
}

function init() {

    console.log('Dom loaded')
    var current_page = document.querySelector('.title').innerHTML;
    highlightCurrentPage(current_page);
    dropArea = document.getElementById("drop-area");
    loader = document.querySelector('.loader')
    content = document.querySelector('.content')
    footer = document.querySelector('.footer')
    mobile_upload_btn = document.querySelector('.browse_button')


    var x = window.matchMedia("(max-width: 530px)")
    changeFooter(x)
    x.addListener(changeFooter)

    var y = window.matchMedia("(max-width: 530px)")
    removeDragAndDrop(y)
    y.addListener(removeDragAndDrop)

    // Prevent default drag behaviors
    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)   
    document.body.addEventListener(eventName, preventDefaults, false)
    })

    // Highlight drop area when item is dragged over it
    ;['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
    })

    ;['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
    })

    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false)
}

function highlightCurrentPage(current_page){
    if (current_page == "Bottle detector"){
        var nav_items = document.getElementsByClassName('navigator_item');
        var current = nav_items[0];
        current.style = 'color: var(--abzg)';
        nav_items[1].classList.add('current_page');
    }
    if (current_page == "Bottle crate overview"){
        var nav_items = document.getElementsByClassName('navigator_item');
        var current = nav_items[1];
        current.style = 'color: var(--abzg)';
        nav_items[0].classList.add('current_page');
    }
}
  
function getFile() {
    document.getElementById("upfile").click();
}

document.addEventListener('DOMContentLoaded', init)