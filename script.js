// ===== lucide 아이콘 초기화 =====
if (typeof lucide !== 'undefined') {
  lucide.createIcons();
}

// ===== 네비게이션 스크롤 효과 =====
window.addEventListener('scroll', function() {
  var navbar = document.querySelector('.navbar');
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});

// ===== 모바일 메뉴 토글 =====
var menuToggle = document.querySelector('.menu-toggle');
var navMenu = document.querySelector('.nav-menu');
if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', function() {
    navMenu.classList.toggle('active');
  });
}

// ===== K-Startup API 키 =====
var API_KEY = '64d0fe97b66aa02faf40b18c610a3ccbad74d584bd3cc7274ce60c5080081db5';

// ===== D-day 계산 =====
function getDday(dateStr) {
  if (!dateStr) return 999;
  var y = dateStr.substring(0,4);
  var m = dateStr.substring(4,6);
  var d = dateStr.substring(6,8);
  var end = new Date(y + '-' + m + '-' + d);
  var today = new Date();
  today.setHours(0,0,0,0);
  var diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

function formatDate(dateStr) {
  if (!dateStr || dateStr.length < 8) return '';
  return dateStr.substring(0,4) + '-' + dateStr.substring(4,6) + '-' + dateStr.substring(6,8);
}

// ===== col name 방식 XML 파싱 =====
function getColVal(item, name) {
  var cols = item.querySelectorAll('col');
  for (var i = 0; i < cols.length; i++) {
    if (cols[i].getAttribute('name') === name) {
      return cols[i].textContent.trim();
    }
  }
  return '';
}

// ===== K-Startup API 호출 =====
function fetchKStartupData(sido, keyword) {
  var url = 'https://nidapi.k-startup.go.kr/api/kisedKstartupService/v1/getAnnouncementInformation'
    + '?serviceKey=' + encodeURIComponent(API_KEY)
    + '&pageNo=1'
    + '&numOfRows=12'
    + '&rcrt_prgs_yn=Y';

  if (sido) url += '&supt_regin=' + encodeURIComponent(sido);
  if (keyword) url += '&pbanc_nm=' + encodeURIComponent(keyword);

  return fetch(url)
    .then(function(res) { return res.text(); })
    .then(function(text) {
      var parser = new DOMParser();
      var xml = parser.parseFromString(text, 'application/xml');
      var items = xml.querySelectorAll('item');
      var result = [];
      items.forEach(function(item) {
        result.push({
          title: getColVal(item, 'pbanc_nm') || getColVal(item, 'intg_pbanc_biz_nm'),
          org: getColVal(item, 'biz_prch_dprt_nm') || getColVal(item, 'sprv_inst'),
          startDate: getColVal(item, 'pbanc_rcpt_bang_dt'),
          endDate: getColVal(item, 'pbanc_rcpt_end_dt'),
          region: getColVal(item, 'supt_regin'),
          url: getColVal(item, 'detl_pg_url') || getColVal(item, 'biz_gdnc_url') || '#'
        });
      });
      return result;
    })
    .catch(function(err) {
      console.error('API 오류:', err);
      return [];
    });
}

// ===== 슬라이더 상태 =====
var sliderItems = [];
var sliderPage = 0;
var sliderPerPage = 4;

function renderSlider() {
  var list = document.getElementById('fundingList');
  if (!list) return;

  var total = sliderItems.length;
  var totalPages = Math.ceil(total / sliderPerPage);
  var start = sliderPage * sliderPerPage;
  var pageItems = sliderItems.slice(start, start + sliderPerPage);

  var cardsHtml = pageItems.map(function(item) {
    var dday = getDday(item.endDate);
    var ddayText = dday === 999 ? '상시' : 'D-' + dday;
    var ddayColor = dday <= 7 ? '#ef4444' : '#00A896';
    var title = item.title || '공고명 없음';
    if (title.length > 40) title = title.substring(0, 40) + '…';

    return '<a href="' + item.url + '" target="_blank" style="text-decoration:none; flex:0 0 calc(25% - 12px); min-width:200px;">'
      + '<div style="background:#ffffff; border-radius:16px; padding:24px 20px; height:180px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 2px 12px rgba(0,0,0,0.08); transition:transform 0.2s; cursor:pointer;" onmouseover="this.style.transform=\'translateY(-4px)\'" onmouseout="this.style.transform=\'translateY(0)\'">'
      + '<div>'
      + '<p style="color:#1e293b; font-size:15px; font-weight:700; line-height:1.5; margin:0 0 12px;">' + title + '</p>'
      + '</div>'
      + '<div>'
      + '<p style="color:#94a3b8; font-size:12px; margin:0 0 6px;">신청기간</p>'
      + '<div style="display:flex; justify-content:space-between; align-items:center;">'
      + '<p style="color:#64748b; font-size:12px; margin:0;">' + formatDate(item.startDate) + ' ~ ' + formatDate(item.endDate) + '</p>'
      + '<span style="color:' + ddayColor + '; font-size:18px; font-weight:800;">' + ddayText + '</span>'
      + '</div>'
      + '</div>'
      + '</div>'
      + '</a>';
  }).join('');

  var prevDisabled = sliderPage === 0;
  var nextDisabled = sliderPage >= totalPages - 1;

  list.innerHTML = '<div style="position:relative;">'
    + '<div style="display:flex; justify-content:flex-end; margin-bottom:16px;">'
    + '<span style="color:#64748b; font-size:14px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:4px;">⊕ 더보기</span>'
    + '</div>'
    + '<div style="display:flex; align-items:center; gap:8px;">'
    + '<button onclick="slidePrev()" style="background:' + (prevDisabled ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.2)') + '; border:none; border-radius:50%; width:36px; height:36px; color:' + (prevDisabled ? '#94a3b8' : '#1e293b') + '; font-size:18px; cursor:' + (prevDisabled ? 'default' : 'pointer') + '; flex-shrink:0; display:flex; align-items:center; justify-content:center;">‹</button>'
    + '<div style="display:flex; gap:16px; flex:1; overflow:hidden;">'
    + cardsHtml
    + '</div>'
    + '<button onclick="slideNext()" style="background:' + (nextDisabled ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.2)') + '; border:none; border-radius:50%; width:36px; height:36px; color:' + (nextDisabled ? '#94a3b8' : '#1e293b') + '; font-size:18px; cursor:' + (nextDisabled ? 'default' : 'pointer') + '; flex-shrink:0; display:flex; align-items:center; justify-content:center;">›</button>'
    + '</div>'
    + '</div>';
}

function slidePrev() {
  if (sliderPage > 0) {
    sliderPage--;
    renderSlider();
  }
}

function slideNext() {
  var totalPages = Math.ceil(sliderItems.length / sliderPerPage);
  if (sliderPage < totalPages - 1) {
    sliderPage++;
    renderSlider();
  }
}

// ===== 공고 필터링 및 화면 표시 =====
function filterAndShowFunding() {
  var sidoEl = document.getElementById('regionSido');
  var sigunguEl = document.getElementById('regionSigungu');
  var interestEl = document.getElementById('interest');
  var resultSection = document.getElementById('fundingResults');
  var list = document.getElementById('fundingList');

  if (!resultSection || !list) return;

  var sido = sidoEl ? sidoEl.value : '';
  var sigungu = sigunguEl ? sigunguEl.value : '';
  var interest = interestEl ? interestEl.value : '';

  if (!sigungu) {
    resultSection.style.display = 'none';
    return;
  }

  resultSection.style.display = 'block';
  list.innerHTML = '<p style="text-align:center; color:rgba(255,255,255,0.6); padding:24px;">🔍 공고를 검색 중입니다...</p>';

  var categoryMap = {
    'startup': '창업',
    'r&d': 'R&D',
    'marketing': '수출',
    'hiring': '고용',
    'finance': '융자'
  };
  var keyword = (interest && categoryMap[interest]) ? categoryMap[interest] : '';

  fetchKStartupData(sido, keyword).then(function(items) {
    if (!items || items.length === 0) {
      list.innerHTML = '<p style="text-align:center; color:rgba(255,255,255,0.5); padding:24px; background:rgba(255,255,255,0.05); border-radius:12px;">해당 조건의 공고가 없습니다.<br>다른 조건을 선택해보세요.</p>';
      return;
    }
    sliderItems = items;
    sliderPage = 0;
    renderSlider();
  });
}

// ===== 시/군/구 데이터 =====
var sigunguData = {
  "서울특별시": ["종로구","중구","용산구","성동구","광진구","동대문구","중랑구","성북구","강북구","도봉구","노원구","은평구","서대문구","마포구","양천구","강서구","구로구","금천구","영등포구","동작구","관악구","서초구","강남구","송파구","강동구"],
  "부산광역시": ["중구","서구","동구","영도구","부산진구","동래구","남구","북구","해운대구","사하구","금정구","강서구","연제구","수영구","사상구","기장군"],
  "대구광역시": ["중구","동구","서구","남구","북구","수성구","달서구","달성군","군위군"],
  "인천광역시": ["중구","동구","미추홀구","연수구","남동구","부평구","계양구","서구","강화군","옹진군"],
  "광주광역시": ["동구","서구","남구","북구","광산구"],
  "대전광역시": ["동구","중구","서구","유성구","대덕구"],
  "울산광역시": ["중구","남구","동구","북구","울주군"],
  "세종특별자치시": ["세종시 전체"],
  "경기도": ["수원시","성남시","의정부시","안양시","부천시","광명시","평택시","동두천시","안산시","고양시","과천시","구리시","남양주시","오산시","시흥시","군포시","의왕시","하남시","용인시","파주시","이천시","안성시","김포시","화성시","광주시","양주시","포천시","여주시","연천군","가평군","양평군"],
  "강원특별자치도": ["춘천시","원주시","강릉시","동해시","태백시","속초시","삼척시","홍천군","횡성군","영월군","평창군","정선군","철원군","화천군","양구군","인제군","고성군","양양군"],
  "충청북도": ["청주시","충주시","제천시","보은군","옥천군","영동군","증평군","진천군","괴산군","음성군","단양군"],
  "충청남도": ["천안시","공주시","보령시","아산시","서산시","논산시","계룡시","당진시","금산군","부여군","서천군","청양군","홍성군","예산군","태안군"],
  "전북특별자치도": ["전주시","군산시","익산시","정읍시","남원시","김제시","완주군","진안군","무주군","장수군","임실군","순창군","고창군","부안군"],
  "전라남도": ["목포시","여수시","순천시","나주시","광양시","담양군","곡성군","구례군","고흥군","보성군","화순군","장흥군","강진군","해남군","영암군","무안군","함평군","영광군","장성군","완도군","진도군","신안군"],
  "경상북도": ["포항시","경주시","김천시","안동시","구미시","영주시","영천시","상주시","문경시","경산시","의성군","청송군","영양군","영덕군","청도군","고령군","성주군","칠곡군","예천군","봉화군","울진군","울릉군"],
  "경상남도": ["창원시","진주시","통영시","사천시","김해시","밀양시","거제시","양산시","의령군","함안군","창녕군","고성군","남해군","하동군","산청군","함양군","거창군","합천군"],
  "제주특별자치도": ["제주시","서귀포시"]
};

function updateSigungu() {
  var sido = document.getElementById('regionSido').value;
  var sigunguSelect = document.getElementById('regionSigungu');
  sigunguSelect.innerHTML = '<option value="" disabled selected>시/군/구 선택</option>';
  if (sigunguData[sido]) {
    sigunguData[sido].forEach(function(sg) {
      var opt = document.createElement('option');
      opt.value = sg;
      opt.textContent = sg;
      sigunguSelect.appendChild(opt);
    });
  }
  var resultSection = document.getElementById('fundingResults');
  if (resultSection) resultSection.style.display = 'none';
}

// ===== 이벤트 바인딩 =====
window.onload = function() {
  var sigunguEl = document.getElementById('regionSigungu');
  var interestEl = document.getElementById('interest');
  if (sigunguEl) sigunguEl.addEventListener('change', filterAndShowFunding);
  if (interestEl) interestEl.addEventListener('change', filterAndShowFunding);
  if (typeof lucide !== 'undefined') lucide.createIcons();
};

// ===== 사전 등록 폼 제출 =====
function submitWaitlist(e) {
  e.preventDefault();
  var biz = document.getElementById('bizNum').value;
  var email = document.getElementById('emailAddr').value;
  var phone = document.getElementById('phoneNum').value;
  var sido = document.getElementById('regionSido').value;
  var sigungu = document.getElementById('regionSigungu').value;
  var interest = document.getElementById('interest').value;
  if (!email || !interest || !sido || !sigungu) {
    alert('필수 항목을 입력해 주세요.');
    return;
  }
  var btn = document.querySelector('#waitlistForm button[type="submit"]');
  btn.textContent = '등록 중...';
  btn.disabled = true;
  fetch('https://script.google.com/macros/s/AKfycbxWbDq8ax0CaVBfQqwt5GlvgKLQf8yVZCdAhtTR3MVgydKKh3QScR1ZLDTR2-s8cuxw/exec', {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bizNum: biz, email: email, phone: phone, sido: sido, sigungu: sigungu, interest: interest })
  })
  .then(function() {
    document.getElementById('waitlistForm').style.display = 'none';
    document.getElementById('waitlistSuccess').style.display = 'block';
  })
  .catch(function() {
    alert('오류가 발생했습니다. 다시 시도해주세요.');
    btn.textContent = '무료로 맞춤 지원금 사전 등록하기';
    btn.disabled = false;
  });
}

// ===== FAQ 토글 =====
function toggleFaq(btn) {
  var item = btn.parentElement;
  item.classList.toggle('open');
}
