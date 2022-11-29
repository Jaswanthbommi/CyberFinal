const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBraW1nd2lqdndpb25pa2p3eW9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njk2NzE2MTcsImV4cCI6MTk4NTI0NzYxN30.t0ditNcROZDuAu0vj3qXKjpwtCCLVoRyguIgh-Ku_VI";

const url = "https://pkimgwijvwionikjwyon.supabase.co";

const database = supabase.createClient(url, key);

let selectedProductIdForEdit;

let save = document.querySelector("#save");
save.addEventListener("click", async (e) => {
    e.preventDefault();
    
    let Product_Name = document.querySelector("#Product_Name").value;
    let Category = document.querySelector("#Category").value;
    let Manufacturer = document.querySelector("#Manufacturer").value;
    let Condition = document.querySelector("#Condition").value;
    let Color = document.querySelector("#Color").value;
    let Stock = parseInt(document.querySelector("#Stock").value);
    let Price = parseInt(document.querySelector("#Price").value);
    console.log(Price);
    console.log(typeof Price);
    save.innerText = "Saving....";
    save.setAttribute("disabled", true);
    let res = await database.from("product").insert([{ 
        Product_Name : Product_Name,
        Category: Category,
        Manufacturer: Manufacturer,
        Condition: Condition,
        Color: Color,
        Stock: Stock,
        Price: Price
    }])
    console.log(res);
    if (!res.error) {
        alert("Product Added Successfully")
        save.innerText = "Save"
        save.setAttribute("disabled", false);
        Product_Name = "";
        Category = "";
        Manufacturer = "";
        Condition = "";
        Color = "";
        Stock = "";
        Price = "";
        document.getElementById("createCloseButton").click();
        getProduct();
        getTotalCount();
    } else {
        alert("Product Not Added Successfully")
        save.innerText = "Save"
        save.setAttribute("disabled", false);
    }
})

const getProduct = async () => {

    let loading = document.getElementById("loading");
  
    loading.innerText = "Loadding...."
    const res = await database.from("product").select("*");
    
    if (res) {
       showData(res.data);

    }

}

getProduct();

const getTotalCount = async () => {
    let total = document.querySelector("#total");
    const res = await database.from("product").select("*", { count: "exact" });
    total.innerText = res.data.length;
}

getTotalCount();

const editProduct = async (Product_Id) => {


    const res = await database.from("product").select("*").eq("Product_Id", Product_Id);
    selectedProductIdForEdit = Product_Id;

    if (res) {
        
        document.getElementById("edit-Product_Name").value = res.data[0].Product_Name;
        document.getElementById("edit-Category").value = res.data[0].Category;
        document.getElementById("edit-Manufacturer").value = res.data[0].Manufacturer;
        document.getElementById("edit-Condition").value = res.data[0].Condition;
        document.getElementById("edit-Color").value = res.data[0].Color;
        document.getElementById("edit-Stock").value = res.data[0].Stock;
        document.getElementById("edit-Price").value = res.data[0].Price;
    }
}

const update = document.getElementById("update");

update.addEventListener("click", async () => {
    
    let Product_Name = document.getElementById("edit-Product_Name").value
    let Category = document.getElementById("edit-Category").value;
    let Manufacturer = document.getElementById("edit-Manufacturer").value;
    let Condition = document.getElementById("edit-Condition").value;
    let Color = document.getElementById("edit-Color").value
    let Stock = document.getElementById("edit-Stock").value;
    let Price = document.getElementById("edit-Price").value;
    update.innerText = "Updating...."
    // update.setAttribute("disabled", true);
    const res = await database.from("product").update({
        Product_Name, Category, Manufacturer, Condition, Color, Stock,Price
    }).eq("Product_Id", selectedProductIdForEdit)

    if (res) {
        alert("Product Updated Successfully")
        update.innerText = "Update"
        // update.setAttribute("disabled", false);
       
        Product_Name = "";
        Category = "";
        Manufacturer = "";
        Condition = "";
        Color = "";
        Stock = "";
        Price = "";
        document.getElementById("updateCloseButton").click();
        getProduct();
        getTotalCount();

    } else {
        alert("Product Not Updated Successfully")
        update.innerText = "Update"
        // update.setAttribute("disabled", false);
    }
})


const deleteProduct = async (Product_Id) => {
    const res = await database.from("product").delete().eq("Product_Id", Product_Id)

    if (res) {
        alert("Delete successfully")
        getProduct();
        getTotalCount();

    } else {
        alert("Delete unsuccessfull")
    }
}

const filterdata = async() => {
    const searchVal = `%${document.getElementById('myInput').value}%`;
let res = await database
  .from('product')
  .select("*")
  .ilike('Product_Name', searchVal)
  showData(res.data);
}

const showData = (data) => {
    let tbody = document.getElementById("tbody");
    let loading = document.getElementById("loading");
    let tr = "";
    for (var i in data) {
        tr += `<tr>
     <td>${parseInt(i) + 1}</td>
     <td>${data[i].Product_Name}</td>
     <td>${data[i].Category}</td>
     <td>${data[i].Manufacturer}</td>
     <td>${data[i].Condition}</td>
     <td>${data[i].Color}</td>
     <td>${data[i].Stock}</td>
     <td>${data[i].Price}</td>
     <td><button class="btn btn-primary" data-bs-toggle="modal"
     onclick='editProduct(${data[i].Product_Id})' data-bs-target="#editModel">Edit</button></td>
     <td><button onclick='deleteProduct(${data[i].Product_Id})' class="btn btn-danger">Delete</button></td>
     </tr>`;
    }
    tbody.innerHTML = tr;
    loading.innerText = ""
}

