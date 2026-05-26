// ===== 네비게이션 스크롤 효과 =====
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});

// ===== 모바일 메뉴 토글 =====
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', function() {
    navMenu.classList.toggle('active');
  });
}

// ===== 스크롤 애니메이션 =====
const scrollElems = document.querySelectorAll('.scroll-anim');
const observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.1 });
scrollElems.forEach(function(el) { observer.observe(el); });

// ===== lucide 아이콘 초기화 =====
if (typeof lucide !== 'undefined') {
  lucide.createIcons();
}

// ===== Mock Data: 가짜 지원금 공고 10개 =====
const mockFundingData = [
  {
    id: 1,
    title: "2026년 소상공인 경영안정 지원사업",
    org: "서울특별시 종로구",
    sido: "서울특별시",
    sigungu: "종로구",
    category: "finance",
    amount: "최대 500만원",
    deadline: "2026-06-30",
    desc: "소상공인의 경영 안정을 위한 저금리 융자 지원 사업입니다."
  },
  {
    id: 2,
    title: "청년 창업 활성화 지원금",
    org: "서울특별시 관악구",
    sido: "서울특별시",
    sigungu: "관악구",
    category: "startup",
    amount: "최대 1,000만원",
    deadline: "2026-07-15",
    desc: "39세 이하 청년 창업자를 위한 초기 창업 자금 지원 사업입니다."
  },
  {
    id: 3,
    title: "중소기업 R&D 기술개발 지원",
    org: "경기도 수원시",
    sido: "경기도",
    sigungu: "수원시",
    category: "r&d",
    amount: "최대 3,000만원",
    deadline: "2026-08-01",
    desc: "중소기업의 기술 경쟁력 강화를 위한 R&D 비용 지원 사업입니다."
  },
  {
    id: 4,
    title: "소상공인 고용창출 장려금",
    org: "부산광역시 해운대구",
    sido: "부산광역시",
    sigungu: "해운대구",
    category: "hiring",
    amount: "1인당 월 80만원",
    deadline: "2026-09-30",
    desc: "신규 직원 채용 시 인건비 일부를 지원하는 고용 장려 사업입니다."
  },
  {
    id: 5,
    title: "수출 중소기업 마케팅 지원",
    org: "인천광역시 남동구",
    sido: "인천광역시",
    sigungu: "남동구",
    category: "marketing",
    amount: "최대 2,000만원",
    deadline: "2026-06-15",
    desc: "해외 진출을 희망하는 중소기업 마케팅 비용 지원 사업입니다."
  },
  {
    id: 6,
    title: "전통시장 상인 디지털 전환 지원",
    org: "서울특별시 종로구",
    sido: "서울특별시",
    sigungu: "종로구",
    category: "startup",
    amount: "최대 300만원",
    deadline: "2026-07-31",
    desc: "전통시장 상인의 온라인 판로 개척을 위한 디지털 전환 지원 사업입니다."
  },
  {
    id: 7,
    title: "대전 스타트업 육성 프로그램",
    org: "대전광역시 유성구",
    sido: "대전광역시",
    sigungu: "유성구",
    category: "startup",
    amount: "최대 5,000만원",
    deadline: "2026-08-20",
    desc: "IT·바이오 분야 스타트업 집중 육성 지원 프로그램입니다."
  },
  {
    id: 8,
    title: "경기도 소상공인 임대료 지원",
    org: "경기도 성남시",
    sido: "경기도",
    sigungu: "성남시",
    category: "finance",
    amount: "월 최대 50만원",
    deadline: "2026-10-31",
    desc: "경기침체로 어려움을 겪는 소상공인 임대료 부담 경감 지원 사업입니다."
  },
  {
    id: 9,
    title: "광주 제조업 스마트공장 구축 지원",
    org: "광주광역시 광산구",
    sido: "광주광역시",
    sigungu: "광산구",
    category: "r&d",
    amount: "최대 1억원",
    deadline: "2026-07-01",
    desc: "제조업 스마트공장 구축을 위한 설비 및 솔루션 도입 비용 지원입니다."
  },
  {
    id: 10,
    title: "부산 관광·외식업 홍보 마케팅 지원",
    org: "부산광역시 중구",
    sido: "부산광역시",
    sigungu: "중구",
    category: "marketing",
    amount: "최대 500만원",
    deadline: "2026-09-01",
    desc: "관광·외식업 소상공인의 SNS·온라인 홍보 비용 지원 사업입니다."
  }
];

