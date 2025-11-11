[file name]: Qibla.css
[file content begin]
:root{
  --bg:#0b0b0b;
  --gold:#d4af37;
  --gold-dark:#b38e2f;
  --text:#f5f5f5;
  --muted:#b8b8b8;
}
*{box-sizing:border-box}
body{
  margin:0; background:var(--bg); color:var(--text);
  font-family:'Tajawal', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  text-align:center;
}
h1{margin:22px 0 8px; font-size:28px; font-weight:800}

.compass{
  position:relative; width:320px; height:320px; margin:20px auto 10px;
  /* لا ندور البوصلة ككل الآن */
}

/* الإطار الذهبي */
.gold-ring{
  position:absolute; inset:0; border-radius:50%;
  background: radial-gradient(circle at 50% 50%, transparent 64%, var(--gold) 64% 100%);
}

/* زخرفة إسلامية خفيفة داخل الحلقة الذهبية */
.islamic-pattern{
  position:absolute; inset:0; border-radius:50%;
  -webkit-mask:
    radial-gradient(circle at 50% 50%, transparent 64%, #000 64% 100%);
  mask:
    radial-gradient(circle at 50% 50%, transparent 64%, #000 64% 100%);
  background:
    url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">  <defs>    <pattern id="p" width="20" height="20" patternUnits="userSpaceOnUse">      <path d="M10 0 L12 6 L18 8 L12 10 L10 16 L8 10 L2 8 L8 6 Z" fill="%23e5c65a"/>    </pattern>  </defs>  <rect width="120" height="120" fill="url(%23p)" opacity="0.25"/></svg>') center/cover no-repeat;
  opacity:.35;
}

/* وجه البوصلة الداخلي */
.face{
  position:absolute; inset:14px; border-radius:50%;
  background: radial-gradient(circle at 50% 45%, #1a1a1a, #111 65%);
}

/* الاتجاهات الأربع */
.direction {
    position: absolute;
    color: #d4af37;
    font-size: 18px;
    font-weight: bold;
}

/* ن */
.north { top: 10%; left: 50%; transform: translateX(-50%); }

/* س */
.south { bottom: 10%; left: 50%; transform: translateX(-50%); }

/* ش */
.east { right: 10%; top: 50%; transform: translateY(-50%); }

/* غ */
.west { left: 10%; top: 50%; transform: translateY(-50%); }

/* شعار القبلة على الحافة */
.qibla-marker {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* يبدأ من المركز */
  font-size: 32px;
  z-index: 3;
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
  animation: pulse 2s infinite;
  /* سنقوم بنقل الشعار إلى الحافة باستخدام JavaScript */
  /* سنستخدم خاصية transform لإزاحته إلى الحافة ثم تدويره */
}

@keyframes pulse {
  0% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.1); }
  100% { transform: translate(-50%, -50%) scale(1); }
}

/* معلومات الموقع */
.location-info {
  margin: 15px 0;
  padding: 10px;
}

.location-info p {
  margin: 0;
  color: var(--muted);
  font-size: 14px;
}

button{
  background:var(--gold); color:#111; border:0; border-radius:12px;
  padding:12px 26px; font-weight:700; cursor:pointer; font-size:16px;
  margin: 10px 0;
}
#status{margin:12px 0 18px; color:var(--muted); font-size:15px;}
.success{color:#19c37d !important; font-weight:700;}
[file content end]
