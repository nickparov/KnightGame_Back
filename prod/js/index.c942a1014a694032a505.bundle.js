"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[826],{8361:(e,t,n)=>{n.d(t,{Z:()=>o});const o=function(){const e=[{url:"https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",type:"link"},{url:"https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.1/font/bootstrap-icons.css",type:"link"},{url:"./assets/main.css",type:"link"}];return{load:function(t){var n;(n=e.map((function({url:e,type:t}){return function(e,t){return new Promise((function(n,o){if("script"!==t&&"link"!==t)throw"not a valid type for load func!";let r=document.createElement(t);"script"===t&&(r.src=e),"link"===t&&(r.setAttribute("rel","stylesheet"),r.setAttribute("href",e)),r.addEventListener("load",(function(){n(!0)})),document.head.appendChild(r)}))}(e,t)})),n.reduce((function(e,t){return e.then((function(){return t.then((function(e){return!0}))}))}),Promise.resolve([]))).then((e=>{console.log("Done loading Core!"),t&&t()}))}}}()},1696:(e,t,n)=>{n.d(t,{q:()=>o});const o={getNowSeconds:()=>Math.round((new Date).getTime()/1e3),getRemainingHours:e=>Math.round((e-o.getNowSeconds())/60/60),getRemainingMinutes:e=>Math.round((e-o.getNowSeconds())/60),getRemainingSeconds:e=>Math.round(e-o.getNowSeconds()),stillInAdventure:e=>Math.round(e-o.getNowSeconds())>0}},2521:(e,t,n)=>{n.d(t,{QD:()=>o,u_:()=>s,Kr:()=>r});const o=function(){function e(e){s.clearModal();const t=`<p>${e}</p>`;s.populateModal("Error Message",t,""),s.show(null,1e3)}return{login:function(){const t=prompt("Your Username:",""),n=prompt("Your Password:","");if(null===t||!t||""===t||null===n||!n||""===n)return;const o={username:t,password:n};fetch("/auth/login",{method:"POST",mode:"cors",cache:"no-cache",credentials:"same-origin",headers:{"Content-Type":"application/json"},referrerPolicy:"no-referrer",body:JSON.stringify(o)}).then((t=>{200!==t.status&&e("Error while processing this request!"),!0===t.redirected&&(document.location.href=t.url)})).catch((t=>{e(t)}))},logout:function(){document.location.href="/auth/logout"},register:function(){const t=document.getElementById("username").value,n=document.getElementById("password").value;if(null===t||!t||""===t||null===n||!n||""===n)return s.addAlert("info","Please, fill out the fields first.",""),void s.show(null,2e3);fetch("/auth/register",{method:"POST",mode:"cors",cache:"no-cache",credentials:"same-origin",headers:{"Content-Type":"application/json"},redirect:"follow",referrerPolicy:"no-referrer",body:JSON.stringify({username:t,password:n})}).then((e=>e.json())).then((t=>{t.error?e(`Server responded with: <u>${t.error}</u>`):(s.clearModal(),s.populateModal("Notification","You have been successfully registered!"),s.show(null,1e3))})).catch((e=>console.log(e)))}}}(),r=new class{state={};set=e=>{this.state={...this.state,...e},this.fire(this.state)};get=()=>this.state;subscribers=[];subscribeAll=e=>{for(const t of e){const{fn:e,that:n}=t;this.subscribe(e,n)}};subscribe=(e,t=null)=>{this.subscribers.push({fn:e,that:t})};fire=e=>{this.subscribers.forEach((({fn:t,that:n})=>{t.call(n,e)}))}};var a=n(8563);!function(){const e="#loader_wrapper";!function(t=null){t?a(e).fadeOut("slow",t):a(e).fadeOut("slow")}()}();var i=n(8563);const s=function(){const e={isOpened:!1},t={ModalContent:"#ModalContent",ModalContainer:".modal_container",CloseModalBtn:".closeModalBtn",ModalTitle:"#modalTitle",ModalBtns:"#ModalBtns",Modal:"#modal"};function n(t){if("boolean"!=typeof t)throw new Error("Invalid type was passed to _setIsOpened function!!!");e.isOpened=!e.isOpened}function o(){i(t.ModalTitle).html(""),i(t.ModalContent).html(""),i(t.ModalBtns).html(""),s("default")}function r(){i(t.ModalContainer).fadeOut(700,(function(){n(!1),o()}))}function a(e=null,o=null,...r){i(t.ModalContainer).fadeOut(700,(function(){n(!1),(e||o)&&("function"!=typeof e||o?e.apply(o,Array.prototype.slice.apply(arguments,[2,arguments.length-1])):e())}))}function s(e=null){i(t.Modal).hasClass("d-flex flex-column justify-content-center")&&i(t.Modal).removeClass("d-flex flex-column justify-content-center"),i(t.ModalContent).hasClass("d-flex flex-column justify-content-center align-items-center")&&i(t.ModalContent).removeClass("d-flex flex-column justify-content-center align-items-center"),i(t.ModalBtns).hasClass("d-flex justify-content-center flex-row")&&i(t.ModalBtns).removeClass("d-flex justify-content-center flex-row")}return i(t.ModalContainer).hide(),i("body").on("click",t.CloseModalBtn,(function(){a(o)})),!i(t.Modal).hasClass("p-4")&&i(t.Modal).addClass("p-4"),{hide:a,show:function(e=null,o=!1){i(t.ModalContainer).fadeIn(700,(function(){n(!0),"function"==typeof e&&e()})),o&&setTimeout((()=>{r()}),o)},clearModal:o,populateModal:function(e,n,o="",r=!0){r?i(t.CloseModalBtn).show():i(t.CloseModalBtn).hide(),i(t.ModalTitle).html(e),i(t.ModalContent).html(n),i(t.ModalBtns).html(o)},getSelectors:function(){return t},hideAndClear:r,addAlert:function(e="warning",n="",o=""){const r=`\n      <div class="alert alert-${e} alert-dismissible fade show" role="alert">\n        <strong>${n}</strong> ${o}\n      </div>\n      `;i(t.ModalContent).prepend(r)},applyStyle:s,isOpened:function(){return e.isOpened}}}();n(1696)},6909:(e,t,n)=>{n(1283),n(7588);var o=n(8361),r=n(2521);const a=function(e){var t;e?.redirect&&(t=e.redirect,window.location.href=t)},i=async function(e){const t=await fetch("/game/user/heroes/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}),n=await t.json();return a(n),n},s=async function(e){const t=await fetch("/game/user/heroes/claim",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}),n=await t.json();return a(n),n},l=async function(e=3){const t=await fetch(`/game/user/heroes/random?num=${e}`,{method:"GET",headers:{"Content-Type":"application/json"}}),n=await t.json();return a(n),n},c=async function(e){const t={hero_id:e},n=await fetch("/game/user/heroes/buy",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),o=await n.json();return a(o),o},d=async function(e){const t=await fetch("/game/user/items/sell",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}),n=await t.json();return a(n),n},u=async function(e){const t={record_id:e},n=await fetch("/game/user/items/buy",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),o=await n.json();return a(o),o},m=async function(e=3){const t=await fetch(`/game/user/items/random?num=${e}`,{method:"GET",headers:{"Content-Type":"application/json"}}),n=await t.json();return a(n),n};var f=n(1696),h=n(8563);const p=function(){const e={usernameInput:document.getElementById("usernameInput"),moneyBtn:h("#moneyBtn")};return{display:function({username:t,money:n}){document.getElementById("WelcomeHeader").textContent=`Welcome! \n${t}`,e.moneyBtn.html(`${n} <i class="bi bi-coin"></i>`)},getUsername:function(){return e.usernameInput.value},setUsername:function(t){e.usernameInput.value=t}}}(),b=new class{reload(){const e=[fetch("/profile"),fetch("/game/user/items"),fetch("/game/user/heroes")];Promise.all(e).then((e=>Promise.all(e.map((e=>e.json()))))).then((e=>{r.Kr.set({items:e[1],profile:e[0],heroes:e[2]})})).catch((e=>console.error(e)))}refetchHeroes(){fetch("/game/user/heroes").then((e=>e.json())).then((e=>{r.Kr.set({heroes:e})}))}refetchItems(){fetch("/game/user/items").then((e=>e.json())).then((e=>{r.Kr.set({items:e})}))}refetchProfile(){fetch("/profile").then((e=>e.json())).then((e=>{r.Kr.set({profile:e})}))}stateChanged({profile:e,items:t,heroes:n}){t&&this.itemsHandler(t),e&&this.profileHandler(e),n&&this.heroesHandler(n)}profileHandler(e){p.display(e),p.setUsername(e.username)}itemsHandler(e){C.displayItems(e)}heroesHandler(e){y.display(e)}};var g=n(8563);const y=function(){const e={heroesContainer:document.getElementById("heroes-container")};return{display:function(t){e.heroesContainer.innerHTML="",e.heroesContainer.insertAdjacentHTML("beforeend",t.map((e=>{return`\n    <div class="single-hero-box col-lg-3 col-md-6 col-sm-12">\n        <div class="hero-box-inner-details">\n            <img src='${(t=e).image}' class="img-thumbnail"/>\n            <p>${t.name}</p>\n            <small>${(({is_available:e,arrivalSeconds:t})=>e?"Resting at home...":!e&&f.q.stillInAdventure(t)?"Having an adventure...":"Waiting for you...")(t)}</small>\n        </div>\n        <div class="d-grid gap-2 mt-2">\n            ${(e=>{if(0===e.is_available&&f.q.stillInAdventure(e.arrivalSeconds)){const n=`${e.hero_record_id}_user_hero`;var t=setInterval((()=>{f.q.stillInAdventure(e.arrivalSeconds)?g(`#${n}`).text(`Arrives in ${f.q.getRemainingSeconds(e.arrivalSeconds)} seconds...`):(b.refetchHeroes(),clearInterval(t))}),1e3);return`<button class="btn btn-warning disabled" id="${n}" data-record_id="${e.hero_record_id}" type="button">Arrives in ${f.q.getRemainingSeconds(e.arrivalSeconds)} seconds...</button>`}return 0!==e.is_available||f.q.stillInAdventure(e.arrivalSeconds)?` <button class="btn btn-warning sendHeroBtn" data-record_id="${e.hero_record_id}" type="button">Send</button>`:`<button class="btn btn-warning claimHeroBtn" data-record_id="${e.hero_record_id}" type="button">Claim Bounty</button>`})(t)}\n        </div>\n    </div>`;var t})).join("")),e.heroesContainer.insertAdjacentHTML("beforeend",'<div class="single-hero-box col-lg-3 col-md-6 col-sm-12" id="addHeroBtn"><div class="hero-box-inner-details h-100"><i class="bi bi-plus-square" style="font-size: 3em;color: #ffc107;"></i></div></div>')},HeroHtml:{heroTraderHTML:e=>`<div class="single-hero-box col-md-4">\n                <div class="hero-box-inner-details">\n                    <img src='${e.image}' class="img-thumbnail"/>\n                    <p>${e.name}</p>\n                </div>\n                <div class="d-grid gap-2 mt-2">\n                    <button class="btn btn-warning buyHeroBtn" data-hero_id="${e.id}"><i class="bi bi-coin"></i> ${e.price}</button>\n                </div>\n            </div>`}}}(),v=function(e){const{item:t,gold:n}=e,o=[];n&&o.push(function(e){return`<p>Your hero brought ${e} <i class="bi bi-coin"></i></p>`}(n)),t&&o.push(C.ItemsHtml.singleItem(t,!0)),t||n||o.push("<h4>Your Hero didn't bring anything...<h4>"),r.u_.clearModal(),r.u_.populateModal("Your Bounty",o.join(""),'<button class="btn btn-warning" id="okayBtn">Okay</button>'),r.u_.show()},w=function(e){let t,n,o;t=e.name,n=C.ItemsHtml.itemInfoHTML(e),o='<button class="btn btn-warning" id="okayBtn">Okay</button>',r.u_.clearModal(),r.u_.populateModal(t,n,'<button class="btn btn-warning" id="okayBtn">Okay</button>'),r.u_.show()},_=async function(){let e,t,n;e='<div class="d-flex flex-row">Trader <i style="margin-left: 10px" id="reloadTraderItemsBtn" class="bi bi-arrow-clockwise"></i></div>';const o=await m(3),a=await l(3),i=o.map((e=>C.ItemsHtml.itemTraderHTML(e))).join("");t=`\n            <div id="traderHeroes" class="row">${a.map((e=>y.HeroHtml.heroTraderHTML(e))).join("")}</div>\n            <div id="traderItems" class="row mt-3">${i}</div>\n        `,n='<button class="btn btn-warning" id="okayBtn">Okay</button>',r.u_.clearModal(),r.u_.populateModal('<div class="d-flex flex-row">Trader <i style="margin-left: 10px" id="reloadTraderItemsBtn" class="bi bi-arrow-clockwise"></i></div>',t,'<button class="btn btn-warning" id="okayBtn">Okay</button>'),r.u_.show()},M=async function(e){const t=r.u_.isOpened();r.u_.clearModal(),r.u_.populateModal("Error",`${e}`,"",!1),!t&&r.u_.show(),setTimeout(r.u_.hideAndClear,1500)},B=function(){r.u_.clearModal(),r.u_.populateModal("Welcome User!",'\n            <h3>Helpful Tips</h3>\n            <p class="mt-3 mb-0"><i class="bi bi-box-arrow-left" style="font-size:1.6em"></i> for logout.</p>\n            <p class="mb-0"><i class="bi bi-wrench" style="font-size:1.6em"></i> to edit your username.</p>\n            <p class="mb-0"><i class="bi bi-trash" style="font-size:1.6em"></i> to delete your account.</p>\n            <p class="mb-0"><i class="bi bi-coin" style="font-size:1.6em"></i> as a local currency.</p>\n            <p class="mb-0"><i class="bi bi-info-circle" style="font-size:1.6em"></i> for item information.</p>\n            <p class="mb-0 mt-5">Go ahead and have an adventure with your Hero!</p>\n        \n        ',""),r.u_.show()};var I=n(8563);const C=function(){const e={itemsContainer:document.getElementById("items-container")},t={singleItem:({image:e,story:t,rarity:n,price:o,record_id:r},a=!1,i=null)=>a?`<div class="col-lg-4 col-sm-6 mb-4">\n                <div class="${n} single-item-box p-4">\n                    <img src='${e}' class="img-thumbnail"/>\n                </div>\n            </div>`:`\n            <div class="col-lg-3 col-md-6 mb-4">\n                <div class="${n} single-item-box p-4">\n                    <img src='${e}' class="img-thumbnail"/>\n                    <p><i>${t?t.substr(0,50):"no story"}...</i></p>\n                    <div class="d-flex justify-content-between">\n                        <button class="btn btn-warning showItemInfoBtn" data-local_arr_idx="${i}">\n                            <i class="bi bi-info-circle"></i>\n                        </button>\n                        <button class="btn btn-warning sellItemBtn" data-local_arr_idx="${i}"  title="Sell">\n                            ${o} <i class="bi bi-coin"></i>\n                        </button>\n                    </div>\n                </div>\n            </div>`,itemInfoHTML:({image:e,desc:t,rarity:n,price:o,record_id:r})=>` \n                <div class="row p-4">\n                    <div class="col-md-4 d-flex justify-content-center align-items-center">\n                        <img src='${e}' class="img-thumbnail"/>\n                    </div>\n                    <div class="col-md-8 d-flex justify-content-center flex-column">\n                        <p><i>${t}...</i></p>\n                        <p>Rarity: ${n} </br> Price: ${o} <i class="bi bi-coin"></i></p>\n                    </div>\n                </div>`,itemTraderHTML:({image:e,desc:t,rarity:n,price:o,id:r})=>` \n                <div class="col-md-4 d-flex flex-column justify-content-center">\n                    <img src='${e}' class="img-thumbnail"/>\n                    <p>Rarity: ${n} </br> Price: ${o} <i class="bi bi-coin"></i></p>\n                    <button class="btn btn-warning buyItemBtn" data-record_id="${r}"><i class="bi bi-cart2"></i></button>\n                </div>\n            `,itemsContainer:e=>`${e.join("\n")}`};return{ItemsHtml:t,displayItems:function(n){e.itemsContainer.innerHTML="";const o=n.map(((e,n)=>t.singleItem(e,!1,n)));e.itemsContainer.insertAdjacentHTML("beforeend",t.itemsContainer(o))},showItemInfo:function(e){let t=void 0===I(I(e.target).parent()).data("local_arr_idx")?I(I(e.target)).data("local_arr_idx"):I(I(e.target).parent()).data("local_arr_idx"),n=r.Kr.get().items[t];w(n)}}}();var T=n(8563);const H=async function(e){const t=await m(3),n=await l(3);T("#traderItems").html(t.map((e=>C.ItemsHtml.itemTraderHTML(e))).join("")),T("#traderHeroes").html(n.map((e=>y.HeroHtml.heroTraderHTML(e))).join(""))},j=async function(e){e.preventDefault(),_()};var $=n(8563);const x=async function(e){const{profile:t}=r.Kr.get(),n={user_id:t.id,hero_record_id:$(e.target).data("record_id")};await i(n),b.refetchHeroes()},k=async function(e){const{profile:t}=r.Kr.get(),n={user_id:t.id,hero_record_id:$(e.target).data("record_id")},o=await s(n);o.success&&(v(o.data),o.data.item&&b.refetchItems(),o.data.gold&&b.refetchProfile())},S=async function(e){const t=$(e.target).data("hero_id")?$(e.target).data("hero_id"):$($(e.target).parent()).data("hero_id");(await c(t)).success?(r.u_.hideAndClear(),b.reload()):M("Not enough money!")},O=async function(e){await _()};var E=n(8563);const P=async function(e){let t=void 0===E(E(e.target).parent()).data("local_arr_idx")?E(E(e.target)).data("local_arr_idx"):E(E(e.target).parent()).data("local_arr_idx");const n=r.Kr.get().items[t],{db_id:o,record_id:a}=n,i={db_id:o,record_id:a};(await d(i)).success||console.error("Error on the back when selling item!"),b.refetchItems(),b.refetchProfile()},A=async function(e){const t=E(e.target).data("record_id")?E(e.target).data("record_id"):E(E(e.target).parent()).data("record_id");await u(t),r.u_.hideAndClear(),b.refetchItems(),b.refetchProfile()},L=async function(){const e=await fetch("/profile",{method:"DELETE",mode:"cors",cache:"no-cache",credentials:"same-origin",referrerPolicy:"no-referrer"}),t=await e.json();return a(t),t},N=async function(e){const t=await fetch("/profile",{method:"PUT",mode:"cors",cache:"no-cache",credentials:"same-origin",headers:{"Content-Type":"application/json"},referrerPolicy:"no-referrer",body:JSON.stringify(e)}),n=await t.json();return a(n),n},K=async function(e){const t={newUsername:p.getUsername()},n=r.Kr.get().profile.username,o=await N(t);if(o.error)return M(o.error),void p.setUsername(n);r.Kr.set({profile:o})},U=async function(e){e.preventDefault();const t=await L();document.location.href=t.redirectUrl};var q=n(8563);!function(){const e={logoutBtn:document.getElementById("logoutBtn"),updateBtn:document.getElementById("updateBtn"),deleteBtn:document.getElementById("deleteBtn"),traderBtn:q("#traderBtn")};e.logoutBtn.addEventListener("click",r.QD.logout),e.updateBtn.addEventListener("click",K),e.deleteBtn.addEventListener("click",U),q("body").on("click","button.sendHeroBtn",x),q("body").on("click","button.claimHeroBtn",k),q("body").on("click","button.buyHeroBtn",S),q("body").on("click","#addHeroBtn",O),q("body").on("click","button.showItemInfoBtn",C.showItemInfo),q("body").on("click","button.sellItemBtn",P),q("body").on("click","button.buyItemBtn",A),e.traderBtn.on("click",j),q("body").on("click","#reloadTraderItemsBtn",H),q("body").on("click","#okayBtn",r.u_.hideAndClear)}(),r.Kr.subscribe(b.stateChanged,b),async function(){o.Z.load(),b.reload(),null===localStorage.getItem("first_time")&&(B(),localStorage.setItem("first_time","false"))}()}},e=>{e.O(0,[563,652],(()=>(6909,e(e.s=6909)))),e.O()}]);