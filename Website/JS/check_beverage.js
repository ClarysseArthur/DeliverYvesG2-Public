
function checkBeverage(){

    // refreshen
    location.reload();
}

function changeColors(nr_of_bottles){
    
    if (nr_of_bottles > 15){
        return "plenty"
    }
    if (nr_of_bottles < 10){
        return "refill"
    }
    else{
        return "consumed"
    }   
}

function changeAlphaColors(nr_of_bottles){
    
    if (nr_of_bottles > 15){
        return "plenty_alpha"
    }
    if (nr_of_bottles < 10){
        return "refill_alpha"
    }
    else{
        return "consumed_alpha"
    }   
}

function loadLevels(){
    // nr_of_levels is in te stellen

    var nr_of_levels = 4;
    if (nr_of_levels > 5){
        var footer = document.querySelector('.footer')
        footer.style = "position: relative;"
    }

    htmlLevels = '';
    var content = document.querySelector('.content')
    for (var i = 0; i < nr_of_levels; i++){
        nr_of_bottles = Math.round(Math.random()*24)
        percentage = (nr_of_bottles/24)*100
        htmlLevels += `<div class="beverage_table_container">
        <div class="beverage_table">
            <p class="beverage_table_level">Level ${i+1}:</p>
            <div class="beverage_table_bottles_grid">
                <p class="${changeColors(nr_of_bottles)}">${nr_of_bottles}</p>
                <p>/</p>
                <p>24</p>
            </div>
            <div style="border: 2px solid var(--${changeAlphaColors(nr_of_bottles)});" class="status_bar_border">
                <div style="width: ${percentage}%; outline: 1.5px solid var(--${changeAlphaColors(nr_of_bottles)});" class="status_bar ${changeAlphaColors(nr_of_bottles)}"></div>
            </div>
        </div>
    </div>`
    }
    content.innerHTML = htmlLevels;
}

document.addEventListener('DOMContentLoaded',loadLevels)