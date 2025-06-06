// Seleciona elementos do DOM usando classes e tags HTML
const fileInput = document.querySelector(".file-input");
const filterOptions = document.querySelectorAll(".filter button"); 
const filterName = document.querySelector(".filter-info .name"); 
const filterValue = document.querySelector(".filter-info .value"); 
const filterSlider = document.querySelector(".slider input");
const rotateOptions = document.querySelectorAll(".rotate button");
const previewImg = document.querySelector(".preview-img img"); 
const resetFilterBtn = document.querySelector(".reset-filter"); 
const chooseImgBtn = document.querySelector(".choose-img"); 
const saveImgBtn = document.querySelector(".save-img"); 

// Variáveis para armazenar os valores dos filtros e rotação
let brightness = "100", saturation = "100", inversion = "0", grayscale = "0";
let rotate = 0, flipHorizontal = 1, flipVertical = 1;

// Função para carregar a imagem selecionada pelo usuário
const loadImage = () => {
    let file = fileInput.files[0];
    if (!file) return; 
    previewImg.src = URL.createObjectURL(file); // Exibe a imagem no elemento de visualização
    previewImg.addEventListener("load", () => {
        resetFilterBtn.click();
        document.querySelector(".container").classList.remove("disable");
    });
}

// Função para aplicar os filtros à imagem de visualização
const applyFilter = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

// Adiciona eventos aos botões de filtro para atualizar os valores e aplicar os filtros
filterOptions.forEach(option => {
    option.addEventListener("click", () => {
        document.querySelector(".active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;

        
        if (option.id === "brightness") {
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        } else if (option.id === "saturation") {
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`;
        } else if (option.id === "inversion") {
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        } else {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    });
});

// Função para atualizar os valores dos filtros com base no slider
const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active");

    // Atualiza os valores dos filtros com base na opção selecionada
    if (selectedFilter.id === "brightness") {
        brightness = filterSlider.value;
    } else if (selectedFilter.id === "saturation") {
        saturation = filterSlider.value;
    } else if (selectedFilter.id === "inversion") {
        inversion = filterSlider.value;
    } else {
        grayscale = filterSlider.value;
    }
    applyFilter(); 
}

// Adiciona eventos aos botões de rotação para modificar a rotação e espelhamento da imagem
rotateOptions.forEach(option => {
    option.addEventListener("click", () => {
        if (option.id === "left") {
            rotate -= 90; 
        } else if (option.id === "right") {
            rotate += 90; 
        } else if (option.id === "horizontal") {
            flipHorizontal = flipHorizontal === 1 ? -1 : 1; 
        } else {
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilter(); 
    });
});

// Função para redefinir todos os filtros e rotações para os valores iniciais
const resetFilter = () => {
    brightness = "100"; saturation = "100"; inversion = "0"; grayscale = "0";
    rotate = 0; flipHorizontal = 1; flipVertical = 1;
    filterOptions[0].click(); 
    applyFilter(); 
}

// Função para salvar a imagem editada pelo usuário
const saveImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;
    
    // Aplica os filtros e rotações à imagem no canvas
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180); // Converte graus para radianos
    }
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    
    // Cria um link de download para a imagem editada
    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL(); // Converte o canvas para data URL
    link.click(); // Simula um clique no link para iniciar o download
}

// Adiciona eventos aos elementos relevantes para chamar as funções apropriadas
filterSlider.addEventListener("input", updateFilter); 
resetFilterBtn.addEventListener("click", resetFilter); 
saveImgBtn.addEventListener("click", saveImage); 
fileInput.addEventListener("change", loadImage); 
chooseImgBtn.addEventListener("click", () => fileInput.click());