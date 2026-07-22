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

const chatLauncher=document.getElementById("chatLauncher");
const chatPanel=document.getElementById("chatPanel");
const chatClose=document.getElementById("chatClose");
const chatInput=document.getElementById("chatInput");
const chatSend=document.getElementById("chatSend");
const chatMessages=document.getElementById("chatMessages");

const hrAnswers=[
{keys:["apply leave","leave application","annual leave"],answer:"Log in to the Faith HR System, select the leave type, enter the dates and submit it for manager approval. Do not make travel commitments until approval is confirmed."},
{keys:["leave balance","check leave"],answer:"Check your entitlement, leave history and approved leave in the Faith HR System. Contact your supervisor or HR if there is a discrepancy."},
{keys:["salary paid","payday","salary date","when is salary"],answer:"Salary is normally credited on the last working day of each month unless HR communicates a change."},
{keys:["payslip","salary slip"],answer:"Your payslip should be available within four working days after salary is credited. If unavailable, email askhr@daythree.co."},
{keys:["medical claim","claim medical"],answer:"Submit through Faith with the original receipt and Medical Certificate where applicable. Claims approved by the 24th are normally reimbursed in the same payroll cycle."},
{keys:["overtime","ot rate","ot claim"],answer:"Overtime must be based on operational need and receive prior approval. Eligibility and payment follow company policy, client requirements and applicable law."},
{keys:["time off"],answer:"Inform your Team Leader, obtain Operations Manager approval and submit through the required process. Maximum Time Off is two hours."},
{keys:["resign","resignation","notice period"],answer:"Inform your supervisor and submit your resignation formally. Serve the notice period stated in your Employment Contract. HR will guide the clearance process."},
{keys:["grievance","complaint","unfair treatment"],answer:"Contact your HR Business Partner or email askhr@daythree.co. Concerns are handled professionally and confidentially."},
{keys:["whistleblowing","unethical","illegal"],answer:"Email whistleblowing@daythree.co for suspected unlawful, unethical or serious misconduct concerns."},
{keys:["contact hr","hr email","ask hr","hr support"],answer:"Contact HR at askhr@daythree.co. For confidential whistleblowing matters, use whistleblowing@daythree.co."},
{keys:["bank","salary bank","rhb"],answer:"The company salary bank panel is RHB Bank."},
{keys:["dress code","clothing","wear to office"],answer:"Dress neatly and professionally, maintain good grooming and follow client-specific requirements. Refer to the Dress Code section for restrictions."},
{keys:["suspicious email","phishing"],answer:"Do not click links or download attachments. Report the email to the IT Helpdesk and follow IT guidance."}
];

function addChatMessage(text,type){
 const item=document.createElement("div");
 item.className=`chat-message ${type}`;
 item.textContent=text;
 chatMessages.appendChild(item);
 chatMessages.scrollTop=chatMessages.scrollHeight;
}
function findHRAnswer(question){
 const q=question.toLowerCase();
 const match=hrAnswers.find(item=>item.keys.some(key=>q.includes(key)));
 return match?match.answer:"I could not find an exact answer. Try asking about leave, payroll, payslips, medical claims, overtime, resignation, dress code or HR contact details. For personal cases, email askhr@daythree.co.";
}
function submitChat(question){
 const value=(question||chatInput.value).trim();
 if(!value)return;
 addChatMessage(value,"user");
 chatInput.value="";
 setTimeout(()=>addChatMessage(findHRAnswer(value),"bot"),250);
}
chatLauncher.addEventListener("click",()=>{chatPanel.classList.add("open");chatPanel.setAttribute("aria-hidden","false");setTimeout(()=>chatInput.focus(),80)});
chatClose.addEventListener("click",()=>{chatPanel.classList.remove("open");chatPanel.setAttribute("aria-hidden","true")});
chatSend.addEventListener("click",()=>submitChat());
chatInput.addEventListener("keydown",e=>{if(e.key==="Enter")submitChat()});
document.querySelectorAll(".chat-suggestions button").forEach(btn=>btn.addEventListener("click",()=>submitChat(btn.dataset.question)));