// ===== 지원금 필터링 및 화면 표시 =====
function filterAndShowFunding() {
  const sido = document.getElementById('regionSido') ? document.getElementById('regionSido').value : '';
  const sigungu = document.getElementById('regionSigungu') ? document.getElementById('regionSigungu').value : '';
  const interest = document.getElementById('interest') ? document.getElementById('interest').value : '';
  const resultSection = document.getElementById('fundingResults');

  if (!resultSection) return;

  // 필터 조건 없으면 숨김
  if (!sido && !sigungu) {
    resultSection.style.display = 'none';
    return;
  }

  // 필터링
  let filtered = mockFundingData.filter(function(item) {
    const sidoMatch = sido ? item.sido === sido : true;
    const sigunguMatch = sigungu ? item.sigungu === sigungu : true;
    const categoryMatch = interest ? item.category === interest : true;
    return sidoMatch && sigunguMatch && categoryMatch;
  });

  // 결과 표시
  resultSection.style.display = 'block';
  const list = document.getElementById('fundingList');
  if (!list) return;

  if (filtered.length === 0) {
    list.innerHTML = '<p style="text-align:center; color:rgba(255,255,255,0.5); padding:24px;">해당 지역의 공고가 없습니다. 다른 지역을 선택해보세요.</p>';
    return;
  }

  list.innerHTML = filtered.map(function(item) {
    const dday = getDday(item.deadline);
    return `
      <div style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:12px; padding:20px; margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; flex-wrap:wrap;">
          <div style="flex:1;">
            <span style="background:#00A896; color:#fff; font-size:11px; font-weight:700; padding:2px 8px; border-radius:4px; margin-bottom:8px; display:inline-block;">${item.org}</span>
            <h4 style="color:#ffffff; font-size:15px; font-weight:700; margin:6px 0 6px;">${item.title}</h4>
            <p style="color:rgba(255,255,255,0.6); font-size:13px; margin:0 0 8px;">${item.desc}</p>
            <span style="color:#F59E0B; font-weight:700; font-size:14px;">💰 ${item.amount}</span>
          </div>
          <div style="text-align:center; flex-shrink:0;">
            <div style="background:${dday <= 7 ? '#ef4444' : '#1e3a8a'}; color:#fff; border-radius:8px; padding:8px 14px; font-size:13px; font-weight:700;">
              D-${dday}
            </div>
            <div style="color:rgba(255,255,255,0.4); font-size:11px; margin-top:4px;">${item.deadline}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function getDday(deadline) {
  const today = new Date();
  const end = new Date(deadline);
  const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

// 시/군/구 변경 시 필터링 자동 실행
document.addEventListener('DOMContentLoaded', function() {
  const sigunguSelect = document.getElementById('regionSigungu');
  const interestSelect = document.getElementById('interest');
  if (sigunguSelect) {
    sigunguSelect.addEventListener('change', filterAndShowFunding);
  }
  if (interestSelect) {
    interestSelect.addEventListener('change', filterAndShowFunding);
  }
});

// ===== 시/군/구 데이터 =====
const sigunguData = {
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
  const sido = document.getElementById('regionSido').value;
  const sigunguSelect = document.getElementById('regionSigungu');
  sigunguSelect.innerHTML = '<option value="" disabled selected>시/군/구 선택</option>';
  if (sigunguData[sido]) {
    sigunguData[sido].forEach(function(sg) {
      const opt = document.createElement('option');
      opt.value = sg;
      opt.textContent = sg;
      sigunguSelect.appendChild(opt);
    });
  }
}

function submitWaitlist(e) {
  e.preventDefault();
  const biz = document.getElementById('bizNum').value;
  const email = document.getElementById('emailAddr').value;
  const phone = document.getElementById('phoneNum').value;
  const sido = document.getElementById('regionSido').value;
  const sigungu = document.getElementById('regionSigungu').value;
  const interest = document.getElementById('interest').value;
  if (!email || !interest || !sido || !sigungu) {
    alert('필수 항목을 입력해 주세요.');
    return;
  }
  const btn = document.querySelector('#waitlistForm button[type="submit"]');
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
