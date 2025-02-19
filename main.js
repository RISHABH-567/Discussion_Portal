let subject = document.querySelectorAll("input")[1];
let text = document.querySelector("textarea");
const submit = document.querySelectorAll("button")[1];  //Submit
const Left_container = document.querySelector(".ans");
const Question = document.querySelector("button");     //Question
const response = document.querySelector(".response");
const content = document.querySelector(".content");
const Response_Question = document.querySelector(".question");
const Resolve = document.querySelectorAll("button")[2];     //Resolve
let mainobj = JSON.parse(localStorage.getItem("key")) || {};
const Response_Submit = document.querySelectorAll("button")[3];  //Submit 2
let Name = document.querySelectorAll("input")[2];
let Textarea = document.querySelectorAll("textarea")[1];
const Right_Response = document.querySelector(".respond");
const search = document.querySelector("input");


//Search functionality including highlighting the text...
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


let originalid;     //Original id of div in left container
let clonenode;      //Clone div made from left container div
let clonediv;      //Original div from which clone div is made


//For Question button to appear question on right side of document...
Question.addEventListener("click", ()=>{
    content.style.display = "block";
    response.style.display = "none";
})



//For deleting div in left container...
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



//Triming the value...
const trimval = (val)=>{
    val.value = val.value.trim();
    return val;
}



//Creating the div for left container using submit button of questions section...
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


//For Timestamp by calculating date.now and div's id...
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
        
        let items = Left_container.querySelectorAll("div");
        items.forEach(item => {
                let span = item.querySelectorAll("p")[1];
                span.innerText = obj.timeStamp;
        });
    }
}



setInterval(updateTimeStamps, 1000);


//Creating the object for left container...
let creatediv = ()=>{
    if(subject.value!="" && text.value != ""){
        subject = trimval(subject);

        text = trimval(text);

        if(subject.value!="" && text.value!=""){
                

                let obj = {
                    id : Date.now(),
                    sub : subject.value,
                    content: text.value,
                    timeStamp: "",
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


//For creating the div on the left container on clicking the submit button on question section...
submit.addEventListener("click", creatediv);


//Storing the data in local storage...
function localstore(key, mainobj){
    localStorage.setItem(key, JSON.stringify(mainobj));
}



//Function invoke on loading the button...
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


//For making the clone of div in left container and append it in the response section...
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



// Creating div for the right section in response side...
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


// Creating the object of the response section and pushing the object in the array of main object...
let creatediv2 = ()=>{
    if(Name.value!="" && Textarea.value != ""){
        Name = trimval(Name);

        Textarea = trimval(Textarea);

        if(Name.value!="" && Textarea.value!=""){
                

                let obj2 = {
                    sub : Name.value,
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

                
                Name.value = "";
                Textarea.value = "";
                
        }
        
    } 
}



//Creating the response section on clicking the submit button of response side...
Response_Submit.addEventListener("click", creatediv2);



// For counting the like and dislike and storing them in the local storage...

response.addEventListener("click", (event) => {
    
    if (event.target.id == "like" || event.target.id == "dislike") {
        let button = event.target.closest("button");
        let id = event.target.closest("div").id;

      
        let responseIndex = mainobj[originalid].arr.findIndex(item => item.id == id);

        
        if (event.target.id == "like") {
            let count = mainobj[originalid].arr[responseIndex].count;
            button.innerText = `Like ${++count}`;
            mainobj[originalid].arr[responseIndex].count = count;
        } else if (event.target.id == "dislike") {
            let dis_count = mainobj[originalid].arr[responseIndex].dis_count;
            button.innerText = `Dislike ${++dis_count}`;
            mainobj[originalid].arr[responseIndex].dis_count = dis_count;
        }

        let count = mainobj[originalid].arr[responseIndex].count;
        let dis_count = mainobj[originalid].arr[responseIndex].dis_count;
        let diff = count - dis_count;

        let currentdiv = event.target.closest("div");
        let prevdiv = currentdiv.previousElementSibling;
        let nextdiv = currentdiv.nextElementSibling;


        while (nextdiv) {
            let id1 = mainobj[originalid].arr.findIndex(item => item.id == nextdiv.id);
            let nextitemlike = mainobj[originalid].arr[id1].count;
            let nextitemdislike = mainobj[originalid].arr[id1].dis_count;
            let nextitemcount = nextitemlike - nextitemdislike;

            if (diff < nextitemcount) {
                Right_Response.insertBefore(currentdiv, nextdiv.nextElementSibling);  
                nextdiv = currentdiv.nextElementSibling;  
            } else {
                break;  
            }
        }

      
        while (prevdiv) {
            let id1 = mainobj[originalid].arr.findIndex(item => item.id == prevdiv.id);
            let nextitemlike = mainobj[originalid].arr[id1].count;
            let nextitemdislike = mainobj[originalid].arr[id1].dis_count;
            let nextitemcount = nextitemlike - nextitemdislike;

            if (diff > nextitemcount) {
                Right_Response.insertBefore(currentdiv, prevdiv);  
                prevdiv = currentdiv.previousElementSibling;  
            } else {
                break;  
            }
        }

        
        let updatedArr = Array.from(Right_Response.children).map(div => {
            return mainobj[originalid].arr.find(item => item.id == div.id);
        });

        mainobj[originalid].arr = updatedArr;

        localstore("key", mainobj);
    }
});
