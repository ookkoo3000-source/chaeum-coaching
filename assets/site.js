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
})();
