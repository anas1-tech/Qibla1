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
const qiblaLine = document.getElementById('qiblaLine');
const statusEl = document.getElementById('status');
const locationText = document.getElementById('locationText');
let qibla = null;
let userLocation = null;

// بدء التشغيل بزر واحد
document.getElementById('startBtn').addEventListener('click', startAll);

async function startAll(){
  statusEl.textContent = 'جاري طلب الأذونات...';
  statusEl.classList.remove('success');

  // iOS: إذن مستشعر الاتجاه
  if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function'){
    try{
      const res = await DeviceOrientationEvent.requestPermission();
      if(res !== 'granted'){ 
        statusEl.textContent = '❌ لم يتم منح إذن البوصلة.'; 
        return; 
      }
    }catch(e){ 
      statusEl.textContent = '❌ تعذّر إذن البوصلة.'; 
      return; 
    }
  }

  // GPS
  if(!navigator.geolocation){ 
    statusEl.textContent='❌ المتصفح لا يدعم GPS.'; 
    return; 
  }
  
  statusEl.textContent='جاري تحديد الموقع...';
  navigator.geolocation.getCurrentPosition(
    pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      userLocation = { lat, lon };
      qibla = computeQibla(lat, lon);
      
      // تحديث نص موقع القبلة
      locationText.textContent = `موقع القبلة: مكة المكرمة | موقعك: ${lat.toFixed(4)}, ${lon.toFixed(4)}`;
      
      statusEl.textContent = 'حرّك الهاتف حتى يتجه خط القبلة إلى الأعلى.';
      
      // بدء استشعار الحركة
      if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', onOrient, true);
      } else {
        statusEl.textContent = '❌ المتصفح لا يدعم استشعار الحركة.';
      }
    },
    error => {
      let errorMsg = '❌ فشل تحديد الموقع. ';
      switch(error.code) {
        case error.PERMISSION_DENIED:
          errorMsg += 'تم رفض الإذن. يرجى تفعيل GPS ومنح الإذن.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMsg += 'معلومات الموقع غير متوفرة.';
          break;
        case error.TIMEOUT:
          errorMsg += 'انتهت مهلة طلب الموقع.';
          break;
        default:
          errorMsg += 'حدث خطأ غير معروف.';
          break;
      }
      statusEl.textContent = errorMsg;
    }, 
    {
      enableHighAccuracy: true, 
      timeout: 15000,
      maximumAge: 60000
    }
  );
}

// تنعيم الزاوية
let current = 0;
function norm(deg){ 
  let d = (deg % 360 + 360) % 360; 
  if(d > 180) d -= 360; 
  return d; 
}

function lerp(a, b, t){ 
  return a + (b - a) * t; 
}

function onOrient(e){
  if(qibla == null) return;
  
  let heading;
  if (typeof e.webkitCompassHeading === 'number') {
    // iOS
    heading = e.webkitCompassHeading;
  } else if (e.alpha !== null) {
    // Android
    heading = 360 - e.alpha;
  } else {
    statusEl.textContent = '⚠️ لم يتم اكتشاف مستشعر الاتجاه.';
    return;
  }
  
  if(isNaN(heading)) { 
    statusEl.textContent = '⚠️ فعّل مستشعر الحركة والاتجاه.'; 
    return; 
  }

  // تدوير البوصلة بأكملها لمواجهة القبلة
  let target = qibla - heading;
  let delta = norm(target - current);
  current = lerp(current, current + delta, 0.15); // تنعيم الحركة

  // تدوير البوصلة بأكملها
  compass.style.transform = `rotate(${current}deg)`;

  // التحقق إذا كان الاتجاه صحيحاً (هامش خطأ 5 درجات)
  const isCorrect = Math.abs(norm(target)) <= 5;
  
  if(isCorrect){
    if (!statusEl.classList.contains('success')) {
      statusEl.textContent = '✓ اتجاه القبلة صحيح';
      statusEl.classList.add('success');
      // اهتزاز عند الوصول للقبلة
      if(navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    }
  } else {
    statusEl.classList.remove('success');
    const degreesOff = Math.abs(Math.round(norm(target)));
    statusEl.textContent = `اتجه ${degreesOff}° ${norm(target) > 0 ? 'يساراً' : 'يميناً'}`;
  }
}

// إظهار معلومات التوجيه عند التحميل
window.addEventListener('load', function() {
  if (!navigator.geolocation) {
    statusEl.textContent = '❌ المتصفح لا يدعم خدمة الموقع.';
  }
});
[file content end]
