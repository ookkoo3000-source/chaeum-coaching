(function () {
  "use strict";

  // ---- mobile menu ----
  var mb = document.querySelector(".menu-btn");
  var mn = document.getElementById("mobileNav");
  if (mb && mn) {
    mb.addEventListener("click", function () {
      var open = mn.classList.toggle("open");
      mb.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // ---- reveal on scroll ----
  var els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add("in"); });
  }

  // ---- phone auto-format ----
  var phone = document.getElementById("f-phone");
  if (phone) {
    phone.addEventListener("input", function () {
      var v = this.value.replace(/\D/g, "").slice(0, 11);
      if (v.length > 7) this.value = v.slice(0, 3) + "-" + v.slice(3, 7) + "-" + v.slice(7);
      else if (v.length > 3) this.value = v.slice(0, 3) + "-" + v.slice(3);
      else this.value = v;
    });
  }

  // ---- form submit via fetch ----
  var form = document.getElementById("applyForm");
  var msg = document.getElementById("formMsg");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var honey = form.querySelector('[name="_honey"]');
      if (honey && honey.value) return;
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = "전송 중…";
      msg.className = "form-msg";
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      }).then(function (r) {
        if (r.ok) {
          form.reset();
          msg.textContent = "신청이 접수되었습니다. 담당자가 곧 연락드리겠습니다.";
          msg.className = "form-msg ok";
          btn.textContent = "신청 완료";
        } else {
          throw new Error("bad response");
        }
      }).catch(function () {
        msg.textContent = "전송에 실패했습니다. 010-3131-5305로 전화 주시면 바로 도와드리겠습니다.";
        msg.className = "form-msg err";
        btn.disabled = false;
        btn.textContent = "무료 학습진단 신청하기";
      });
    });
  }

  // ---- center finder (centers.html) ----
  var centerGrid = document.getElementById("centerGrid");
  if (centerGrid) {
    // 실제로 확인된 지점만 등록합니다. 새 지점 정보가 오면 이 배열에 추가하세요.
    var CENTERS = [
      { name: "원흥점", region: "경기", city: "경기 고양시 덕양구", address: "경기 고양시 덕양구 권율대로 672 원흥역봄오피스텔 2층 217호", note: "원흥역 1번 출구 앞, 1층 베스킨라빈스 건물 2층", schools: ["원흥초","삼송초","고양동산초","원흥중","고양중","고양동산고","도래울고"], reg: "고양교육지원청 등록 제6096호", director: "이원희" },
      { name: "첨단점", region: "경상·전라", city: "광주 광산구", address: "광주 광산구 월계로 191 첨단메디컬빌딩 4층 404호", note: "1층 김가네와 쿼드커피 사이 입구, 엘리베이터에서 내려 바로 오른쪽", schools: ["월봉초","월계초","봉산초","산월초","첨단초","신용초","천곡중","월봉중","봉산중","첨단중","신용중","숭덕고","비아고","빛고을고","장덕고"], reg: "광주서부교육지원청 등록 제7200호", director: "남현주" },
      { name: "논현점", region: "서울·인천", city: "인천 남동구", address: "인천 남동구 청능대로 559 2층", note: "논현역 3번 출구 직진 200m, 논현메디컬센터 2층", schools: ["동방초","은봉초","원동초","논현초","소래초","동방중","고잔중","남동고","논현고","송천고","고잔고"], reg: "인천동부교육지원청 등록 제3283호", director: "김윤심" },
      { name: "내발산점", region: "서울·인천", city: "서울 강서구", address: "서울 강서구 마곡중앙4로 74 이웰메디파크 4층 401·402호", note: "내발산역~우장산역 방향 육교 앞 건물, 1층 커피숍·딤채", schools: ["등명초","내발산초","등명중","화곡중","명덕여중","덕원중","화곡고","명덕고","명덕여고","덕원여고","등촌고","경복여고"], reg: "강서양천교육지원청 등록 제5444호", director: "양정원" },
      { name: "상동점", region: "경기", city: "경기 부천시 원미구", address: "경기 부천시 원미구 송내대로265번길 67 월드컵타운 305호", note: "상동역 7호선 6번 출구 100m, 사거리 좌회전 50m 대림타운", schools: ["석천초","상일초","상인초","석천중","상일중","중원중","부명중","중원고","상원고","중흥고","상일고","부명고","송내고"], reg: "부천교육지원청 등록 제5950호", director: "박경숙" },
      { name: "배곧점", region: "경기", city: "경기 시흥시", address: "경기 시흥시 배곧4로 22 배곧타운2 217호", schools: ["배곧초","배곧라온초","배곧라라초","함현초","배곧중","배곧라라중","배곧고","함현고","서해고"], reg: "경기도시흥교육지원청 제 시1653호", director: "정란" },
      { name: "마포2호점", region: "서울·인천", city: "서울 마포구", address: "서울 마포구 토정로 252 승지빌딩 3층", note: "대흥역 3번 출구 5분 거리, 1층 기아자동차 AS센터 건물", schools: ["신석초","염리초","용강초","서강초","서울여중","동도중","신수중","서울여고","숭문고","광성고"], reg: "서울특별시 서부교육지원청 제02202300102호", director: "선명도" },
      { name: "반월당점", region: "경상·전라", city: "대구 중구", address: "대구 중구 대봉로 253 3층", note: "센트로팰리스 대백마트 맞은편", schools: ["대구초","사대부초","동덕초","삼덕초","대구제일중","경북대사대부중","사대부고","경북여고","대구고","경북예고"], reg: "대구광역시동부교육지원청 제6834호", director: "박민아" },
      { name: "신중동점", region: "경기", city: "경기 부천시 원미구", address: "경기 부천시 원미구 조마루로291번길 25 센터프라자 405·406호", schools: ["부곡초","계남초","심원초","심곡초","부천중앙초","심원중","계남중","부곡중","부천중","계남고","심원고","원미고"], reg: "부천교육지원청 등록 제6330호", director: "최혜민" },
      { name: "갈산점", region: "경기", city: "경기 이천시", address: "경기 이천시 갈산동 영창로 314 주공프라자 504호", schools: ["안흥초","설봉초","이천중","설봉중","증포중","이천제일고","이현고"], reg: "이천교육지원청 등록 제1127호", director: "김지선" },
      { name: "관평점", region: "대전·충청", city: "대전 유성구", address: "대전 유성구 관평2로 46 밸리타운 501호", note: "동화중학교 맞은편, 주민센터 뒷 건물", schools: ["동화초","관평초","배울초","대전용산초","동화중","관평중","두리중","중일고","대전용산고","용산고"], reg: "대전서부교육지원청 등록 제 서4761호", director: "박은경" },
      { name: "강릉교동점", region: "강원·제주", city: "강원 강릉시", address: "강원특별자치도 강릉시 정원로 44 202호", schools: ["율곡초","경포초","유천초","관동중","율곡중","해람중","솔올중","강일여고","강릉여고","명륜고","강릉제일고"], reg: "강릉교육지원청 등록 제1386호", director: "김태훈" },
      { name: "별내중앙점 (모두오름)", region: "경기", city: "경기 남양주시", address: "경기 남양주시 별내3로 66 401호", note: "우체국과 홈플러스 사이 건물 4층", schools: ["한별초","화접중","한별중","별내고"], reg: "경기도구리남양주교육지원청 제5006호", director: "박선욱·정호윤·김명진" },
      { name: "알파시티점", region: "경상·전라", city: "대구 수성구", address: "대구 수성구 알파시티2로 19 알파N시티 2층 201호", schools: ["노변초","고산초","노변중","고산중","매호중","시지고","덕원고"], reg: "대구광역시동부교육지원청 제6562호", director: "지혜영" },
      { name: "화정점 (더블유플러스)", region: "경기", city: "경기 고양시 덕양구", address: "경기 고양시 덕양구 화중로 32-31 효원빌딩 401호", schools: ["지도초","화정중","백양중","화정고","백양고"], reg: "고양교육지원청 등록 제6077호", director: "한민진" },
      { name: "지족점", region: "대전·충청", city: "대전 유성구", address: "대전 유성구 지족동 910-7 401호", note: "노은역 동광장 다이소 맞은편", schools: ["상지초","지족초","노은초","지족중","노은중","반석고","지족고","노은고","유성여고"], reg: "대전서부교육지원청 등록 제 서4241호", director: "라미영" },
      { name: "대구역점", region: "경상·전라", city: "대구 중구", address: "대구 중구 서성로 99 대구역센트럴자이 상가 302호", note: "수창공원 맞은편, 1층 몬스터커피 왼쪽 건물 3층", schools: ["수창초","달성초","종로초","계성중","성명여중","사대부중","경일중","사대부고","신명고","경명여고","칠성고","대구제일고"], reg: "대구광역시동부교육지원청 제6571호", director: "박민아" },
      { name: "오산점", region: "경기", city: "경기 오산시", address: "경기 오산시 성호대로 121 월드타워 505호", note: "오산시청 우리은행 건물 5층", schools: ["운암초","성호초","성산초","운산초","운암중","운천중","성호중","원일중","운암고","운천고"], reg: "화성오산교육지원청 등록 제2840호", director: "권희화" },
      { name: "신방점", region: "대전·충청", city: "충남 천안시 동남구", address: "충남 천안시 동남구 신방동 886 학산프라자 A동 304·305호", schools: ["신용초","용소초","수곡초","신촌초","용곡초","용곡중","신방중","청수고","쌍용고","천안여고"], reg: "천안교육지원청 등록 제3413호", director: "허진희" },
      { name: "중산점", region: "경기", city: "경기 고양시 일산동구", address: "경기 고양시 일산동구 중산로 103 거풍프라자 202호", schools: ["모당초","안곡초","중산초","안곡중","중산중","일산중","안곡고","중산고"], reg: "경기도고양교육지원청 제6727호", director: "박영미" },
      { name: "부평점", region: "서울·인천", city: "인천 부평구", address: "인천 부평구 부평동 부흥로 264 5층", note: "부평시장역 3번 출구 도보 5분, 쿠우쿠우 건물 5층", schools: ["부평서초","부평동초","부원초","부원중","부원여중","부평중","부평고","부평여고"], reg: "인천북부교육지원청 등록 제4371호", director: "김현정" },
      { name: "신곡점", region: "경기", city: "경기 의정부시", address: "경기도 의정부시 신곡동 장곡로 626 금오종합상가 A동 302·303호", note: "경기북부청사경전철역 건너편, 1층 페리카나", schools: ["새말초","의순초","효자초","어룡초","금오초","천보중","효자중","신곡중","효자고","송현고"], reg: "의정부교육지원청 등록 제2071호", director: "김현웅" },
      { name: "산남점", region: "대전·충청", city: "충북 청주시 서원구", address: "충북 청주시 서원구 산남동 산남로 18 이화빌딩 5층", schools: ["샛별초","산남초","남성초","수곡초","한솔초","수곡중","남성중","산남중","산남고","충북고"], reg: "청주교육지원청 등록 제4696호", director: "이진선" },
      { name: "둔산점 (더블유플러스)", region: "대전·충청", city: "대전 서구", address: "대전 서구 둔산로 130 803호", note: "시청역 7번 출구 30m", schools: ["한밭초","문정초","삼천초","탄방초","둔산초","서원초","삼천중","문정중","탄방중","충남고","괴정고"], reg: "대전서부교육지원청 등록 제 서4833호", director: "이지숙" },
      { name: "마두점", region: "경기", city: "경기 고양시 일산동구", address: "경기 고양시 일산동구 중앙로 1191 굿모닝법조타운1 604호", note: "스타벅스 마두역점 건물 6층", schools: ["백신초","낙민초","정발초","호수초","금계초","백신중","정발중","백마중","백신고","정발고","백석고","백마고"], reg: "고양교육지원청 등록 제6135호", director: "송현규" },
      { name: "당진중앙점", region: "대전·충청", city: "충남 당진시", address: "충남 당진시 당진중앙2로 211-5 효명프라자 404호", schools: ["탑동초","계성초","당진초","원당초","호서중","당진중","원당중","호서고","당진고"], reg: "당진교육지원청 등록 제617호", director: "임충효" },
      { name: "호매실점", region: "경기", city: "경기 수원시 권선구", address: "경기 수원시 권선구 금곡로 116 유동빌딩 602호", schools: ["가온초","상촌초","중촌초","칠보중","상촌중","칠보고"], reg: "수원교육지원청 등록 제6830호", director: "차은영" },
      { name: "칠곡점", region: "경상·전라", city: "대구 북구", address: "대구 북구 구암로 149 6층", schools: ["대구북부초","함지초","관천초","대천초","구암초","구암중","관천중","운암중","강북중","구암고","함지고","운암고"], reg: "대구서부교육지원청 등록 제2020-4298호", director: "남영옥" },
      { name: "센트럴점", region: "경기", city: "경기 하남시", address: "경기 하남시 미사강변대로 84 미사탑프라자 601호", note: "빽다방 건물, 자이아파트 정문", schools: ["한홀초","청아초","윤슬초","강솔초","윤슬중","미사중","한홀중","덕풍중","하남고"], reg: "광주하남교육지원청 등록 제1894호", director: "우전희" },
      { name: "상암점", region: "서울·인천", city: "서울 마포구", address: "서울 마포구 상암동 상암산로1길 73 202호", schools: ["상지초","상암초","하늘초","상암중","중암중","상암고"], reg: "서울서부교육지원청 등록 제022015001127호", director: "오미라" },
      { name: "비산점", region: "경기", city: "경기 안양시 동안구", address: "경기 안양시 동안구 관악대로 91 대림타워 1102호", schools: ["중앙초","안양초","샘모루초","비산중","부흥중","부림중","신성중","부흥고"], reg: "안양과천교육지원청 등록 제2017-063호", director: "김래정" },
      { name: "후평점", region: "강원·제주", city: "강원 춘천시", address: "강원특별자치도 춘천시 춘천로 316 춘천더샵아파트상가2동 304·305호", note: "후평사거리 포스코상가 3층 (정육점 건물)", schools: ["후평초","부안초","만천초","동춘천초","후평중","봉의중","춘천여고","봉의고"], reg: "춘천교육지원청 등록 제1741호", director: "조현구" },
      { name: "탄현점", region: "경기", city: "경기 고양시 일산서구", address: "경기 고양시 일산서구 산현로17번길 23 은행프라자 4층", schools: ["상탄초","현산초","한뫼초","일산동중","일산중","현산중","호곡중","일산고","일산동고","덕이고","대진고"], reg: "고양교육지원청 등록 제5930호", director: "이수정" },
      { name: "흥덕점", region: "경기", city: "경기 용인시 기흥구", address: "경기 용인시 기흥구 흥덕2로 85 우연프라자 201호", note: "용인 흥덕 이마트 뒷편 세차장 옆 건물 2층", schools: ["샘말초","석현초","흥덕초","흥덕중","광교호수중","흥덕고","기흥고","신갈고","상현고","매원고"], reg: "용인교육지원청 등록 제4989호", director: "박재현" },
      { name: "미사점", region: "경기", city: "경기 하남시", address: "경기 하남시 미사강변대로 212 미사센트럴프라자 309호", note: "미사도서관·보건센터 도보 2분", schools: ["미사초","미사강변초","윤슬초","망월초","윤슬중","미사강변중","강동중","미사고","하남고","미사강변고","강일고"], reg: "광주하남교육지원청 등록 제1913호", director: "김경미" },
      { name: "돈암점", region: "서울·인천", city: "서울 성북구", address: "서울 성북구 돈암동 동소문로 190 중앙빌딩 201호", note: "성신여대역 1번 출구 직진, 기아자동차 건물 2층", schools: ["개운초","매원초","개운중","성신여중","고명중","용문고","사대부고","성신여고","고대부고","계성고"], reg: "성북강북교육지원청 등록 제2017-43호", director: "박보영" },
      { name: "정평점", region: "경상·전라", city: "경북 경산시", address: "경북 경산시 대학로 23 월드스퀘어 302호", schools: ["사월초","정평초","경산중","사동중","경산여중","경산고","경산여고","시지고"], reg: "경산교육지원청 등록 제941호", director: "박지원" },
      { name: "석동점", region: "경상·전라", city: "경남 창원시 진해구", address: "경남 창원시 진해구 석동로 51 세븐코아 504호", schools: ["석동초","동부초","석동중"], reg: "창원교육지원청 등록 제1933호", director: "신재호" },
      { name: "청라점", region: "서울·인천", city: "인천 서구", address: "인천 서구 중봉대로 588 청라센트럴프라자 609호", schools: ["초은초","청라초","청람초","도담초","청라중","청람중","청호중","초은중","청라고","초은고"], reg: "인천서부교육지원청 등록 서부 제1903호", director: "안윤희" },
      { name: "미금점", region: "경기", city: "경기 성남시 분당구", address: "경기 성남시 분당구 금곡동 돌마로 87 골드프라자 402호", note: "미금역 2번 출구 150m, 국민은행 건물 4층", schools: ["미금초","청솔초","늘푸른초","불곡중","늘푸른중","불곡고","늘푸른고","분당중앙고"], reg: "성남교육지원청 등록 제5313호", director: "김성기" },
      { name: "이곡점", region: "경상·전라", city: "대구 달서구", address: "대구 달서구 이곡동 달구벌대로259길 33 제일빌딩 5층", schools: ["와룡초","이곡초","성서초","성곡초","성지중","와룡중","성산중","성서고","와룡고","성산고"], reg: "대구남부교육지원청 등록 제2016-13호", director: "김재수" },
      { name: "신방화점", region: "서울·인천", city: "서울 강서구", address: "서울 강서구 방화대로 294 마곡더블유타워 505호", note: "신방화역 6번 출구 바로 왼쪽", schools: ["송화초","공항초","송정초","방화초","마곡중","공항중","송정중","방화중","마곡하늬중","백영고","공항고","한서고"], reg: "강서양천교육지원청 등록 제5879호", director: "조민균" },
      { name: "단구점", region: "강원·제주", city: "강원 원주시", address: "강원특별자치도 원주시 서원대로 406 리더스빌딩 402호", note: "단구동 롯데시네마 근처 우리은행 건물 4층", schools: ["구곡초","서원주초","원주중","원주여중","단구중","남원주중","치악고","원주고","상지여고"], reg: "원주교육지원청 등록 제2412호", director: "김신태" },
      { name: "반달점", region: "경기", city: "경기 부천시 원미구", address: "경기 부천시 원미구 상일로 69 반달마을 상가동 304호", schools: ["부인초","상도초","부인중","상동중","상도중","상원고","상동고","상일고","부천여고"], reg: "부천교육지원청 등록 제6730호", director: "김희연" },
      { name: "마포점", region: "서울·인천", city: "서울 마포구", address: "서울 마포구 염리동 독막로42길 7 173-3 2층", note: "마포역·공덕역에서 염리초등학교 방향 도보 10분", schools: ["염리초","서울여중","동도중","신수중","숭문중","서울여고","숭문고","광성고"], reg: "서울서부교육지원청 등록 제02201800007호", director: "선명도" },
      { name: "제기점", region: "서울·인천", city: "서울 동대문구", address: "서울 동대문구 왕산로 61 302호", schools: ["용두초","종암초","대광초","대광중","성일중","대광고","청량고","경희고"], reg: "서울동부교육지원청 등록 제3066호", director: "김지현" },
      { name: "원주시청점", region: "강원·제주", city: "강원 원주시", address: "강원특별자치도 원주시 시청로 22 2층 201호", schools: ["만대초","무실초","대성중","원주여중","평원중","대성고","원주삼육고"], reg: "원주교육지원청 등록 제2605호", director: "김태훈" },
      { name: "후곡점 (더블유플러스)", region: "경기", city: "경기 고양시 일산서구", address: "경기 고양시 일산서구 일산로 524 202호", schools: ["문화초","신일초","신촌초","오마초","강선초","율동초","일산초","모당초","오마중","신일중","발산중","저동고"], reg: "경기도고양교육지원청 등록 제6354호", director: "박영미" },
      { name: "수지점 (더블유플러스)", region: "경기", city: "경기 용인시 수지구", address: "경기 용인시 수지구 진산로 106 훼미리빌딩 512·513·514호", schools: ["신월초","토월초","풍천초","풍덕초","정평초","이현중","수지중","정평중","성복고","풍덕고","수지고","죽전고"], reg: "용인교육지원청 등록 제5126호", director: "이재근" },
      { name: "진접점", region: "경기", city: "경기 남양주시", address: "경기 남양주시 진접읍 해밀예당1로 171 제일프라자 203호", schools: ["진접초","해밀초","주곡초","화봉초","풍양중","주곡중","진접고"], reg: "경기도구리남양주교육지원청 등록 제4552호", director: "서소하" },
      { name: "광장점", region: "서울·인천", city: "서울 광진구", address: "서울 광진구 광나루로 584 동서울빌딩 5층", note: "올림픽대교북단사거리 바로 앞", schools: ["양진초","광진초","광장초","광남초","양진중","광남중","광장중","광남고","동대부고","건대부고"], reg: "성동광진교육지원청 등록 제2316호", director: "김지선" },
      { name: "주엽점", region: "경기", city: "경기 고양시 일산서구", address: "경기 고양시 일산서구 주엽동 주화로 88 502호", schools: ["강선초","한수초","주엽초","문화초","오마초","고양신일초","한수중","발산중","주엽고","대진고","저동고"], reg: "고양교육지원청 등록 제5403호", director: "박상연" },
      { name: "범박점", region: "경기", city: "경기 부천시 소사구", address: "경기 부천시 소사구 은성로 132 5층", note: "세븐일레븐 건물 5층", schools: ["창영초","일신초","소안초","소일초","범박초","소사초","복사초","일신중","소사중","범박중","부일중","시온고","소사고","범박고"], reg: "부천교육지원청 등록 제6495호", director: "박지은" },
      { name: "두정점", region: "대전·충청", city: "충남 천안시 서북구", address: "충남 천안시 서북구 두정동 봉정로 382 성광빌딩 3층", note: "두정초 정문 앞, 피자마루 건물 3층", schools: ["두정초","신대초","부성초","두정중","성성중","성정중","두정고"], reg: "천안교육지원청 등록 제3444호", director: "정누리" },
      { name: "덕이점", region: "경기", city: "경기 고양시 일산서구", address: "경기 고양시 일산서구 하이파크2로 40 금문프라자 804호", note: "농협 옆 건물, 1층 컴포즈커피", schools: ["한산초","덕이초","백송초","덕이중","덕이고","백송고"], reg: "고양교육지원청 등록 제6169호", director: "이경진" },
      { name: "침산점", region: "경상·전라", city: "대구 북구", address: "대구 북구 침산남로 140 엠비프라자 901호", schools: ["침산초","칠성초","달산초","옥산초","침산중","대구일중","경명여중","경명여고","칠성고","경상여고"], reg: "대구서부교육지원청 등록 제2019-4229호", director: "구선영" },
      { name: "수지점 (글로리드)", region: "경기", city: "경기 용인시 수지구", address: "경기 용인시 수지구 풍덕천로 114 3층", note: "수지구청역 2번 출구 앞, 미스터피자 건물 3층", schools: ["풍천초","정평초","이현초","이현중","수지중","정평중","상현고","신봉고","홍천고","성복고","풍덕고","수지고","죽전고"], reg: "경기도용인교육지원청 제5340호", director: "이재근" },
      { name: "대구장기점", region: "경상·전라", city: "대구 달서구", address: "대구 달서구 장기로 252 장기협성휴포레 2층 209·210호", note: "장동초등학교 앞 버스정류장, 1층 한솥도시락", schools: ["장동초","장기초","성당초","본리초","덕인초","원화중","경암중","성당중","새본리중","대건고","효성여고","원화여고","상서고","경화여고"], reg: "대구남부교육지원청 등록 제2020-80호", director: "김재수" },
      { name: "송도점", region: "서울·인천", city: "인천 연수구", address: "인천 연수구 해돋이로 165 차오름프라자 302호", note: "1공구 학원가, 백제원·채드윅 근처", schools: ["신정초","연송초","명선초","신송초","먼우금초","신정중","신송중","연송고","신송고","인천포스코고"], reg: "인천동부교육지원청 등록 제3284호", director: "조은정" },
      { name: "화정점", region: "경기", city: "경기 고양시 덕양구", address: "경기 고양시 덕양구 화신로 263 브릿지타워 214호", note: "한방병원 건물 2층", schools: ["백양초","화정초","지도초","백양중","화정중","지도중","능곡중","화정고","백양고"], reg: "고양교육지원청 등록 제5768호", director: "한민진" },
      { name: "향남점", region: "경기", city: "경기 화성시 향남읍", address: "경기 화성시 향남읍 발안로 103-6 J&H빌딩 402호", schools: ["한울초","도이초","발안초","행정초","발안중","향남중","화성중","향남고","향일고","발안바이오고","화성고","하길고"], reg: "화성오산교육지원청 등록 제3567호", director: "정은희" },
      { name: "영천점", region: "경기", city: "경기 화성시", address: "경기 화성시 동탄순환대로 704 성산에이타워 4층 403호", schools: ["한백초","다원초","무봉초","한백중","다원중","동탄중","한백고","동탄중앙고"], reg: "화성오산교육지원청 등록 제2851호", director: "박승균" },
      { name: "새롬점", region: "대전·충청", city: "세종특별자치시", address: "세종특별자치시 새롬중앙로 62-15 해피라움W 305호", schools: ["새뜸초","새롬초","가득초","새뜸중","새움중","새롬중","다정중","새롬고","다정고","한솔고"], reg: "세종특별자치시교육청 등록 제1211호", director: "신재찬" },
      { name: "복산점", region: "경상·전라", city: "울산 중구", address: "울산 중구 번영로 461 B2동 7호", schools: ["약사초","평산초","복산초","함월초","학성초","약사중","무룡중","가온중","울산중","울산고","성신고","학성여고","약사고"], reg: "울산강북교육지원청 등록 제5462호", director: "감병훈" },
      { name: "화명점", region: "경상·전라", city: "부산 북구", address: "부산 북구 금곡대로285번길 19 리버사이드빌딩 504호", note: "일방통행길 빽다방 건물 5층", schools: ["와석초","화잠초","학사초","용수초","명진초","명진중","화신중","화명중","용수중","화명고","금곡고"], reg: "부산북부교육지원청 등록 제2830호", director: "김연하" },
      { name: "후곡점", region: "경기", city: "경기 고양시 일산서구", address: "경기 고양시 일산서구 일산로 511 태성상가 2층 201·202호", schools: ["문화초","고양신일초","신촌초","오마초","율동초","오마중","신일중","발산중","저동고"], reg: "고양교육지원청 등록 제5985호", director: "박영미" },
      { name: "영통구청점", region: "경기", city: "경기 수원시 영통구", address: "경기 수원시 영통구 매탄로108번길 10 모닝프라자 602호", note: "영통구청 옆 중심상가, 맘스터치 건물 6층", schools: ["매탄초","매현초","효원초","매원중","매탄중","매현중","매탄고","효원고","화홍고"], reg: "수원교육지원청 등록 제6824-1호", director: "권희화" },
      { name: "노형점", region: "강원·제주", city: "제주 제주시", address: "제주특별자치도 제주시 노형동 727-3 대안빌딩 3층", note: "제주은행 연북로지점 주차장 뒷편 CU건물 3층", schools: ["노형초","한라초","노형중","중앙중","한라중","제주제일고","남녕고"], reg: "제주시교육지원청 등록 제2163호", director: "박은하" }
    ];

    var countEl = document.getElementById("centerCount");
    var emptyEl = document.getElementById("centerEmpty");
    var searchEl = document.getElementById("centerSearch");
    var chips = document.querySelectorAll(".finder-chip");
    var activeRegion = "all";

    function renderCenters(list) {
      centerGrid.innerHTML = list.map(function (c) {
        var schoolTags = c.schools.map(function (s) { return "<span>" + s + "</span>"; }).join("");
        return (
          '<article class="center-card">' +
            '<div class="cc-head"><h3>' + c.name + '</h3><span class="cc-city">' + c.city + '</span></div>' +
            '<p class="cc-addr">' + c.address + (c.note ? " &middot; " + c.note : "") + '</p>' +
            '<div class="cc-schools">' + schoolTags + '</div>' +
            '<div class="cc-reg">' + c.reg + (c.director ? " &middot; " + c.director + " 원장" : "") + '</div>' +
            '<a href="apply.html" class="btn btn-primary">' + c.name + ' 상담 신청</a>' +
          '</article>'
        );
      }).join("");
      countEl.textContent = list.length;
      emptyEl.hidden = list.length > 0;
      centerGrid.hidden = list.length === 0;
    }

    function applyFilter() {
      var q = (searchEl.value || "").trim().toLowerCase();
      var filtered = CENTERS.filter(function (c) {
        var regionOk = activeRegion === "all" || c.region === activeRegion;
        if (!regionOk) return false;
        if (!q) return true;
        var hay = (c.name + " " + c.city + " " + c.address + " " + c.schools.join(" ")).toLowerCase();
        return hay.indexOf(q) !== -1;
      });
      renderCenters(filtered);
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("active"); });
        chip.classList.add("active");
        activeRegion = chip.getAttribute("data-region");
        applyFilter();
      });
    });
    searchEl.addEventListener("input", applyFilter);

    applyFilter();
  }
})();
