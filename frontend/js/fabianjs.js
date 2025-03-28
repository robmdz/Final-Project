document.addEventListener("DOMContentLoaded", function () {
    let indexActual = 0;
    const slides = document.querySelectorAll(".slide");
    const puntos = document.querySelectorAll(".partes");

    function mostrarSlide(index) {
        if (index >= slides.length) indexActual = 0;
        else if (index < 0) indexActual = slides.length - 1;
        else indexActual = index;

        
        slides.forEach(slide => {
            slide.classList.remove("visible");
            slide.style.opacity = "0"; 
        });

        
        const slideActual = slides[indexActual];
        const img = slideActual.querySelector("img");

        if (!img.src || img.src === "") {
            console.log("Cargando imagen:", img.getAttribute("data-src"));
            img.src = img.getAttribute("data-src"); 
        }

        slideActual.classList.add("visible");
        slideActual.style.opacity = "1";

        puntos.forEach((punto, i) => {
            punto.classList.toggle("active", i === indexActual);
        });
    }

    function irASlide(index) {
        mostrarSlide(index);
    }

    setInterval(() => {
        mostrarSlide(indexActual + 1);
    }, 5000);

    puntos.forEach((punto, index) => {
        punto.addEventListener("click", () => irASlide(index));
    });

    mostrarSlide(indexActual);
});
