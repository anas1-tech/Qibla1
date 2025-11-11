[file name]: Qibla.js
[file content begin]
// حساب اتجاه القبلة من إحداثيات المستخدم
function computeQibla(lat, lon){
  const KaabaLat = 21.4225 * Math.PI/180;
  const KaabaLon = 39.8262 * Math.PI/180;
  const φ = lat * Math.PI/180, λ = lon * Math.PI/180;
  const y = Math.sin(KaabaLon - λ) * Math.cos(KaabaLat);
  const x = Math.cos(φ)*Math.sin(KaabaLat) - Math.sin(φ)*Math.cos(KaabaLat)*Math.cos(KaabaLon - λ);
  return (Math.atan2(y, x) * 180/Math.PI + 360) % 360; // 0..360 من الشمال
}

const compass = document.getElementById('compass');
const qiblaMarker = document.getElementById('qiblaMarker');
const statusEl = document.getElementById('status');
const locationText = document.getElementById('locationText');
let qibla = null;

// بدء التشغيل بزر واحد
document.getElementById('startBtn').addEventListener('click', startAll);

async function startAll(){
  statusEl.textContent = 'جاري طلب الأذونات...';

  // iOS: إذن مستشعر الاتجاه
  if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function'){
    try{
      const res = await DeviceOrientationEvent.requestPermission();
      if(res !== 'granted'){ statusEl.textContent = '❌ لم يتم منح إذن البوصلة.'; return; }
    }catch(e){ statusEl.textContent = '❌ تعذّر إذن البوصلة.'; return; }
  }

  // GPS
  if(!navigator.geolocation){ statusEl.textContent='❌ المتصفح لا يدعم GPS.'; return; }
  statusEl.textContent='جاري تحديد الموقع...';
  navigator.geolocation.getCurrentPosition(pos=>{
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    qibla = computeQibla(lat, lon);
    
    // تحديث نص موقع القبلة
    locationText.textContent = `موقع القبلة: مكة المكرمة (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
    
    statusEl.textContent='حرّك الهاتف حتى يتجه شعار القبلة إلى الأعلى.';
    window.addEventListener('deviceorientation', onOrient, true);
  }, _=>{
    statusEl.textContent='❌ فشل تحديد الموقع. فعّل GPS ومنح الإذن.';
  }, {enableHighAccuracy:true, timeout:10000});
}

// تنعيم الزاوية
let current = 0;
function norm(deg){ let d=(deg%360+360)%360; if(d>180)d-=360; return d; }
function lerp(a,b,t){ return a+(b-a)*t; }

function onOrient(e){
  if(qibla==null) return;
  let heading = (typeof e.webkitCompassHeading==='number') ? e.webkitCompassHeading : (360 - (e.alpha||0));
  if(isNaN(heading)) { statusEl.textContent='⚠️ فعّل مستشعر الحركة.'; return; }

  // حساب الزاوية التي يجب أن يدور فيها شعار القبلة
  // الشعار يجب أن يدور ليشير إلى اتجاه القبلة بالنسبة للبوصلة
  // إذا كانت القبلة في اتجاه 90 درجة (شرق) وكان الهاتف يشير إلى الشمال (0 درجة) فإن الشعار يجب أن يدور 90 درجة.
  // لكننا نريد أن يكون الشعار في الحافة، لذا سنقوم بتدوير الشعار بحيث يكون موقعه على الحافة في الزاوية الصحيحة.

  // الزاوية المطلوبة هي الفرق بين اتجاه القبلة واتجاه الهاتف
  let target = qibla - heading;
  let delta  = norm(target - current);
  current    = lerp(current, current + delta, 0.22);

  // تدوير شعار القبلة ليشير إلى الاتجاه الصحيح
  // نستخدم `current` التي تم تنعيمها
  // نريد أن نحرك الشعار إلى الحافة ثم ندوره ليشير إلى الخارج.
  // سنقوم بتدوير الشعار حول المركز ثم نزحته إلى الحافة.

  // نصف قطر البوصلة (ناقص نصف ارتفاع الشعار تقريبًا)
  const radius = 140; // نصف قطر البوصلة الداخلية (بكسل)

  // حساب الإزاحة بناء على الزاوية
  const angleInRad = (current - 90) * Math.PI / 180; // نطرح 90 لأننا نريد أن يكون الأعلى هو 0
  const x = radius * Math.cos(angleInRad);
  const y = radius * Math.sin(angleInRad);

  // تطبيق التحويلات: أولاً ندور الشعار ليكون متجهًا للخارج، ثم ننقله إلى الحافة
  // لتدوير الشعار ليكون متجهًا للخارج، نضيف 90 درجة إلى الزاوية حتى يكون وجه الشعار للخارج.
  const rotation = current; // يمكن تعديل هذه القيمة لضمان اتجاه الشعار بشكل صحيح

  qiblaMarker.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotation}deg)`;

  const ok = Math.abs(norm(target)) <= 6;
  if(ok){
    statusEl.textContent = 'اتجاه القبلة صحيح ✅';
    statusEl.classList.add('success');
    if(navigator.vibrate) navigator.vibrate([0,40,40,40]);
  }else{
    statusEl.classList.remove('success');
    statusEl.textContent = 'اضغط ابدأ ثم حرّك الهاتف حتى يتجه شعار القبلة إلى الأعلى.';
  }
}
[file content end]
