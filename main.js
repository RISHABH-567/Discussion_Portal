let subject = document.querySelectorAll("input")[1];
let text = document.querySelector("textarea");
const submit = document.querySelectorAll("button")[1];  //submit
const Left_container = document.querySelector(".ans");
const Question = document.querySelector("button");     //question
const response = document.querySelector(".response");
const content = document.querySelector(".content");
const Response_Question = document.querySelector(".question");
const Resolve = document.querySelectorAll("button")[2];     //resolve
let mainobj = JSON.parse(localStorage.getItem("key")) || {};
const Response_Submit = document.querySelectorAll("button")[3];  //Submit 2
let subject2 = document.querySelectorAll("input")[2];
let Textarea = document.querySelectorAll("textarea")[1];
const Right_Response = document.querySelector(".respond");

const search = document.querySelector("input");



search.addEventListener("input", (event) => {
    let searchQuery = event.target.value.toLowerCase().trim();
    let items = Left_container.querySelectorAll("div");

    if (searchQuery === "") {
        items.forEach(item => {
            item.innerHTML = item.dataset.original; 
            item.style.display = "block";
            item.style.color = ''; 
        });
        return;
    }


    items.forEach(function (item) {
        let originalText = item.dataset.original || item.innerHTML;
        item.dataset.original = originalText; 
        let itemName = originalText.toLowerCase();

        if (itemName.includes(searchQuery)) {
            const regex = new RegExp(`(${searchQuery})(?![^<>]*>)`, 'gi');
            const highlightedText = originalText.replace(regex, '<span class="highlight" style="color: red;">$1</span>');
            item.innerHTML = highlightedText;
            item.style.display = "block";
        } else {
            item.innerHTML = originalText;
            item.style.display = "none";
        }
    });
});


let originalid;
let clonenode;
let clonediv;


Question.addEventListener("click", ()=>{
    content.style.display = "block";
    response.style.display = "none";
})


Resolve.addEventListener("click", ()=>{
   
   
    for(let key in mainobj){
        
        if(mainobj[key].id == originalid){
            
            delete mainobj[key];
            break;
        }
       
    }
    localStorage.setItem("key", JSON.stringify(mainobj));
    
    if(clonediv.id == originalid){
        clonediv.remove();
    }

    Response_Question.innerHTML = "";
    Right_Response.innerHTML = "";
    
});



//Triming the value
const trimval = (val)=>{
    val.value = val.value.trim();
    return val;
}


function createsection(obj){
    let div = document.createElement("div");
    div.id = obj.id;
            let h = document.createElement("h3");
                h.innerText  = obj.sub;
            
                
                

                let p = document.createElement("p");
                p.innerHTML = obj.content;
                

                let d = document.createElement("p");
                d.innerText = obj.timeStamp;
                
            
                
                

                div.append(h,p,d);
        

                return div;
}



function updateTimeStamps() {
    let now = Date.now();

    for (let key in mainobj) {
        let obj = mainobj[key];
        let diff = Math.floor((now - obj.id) / 1000);

        if (diff < 60) {
            obj.timeStamp = diff <= 10 ? "Just Now" : `${diff} seconds ago`;
        } else if (diff < 3600) {
            obj.timeStamp = `${Math.floor(diff / 60)} minutes ago`;
        } else if (diff < 86400) {
            obj.timeStamp = `${Math.floor(diff / 3600)} hours ago`;
        } else {
            obj.timeStamp = `${Math.floor(diff / 86400)} days ago`;
        }
        
        mainobj[key] = obj;
    }

    
    localstore("key", mainobj);

    // Update the displayed timestamps
    let items = Left_container.querySelectorAll("div");
    items.forEach(item => {
        let id = item.id;
        if (mainobj[id]) {
            let span = item.querySelectorAll("p")[1];
            span.innerText = mainobj[id].timeStamp;
        }
    });
}


setInterval(updateTimeStamps, 1000);



