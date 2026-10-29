// 第一次啟動時寫入資料庫的範例資料（曼谷五天四夜，已去識別）。
// 網站裡的「設定 → 清空範例」可以一鍵清掉行程、預約、提醒與記帳。
export default [
 {
  "col": "meta",
  "id": "trip",
  "data": {
   "title": "曼谷五日誌",
   "en": "Bangkok Notes",
   "code": "BKK",
   "start": "2027-01-26",
   "lang": "th",
   "currency": "THB",
   "example": true,
   "palette": "bangkok",
   "days": [
    {
     "word": "還願",
     "en": "Offerings & Rooftops",
     "sub": "抵達、還願、購物、Rooftop Bar",
     "color": "#C8963E",
     "art": "shrine"
    },
    {
     "word": "料理",
     "en": "Lemongrass & Markets",
     "sub": "料理教室、市集、特色酒吧",
     "color": "#536E40",
     "art": "bowl"
    },
    {
     "word": "泰服",
     "en": "Silk at Wat Arun",
     "sub": "鄭王廟泰服、河岸餐廳與划船",
     "color": "#5E3A57",
     "art": "prang"
    },
    {
     "word": "大城",
     "en": "A Day in Ayutthaya",
     "sub": "大城動物園一日遊",
     "color": "#9C5B2C",
     "art": "elephant"
    },
    {
     "word": "水市",
     "en": "Floating Market & Home",
     "sub": "水上市場、回程",
     "color": "#2F4E6E",
     "art": "boat"
    }
   ]
  }
 },
 {
  "col": "meta",
  "id": "settings",
  "data": {
   "rate": 0.95,
   "members": [
    "旅伴A",
    "旅伴B",
    "旅伴C"
   ]
  }
 },
 {
  "col": "items",
  "id": "d1-1",
  "data": {
   "day": 1,
   "end": "12:30",
   "note": "人多行李多，先確認接送車輛大小",
   "order": 1000,
   "place": "Suvarnabhumi Airport",
   "start": "10:45",
   "title": "抵達 BKK、入境及領行李"
  }
 },
 {
  "col": "items",
  "id": "d1-2",
  "data": {
   "day": 1,
   "end": "14:00",
   "moveMode": "包車或大型車",
   "moveTime": "約 45 分",
   "note": "住宿建議 Asok／Phrom Phong 一帶",
   "order": 2000,
   "place": "",
   "start": "12:30",
   "title": "前往飯店寄放行李、午餐"
  }
 },
 {
  "col": "items",
  "id": "d1-3",
  "data": {
   "day": 1,
   "end": "16:30",
   "moveMode": "BTS",
   "moveTime": "約 15 分",
   "note": "四面佛、CentralWorld、Big C 都在 Ratchaprasong 商圈",
   "order": 3000,
   "place": "Erawan Shrine Bangkok",
   "start": "14:00",
   "title": "還願 → CentralWorld → Big C"
  }
 },
 {
  "col": "items",
  "id": "d1-4",
  "data": {
   "day": 1,
   "end": "18:00",
   "note": "",
   "order": 4000,
   "place": "",
   "start": "16:30",
   "title": "晚餐（待定）"
  }
 },
 {
  "col": "items",
  "id": "d1-5",
  "data": {
   "day": 1,
   "end": "20:00",
   "note": "",
   "order": 5000,
   "place": "",
   "start": "18:30",
   "title": "按摩 60–90 分鐘"
  }
 },
 {
  "col": "items",
  "id": "d1-6",
  "data": {
   "day": 1,
   "end": "22:00",
   "moveMode": "Grab",
   "moveTime": "約 15 分",
   "note": "",
   "order": 6000,
   "place": "Red Sky Rooftop Bar Centara Grand at CentralWorld",
   "start": "20:00",
   "title": "Red Sky Rooftop Bar 或附近特色酒吧"
  }
 },
 {
  "col": "items",
  "id": "d2-1",
  "data": {
   "day": 2,
   "end": "08:30",
   "note": "",
   "order": 1000,
   "place": "",
   "start": "07:30",
   "title": "早餐、前往料理教室"
  }
 },
 {
  "col": "items",
  "id": "d2-2",
  "data": {
   "day": 2,
   "end": "12:30",
   "moveMode": "BTS",
   "moveTime": "約 30 分",
   "note": "Sompong Thai Cooking School",
   "order": 2000,
   "place": "Sompong Thai Cooking School",
   "start": "08:30",
   "title": "廚藝教室＋市場採買"
  }
 },
 {
  "col": "items",
  "id": "d2-3",
  "data": {
   "day": 2,
   "end": "14:00",
   "note": "",
   "order": 3000,
   "place": "",
   "start": "12:30",
   "title": "用餐、返回市區"
  }
 },
 {
  "col": "items",
  "id": "d2-4",
  "data": {
   "day": 2,
   "end": "19:30",
   "moveMode": "BTS",
   "moveTime": "約 30 分",
   "note": "週末市集主要週六日營業，週三請先確認",
   "order": 4000,
   "place": "Chatuchak Weekend Market",
   "start": "14:00",
   "title": "洽圖洽市集"
  }
 },
 {
  "col": "items",
  "id": "d2-5",
  "data": {
   "day": 2,
   "end": "22:30",
   "moveMode": "BTS",
   "moveTime": "約 35 分",
   "note": "5 人以上建議預約",
   "order": 5000,
   "place": "Octave Rooftop Lounge and Bar Bangkok Marriott Sukhumvit",
   "start": "20:00",
   "title": "Octave Rooftop Lounge & Bar 或 Thonglor 特色酒吧"
  }
 },
 {
  "col": "items",
  "id": "d3-1",
  "data": {
   "day": 3,
   "end": "09:00",
   "note": "",
   "order": 1000,
   "place": "",
   "start": "08:00",
   "title": "早餐、前往鄭王廟"
  }
 },
 {
  "col": "items",
  "id": "d3-2",
  "data": {
   "day": 3,
   "end": "12:00",
   "moveMode": "BTS＋昭披耶河船",
   "moveTime": "約 45 分",
   "note": "鄭王廟 08:00–18:00，外國成人 200 泰銖",
   "order": 2000,
   "place": "Wat Arun",
   "start": "09:00",
   "title": "泰服換裝、妝髮、拍照"
  }
 },
 {
  "col": "items",
  "id": "d3-3",
  "data": {
   "day": 3,
   "end": "13:30",
   "note": "",
   "order": 3000,
   "place": "",
   "start": "12:00",
   "title": "河岸午餐（待定）"
  }
 },
 {
  "col": "items",
  "id": "d3-4",
  "data": {
   "day": 3,
   "end": "15:30",
   "moveMode": "Grab",
   "moveTime": "車程待確認",
   "note": "泰國小馬爾地夫",
   "order": 4000,
   "place": "Bubble in the forest cafe Bangkok",
   "start": "13:30",
   "title": "Bubble in the forest 咖啡廳"
  }
 },
 {
  "col": "items",
  "id": "d3-5",
  "data": {
   "day": 3,
   "end": "20:00",
   "moveMode": "Grab",
   "moveTime": "依餐廳位置",
   "note": "划船若只有特定時段，以餐廳預約為主",
   "order": 5000,
   "place": "",
   "start": "17:30",
   "title": "河岸餐廳、晚餐與划船"
  }
 },
 {
  "col": "items",
  "id": "d3-6",
  "data": {
   "day": 3,
   "end": "",
   "note": "",
   "order": 6000,
   "place": "",
   "start": "20:00",
   "title": "返回飯店休息"
  }
 },
 {
  "col": "items",
  "id": "d4-1",
  "data": {
   "day": 4,
   "end": "07:00",
   "note": "",
   "order": 1000,
   "place": "",
   "start": "06:30",
   "title": "早餐、包車出發"
  }
 },
 {
  "col": "items",
  "id": "d4-2",
  "data": {
   "day": 4,
   "end": "09:00",
   "moveMode": "包車",
   "moveTime": "1.5–2 小時",
   "note": "車程暫抓 1.5–2 小時",
   "order": 2000,
   "place": "Ayutthaya",
   "start": "07:00",
   "title": "前往大城"
  }
 },
 {
  "col": "items",
  "id": "d4-3",
  "data": {
   "day": 4,
   "end": "14:00",
   "note": "Klook 大城動物園一日遊",
   "order": 3000,
   "place": "",
   "start": "09:00",
   "title": "動物園、動物體驗及午餐（糖絲捲）"
  }
 },
 {
  "col": "items",
  "id": "d4-4",
  "data": {
   "day": 4,
   "end": "16:30",
   "moveMode": "包車",
   "moveTime": "約 2 小時（含塞車）",
   "note": "保留塞車緩衝",
   "order": 4000,
   "place": "",
   "start": "14:00",
   "title": "返回曼谷"
  }
 },
 {
  "col": "items",
  "id": "d4-5",
  "data": {
   "day": 4,
   "end": "18:00",
   "note": "若交通延誤，改成飯店附近短時段按摩",
   "order": 5000,
   "place": "",
   "start": "17:00",
   "title": "按摩"
  }
 },
 {
  "col": "items",
  "id": "d4-6",
  "data": {
   "day": 4,
   "end": "20:00",
   "note": "",
   "order": 6000,
   "place": "",
   "start": "18:30",
   "title": "晚餐"
  }
 },
 {
  "col": "items",
  "id": "d4-7",
  "data": {
   "day": 4,
   "end": "",
   "note": "不再安排酒吧",
   "order": 7000,
   "place": "",
   "start": "20:00",
   "title": "自由休息"
  }
 },
 {
  "col": "items",
  "id": "d5-1",
  "data": {
   "day": 5,
   "end": "07:00",
   "note": "",
   "order": 1000,
   "place": "",
   "start": "06:30",
   "title": "退房、行李交給包車"
  }
 },
 {
  "col": "items",
  "id": "d5-2",
  "data": {
   "day": 5,
   "end": "08:00",
   "moveMode": "包車",
   "moveTime": "約 40 分",
   "note": "",
   "order": 2000,
   "place": "",
   "start": "07:00",
   "title": "前往水上市場"
  }
 },
 {
  "col": "items",
  "id": "d5-3",
  "data": {
   "day": 5,
   "end": "10:00",
   "note": "空叻瑪榮水上市場",
   "order": 3000,
   "place": "Khlong Lat Mayom Floating Market",
   "start": "08:00",
   "title": "早餐、逛市場、買小吃"
  }
 },
 {
  "col": "items",
  "id": "d5-4",
  "data": {
   "day": 5,
   "end": "11:30",
   "note": "",
   "order": 4000,
   "place": "",
   "start": "10:00",
   "title": "離開市場，取行李或直接前往機場"
  }
 },
 {
  "col": "items",
  "id": "d5-5",
  "data": {
   "day": 5,
   "end": "13:30",
   "moveMode": "包車",
   "moveTime": "約 50 分",
   "note": "",
   "order": 5000,
   "place": "Suvarnabhumi Airport",
   "start": "12:30",
   "title": "抵達 BKK 機場"
  }
 },
 {
  "col": "items",
  "id": "d5-6",
  "data": {
   "day": 5,
   "end": "",
   "note": "",
   "order": 6000,
   "place": "",
   "start": "17:15",
   "title": "回程航班"
  }
 },
 {
  "col": "bookings",
  "id": "b-airport",
  "data": {
   "day": 1,
   "done": false,
   "link": "",
   "note": "人多加大型行李，比較包車或大型車費用，不要預設一台普通 Grab",
   "order": 2000,
   "title": "機場接送大型車"
  }
 },
 {
  "col": "bookings",
  "id": "b-ayutthaya",
  "data": {
   "day": 4,
   "done": false,
   "link": "",
   "note": "確認來回費用、等候時間、高速公路費、停車費",
   "order": 8000,
   "title": "大城包車＋動物園行程（Klook）"
  }
 },
 {
  "col": "bookings",
  "id": "b-cooking",
  "data": {
   "day": 2,
   "done": false,
   "link": "",
   "note": "確認集合時間、是否含市場導覽、料理與用餐時間",
   "order": 4000,
   "title": "Sompong Thai Cooking School"
  }
 },
 {
  "col": "bookings",
  "id": "b-hotel",
  "data": {
   "day": 0,
   "done": false,
   "link": "",
   "note": "每房每晚 NT$2,000–3,500",
   "order": 1000,
   "title": "住宿（Asok／Phrom Phong）"
  }
 },
 {
  "col": "bookings",
  "id": "b-market",
  "data": {
   "day": 5,
   "done": false,
   "link": "",
   "note": "行李放車上，市場後直送機場",
   "order": 9000,
   "title": "水上市場包車（privatetour）"
  }
 },
 {
  "col": "bookings",
  "id": "b-octave",
  "data": {
   "day": 2,
   "done": false,
   "link": "",
   "note": "5 人以上建議預約；接近出發時確認 2027 年 1 月營業時間與服裝規定",
   "order": 5000,
   "title": "Octave Rooftop 訂位"
  }
 },
 {
  "col": "bookings",
  "id": "b-redsky",
  "data": {
   "day": 1,
   "done": false,
   "link": "",
   "note": "確認營業時間、服裝規定",
   "order": 3000,
   "title": "Red Sky Rooftop Bar"
  }
 },
 {
  "col": "bookings",
  "id": "b-river",
  "data": {
   "day": 3,
   "done": false,
   "link": "",
   "note": "確認划船時段，以餐廳預約為主",
   "order": 7000,
   "title": "河岸餐廳晚餐＋划船"
  }
 },
 {
  "col": "bookings",
  "id": "b-thaidress",
  "data": {
   "day": 3,
   "done": false,
   "link": "",
   "note": "",
   "order": 6000,
   "title": "鄭王廟泰服租借＋妝髮"
  }
 },
 {
  "col": "tips",
  "id": "t-0a",
  "data": {
   "body": "機場快線、BTS 與 Grab 混搭。人多又有大型行李時，比較包車或大型車費用。",
   "order": 1000,
   "scope": 0,
   "title": "交通"
  }
 },
 {
  "col": "tips",
  "id": "t-0b",
  "data": {
   "body": "建議 Asok／Phrom Phong，預算每房每晚 NT$2,000–3,500。",
   "order": 2000,
   "scope": 0,
   "title": "住宿"
  }
 },
 {
  "col": "tips",
  "id": "t-1a",
  "data": {
   "body": "每日 06:00–22:00，位在 Ratchaprasong 商圈，可和 CentralWorld、Big C 排在一起。",
   "order": 3000,
   "scope": 1,
   "title": "四面佛"
  }
 },
 {
  "col": "tips",
  "id": "t-2a",
  "data": {
   "body": "這天路線以料理教室地址為核心。預約前確認集合時間、是否含市場導覽、料理時間和用餐時間。",
   "order": 4000,
   "scope": 2,
   "title": "料理教室"
  }
 },
 {
  "col": "tips",
  "id": "t-2b",
  "data": {
   "body": "2027 年 1 月的營業時間、訂位與服裝規定，接近出發時再確認。5 人以上建議預約。",
   "order": 5000,
   "scope": 2,
   "title": "Octave"
  }
 },
 {
  "col": "tips",
  "id": "t-2c",
  "data": {
   "body": "洽圖洽週末市集主要在週六、週日營業，1/27 是週三，平日多數攤位沒開。出發前確認，或考慮改去其他夜市。",
   "order": 6000,
   "scope": 2,
   "title": "洽圖洽市集營業日"
  }
 },
 {
  "col": "tips",
  "id": "t-3a",
  "data": {
   "body": "參觀時間每日 08:00–18:00，外國成人門票 200 泰銖，以當日公告為準。",
   "order": 7000,
   "scope": 3,
   "title": "鄭王廟"
  }
 },
 {
  "col": "tips",
  "id": "t-3b",
  "data": {
   "body": "如果划船只能在特定時段，把按摩改成午餐後的短時段足部按摩，不要影響餐廳預約。",
   "order": 8000,
   "scope": 3,
   "title": "划船時段"
  }
 },
 {
  "col": "tips",
  "id": "t-4a",
  "data": {
   "body": "事先確認來回費用、等候時間、是否含高速公路費及停車費。不要用市區計程車單程價格估算整天費用。",
   "order": 9000,
   "scope": 4,
   "title": "包車"
  }
 },
 {
  "col": "tips",
  "id": "t-5a",
  "data": {
   "body": "空叻瑪榮水上市場通常週六、週日及公眾假期 08:00–17:00 營業。17:15 起飛，只走早上快閃版。",
   "order": 10000,
   "scope": 5,
   "title": "水上市場"
  }
 },
 {
  "col": "phrases",
  "id": "th-01",
  "data": {
   "cat": "禮貌",
   "order": 100,
   "roman": "sawatdee",
   "say": "薩瓦迪",
   "th": "สวัสดี",
   "zh": "你好",
   "lang": "th"
  }
 },
 {
  "col": "phrases",
  "id": "th-02",
  "data": {
   "cat": "禮貌",
   "order": 200,
   "roman": "khop khun",
   "say": "擴昆",
   "th": "ขอบคุณ",
   "zh": "謝謝",
   "lang": "th"
  }
 },
 {
  "col": "phrases",
  "id": "th-03",
  "data": {
   "cat": "禮貌",
   "order": 300,
   "roman": "kho thot",
   "say": "擴透",
   "th": "ขอโทษ",
   "zh": "不好意思／借過",
   "lang": "th"
  }
 },
 {
  "col": "phrases",
  "id": "th-04",
  "data": {
   "cat": "禮貌",
   "order": 400,
   "roman": "kha / khrap",
   "say": "卡／卡普",
   "th": "ค่ะ ／ ครับ",
   "zh": "句尾加上更禮貌（女／男）",
   "lang": "th"
  }
 },
 {
  "col": "phrases",
  "id": "th-05",
  "data": {
   "cat": "餐廳",
   "order": 500,
   "roman": "mai phet",
   "say": "麥配",
   "th": "ไม่เผ็ด",
   "zh": "不要辣",
   "lang": "th"
  }
 },
 {
  "col": "phrases",
  "id": "th-06",
  "data": {
   "cat": "餐廳",
   "order": 600,
   "roman": "phet nit noi",
   "say": "配 逆儂",
   "th": "เผ็ดนิดหน่อย",
   "zh": "一點點辣就好",
   "lang": "th"
  }
 },
 {
  "col": "phrases",
  "id": "th-07",
  "data": {
   "cat": "餐廳",
   "order": 700,
   "roman": "mai sai phak chi",
   "say": "麥賽怕雞",
   "th": "ไม่ใส่ผักชี",
   "zh": "不要香菜",
   "lang": "th"
  }
 },
 {
  "col": "phrases",
  "id": "th-08",
  "data": {
   "cat": "餐廳",
   "order": 800,
   "roman": "mai sai nam khaeng",
   "say": "麥賽南肯",
   "th": "ไม่ใส่น้ำแข็ง",
   "zh": "不要加冰",
   "lang": "th"
  }
 },
 {
  "col": "phrases",
  "id": "th-09",
  "data": {
   "cat": "餐廳",
   "order": 900,
   "roman": "chek bin",
   "say": "切賓",
   "th": "เช็คบิล",
   "zh": "買單",
   "lang": "th"
  }
 },
 {
  "col": "phrases",
  "id": "th-10",
  "data": {
   "cat": "餐廳",
   "order": 1000,
   "roman": "aroi",
   "say": "阿洛伊",
   "th": "อร่อย",
   "zh": "好好吃",
   "lang": "th"
  }
 },
 {
  "col": "phrases",
  "id": "th-11",
  "data": {
   "cat": "按摩",
   "order": 1100,
   "roman": "bao bao",
   "say": "包包",
   "th": "เบาๆ",
   "zh": "輕一點",
   "lang": "th"
  }
 },
 {
  "col": "phrases",
  "id": "th-12",
  "data": {
   "cat": "按摩",
   "order": 1200,
   "roman": "raeng raeng",
   "say": "朗朗",
   "th": "แรงๆ",
   "zh": "大力一點",
   "lang": "th"
  }
 },
 {
  "col": "phrases",
  "id": "th-13",
  "data": {
   "cat": "按摩",
   "order": 1300,
   "roman": "jep",
   "say": "介",
   "th": "เจ็บ",
   "zh": "會痛",
   "lang": "th"
  }
 },
 {
  "col": "phrases",
  "id": "th-14",
  "data": {
   "cat": "按摩",
   "order": 1400,
   "roman": "kamlang di",
   "say": "甘朗低",
   "th": "กำลังดี",
   "zh": "剛剛好",
   "lang": "th"
  }
 },
 {
  "col": "phrases",
  "id": "th-15",
  "data": {
   "cat": "購物",
   "order": 1500,
   "roman": "thao rai",
   "say": "濤萊",
   "th": "เท่าไหร่",
   "zh": "多少錢？",
   "lang": "th"
  }
 },
 {
  "col": "phrases",
  "id": "th-16",
  "data": {
   "cat": "購物",
   "order": 1600,
   "roman": "lot dai mai",
   "say": "洛代買",
   "th": "ลดได้ไหม",
   "zh": "可以便宜一點嗎？",
   "lang": "th"
  }
 },
 {
  "col": "phrases",
  "id": "th-17",
  "data": {
   "cat": "購物",
   "order": 1700,
   "roman": "phaeng pai",
   "say": "畔拜",
   "th": "แพงไป",
   "zh": "太貴了",
   "lang": "th"
  }
 },
 {
  "col": "phrases",
  "id": "th-18",
  "data": {
   "cat": "交通",
   "order": 1800,
   "roman": "pai thi ni",
   "say": "拜替尼",
   "th": "ไปที่นี่",
   "zh": "請到這裡",
   "lang": "th"
  }
 },
 {
  "col": "phrases",
  "id": "th-19",
  "data": {
   "cat": "交通",
   "order": 1900,
   "roman": "poet mitoe duai",
   "say": "潑咪德堆",
   "th": "เปิดมิเตอร์ด้วย",
   "zh": "請跳表",
   "lang": "th"
  }
 },
 {
  "col": "phrases",
  "id": "th-20",
  "data": {
   "cat": "交通",
   "order": 2000,
   "roman": "jot trong ni",
   "say": "角東尼",
   "th": "จอดตรงนี้",
   "zh": "在這裡停",
   "lang": "th"
  }
 },
 {
  "col": "phrases",
  "id": "th-21",
  "data": {
   "cat": "求助",
   "order": 2100,
   "roman": "hong nam yu thi nai",
   "say": "鴻南 尤替乃",
   "th": "ห้องน้ำอยู่ที่ไหน",
   "zh": "廁所在哪裡？",
   "lang": "th"
  }
 },
 {
  "col": "phrases",
  "id": "th-22",
  "data": {
   "cat": "求助",
   "order": 2200,
   "roman": "chuai duai",
   "say": "催堆",
   "th": "ช่วยด้วย",
   "zh": "請幫幫我",
   "lang": "th"
  }
 },
 {
  "col": "phrases",
  "id": "th-23",
  "data": {
   "cat": "求助",
   "order": 2300,
   "roman": "mai sabai",
   "say": "麥沙拜",
   "th": "ไม่สบาย",
   "zh": "我不舒服",
   "lang": "th"
  }
 },
 {
  "col": "phrases",
  "id": "th-24",
  "data": {
   "cat": "求助",
   "order": 2400,
   "roman": "riak tamruat",
   "say": "利亞 當魯阿",
   "th": "เรียกตำรวจ",
   "zh": "請叫警察",
   "lang": "th"
  }
 },
 {
  "col": "phrases",
  "id": "ja-01",
  "data": {
   "lang": "ja",
   "cat": "禮貌",
   "zh": "你好",
   "th": "こんにちは",
   "say": "空你七哇",
   "roman": "konnichiwa",
   "order": 100
  }
 },
 {
  "col": "phrases",
  "id": "ja-02",
  "data": {
   "lang": "ja",
   "cat": "禮貌",
   "zh": "謝謝",
   "th": "ありがとうございます",
   "say": "阿里嘎多 狗災媽斯",
   "roman": "arigatou gozaimasu",
   "order": 200
  }
 },
 {
  "col": "phrases",
  "id": "ja-03",
  "data": {
   "lang": "ja",
   "cat": "禮貌",
   "zh": "不好意思／借過",
   "th": "すみません",
   "say": "蘇咪媽森",
   "roman": "sumimasen",
   "order": 300
  }
 },
 {
  "col": "phrases",
  "id": "ja-04",
  "data": {
   "lang": "ja",
   "cat": "餐廳",
   "zh": "請給我這個",
   "th": "これをください",
   "say": "摳咧喔 哭搭賽",
   "roman": "kore o kudasai",
   "order": 400
  }
 },
 {
  "col": "phrases",
  "id": "ja-05",
  "data": {
   "lang": "ja",
   "cat": "餐廳",
   "zh": "不要辣",
   "th": "辛くしないでください",
   "say": "卡拉哭 西奈爹 哭搭賽",
   "roman": "karaku shinaide kudasai",
   "order": 500
  }
 },
 {
  "col": "phrases",
  "id": "ja-06",
  "data": {
   "lang": "ja",
   "cat": "餐廳",
   "zh": "不要加冰",
   "th": "氷なしでお願いします",
   "say": "闊歐里 那西爹 歐聶嘎伊西媽斯",
   "roman": "koori nashi de onegaishimasu",
   "order": 600
  }
 },
 {
  "col": "phrases",
  "id": "ja-07",
  "data": {
   "lang": "ja",
   "cat": "餐廳",
   "zh": "請結帳",
   "th": "お会計お願いします",
   "say": "歐凱K 歐聶嘎伊西媽斯",
   "roman": "okaikei onegaishimasu",
   "order": 700
  }
 },
 {
  "col": "phrases",
  "id": "ja-08",
  "data": {
   "lang": "ja",
   "cat": "餐廳",
   "zh": "好吃",
   "th": "おいしい",
   "say": "歐伊西",
   "roman": "oishii",
   "order": 800
  }
 },
 {
  "col": "phrases",
  "id": "ja-09",
  "data": {
   "lang": "ja",
   "cat": "餐廳",
   "zh": "有中文菜單嗎？",
   "th": "中国語のメニューはありますか",
   "say": "秋勾苦勾諾 妹妞哇 阿里媽斯卡",
   "roman": "chuugokugo no menyuu wa arimasu ka",
   "order": 900
  }
 },
 {
  "col": "phrases",
  "id": "ja-10",
  "data": {
   "lang": "ja",
   "cat": "購物",
   "zh": "多少錢？",
   "th": "いくらですか",
   "say": "伊庫拉 爹斯卡",
   "roman": "ikura desu ka",
   "order": 1000
  }
 },
 {
  "col": "phrases",
  "id": "ja-11",
  "data": {
   "lang": "ja",
   "cat": "購物",
   "zh": "可以刷卡嗎？",
   "th": "カードは使えますか",
   "say": "卡多哇 次卡耶媽斯卡",
   "roman": "kaado wa tsukaemasu ka",
   "order": 1100
  }
 },
 {
  "col": "phrases",
  "id": "ja-12",
  "data": {
   "lang": "ja",
   "cat": "購物",
   "zh": "可以免稅嗎？",
   "th": "免税できますか",
   "say": "悶賊 爹key媽斯卡",
   "roman": "menzei dekimasu ka",
   "order": 1200
  }
 },
 {
  "col": "phrases",
  "id": "ja-13",
  "data": {
   "lang": "ja",
   "cat": "交通",
   "zh": "請到這裡",
   "th": "ここまでお願いします",
   "say": "摳摳媽爹 歐聶嘎伊西媽斯",
   "roman": "koko made onegaishimasu",
   "order": 1300
  }
 },
 {
  "col": "phrases",
  "id": "ja-14",
  "data": {
   "lang": "ja",
   "cat": "交通",
   "zh": "車站在哪裡？",
   "th": "駅はどこですか",
   "say": "欸key哇 都摳 爹斯卡",
   "roman": "eki wa doko desu ka",
   "order": 1400
  }
 },
 {
  "col": "phrases",
  "id": "ja-15",
  "data": {
   "lang": "ja",
   "cat": "求助",
   "zh": "廁所在哪裡？",
   "th": "トイレはどこですか",
   "say": "偷伊咧哇 都摳 爹斯卡",
   "roman": "toire wa doko desu ka",
   "order": 1500
  }
 },
 {
  "col": "phrases",
  "id": "ja-16",
  "data": {
   "lang": "ja",
   "cat": "求助",
   "zh": "請幫幫我",
   "th": "助けてください",
   "say": "他斯克爹 哭搭賽",
   "roman": "tasukete kudasai",
   "order": 1600
  }
 },
 {
  "col": "phrases",
  "id": "ja-17",
  "data": {
   "lang": "ja",
   "cat": "求助",
   "zh": "我不舒服",
   "th": "気分が悪いです",
   "say": "key本嘎 哇嚕伊 爹斯",
   "roman": "kibun ga warui desu",
   "order": 1700
  }
 },
 {
  "col": "phrases",
  "id": "ja-18",
  "data": {
   "lang": "ja",
   "cat": "求助",
   "zh": "請叫救護車",
   "th": "救急車を呼んでください",
   "say": "Q-Q夏喔 用爹 哭搭賽",
   "roman": "kyuukyuusha o yonde kudasai",
   "order": 1800
  }
 },
 {
  "col": "phrases",
  "id": "ko-01",
  "data": {
   "lang": "ko",
   "cat": "禮貌",
   "zh": "你好",
   "th": "안녕하세요",
   "say": "安妞哈誰呦",
   "roman": "annyeonghaseyo",
   "order": 100
  }
 },
 {
  "col": "phrases",
  "id": "ko-02",
  "data": {
   "lang": "ko",
   "cat": "禮貌",
   "zh": "謝謝",
   "th": "감사합니다",
   "say": "砍撒哈米達",
   "roman": "gamsahamnida",
   "order": 200
  }
 },
 {
  "col": "phrases",
  "id": "ko-03",
  "data": {
   "lang": "ko",
   "cat": "禮貌",
   "zh": "對不起",
   "th": "죄송합니다",
   "say": "粗送哈米達",
   "roman": "joesonghamnida",
   "order": 300
  }
 },
 {
  "col": "phrases",
  "id": "ko-04",
  "data": {
   "lang": "ko",
   "cat": "禮貌",
   "zh": "（叫店員）不好意思",
   "th": "저기요",
   "say": "秋key呦",
   "roman": "jeogiyo",
   "order": 400
  }
 },
 {
  "col": "phrases",
  "id": "ko-05",
  "data": {
   "lang": "ko",
   "cat": "餐廳",
   "zh": "請給我這個",
   "th": "이거 주세요",
   "say": "一勾 啾誰呦",
   "roman": "igeo juseyo",
   "order": 500
  }
 },
 {
  "col": "phrases",
  "id": "ko-06",
  "data": {
   "lang": "ko",
   "cat": "餐廳",
   "zh": "不要辣",
   "th": "안 맵게 해 주세요",
   "say": "安 妹給 黑 啾誰呦",
   "roman": "an maepge hae juseyo",
   "order": 600
  }
 },
 {
  "col": "phrases",
  "id": "ko-07",
  "data": {
   "lang": "ko",
   "cat": "餐廳",
   "zh": "請給我水",
   "th": "물 주세요",
   "say": "木 啾誰呦",
   "roman": "mul juseyo",
   "order": 700
  }
 },
 {
  "col": "phrases",
  "id": "ko-08",
  "data": {
   "lang": "ko",
   "cat": "餐廳",
   "zh": "好吃",
   "th": "맛있어요",
   "say": "媽西搜呦",
   "roman": "masisseoyo",
   "order": 800
  }
 },
 {
  "col": "phrases",
  "id": "ko-09",
  "data": {
   "lang": "ko",
   "cat": "餐廳",
   "zh": "請結帳",
   "th": "계산해 주세요",
   "say": "K散黑 啾誰呦",
   "roman": "gyesanhae juseyo",
   "order": 900
  }
 },
 {
  "col": "phrases",
  "id": "ko-10",
  "data": {
   "lang": "ko",
   "cat": "購物",
   "zh": "多少錢？",
   "th": "얼마예요?",
   "say": "喔媽耶呦",
   "roman": "eolmayeyo",
   "order": 1000
  }
 },
 {
  "col": "phrases",
  "id": "ko-11",
  "data": {
   "lang": "ko",
   "cat": "購物",
   "zh": "算便宜一點",
   "th": "좀 깎아 주세요",
   "say": "縱 嘎嘎 啾誰呦",
   "roman": "jom kkakka juseyo",
   "order": 1100
  }
 },
 {
  "col": "phrases",
  "id": "ko-12",
  "data": {
   "lang": "ko",
   "cat": "購物",
   "zh": "可以刷卡嗎？",
   "th": "카드 돼요?",
   "say": "卡德 對呦",
   "roman": "kadeu dwaeyo",
   "order": 1200
  }
 },
 {
  "col": "phrases",
  "id": "ko-13",
  "data": {
   "lang": "ko",
   "cat": "交通",
   "zh": "請到這裡",
   "th": "여기로 가 주세요",
   "say": "呦key囉 卡 啾誰呦",
   "roman": "yeogiro ga juseyo",
   "order": 1300
  }
 },
 {
  "col": "phrases",
  "id": "ko-14",
  "data": {
   "lang": "ko",
   "cat": "交通",
   "zh": "地鐵站在哪裡？",
   "th": "지하철역 어디예요?",
   "say": "七哈抽溜 喔滴耶呦",
   "roman": "jihacheollyeok eodiyeyo",
   "order": 1400
  }
 },
 {
  "col": "phrases",
  "id": "ko-15",
  "data": {
   "lang": "ko",
   "cat": "求助",
   "zh": "廁所在哪裡？",
   "th": "화장실 어디예요?",
   "say": "花張西 喔滴耶呦",
   "roman": "hwajangsil eodiyeyo",
   "order": 1500
  }
 },
 {
  "col": "phrases",
  "id": "ko-16",
  "data": {
   "lang": "ko",
   "cat": "求助",
   "zh": "請幫幫我",
   "th": "도와주세요",
   "say": "投哇啾誰呦",
   "roman": "dowajuseyo",
   "order": 1600
  }
 },
 {
  "col": "phrases",
  "id": "ko-17",
  "data": {
   "lang": "ko",
   "cat": "求助",
   "zh": "我不舒服",
   "th": "몸이 안 좋아요",
   "say": "摸米 安 秋阿呦",
   "roman": "momi an joayo",
   "order": 1700
  }
 }
];
