let cl = console.log;
const postContainer = document.getElementById("postContainer");
const titleControl = document.getElementById("title");
const contentControl = document.getElementById("content");
const addPostBtn = document.getElementById("addPostBtn");
const updatePostBtn = document.getElementById("updatePostBtn");
const postsForm = document.getElementById("postsForm");
const userId = document.getElementById("userId");


let baseUrl = `https://jsonplaceholder.typicode.com`;

let postsUrl = `${baseUrl}/posts`;


const onDeleteBtn = (ele) => {
    let getId = ele.closest(".card").id;
    let deleteUrl = `${baseUrl}/posts/${getId}`;
    let card = document.getElementById(getId);

    let xhr = new XMLHttpRequest();

    xhr.open("DELETE", deleteUrl);

    xhr.send();

    xhr.onload = () => {
        if(xhr.status >= 200 && xhr.status < 300){
            
            Swal.fire({
                title: "Are you sure?",
                text: "You want to delete this post!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
              }).then((result) => {
                if (result.isConfirmed) {
                    card.remove();
                  Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                  });
                }
            });
        }
    }
}

const onEditBtn = (ele) => {
    let getId = ele.closest(".card").id;
    localStorage.setItem("getId", getId);

    let getEditId = `${baseUrl}/posts/${getId}`;
    let getscrollvalue = window.scrollY;
    cl(getscrollvalue);
    if(getscrollvalue > 150){
        window.scrollTo(0,0);
    }
    
    let xhr = new XMLHttpRequest();

    xhr.open("GET", getEditId, true);

    xhr.send();

    xhr.onload = function(){
        if(xhr.status === 200){
            let data = JSON.parse(xhr.response);
            titleControl.value = data.title;
            contentControl.value = data.body;
            userId.value = data.userId;
            updatePostBtn.classList.remove("d-none");
            addPostBtn.classList.add("d-none");
        }
    }

}

const createcards = (data) => {
    postContainer.innerHTML = data.map(ele => { 
        return `
        <div class="card mb-4 text-capitalize" id ="${ele.id}">
            <div class="card-header">
                 <h4 class="m-0">${ele.title}</h4>
            </div>
            <div class="card-body">
                    <p class="m-0">${ele.body}</p>
                    </div>
            <div class="card-footer d-flex justify-content-between">
                <button class="btn btn-primary" onclick="onEditBtn(this)">Edit</button>
                <button class="btn btn-danger" onclick="onDeleteBtn(this)">Delete</button>
            </div>
        </div>
        `
    }).join('');
}

let getDBdata = () => {
    let xhr = new XMLHttpRequest();

    xhr.open("GET", postsUrl, true);

    xhr.send();

    xhr.onload = function(){
    if(xhr.status >= 200 && xhr.status < 300){
        let data = JSON.parse(xhr.response);
        cl(data);
        createcards(data);
    }
}
}

const onSubmitHandler = (eve) => {
    eve.preventDefault();
    let obj = {
        title : titleControl.value,
        body : contentControl.value,
        userId : userId.value
    }
    cl(obj);
    let xhr = new XMLHttpRequest();

    xhr.open("POST", postsUrl, true);

    xhr.send(JSON.stringify(obj));

    xhr.onload = function(){
        if(xhr.status > 200 && xhr.status <= 300){
            obj.id = JSON.parse(xhr.response).id;
            let div = document.createElement("div");
            div.className = "card mb-4 text-capitalize";
            div.id = obj.id;
            div.innerHTML = `
            <div class="card-header">${obj.title}</div>
            <div class="card-body">${obj.body}</div>
            <div class="card-footer d-flex justify-content-between">
                <button class="btn btn-primary" onclick="onEditBtn(this)">Edit</button>
                <button class="btn btn-danger" onclick="onDeleteBtn(this)">Delete</button>
            </div>
            `
            postContainer.prepend(div);
        }
        postsForm.reset();
        Swal.fire({
            title : 'Your post is added successfully !!!',
            icon : "success",
            timer :1500
        })
    }
}

const onSubmitBtnHandler = () => {
    let getId = localStorage.getItem("getId");
    let getEditId = `${baseUrl}/posts/${getId}`;

    cl(getId);
    let obj = {
        title : titleControl.value,
        body : contentControl.value,
        userId : userId.value
    }

    cl(obj);
    let getUpdateId = [...document.getElementById(getId).children];
    cl(getUpdateId);
    let xhr = new XMLHttpRequest();

    xhr.open("PATCH", getEditId, true);

    xhr.send(JSON.stringify(obj));

    xhr.onload = function(){
        getUpdateId[0].innerHTML = `<h4 class="m-0">${obj.title}</h4>`;
        getUpdateId[1].innerHTML = `<p class="m-0">${obj.body}</p>`;
        getUpdateId[2] = obj.userId;
        postsForm.reset()
        addPostBtn.classList.remove("d-none");
        updatePostBtn.classList.add("d-none");
        Swal.fire({
            title : `Updated !!!`,
            text : "Post is updated successfully!!",
            icon : "success",
            timer :2000
        })

    }
}

getDBdata();

postsForm.addEventListener("submit", onSubmitHandler);
updatePostBtn.addEventListener("click", onSubmitBtnHandler);