let creatediv = ()=>{
    if(subject.value!="" && text.value != ""){
        subject = trimval(subject);

        text = trimval(text);

        if(subject.value!="" && text.value!=""){
                

                let obj = {
                    id : Date.now(),
                    sub : subject.value,
                    content: text.value,
                    timeStamp: "Just Now",
                    arr: []   
                };

                let savedData = JSON.parse(localStorage.getItem("key")) || {};
                
                
                savedData[obj.id] = obj;

                mainobj = savedData;
                
                localstore("key",mainobj)
                
                let div = createsection(obj);
                Left_container.appendChild(div);

                
                subject.value = "";
                text.value = "";
                
        }
        
    } 
}


submit.addEventListener("click", creatediv);


function localstore(key, mainobj){
    localStorage.setItem(key, JSON.stringify(mainobj));
}


window.onload = ()=>{
    let item = JSON.parse(localStorage.getItem("key"));
    if(item){ 
        for(let key in item){
            let div = createsection(item[key]);
            Left_container.append(div);
        }
    }
    search.value = "";
    
}



Left_container.addEventListener("click", (event)=>{
     clonediv = event.target.closest("div");
     
    if(clonediv){
        content.style.display = "none";
        response.style.display = "block"; 
        clonenode = clonediv.cloneNode(true);
        originalid = clonediv.id;
        clonenode.setAttribute("id",originalid);
        
        Response_Question.innerText = "";
        Response_Question.appendChild(clonenode);
        Right_Response.innerHTML = "";
        mainobj[originalid].arr.forEach((item)=>{
            let div = createsection2(item);
            Right_Response.appendChild(div);
        })

    }
})




function createsection2(obj){
    let div = document.createElement("div");
    div.id = obj.id;
            let h = document.createElement("h3");
                h.innerText  = obj.sub;
                
            let count = obj.count;
            let dis_count = obj.dis_count;
                

                let p = document.createElement("p");
                p.innerHTML = obj.content;

                let button = document.createElement("button");
                button.innerText = obj.like + " " +obj.count;
                button.id = "like";



                let button2 = document.createElement("button");
                button2.innerText = obj.dislike + " " + obj.dis_count;
                button2.id = "dislike";

                div.append(h,p, button, button2);
                
                

                return div;
}


let creatediv2 = ()=>{
    if(subject2.value!="" && Textarea.value != ""){
        subject2 = trimval(subject2);

        Textarea = trimval(Textarea);

        if(subject2.value!="" && Textarea.value!=""){
                

                let obj2 = {
                    sub : subject2.value,
                    content: Textarea.value,
                    like:  "Like",
                    dislike: "Dislike",
                    count: 0,
                    dis_count: 0,
                    id: Date.now()
                }
                
                mainobj[originalid].arr.push(obj2);
                
                localstore("key",mainobj);
               
                let div = createsection2(obj2);
                
                Right_Response.appendChild(div);

                
                subject2.value = "";
                Textarea.value = "";
                
        }
        
    } 
}




Response_Submit.addEventListener("click", creatediv2);

response.addEventListener("click", (event)=>{
    
    if(event.target.id == "like"){
        let button = event.target.closest("button");

        let id = event.target.closest("div").id;
        
        let responseIndex = mainobj[originalid].arr.findIndex(item => item.id == id);

         let count = mainobj[originalid].arr[responseIndex].count;
    
        button.innerText = `Like ${++count}`;
    
            mainobj[originalid].arr[responseIndex].count = count;
                
              
        localstore("key",mainobj);  
        
     }
    else if(event.target.id == "dislike"){
        let button = event.target.closest("button");

        let id = event.target.closest("div").id;
        
        let responseIndex = mainobj[originalid].arr.findIndex(item => item.id == id);

         let count = mainobj[originalid].arr[responseIndex].dis_count;
    
        button.innerText = `Dislike ${++count}`;
    
            mainobj[originalid].arr[responseIndex].dis_count = count;
                
              
        localstore("key",mainobj); 
    }

})

// ` 


 