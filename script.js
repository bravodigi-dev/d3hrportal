const body=document.body;
const themeToggle=document.getElementById("themeToggle");
const savedTheme=localStorage.getItem("d3-theme");
if(savedTheme==="dark") body.classList.add("dark");
themeToggle.addEventListener("click",()=>{
  body.classList.toggle("dark");
  localStorage.setItem("d3-theme",body.classList.contains("dark")?"dark":"light");
});

const menuToggle=document.getElementById("menuToggle");
const mobileNav=document.getElementById("mobileNav");
menuToggle.addEventListener("click",()=>mobileNav.classList.toggle("open"));
mobileNav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>mobileNav.classList.remove("open")));

const search=document.getElementById("globalSearch");
const searchable=[...document.querySelectorAll(".searchable")];
const status=document.getElementById("searchStatus");

function applyFilters(){
  const q=search.value.trim().toLowerCase();
  const category=document.getElementById("faqCategory").value;
  let visible=0;
  searchable.forEach(el=>{
    const text=(el.dataset.search+" "+el.textContent).toLowerCase();
    const categoryMatch=!el.classList.contains("faq-item")||category==="all"||el.dataset.category===category;
    const searchMatch=!q||text.includes(q);
    const show=categoryMatch&&searchMatch;
    el.classList.toggle("hidden-by-search",!show);
    if(show) visible++;
  });
  status.textContent=q?`${visible} matching portal items found for “${search.value}”.`:"";
}
search.addEventListener("input",applyFilters);
document.getElementById("faqCategory").addEventListener("change",applyFilters);

document.addEventListener("keydown",e=>{
  if(e.key==="/" && document.activeElement!==search){
    e.preventDefault();search.focus();
  }
  if(e.key==="Escape" && document.getElementById("imageModal").open){
    document.getElementById("imageModal").close();
  }
});

const modal=document.getElementById("imageModal");
const modalImage=document.getElementById("modalImage");
const modalTitle=document.getElementById("modalTitle");
document.querySelectorAll(".image-button").forEach(btn=>btn.addEventListener("click",()=>{
  modalImage.src=btn.dataset.image;
  modalImage.alt=btn.dataset.title;
  modalTitle.textContent=btn.dataset.title;
  modal.showModal();
}));
document.getElementById("closeModal").addEventListener("click",()=>modal.close());
modal.addEventListener("click",e=>{if(e.target===modal)modal.close()});

const backToTop=document.getElementById("backToTop");
window.addEventListener("scroll",()=>backToTop.classList.toggle("visible",scrollY>500));
backToTop.addEventListener("click",()=>scrollTo({top:0,behavior:"smooth"}));
