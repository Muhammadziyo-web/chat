let $ = function(el){
    let element = document.querySelector(el)
    return element
}

let $a = function(el){
   return document.querySelectorAll(el); 
    
}

let createEl = function(el,className,text){
    let element = document.createElement(el)
    if(className){
        element.setAttribute('class', className)
    }
    if(text){
        element.innerHTML = text
    }
    return element
}

