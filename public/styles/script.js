new Swiper('.card-wrapper', {
    loop: true,
    spaceBetween: 30,
  
    //pagination bullets
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  
     // Responsive Breakpoint
    breakpoints: {
      0: {
        slidesPerView: 1
      },
      768: {
        slidesPerView: 2
      },
      1024: {
        slidesPerView: 3
      },
    }
  
  });

      // Add event listener to the Edit button (principe)
      document.getElementById("edit-btn").addEventListener("click", function () {
        console.log("Button is clicked!");
        
        // Hide the edit button and show the save button
        this.style.display = "none";
        document.getElementById("save-btn").style.display = "block";
        
        // Get all elements with the class "principe-edit" and make them visible
        const editors = document.getElementsByClassName("principe-edit");
        for (let i = 0; i < editors.length; i++) {
            editors[i].style.display = "block";
        }
    });

    //serviceScript
    function servicesEdit(id) {
      const displayDiv = document.getElementById("servicesDisplay");
      const editForm = document.getElementById("servicesEditForm");
      editForm.hidden = false;
      displayDiv.hidden = true;
      document.getElementById("edit-button").style.display = "none";
    
    }

    //mission script
    function showEdit(id){
      //Hide the title and description
      document.getElementById(`title${id}`).style.display = "none";
      document.getElementById(`description${id}`).style.display = "none";
      const inputHide = document.querySelector(`#input-title${id}`).closest("form");
      inputHide.hidden = false;
      document.getElementById(`edited${id}`).style.display = "none";
    };