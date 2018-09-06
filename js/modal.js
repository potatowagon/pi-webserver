// Get the modal
var modal = document.getElementById('myModal');

// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = [document.getElementById('chart')]; 
img.push.apply(img, document.getElementsByClassName('incubator-img')); 

var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");

for(let i = 0; i < img.length; i++) {
    img[i].onclick = function(){
        //hide info modal
        document.getElementById("info-modal").style.display = "none";
        modal.style.paddingTop = "100px";
        modal.style.display = "block";
        modalImg.src = this.src;
        captionText.innerHTML = this.alt;
    }
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() { 
    modal.style.display = "none";
}

//close on clicking the modal background
var background = [document.getElementById("info-modal"), document.getElementById("background")];
for(let i =0; i < background.length; i++) {
    background[i].onclick = function() {
        modal.style.display = "none";
    }
}