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
      {
        name: "원흥점",
        region: "경기",
        city: "경기 고양시 덕양구",
        address: "경기 고양시 덕양구 권율대로 672 원흥역봄오피스텔 2층 217호",
        note: "원흥역 1번 출구 앞, 1층 베스킨라빈스 건물 2층",
        schools: ["원흥초", "삼송초", "고양동산초", "원흥중", "고양중", "고양동산고", "도래울고"],
        reg: "고양교육지원청 등록 제6096호"
      },
      {
        name: "첨단점",
        region: "경상·전라",
        city: "광주광역시 광산구",
        address: "광주광역시 광산구 첨단지구 일대",
        note: "상세 위치는 상담 시 안내드립니다",
        schools: ["월봉중", "봉산중", "첨단중"],
        reg: "광주서부교육지원청 등록 제7200호"
      }
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
            '<div class="cc-reg">' + c.reg + '</div>' +
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
