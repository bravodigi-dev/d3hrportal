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
  {keys:["when and how can i request my payslip","payslip request","payslip"],answer:"Your payslip will be available within four (4) working days after your salary has been credited. If you have not received it after this period, email askhr@daythree.co."},
  {keys:["how can i set up zakat deductions from my salary","zakat deductions","zakat"],answer:"Register directly through the official Zakat website for your state, such as Zakat Selangor, Zakat Pulau Pinang or Zakat Wilayah Persekutuan. Use askhr@daythree.co as the employer email. Once the Zakat office confirms the registration, the monthly deduction will be processed through payroll."},
  {keys:["can foreign employees claim epf or socso refunds when leaving malaysia","epf socso","epf"],answer:"Foreign employees may withdraw EPF contributions when permanently leaving Malaysia, subject to EPF regulations. SOCSO contributions are not refundable."},
  {keys:["how does income tax work for foreign employees","income tax","income"],answer:"Foreign employees must pay Malaysian income tax. Employees staying more than 182 days are generally treated as residents and subject to progressive rates from 0% to 30%. Non-residents are generally subject to a flat 30% rate."},
  {keys:["when is salary paid","salary paid","salary"],answer:"Salary is normally credited on the last working day of each month unless otherwise communicated. Employees will be informed in advance if the date changes due to public holidays or operational requirements."},
  {keys:["how do i update my bank account details","update bank","update"],answer:"Submit the request to HR with supporting documents such as a bank statement or account details. The update must be completed before the payroll cut-off date to take effect in the current cycle. Email askhr@daythree.co for assistance."},
  {keys:["how do i update my epf nomination","epf nomination","epf"],answer:"Update your nomination directly with EPF/KWSP by visiting an EPF branch or using EPF online services where available."},
  {keys:["how can i request an employment confirmation letter or salary letter","employment confirmation","employment"],answer:"Email askhr@daythree.co and state the type of letter, purpose and any required information. Allow several working days for processing."},
  {keys:["what is ev portal","ev portal","ev"],answer:"EV Portal means Employee Verification Portal. New candidates use the provided link to verify their personal details and support a smooth payroll process."},
  {keys:["what is the company’s bank panel for salary","company bank","company"],answer:"RHB Bank."},
  {keys:["can unused medical claims be carried forward","unused medical","unused"],answer:"No. Medical claims operate on a Pay & Claim basis. Unused monthly entitlement cannot be carried forward or accumulated."},
  {keys:["how do i submit a medical claim","submit medical","submit"],answer:"Submit the claim through the Faith system with the original medical receipt and Medical Certificate where applicable. Claims approved by the 24th are reimbursed in the same payroll cycle; approvals after the cut-off are reimbursed in the following month."},
  {keys:["can i request a special working arrangement if i am a part-time student","part time","part"],answer:"Employees must follow schedules assigned by Operations, and special arrangements cannot be guaranteed. For examinations, apply for Annual Leave, submit the examination timetable, obtain Operations Manager approval and apply through Faith."},
  {keys:["how do i apply for time off (to)","time off","time"],answer:"Inform your Team Leader, obtain Operations Manager approval and submit the request through the required process. The maximum Time Off allocation is two hours."},
  {keys:["how do i check my leave balance","check leave","check"],answer:"Log in to Faith to view available entitlement, leave history and approved leave. If the balance appears incorrect, contact your immediate superior or email askhr@daythree.co."},
  {keys:["when will my leave be approved","leave approval","leave"],answer:"Approval depends on operational requirements and manager approval. Submit requests early and do not make travel or personal commitments until the leave is officially approved in Faith."},
  {keys:["can i cancel or amend my approved leave","cancel amend","cancel"],answer:"Inform your immediate supervisor as soon as possible. The change must also be updated in Faith and remains subject to manager approval."},
  {keys:["what happens if i fall sick while on annual leave","sick annual","sick"],answer:"Notify your immediate supervisor promptly and submit a valid Medical Certificate from a registered medical practitioner through the prescribed process. The request will be reviewed under the leave policy."},
  {keys:["will there be bonuses or salary increments","bonus salary","bonus"],answer:"Performance bonuses are not provided because employee performance is assessed monthly through KPIs. Salary increments are reviewed based on annual performance, business needs and company policies."},
  {keys:["i have a complaint about someone. what should i do","complaint someone","complaint"],answer:"Speak with your assigned HR Business Partner or email askhr@daythree.co. Concerns are handled professionally, fairly and confidentially under the Grievance Procedure."},
  {keys:["how can i stay updated with hr announcements","hr announcements","hr"],answer:"Regularly check Company Memos in the Faith portal for updates on HR policies, employee benefits, events and important announcements."},
  {keys:["who is my hr business partner (hrbp)","who is","who"],answer:"Each business unit has an assigned HRBP. If you are unsure who supports your unit, email askhr@daythree.co and your enquiry will be directed appropriately."},
  {keys:["how do i update my personal information","update personal","update"],answer:"Notify HR promptly of changes to home address, mobile number, emergency contact, marital status, personal email or educational qualifications. Email askhr@daythree.co; supporting documents may be required."},
  {keys:["how do i submit my resignation","resignation notice","resignation"],answer:"Inform your immediate supervisor and submit the resignation formally. Serve the notice period stated in your Employment Contract. HR will guide you through clearance and exit."},
  {keys:["who should i contact if i have questions about a policy","questions policy","questions"],answer:"Contact your HR Business Partner or email askhr@daythree.co for clarification."},
  {keys:["where can i view internal job vacancies","internal job","internal"],answer:"Internal vacancies are announced through official company communication channels in the Faith system."},
  {keys:["what should i do if i receive a suspicious email","suspicious email","suspicious"],answer:"Do not click links or download attachments. Report the email immediately to the IT Helpdesk and delete it only after receiving IT guidance."},
  {keys:["can i use my personal email to send company information","personal email","personal"],answer:"No. Company information must be shared only through approved company systems and email accounts. Using personal email or unauthorised platforms may result in disciplinary action."},
  {keys:["how can i enjoy corporate discounts offered by daythree","corporate discounts","corporate"],answer:"Eligible employees may enjoy corporate discounts with selected partners including Grab, foodpanda, Proton, INTI International College and Celebrity Fitness. Check official HR communications for current offers."},
  {keys:["overtime","ot rate","ot claim"],answer:"Overtime may be required for operational needs and requires prior supervisor approval. Eligibility and payment follow the Employment Act, company policy and client requirements."},
  {keys:["dress code","professional appearance","wear to office"],answer:"Dress neatly and professionally, maintain good personal grooming and follow any client-specific dress requirements communicated by your Manager or Supervisor."},
  {keys:["workplace safety","smoking","vaping","rm100 fine"],answer:"Smoking and vaping are prohibited in designated areas. Building management may impose an RM100 fine, restrict access if unpaid, and company disciplinary action may apply."},
  {keys:["whistleblowing","unethical conduct","unlawful conduct"],answer:"Report genuine unethical or unlawful conduct to whistleblowing@daythree.co. Good-faith reporters are protected from retaliation."},
  {keys:["public holiday","holiday assigned","campaign holiday"],answer:"You will follow the public holidays assigned to you based on your job role and the campaign you serve."}
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
