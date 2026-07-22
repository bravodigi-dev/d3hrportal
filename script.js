const body=document.body;
const themeToggle=document.getElementById("themeToggle");
if(localStorage.getItem("d3-theme")==="dark")body.classList.add("dark");
themeToggle.addEventListener("click",()=>{
  body.classList.toggle("dark");
  localStorage.setItem("d3-theme",body.classList.contains("dark")?"dark":"light");
});

const menuToggle=document.getElementById("menuToggle");
const mobileNav=document.getElementById("mobileNav");
menuToggle.addEventListener("click",()=>mobileNav.classList.toggle("open"));
mobileNav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>mobileNav.classList.remove("open")));

const searchInput=document.getElementById("globalSearch");
const searchButton=document.getElementById("searchButton");
const searchable=[...document.querySelectorAll(".searchable")];
const faqFilter=document.getElementById("faqFilter");
const searchStatus=document.getElementById("searchStatus");

function applySearch(){
  const q=searchInput.value.trim().toLowerCase();
  const category=faqFilter.value;
  let shown=0;
  searchable.forEach(el=>{
    const text=(el.dataset.search+" "+el.textContent).toLowerCase();
    const categoryOk=!el.classList.contains("faq")||category==="all"||el.dataset.category===category;
    const queryOk=!q||text.includes(q);
    const visible=categoryOk&&queryOk;
    el.classList.toggle("hidden",!visible);
    if(visible)shown++;
  });
  searchStatus.textContent=q?`${shown} matching portal items found for “${searchInput.value}”.`:"";
  if(q)document.getElementById("employee-info").scrollIntoView({behavior:"smooth"});
}
searchButton.addEventListener("click",applySearch);
searchInput.addEventListener("keydown",e=>{if(e.key==="Enter")applySearch()});
searchInput.addEventListener("input",()=>{if(!searchInput.value)applySearch()});
faqFilter.addEventListener("change",applySearch);

const modal=document.getElementById("imageModal");
const modalImage=document.getElementById("modalImage");
const modalTitle=document.getElementById("modalTitle");
document.querySelectorAll("[data-image]").forEach(btn=>btn.addEventListener("click",()=>{
  modalImage.src=btn.dataset.image;
  modalImage.alt=btn.dataset.title;
  modalTitle.textContent=btn.dataset.title;
  modal.showModal();
}));
document.getElementById("modalClose").addEventListener("click",()=>modal.close());
modal.addEventListener("click",e=>{if(e.target===modal)modal.close()});

const chatLauncher=document.getElementById("chatLauncher");
const chatPanel=document.getElementById("chatPanel");
const chatClose=document.getElementById("chatClose");
const chatMessages=document.getElementById("chatMessages");
const chatInput=document.getElementById("chatInput");
const chatSend=document.getElementById("chatSend");

const answers=[
  {keys:["apply leave","leave application","annual leave"],answer:"Log in to the Faith HR System, select the leave type, enter the dates and submit the request for manager approval."},
  {keys:["leave balance","check leave"],answer:"You can check your leave entitlement, history and approved leave in the Faith HR System."},
  {keys:["salary paid","salary date","payday","when is salary"],answer:"Salary is normally credited on the last working day of each month unless HR communicates a change."},
  {keys:["payslip","salary slip"],answer:"Your payslip should be available within four working days after salary is credited. If it is unavailable, email askhr@daythree.co."},
  {keys:["medical claim","claim medical"],answer:"Submit the claim through Faith with the original receipt and Medical Certificate where applicable. Claims approved by the 24th are normally reimbursed in the same payroll cycle."},
  {keys:["overtime","ot rate","ot claim"],answer:"Overtime must be based on operational need and receive prior approval. Eligibility and payment follow company policy, client requirements and applicable law."},
  {keys:["resign","resignation","notice period"],answer:"Inform your supervisor, submit the resignation formally and serve the notice period stated in your Employment Contract."},
  {keys:["grievance","complaint","unfair treatment"],answer:"Contact your HR Business Partner or email askhr@daythree.co. Concerns are handled professionally and confidentially."},
  {keys:["whistleblowing","unethical","illegal"],answer:"Use whistleblowing@daythree.co for suspected unlawful, unethical or serious misconduct concerns."},
  {keys:["contact hr","hr email","ask hr"],answer:"Contact HR through askhr@daythree.co. For whistleblowing matters, use whistleblowing@daythree.co."},
  {keys:["dress code","wear to office"],answer:"Dress neatly and professionally, maintain good grooming and follow client-specific requirements."},
  {keys:["bank","rhb","salary bank"],answer:"The company salary bank panel is RHB Bank."}
];

function addMessage(text,type){
  const div=document.createElement("div");
  div.className=`message ${type}`;
  div.textContent=text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop=chatMessages.scrollHeight;
}
function getAnswer(q){
  const lower=q.toLowerCase();
  const found=answers.find(item=>item.keys.some(k=>lower.includes(k)));
  return found?found.answer:"I could not find an exact answer. Try asking about leave, payroll, medical claims, overtime, resignation, dress code or HR contact details. For personal matters, email askhr@daythree.co.";
}
function sendMessage(question){
  const value=(question||chatInput.value).trim();
  if(!value)return;
  addMessage(value,"user");
  chatInput.value="";
  setTimeout(()=>addMessage(getAnswer(value),"bot"),250);
}
chatLauncher.addEventListener("click",()=>{chatPanel.classList.add("open");chatPanel.setAttribute("aria-hidden","false");setTimeout(()=>chatInput.focus(),70)});
chatClose.addEventListener("click",()=>{chatPanel.classList.remove("open");chatPanel.setAttribute("aria-hidden","true")});
chatSend.addEventListener("click",()=>sendMessage());
chatInput.addEventListener("keydown",e=>{if(e.key==="Enter")sendMessage()});
document.querySelectorAll(".suggestion-row button").forEach(btn=>btn.addEventListener("click",()=>sendMessage(btn.dataset.question)));
