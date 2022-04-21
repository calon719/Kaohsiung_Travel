// 高雄旅遊網

// DOM
const selectBox = document.querySelector('.selectBox');
const contentTitle = document.querySelector('.content-title');
const hotZone = document.querySelector('.hot-list')
const list = document.querySelector('.list');
const zone = document.querySelector('.content-title');
const pageBtn = document.querySelector('.page');


// event
selectBox.addEventListener('change',addPoints,false);
pageBtn.addEventListener('click',changePage,false);

// model 
let pageData = [];
let zoneAll = [];
let zoneRanking = JSON.parse(localStorage.getItem('score')) || [];

let xhr = new XMLHttpRequest();
xhr.open('get','https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json',true);
xhr.send(null);
xhr.onload = function(){
  // event
  selectBox.addEventListener('change',updateList,false);
  hotZone.addEventListener('click',clickHot,false);

  // model
  const data = JSON.parse(xhr.responseText);
  Object.freeze(data);
  const len = data.result.records.length;

  ///// 初始化 /////
  // 將行政區域取出並加入至 select
  function inputSelectBox(){
    //  將行政區域取出並去除重複的值 
    let zoneAry = [];
    for(let i = 0; i < len; i++){
      zoneAry.push(data.result.records[i].Zone);
    };
  let zoneAryRevise = zoneAry.filter((item, index, arr) => {
      return arr.indexOf(item) === index;
  });

  // 帶入全域變數排熱門地區時用
  zoneAll = zoneAryRevise;

  // 加入至 select
  for(let i = 0; i < zoneAryRevise.length; i++){
    let str = document.createElement('option');
    str.textContent = zoneAryRevise[i];
    selectBox.appendChild(str);
  };
};
  inputSelectBox();
  updateList();
  //////

  // 將被選取行政區的資料取出
  function updateList(){
    switch(selectBox.value){
      case '- - 請選擇行政區- -':
        let pageAll = [];
        for(let i = 0; i < len; i++){
          pageAll.push(data.result.records[i]);
        };
        pageData = pageAll;
        contentTitle.innerHTML = `<h2>高雄全區</h2>`;

        showPageBtn();
        pageDefault();
        break;
    default:
      let str = '';
      let page = [];
      for(let i = 0; i < len; i++){
        if(data.result.records[i].Zone === selectBox.value){
            page.push(data.result.records[i]);
          };
      };
      pageData = page;
      contentTitle.innerHTML = `<h2>${selectBox.value}</h2>`;
      list.innerHTML = str;

      showPageBtn();
      pageDefault();
      break;
    };

    if(zoneRanking.length < 1){
      rankDefault();
    }else{
      hotZoneView();
    };
  };

  function clickHot(e){
    e.preventDefault();
    if(e.target.nodeName !== 'A'){return};
  
    let hotZone = e.target.text;
    let str = '';
        let page = [];
        for(let i = 0; i < len; i++){
          if(data.result.records[i].Zone === hotZone){
              page.push(data.result.records[i]);
            };
        };
        pageData = page;
        contentTitle.innerHTML = `<h2>${hotZone}</h2>`;
        list.innerHTML = str;
  
        showPageBtn();
        pageDefault();
  }
};

// page 分頁
function showPageBtn(){
  // 每頁10筆資料所需頁數
  let index = Math.ceil(pageData.length/10);
  // btn
  let str = '';
  for(let i = 0; i < index; i++){
    let txt = 
      `<li>
        <a data-index="${i}" href="#">${i+1}</a>
      </li>`;
    str += txt;
  };
  pageBtn.innerHTML = str;
  
  const btn = document.querySelectorAll('.page a');
  // 第1頁為預設樣式
  btn[0].setAttribute('class','page-now');
};
function changePage(e){
  e.preventDefault();
  if(e.target.nodeName !== 'A'){return};

  // 清除 page-num 所有 class 後在所按下的 a 加上當前分頁 class 樣式
  const num = document.querySelectorAll('.page a');
  for(let i = 0; i < num.length; i++){
    num[i].classList.remove('page-now');
  };
  e.target.setAttribute('class','page-now');

  // 將取得的值轉為 number
  // 取出每頁 10 筆資料
  let page = parseInt(e.target.dataset.index);
  const items = 10;
  // 第 1 頁為 0 ~ 9 筆資料  第 2 頁為 10 ~ 20 筆以此類推
  let indexStart = page*items; 
  let indexEnd = (page+1)*items;
  let str = '';
  for(let i = indexStart; i < indexEnd; i++){
    // 尾頁資料數 < 10 時停止迴圈
    if(i >= pageData.length){break;};
    let txt = 
      `<li class="card">
        <div class="card-top" style="background: url(${pageData[i].Picture1}); ">
          <h4>${pageData[i].Name}</h4>
          <p>${pageData[i].Zone}</p>
        </div>
        <div class="card-txt">
          <p><img src="images/icons_clock.png">${pageData[i].Opentime}</p>
          <p><img src="images/icons_pin.png">${pageData[i].Add}</p>
          <p><img src="images/icons_phone.png">${pageData[i].Tel}</p>
          <p><img src="images/icons_tag.png">${pageData[i].Ticketinfo}</p>
        </div>
      </li>`;
    str += txt;
    
  };
  list.innerHTML = str;
};
function pageDefault(){
  const items = 10;
  let indexStart = 0*items;
  let indexEnd = 1*items;
  let str = '';
  for(let i = indexStart; i < indexEnd; i++){
    if(i >= pageData.length){break;};
    let txt = 
    `<li class="card">
      <div class="card-top" style="background: url(${pageData[i].Picture1}); ">
        <h4>${pageData[i].Name}</h4>
        <p>${pageData[i].Zone}</p>
      </div>
      <div class="card-txt">
        <p><img src="images/icons_clock.png">${pageData[i].Opentime}</p>
        <p><img src="images/icons_pin.png">${pageData[i].Add}</p>
        <p><span><img src="images/icons_phone.png"></span>${pageData[i].Tel}</p>
        <p><img src="images/icons_tag.png">${pageData[i].Ticketinfo}</p>
      </div>
    </li>`;
    str += txt;
  };
  list.innerHTML = str;
};

// 帶入行政區與初始分數
function rankDefault(){
  let ary = [];
  for(let i = 0; i < zoneAll.length; i++){
    let rankData = {
      zone: zoneAll[i],
      score: 0
    };
    ary.push(rankData);
  }
  zoneRanking = ary;
};

// 每被選到一次 score += 1 並存入 localStorage
function addPoints(e){
  for(let i = 0; i < zoneRanking.length; i++){
    if(e.target.value === zoneRanking[i].zone){
      zoneRanking[i].score += 1;
    };
  };
  
  // 降序排序
  zoneRanking = zoneRanking.sort(function sortNum(a,b) {
    return b.score > a.score ? 1 : -1;
    });

  localStorage.setItem('score',JSON.stringify(zoneRanking));

  hotZoneView();
};

// 顯示前五名熱門行政區 btn 並點其 btn 會顯示其資料
function hotZoneView(){
  let str = '';
  for(let i = 0; i <= 4; i++){
    if(zoneRanking[i].score > 0){
      let txt = `<li>
                      <a data-num="${i}" href="#">${zoneRanking[i].zone}</a>
                    </li>`;
      str += txt;
    }
  };
  hotZone.innerHTML = str;
};
