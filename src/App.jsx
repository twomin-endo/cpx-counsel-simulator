import React, { useState, useEffect } from 'react';
import { 
  Clock, CheckSquare, User, FileText, RefreshCw, Activity, Heart, 
  AlertCircle, ChevronRight, Stethoscope, Play, Pause, RotateCcw, 
  BookOpen, Thermometer, Mic, Pill, Wine, Coffee, Droplets, Scale, Cigarette, HelpCircle, MessageSquare, Star, Layout 
} from 'lucide-react';

// --- 데이터: 순환기내과 + 대사 CPX 시나리오 (총 8개 - Full Script Version) ---
const SCENARIOS = [
  {
    id: 'chest_pain',
    title: '흉통 (Chest Pain)',
    category: 'Emergency / Ischemic',
    chiefComplaint: '가슴이 쥐어짜듯이 아파서 왔어요.',
    vitals: { BP: '150/95', HR: '92', RR: '22', BT: '36.5℃', SpO2: '96%' },
    patientScript: {
      profile: '55세 남성, 건설 현장 소장',
      presentIllness: '오늘 아침 8시쯤 현장 순찰을 돌면서 언덕길을 오르는데 갑자기 가슴 중앙이 짓눌리는 것처럼 아팠습니다. 식은땀도 나고 숨도 좀 찼습니다. 5분 정도 쪼그려 앉아 쉬니까 조금 나아지긴 했는데, 이런 적은 처음이라 겁이 나서 왔습니다.',
      details: {
        onset: '오늘 아침 8시경 (활동 중 발생)',
        location: '흉골 하부(Substernal), 명치 부근',
        duration: '약 5~10분 지속 후 호전',
        character: '짓눌리고 쥐어짜는 느낌 (Squeezing, Pressure)',
        aggravating: '운동(계단/언덕 오르기), 찬 바람 맞을 때',
        relieving: '휴식 시 3-5분 내 호전',
        radiation: '왼쪽 어깨와 팔 안쪽으로 뻗침',
        associated: '오심(Nausea) 약간, 식은땀(Diaphoresis), 호흡곤란',
      },
      pastHistory: '고혈압(5년 전 진단, 불규칙하게 복용), 고지혈증(진단받았으나 약 안 먹음)',
      socialHistory: '흡연 30갑년(현재 1갑/일), 음주 주 3-4회(소주 1-2병), 짠 음식 선호',
      familyHistory: '아버지가 60대 초반에 급성 심근경색으로 사망',
      medication: '암로디핀 5mg (가끔 생각날 때만 복용)'
    },
    checklist: [
      { category: 'History (병력청취)', items: [
        { id: 'h1', text: 'O (Onset): 언제, 무엇을 할 때 시작되었나?', question: '통증이 정확히 언제 시작되었나요? 그때 무엇을 하고 계셨습니까?', points: 1 },
        { id: 'h2', text: 'L (Location): 정확한 위치 및 방사통(Radiation) 확인', question: '가슴 어디가 아프신가요? 어깨나 팔, 턱 쪽으로 통증이 뻗치지는 않나요?', points: 1 },
        { id: 'h3', text: 'D (Duration): 통증 지속 시간 (30분 이상인지 확인)', question: '아픈 증상이 몇 분 정도 지속되었나요? 지금도 계속 아프신가요?', points: 1 },
        { id: 'h4', text: 'C (Character): 통증 양상 (쥐어짜는, 찌르는)', question: '어떻게 아프신가요? 쥐어짜나요, 아니면 바늘로 찌르는 것 같나요?', points: 1 },
        { id: 'h5', text: 'A (Aggravating/Relieving): 악화/완화 요인', question: '계단을 오르거나 운동할 때 더 심해지나요? 쉬면 좀 나아집니까?', points: 2 },
        { id: 'h6', text: 'A (Associated): 식은땀, 오심, 호흡곤란 유무', question: '아플 때 식은땀이 나거나 토할 것 같지는 않았나요? 숨은 안 차셨나요?', points: 1 },
        { id: 'h7', text: 'Risk Factors: 기저질환 및 가족력', question: '혈압, 당뇨, 고지혈증 있다고 들으신 적 있나요? 가족 중에 심장병 앓으신 분 계신가요?', points: 2 },
      ]},
      { category: 'Physical Exam (신체진찰)', items: [
        { id: 'p1', text: 'General: 안색(창백), 발한, 통증 정도 관찰', question: '(시진) 환자가 식은땀을 흘리거나 통증으로 가슴을 움켜쥐고 있는지 확인', points: 1 },
        { id: 'p2', text: 'Vital Signs: 양팔 혈압 측정 (대동맥 박리 감별)', question: '양쪽 팔 혈압을 비교해서 재보겠습니다. (Dissection 감별)', points: 1 },
        { id: 'p3', text: 'Neck: 경정맥 확장(JVP) 확인', question: '고개를 45도 돌려보세요. 목 정맥이 늘어나 있는지 보겠습니다.', points: 1 },
        { id: 'p4', text: 'Chest: 심잡음, 제3/4심음, 폐음(Rale) 청진', question: '숨을 깊게 들이마시고 참아보세요. (심음 및 폐음 청진)', points: 2 },
        { id: 'p5', text: 'Abd: 복부 대동맥 박동 확인 (AAA 감별)', question: '배에 맥박이 뛰는 덩어리가 만져지는지 확인하겠습니다.', points: 1 },
      ]},
      { category: 'Education (환자교육)', items: [
        { id: 'e1', text: '진단: 협심증 의심 및 심근경색 감별 필요성 설명', question: '증상을 들어보니 심장 혈관이 좁아진 협심증이 의심됩니다.', points: 1 },
        { id: 'e2', text: '검사: 심전도, 효소검사, 심초음파 계획', question: '지금 당장 심전도와 피검사를 해서 심근경색 여부를 확인해야 합니다.', points: 1 },
        { id: 'e3', text: '응급처치: 흉통 30분 이상 지속 시 즉시 내원', question: '만약 흉통이 30분 이상 안 멈추면 바로 119를 부르셔야 합니다.', points: 2 },
        { id: 'e4', text: '생활습관: 금연 필수, 저염식, 규칙적 투약', question: '담배는 당장 끊으셔야 하고, 혈압약도 매일 드셔야 합니다.', points: 1 },
      ]}
    ],
    script: [
      { type: 'direction', text: '🎬 [도입: 1분] 환자가 가슴을 움켜쥐고 입장. 의사는 일어나서 맞이한다.' },
      { type: 'doctor', text: '반갑습니다. 환자분 성함과 생년월일을 확인해주시겠습니까?' },
      { type: 'patient', text: '김철수, 70년생입니다. 으... 가슴이...' },
      { type: 'doctor', text: '네, 김철수님. 어디가 많이 불편하신가요? 표정이 안 좋아 보이십니다.' },
      { type: 'patient', text: '가슴이... 쥐어짜듯이 아파서 왔어요. 죽는 줄 알았습니다.' },
      { type: 'tip', text: '💡 공감(Empathy): "많이 놀라셨겠네요. 지금은 좀 어떠신가요?"라고 안심시키는 멘트 필수.' },
      { type: 'doctor', text: '많이 놀라셨겠네요. 지금도 통증이 계속되시나요?' },
      { type: 'patient', text: '지금은 좀 괜찮은데 아까는 식은땀이 날 정도였어요.' },
      
      { type: 'direction', text: '🎬 [병력 청취: 4분] OLD COART 중심으로 질문 시작.' },
      { type: 'doctor', text: '언제 처음 아프기 시작했나요? 그때 뭐 하고 계셨습니까?' },
      { type: 'patient', text: '오늘 아침 8시쯤에요. 현장 순찰한다고 언덕길을 좀 올라가는데 갑자기 그랬어요.' },
      { type: 'doctor', text: '아픈 부위를 손가락으로 한번 짚어보시겠어요? 통증이 다른 곳으로 뻗치지는 않았나요?' },
      { type: 'patient', text: '(주먹으로 가슴 중앙을 누르며) 여기가 꽉 눌리는 것 같았고, 왼쪽 어깨랑 팔 안쪽이 저릿했어요.' },
      { type: 'doctor', text: '통증은 몇 분 정도 지속됐나요? 쉬니까 좀 나아지던가요?' },
      { type: 'patient', text: '한 5분? 쪼그려 앉아서 쉬니까 금방 괜찮아지더라고요.' },
      { type: 'doctor', text: '가슴 아플 때 숨이 차거나 어지럽지는 않았나요? 신물이 올라오거나 하진 않았고요?' },
      { type: 'tip', text: '💡 감별진단: 위식도역류(GERD)나 호흡기 질환 감별 질문 포함.' },
      { type: 'patient', text: '숨은 좀 찼는데 소화가 안 되거나 하진 않았어요.' },
      { type: 'doctor', text: '과거력을 좀 여쭤보겠습니다. 고혈압이나 당뇨 있으신가요?' },
      { type: 'patient', text: '혈압약은 먹고 있는데... 가끔 빼먹어요.' },
      { type: 'doctor', text: '가족분들 중에 심장 문제로 돌아가신 분이 계신가요?' },
      { type: 'patient', text: '아버지가 60대에 심근경색으로 돌아가셨습니다.' },
      { type: 'doctor', text: '술, 담배는 하시나요?' },
      { type: 'patient', text: '담배는 하루 한 갑 30년 피웠습니다.' },

      { type: 'direction', text: '🎬 [신체 진찰: 3분] 의사는 손 소독제로 손을 닦는 시늉을 한다.' },
      { type: 'tip', text: '💡 위생: "진찰 전 손을 씻겠습니다"라고 말하며 제스처 취하기.' },
      { type: 'doctor', text: '정확한 상태를 보기 위해 진찰을 하겠습니다. 침대에 편안히 누워보세요.' },
      { type: 'doctor', text: '먼저 눈을 보겠습니다. 위를 봐주세요. (빈혈 확인) 입을 벌려보세요. (청색증/탈수 확인)' },
      { type: 'doctor', text: '목을 보겠습니다. 고개를 왼쪽으로 돌려보세요. (경정맥 확장 JVP 확인)' },
      { type: 'doctor', text: '가슴을 청진하겠습니다. 옷을 살짝 올리겠습니다.' },
      { type: 'tip', text: '💡 청진 Tip: "숨을 크게 들이마시고... 내쉬세요."를 반복하며 전흉부와 등 뒤를 꼼꼼히 청진하는 척해야 합니다.' },
      { type: 'doctor', text: '(심음 청진 후) 심장 소리는 규칙적입니다. 이제 폐 소리를 듣겠습니다.' },
      { type: 'doctor', text: '누운 김에 배도 좀 보겠습니다. (복부 대동맥 박동 확인 - AAA 감별)' },
      { type: 'doctor', text: '마지막으로 다리를 좀 걷어보겠습니다. (정강이 눌러보며 부종 확인)' },
      { type: 'direction', text: '진찰을 마치고 다시 자리에 앉는다.' },

      { type: 'direction', text: '🎬 [환자 교육 및 마무리: 2분] 진단과 향후 계획 설명.' },
      { type: 'doctor', text: '환자분, 증상과 진찰 소견을 종합해볼 때 심장 혈관이 좁아지는 "협심증"이 강력하게 의심됩니다.' },
      { type: 'doctor', text: '지금 당장은 통증이 없지만, 언제든 혈관이 완전히 막히는 심근경색으로 진행할 수 있어 매우 위험합니다.' },
      { type: 'patient', text: '심근경색이요? 아버지처럼 되는 건가요?' },
      { type: 'doctor', text: '너무 걱정 마세요. 지금 발견해서 다행입니다. 정확한 진단을 위해 바로 심전도와 피검사, 심장 초음파를 진행하겠습니다.' },
      { type: 'doctor', text: '가장 중요한 건 금연입니다. 그리고 처방해드리는 아스피린과 혈압약을 절대 빼먹지 말고 드셔야 합니다.' },
      { type: 'doctor', text: '혹시 댁에서 또 가슴이 아픈데, 쉬어도 20분 이상 안 멈춘다면 바로 119를 불러서 응급실로 오셔야 합니다. 아시겠습니까?' },
      { type: 'patient', text: '네, 알겠습니다 선생님.' },
      { type: 'doctor', text: '궁금하신 점 있으신가요?' },
      { type: 'patient', text: '없습니다.' },
      { type: 'doctor', text: '네, 그럼 밖에서 검사 안내 받으십시오. 안녕히 가세요.' }
    ],
    clinicalPearls: [
      '**Stable Angina vs ACS:** 휴식 시 호전되는지(Stable), 휴식 시에도 아프거나 빈도/강도가 증가하는지(Unstable/MI) 감별하는 것이 최우선입니다.',
      '**Endocrine Context (Diabetes):** 당뇨병 환자는 전형적인 흉통 없이 "숨이 차다", "소화가 안 된다" 같은 모호한 증상(Silent MI)으로 올 수 있으니 역치(Threshold)를 낮춰 검사하세요.',
      '**Differential Diagnosis:** 흉통의 3대 응급 질환인 급성 심근경색(AMI), 대동맥 박리(Aortic Dissection), 폐색전증(Pulmonary Embolism)을 항상 염두에 두세요.',
      '**Physical Exam:** 흉통 환자에서 "압통(Tenderness)"이 있다면 근골격계 통증일 가능성이 높습니다. 꼭 눌러보세요.'
    ]
  },
  // ... (다른 시나리오들도 동일하게 포함됩니다. 코드가 너무 길어 생략된 부분은 위와 동일합니다) ...
  {
    id: 'palpitations',
    title: '두근거림 (Palpitations)',
    category: 'Arrhythmia',
    chiefComplaint: '가슴이 덜컹거리고 두근거려요.',
    vitals: { BP: '120/70', HR: '108 (Irregular)', RR: '18', BT: '36.8℃', SpO2: '98%' },
    patientScript: {
      profile: '29세 여성, 마케팅 회사 대리',
      presentIllness: '최근 프로젝트 마감이 있어서 야근을 며칠 했습니다. 어젯밤에 커피를 3잔 정도 마시고 작업을 하는데, 갑자기 심장이 막 불규칙하게 쿵쿵 뛰어서 너무 놀랐습니다. 1시간 정도 그러다가 지금은 좀 덜한데 여전히 불안해요.',
      details: {
        onset: '어젯밤 10시경 (과로 및 카페인 섭취 후)',
        location: '가슴 전체, 목 부위까지 느껴짐',
        duration: '1시간 지속 후 호전, 현재는 간헐적',
        character: '맥이 건너뛰는 느낌(Skipping), 불규칙하게 빠름',
        aggravating: '커피, 스트레스, 수면 부족, 누워 있을 때',
        relieving: '심호흡을 크게 하면 잠시 안정됨',
        radiation: '없음',
        associated: '어지러움(Dizziness) 경미함, 숨참, 불안감',
      },
      pastHistory: '3년 전 갑상선 기능 항진증(그레이브스병) 치료 후 약 중단',
      socialHistory: '흡연 안함, 음주 주 1회(맥주 2캔), 커피 하루 4-5잔(아이스 아메리카노)',
      familyHistory: '어머니 부정맥(심방세동) 시술 받으심',
      medication: '종합비타민, 다이어트 보조제(최근 복용 시작)'
    },
    checklist: [
      { category: 'History (병력청취)', items: [
        { id: 'h1', text: 'Onset/Offset: 시작과 종료 양상', question: '두근거림이 스위치 켜듯 갑자기 시작됐나요, 아니면 서서히 심해졌나요? 멈출 때는 어땠나요?', points: 1 },
        { id: 'h2', text: 'Character: 규칙성 확인', question: '규칙적으로 쿵-쿵-쿵 뛰나요, 아니면 엇박자로 불규칙하게 뛰나요?', points: 2 },
        { id: 'h3', text: 'Trigger: 유발 요인 확인', question: '증상 전에 커피, 술, 심한 운동, 스트레스 같은 게 있었나요?', points: 1 },
        { id: 'h4', text: 'Associated: 실신, 흉통, 호흡곤란', question: '두근거릴 때 어지러워서 쓰러질 뻔하거나 숨이 차진 않았나요?', points: 2 },
        { id: 'h5', text: 'Past Hx: 갑상선 및 심장 질환', question: '예전에 갑상선 질환이나 심장 문제로 치료받으신 적 있나요?', points: 1 },
        { id: 'h6', text: 'Medication: 유발 약물 확인', question: '최근에 드시는 다이어트 약이나 감기약 같은 게 있나요?', points: 1 },
      ]},
      { category: 'Physical Exam (신체진찰)', items: [
        { id: 'p1', text: 'Pulse: 요골동맥 맥박수 및 규칙성 측정', question: '손목 맥박을 1분 동안 짚어보며 규칙적인지 확인하겠습니다.', points: 2 },
        { id: 'p2', text: 'Eye/Neck: 갑상선 항진증 징후 확인', question: '눈이 좀 튀어나오지 않았는지, 목 앞쪽이 부어있는지 만져보겠습니다.', points: 1 },
        { id: 'p3', text: 'Heart: 심음 청진', question: '심장 소리를 들어보겠습니다. (맥박 결손이 있는지 확인)', points: 2 },
      ]},
      { category: 'Education (환자교육)', items: [
        { id: 'e1', text: '진단: 부정맥 의심 및 갑상선 재발 가능성', question: '맥박이 불규칙한 것으로 보아 부정맥이 의심되며, 갑상선 기능 이상도 확인이 필요합니다.', points: 1 },
        { id: 'e2', text: '검사: 24시간 홀터, 갑상선 기능 검사', question: '하루 종일 기계를 차고 있는 홀터 검사와 피검사를 해봅시다.', points: 1 },
        { id: 'e3', text: '생활: 카페인 제한, 다이어트 약 중단', question: '커피와 다이어트 약은 심장을 뛰게 하니 당분간 끊으셔야 합니다.', points: 1 },
        { id: 'e4', text: '대처: 발살바 수기 및 응급 내원', question: '갑자기 맥이 빠르면 숨을 크게 참고 힘을 주는 동작(Valsalva)을 해보세요.', points: 1 },
      ]}
    ],
    script: [
      { type: 'direction', text: '🎬 [도입: 1분] 환자가 가슴에 손을 얹고 불안한 표정으로 앉아있다.' },
      { type: 'doctor', text: '안녕하세요. 환자분 성함이 어떻게 되시죠?' },
      { type: 'patient', text: '이영희요. 선생님, 가슴이 막 덜컹거리고 두근거려서 왔어요.' },
      { type: 'doctor', text: '가슴이 두근거리시는군요. 많이 불안하시겠어요. 언제부터 그런 증상이 시작됐나요?' },
      
      { type: 'direction', text: '🎬 [병력 청취: 4분] 유발요인과 양상(Onset/Character) 파악.' },
      { type: 'patient', text: '어젯밤 10시쯤요. 야근하면서 커피를 좀 많이 마셨는데 갑자기 심장이 쿵쿵거리더라고요.' },
      { type: 'doctor', text: '갑자기 시작됐군요. 두근거림이 규칙적으로 쿵-쿵 뛰나요, 아니면 불규칙하게 엇박자로 뛰나요?' },
      { type: 'tip', text: '💡 규칙성 확인: 부정맥 감별의 핵심. "건너뛰나요?", "맥이 빠지나요?" 등으로 재확인.' },
      { type: 'patient', text: '막 제멋대로 뛰어요. 건너뛰는 느낌도 들고요.' },
      { type: 'doctor', text: '증상은 얼마나 지속됐나요? 갑자기 멈췄나요, 아니면 서서히 좋아졌나요?' },
      { type: 'patient', text: '한 1시간 정도 그러다가 서서히 괜찮아졌어요. 심호흡 하니까 좀 낫더라고요.' },
      { type: 'doctor', text: '두근거릴 때 어지럽거나 숨이 차지는 않으셨나요? 흉통은 없었고요?' },
      { type: 'patient', text: '좀 어지럽고 숨도 약간 찼어요. 아프진 않았고요.' },
      { type: 'doctor', text: '예전에도 갑상선이나 심장 쪽으로 치료받으신 적 있나요?' },
      { type: 'patient', text: '네, 3년 전에 갑상선 항진증 약 먹다가 다 나았다고 해서 끊었어요.' },
      { type: 'tip', text: '💡 Past History Catch: 갑상선 병력은 빈맥의 흔한 원인. 내분비내과 의사라면 놓치면 안 됨.' },
      { type: 'doctor', text: '최근에 드시는 약이나 건강보조식품, 다이어트 약 같은 건 없나요?' },
      { type: 'patient', text: '아, 다이어트 보조제를 얼마 전부터 먹기 시작했어요.' },
      
      { type: 'direction', text: '🎬 [신체 진찰: 3분] 의사는 손을 씻고 환자에게 다가간다.' },
      { type: 'doctor', text: '그 약이 심장을 뛰게 할 수도 있습니다. 진찰을 좀 해보겠습니다. 손을 앞으로 뻗어보세요.' },
      { type: 'doctor', text: '(손 떨림 확인 후) 이제 제 손가락을 보세요. (안구 움직임 및 Lid lag 확인)' },
      { type: 'doctor', text: '목을 좀 만져보겠습니다. 침을 한번 삼켜보세요. (갑상선 비대 촉진)' },
      { type: 'tip', text: '💡 Thyroid Palpation: 환자 뒤에서 혹은 앞에서 양손으로 갑상선을 촉지하며 "침 삼키세요"라고 지시.' },
      { type: 'doctor', text: '이제 심장 소리를 듣겠습니다. (청진기를 가슴에 대고 불규칙한 리듬 확인)' },
      { type: 'doctor', text: '손목 맥박도 한번 짚어보겠습니다. (요골동맥 촉지)' },
      { type: 'direction', text: '맥박을 15초 이상 신중하게 세는 척 한다.' },

      { type: 'direction', text: '🎬 [환자 교육 및 마무리: 2분]' },
      { type: 'doctor', text: '환자분, 진찰해보니 맥박이 빠르고 불규칙합니다. 목도 약간 부어있고요.' },
      { type: 'doctor', text: '지금 증상은 부정맥이 의심되고, 갑상선 기능 항진증이 재발했을 가능성도 있습니다. 다이어트 약 성분 때문일 수도 있고요.' },
      { type: 'patient', text: '다시 재발한 건가요? ㅠㅠ' },
      { type: 'doctor', text: '검사를 해봐야 확실히 알 수 있습니다. 오늘 24시간 심전도(홀터) 검사와 갑상선 피검사를 하고 가시는 게 좋겠습니다.' },
      { type: 'doctor', text: '결과 나올 때까지는 커피와 다이어트 약은 완전히 끊으셔야 합니다. 술도 피하시고요.' },
      { type: 'doctor', text: '혹시 집에서 또 갑자기 심장이 뛰면, 숨을 크게 들이마시고 배에 힘을 주는 동작(발살바)을 해보세요. 그래도 안 멈추거나 어지러우면 병원으로 오셔야 합니다.' },
      { type: 'patient', text: '네, 알겠습니다.' }
    ],
    clinicalPearls: [
      '**Onset/Offset:** 갑자기 시작해서 갑자기 멈추는(Sudden On/Off) 양상은 **PSVT**의 강력한 특징입니다. 서서히 빨라졌다 서서히 느려지면 Sinus Tachycardia일 가능성이 높습니다.',
      '**Endocrine Context:** 젊은 여성의 두근거림에서 **갑상선 기능 항진증(Thyrotoxicosis)**, **저혈당(Hypoglycemia)**, **갈색세포종(Pheochromocytoma)**을 꼭 감별해야 합니다. 다이어트 약(교감신경 흥분제) 복용력도 흔한 원인입니다.',
      '**Irregularly Irregular:** 맥박이 불규칙하게 불규칙하다면 **심방세동(Atrial Fibrillation)**입니다. 뇌졸중 위험이 있으므로 항응고 치료 여부를 고민해야 합니다.'
    ]
  },
  {
    id: 'syncope',
    title: '실신 (Syncope)',
    category: 'Neurologic / Cardiac',
    chiefComplaint: '아침 조회 시간에 쓰러졌어요.',
    vitals: { BP: '98/60', HR: '70', RR: '18', BT: '36.5℃', SpO2: '99%' },
    patientScript: {
      profile: '17세 여자 고등학생',
      presentIllness: '오늘 아침 학교 운동장에서 교장 선생님 훈화 말씀을 듣느라 30분 정도 서 있었는데, 갑자기 속이 메스껍고 눈앞이 하얘지더니 기억을 잃었습니다. 친구들 말로는 제가 스르르 주저앉았고 30초 정도 뒤에 깨어났다고 해요.',
      details: {
        onset: '아침 8시 30분경, 오래 서 있는 상황',
        location: '학교 운동장 (더운 날씨)',
        duration: '의식 소실 1분 미만, 금방 회복됨',
        character: '쓰러지기 전 식은땀, 오심, 시야 흐림(Tunnel vision)',
        aggravating: '오래 서 있기(Prolonged standing), 공복, 탈수',
        relieving: '누워 있으면 편해짐',
        radiation: '해당 없음',
        associated: '경련 없었음, 소변 실금 없음, 깨어난 후 약간 멍하지만 지남력 있음',
      },
      pastHistory: '특이사항 없음, 초경 13세 (규칙적)',
      socialHistory: '아침 식사 자주 거름, 어제 밤 늦게까지 공부함',
      familyHistory: '어머니도 젊을 때 자주 어지러우셨다고 함',
      medication: '없음'
    },
    checklist: [
      { category: 'History (병력청취)', items: [
        { id: 'h1', text: 'Situation: 실신 당시 상황', question: '쓰러질 때 무엇을 하고 계셨나요? 오래 서 있었거나, 갑자기 일어났나요?', points: 2 },
        { id: 'h2', text: 'Prodrome: 전조증상 유무', question: '기절하기 직전에 속이 울렁거리지 않았나요? 눈앞이 하얘지거나 식은땀이 났나요?', points: 2 },
        { id: 'h3', text: 'Event: 의식 소실 및 경련 여부', question: '얼마나 오랫동안 정신을 잃었나요? 친구들이 몸을 떨거나 눈이 돌아갔다고 하던가요?', points: 1 },
        { id: 'h4', text: 'Recovery: 회복 양상', question: '깨어난 직후에 여기가 어딘지 바로 아셨나요, 아니면 한동안 멍했나요?', points: 1 },
        { id: 'h5', text: 'Cardiac Risk: 심장성 실신 배제', question: '평소에 운동하다가 숨이 차거나 가슴이 아픈 적은 없었나요?', points: 2 },
      ]},
      { category: 'Physical Exam (신체진찰)', items: [
        { id: 'p1', text: 'Vitals: 기립성 혈압 측정', question: '누워서 재고, 일어서서 1분/3분 뒤에 혈압을 다시 재보겠습니다. (기립성 저혈압 확인)', points: 2 },
        { id: 'p2', text: 'Heart: 심잡음 청진', question: '심장에서 잡음이 들리는지 꼼꼼히 들어보겠습니다. (HCMP 등 확인)', points: 2 },
        { id: 'p3', text: 'Neuro: 신경학적 검사', question: '동공 반응을 보고, 팔다리 힘이 잘 들어가는지 체크하겠습니다.', points: 1 },
        { id: 'p4', text: 'Injury: 외상 확인', question: '쓰러지면서 머리나 몸을 다친 곳은 없는지 살펴보겠습니다.', points: 1 },
      ]},
      { category: 'Education (환자교육)', items: [
        { id: 'e1', text: '진단: 미주신경성 실신 가능성 설명', question: '오래 서 있어서 혈액순환이 안 돼 생긴 미주신경성 실신 같습니다. 큰 병은 아닙니다.', points: 1 },
        { id: 'e2', text: '검사: 기립경 검사 및 심전도', question: '정확한 진단을 위해 테이블에 누워서 기울기를 조절하는 검사를 해볼 수 있습니다.', points: 1 },
        { id: 'e3', text: '대처: 전조증상 시 자세 교정', question: '다음에도 어지러우면 참지 말고 즉시 쪼그려 앉거나 누워야 다치지 않습니다.', points: 2 },
      ]}
    ],
    script: [
      { type: 'direction', text: '🎬 [도입: 1분] 교복을 입은 학생이 보호자 없이 혼자 들어온다.' },
      { type: 'doctor', text: '학생, 안색이 안 좋아 보이네요. 어디가 불편해서 왔어요?' },
      { type: 'patient', text: '오늘 아침 조회 시간에 서 있다가 기절했어요.' },
      { type: 'doctor', text: '저런, 많이 놀랐겠네. 다친 데는 없어요?' },
      { type: 'patient', text: '네, 엉덩방아만 찧었어요.' },

      { type: 'direction', text: '🎬 [병력 청취: 4분] 실신 전후 상황(Peri-syncope) 파악.' },
      { type: 'doctor', text: '쓰러질 때 상황을 좀 자세히 말해줄 수 있어요? 얼마나 서 있었나요?' },
      { type: 'patient', text: '한 30분 넘게 서 있었어요. 날씨도 좀 더웠고요.' },
      { type: 'doctor', text: '쓰러지기 직전에 몸에 어떤 느낌이 있었나요? 속이 울렁거리거나 눈앞이 캄캄해지진 않았어요?' },
      { type: 'tip', text: '💡 Prodrome(전조증상) 확인: 미주신경성 실신은 전조증상이 뚜렷한 반면, 부정맥에 의한 실신은 전조증상이 없는 경우가 많습니다.' },
      { type: 'patient', text: '네, 속이 막 메스껍고 식은땀이 나더니 눈앞이 하얘지면서 기억이 안 나요.' },
      { type: 'doctor', text: '그랬군요. 얼마나 오랫동안 정신을 잃었는지 들었어요?' },
      { type: 'patient', text: '친구들이 1분도 안 돼서 바로 깼다고 했어요. 몸을 떨거나 하진 않았대요.' },
      { type: 'doctor', text: '깨어났을 때 여기가 어딘지 바로 알았나요, 아니면 한동안 멍했나요?' },
      { type: 'tip', text: '💡 Seizure 감별: 실신은 금방 정신이 돌아오지만(Alert), 간질 발작은 깨어난 후에도 혼돈(Confusion)이 깁니다.' },
      { type: 'patient', text: '바로 알았어요. 친구들이 쳐다보고 있어서 창피했어요.' },
      { type: 'doctor', text: '다행히 회복이 빨랐네요. 평소에 운동할 때 가슴이 아프거나 숨이 찬 적은 없었고요?' },
      { type: 'patient', text: '네, 그런 적은 없어요. 아침밥을 안 먹고 가서 그런가...' },

      { type: 'direction', text: '🎬 [신체 진찰: 3분] 기립성 혈압 측정 준비.' },
      { type: 'doctor', text: '빈혈이나 저혈압이 있는지 확인해볼게요. 눈 밑을 좀 내려보겠습니다. (결막 확인)' },
      { type: 'doctor', text: '누워서 혈압을 재고, 일어나서 1분 뒤에 다시 재보겠습니다. (기립성 혈압 측정 시늉)' },
      { type: 'tip', text: '💡 Orthostatic BP: "누웠을 때랑 일어났을 때 혈압 차이를 봅니다"라고 멘트하세요.' },
      { type: 'doctor', text: '심장 소리를 들어볼게요. (심잡음 청진 - 특히 HCMP 확인)' },
      { type: 'doctor', text: '신경학적 검사도 간단히 하겠습니다. 제 손가락을 눈으로 따라오세요. 팔을 들어서 버텨보세요.' },
      
      { type: 'direction', text: '🎬 [환자 교육 및 마무리: 2분]' },
      { type: 'doctor', text: '검사 결과 심장이나 뇌에는 큰 문제가 없어 보입니다. 오래 서 있어서 피가 다리로 쏠리면서 뇌로 가는 피가 부족해져서 생긴 "미주신경성 실신" 같아요.' },
      { type: 'patient', text: '큰 병은 아닌가요?' },
      { type: 'doctor', text: '네, 청소년기에 흔히 있을 수 있는 일입니다. 하지만 넘어지면서 머리를 다칠 수 있어 조심해야 합니다.' },
      { type: 'doctor', text: '다음에 또 속이 메스껍고 어지러운 느낌(전조증상)이 들면, 참지 말고 그 자리에 즉시 쪼그려 앉거나 누워야 합니다. 그래야 뇌로 피가 가서 안 쓰러집니다.' },
      { type: 'doctor', text: '그리고 아침밥 꼭 챙겨 먹고 물도 많이 마시세요.' },
      { type: 'patient', text: '네, 감사합니다.' }
    ],
    clinicalPearls: [
      '**Vasovagal vs Cardiogenic:** 전조증상(메스꺼움, 발한)이 뚜렷하고 상황(오래 서 있음, 채혈 등)이 명확하면 미주신경성입니다. 반면 **전조증상 없이 "툭" 쓰러지거나 운동 중에 발생하면 심장성(부정맥, 구조적 이상)**을 강력히 의심해야 합니다.',
      '**Seizure Differentiation:** 실신은 금방 깨어나고 의식이 명료(Oriented)해지지만, 발작은 깨어난 후에도 한참 동안 멍한 상태(Post-ictal confusion)가 지속됩니다.',
      '**Endocrine Context:** 당뇨병 환자의 반복된 실신/어지러움은 **자율신경병증(Autonomic Neuropathy)**에 의한 기립성 저혈압일 수 있습니다. 꼭 기립경 검사(Tilt Table)나 Orthostatic BP를 확인하세요.'
    ]
  },
  {
    id: 'dyspnea',
    title: '호흡곤란 (Dyspnea)',
    category: 'Heart Failure',
    chiefComplaint: '조금만 걸어도 숨이 차서 힘들어요.',
    vitals: { BP: '130/80', HR: '90', RR: '24', BT: '36.5℃', SpO2: '93% (RA)' },
    patientScript: {
      profile: '68세 남성, 은퇴 후 자영업',
      presentIllness: '2주 전부터 평지를 조금만 걸어도 숨이 찹니다(DOE). 어제 밤에는 자다가 숨이 막혀서 깼고(PND), 창문을 열고 숨을 쉬어야 했습니다. 요즘 다리도 붓는 것 같고, 베개를 2개 베야 잠을 잘 수 있습니다(Orthopnea).',
      details: {
        onset: '2주 전부터 서서히 악화됨',
        location: '가슴 전체 답답함',
        duration: '지속적, 밤에 더 심함',
        character: '숨을 깊게 쉴 수 없음, 물에 잠긴 느낌',
        aggravating: '누워 있을 때, 운동 시',
        relieving: '앉아 있으면 호전(Sit up)',
        radiation: '없음',
        associated: '기침(흰 가래), 하지 부종, 피로감, 야간뇨',
      },
      pastHistory: '10년 전 심근경색으로 스텐트 시술, 고혈압, 당뇨병(15년)',
      socialHistory: '과거 흡연 20년(10년 전 금연), 음주 가끔',
      familyHistory: '없음',
      medication: '아스피린, 혈압약, 당뇨약 복용 중(최근 소화 안 돼서 며칠 안 먹음)'
    },
    checklist: [
      { category: 'History (병력청취)', items: [
        { id: 'h1', text: 'Severity: 운동 시 호흡곤란 정도 (NYHA)', question: '평지를 걸을 때 숨이 차나요? 아니면 계단 오를 때만 차나요? (어느 정도 활동에 숨이 찬지)', points: 1 },
        { id: 'h2', text: 'Postural: 기좌호흡, 야간발작성 호흡곤란', question: '누우면 숨이 더 차서 앉아있어야 하나요? 자다가 숨이 차서 깬 적이 있습니까?', points: 2 },
        { id: 'h3', text: 'Volume Status: 부종, 체중 변화', question: '최근에 몸이 붓거나 몸무게가 갑자기 늘지는 않았나요?', points: 1 },
        { id: 'h4', text: 'Cause: 악화 요인(약물 중단, 짠 음식)', question: '최근에 드시던 심장약이나 혈압약을 빼먹은 적은 없으신가요? 짠 음식을 많이 드셨나요?', points: 1 },
        { id: 'h5', text: 'Differentiation: 폐질환 감별', question: '기침이나 가래가 심하게 나오거나 열이 나지는 않았습니까?', points: 1 },
      ]},
      { category: 'Physical Exam (신체진찰)', items: [
        { id: 'p1', text: 'Neck: 경정맥 확장(JVP) 및 HJR', question: '목 혈관이 늘어나 있는지 보고, 배를 눌렀을 때 목 혈관이 튀어나오는지 보겠습니다.', points: 2 },
        { id: 'p2', text: 'Chest: 폐 청진 (Crackle)', question: '등 뒤에서 폐 소리를 들어보겠습니다. (부글거리는 소리가 들리는지)', points: 2 },
        { id: 'p3', text: 'Extremities: Pitting Edema', question: '정강이 뼈 앞쪽을 눌러서 부기가 있는지 확인하겠습니다.', points: 1 },
      ]},
      { category: 'Education (환자교육)', items: [
        { id: 'e1', text: '진단: 심부전 악화 의심', question: '심장 기능이 떨어져서 폐에 물이 차는 심부전 증상입니다.', points: 1 },
        { id: 'e2', text: '검사: 흉부 X-ray, 심초음파, BNP', question: '폐 사진을 찍어보고, 피검사로 심장 수치를 확인해야 합니다.', points: 1 },
        { id: 'e3', text: '생활: 저염식, 매일 체중 측정', question: '싱겁게 드셔야 하고, 매일 아침 몸무게를 재서 2kg 이상 늘면 병원에 오셔야 합니다.', points: 2 },
      ]}
    ],
    script: [
      { type: 'direction', text: '🎬 [도입: 1분] 환자가 숨을 헐떡이며 천천히 걸어 들어온다.' },
      { type: 'doctor', text: '어르신, 숨이 많이 차 보이시네요. 괜찮으신가요?' },
      { type: 'patient', text: '어휴... 조금만 걸어도 숨이 차서 죽겠어.' },
      { type: 'doctor', text: '숨이 많이 차시군요. 언제부터 이렇게 심해지셨나요?' },
      { type: 'patient', text: '한 2주 됐어... 점점 더 심해지는 것 같아.' },

      { type: 'direction', text: '🎬 [병력 청취: 4분] 심부전 특이 증상(PND, Orthopnea) 확인.' },
      { type: 'doctor', text: '밤에 주무실 때는 괜찮으신가요? 누우면 숨이 더 차서 깨거나 하진 않으세요?' },
      { type: 'tip', text: '💡 PND/Orthopnea 확인: 심부전 진단의 핵심 열쇠(Key). "베개를 높게 베야 편하신가요?"' },
      { type: 'patient', text: '안 그래도 어제는 자다가 숨이 막혀서 깼어. 창문 열고 앉아 있으니 좀 낫더라고.' },
      { type: 'doctor', text: '전형적인 증상이네요. 요즘 다리가 붓거나 몸무게가 늘진 않으셨어요?' },
      { type: 'patient', text: '다리가 퉁퉁 부어. 신발이 안 들어갈 정도야.' },
      { type: 'doctor', text: '과거에 심장병이나 당뇨 앓으신 적 있나요?' },
      { type: 'patient', text: '10년 전에 심근경색으로 스텐트 넣었고, 당뇨도 있어.' },
      { type: 'doctor', text: '혹시 최근에 드시던 혈압약이나 심장약을 빼먹은 적은 없으신가요?' },
      { type: 'patient', text: '속이 좀 더부룩해서 며칠 안 먹긴 했지.' },
      { type: 'tip', text: '💡 악화 요인 탐색: 심부전 급성 악화의 가장 흔한 원인은 "약물 중단"과 "과도한 염분 섭취"입니다.' },
      { type: 'doctor', text: '가래가 나오거나 열이 나지는 않았나요? (폐렴 감별)' },
      { type: 'patient', text: '가래는 하얗게 조금 나오는데 열은 없어.' },

      { type: 'direction', text: '🎬 [신체 진찰: 3분] 체액 과부하(Volume Overload) 소견 확인.' },
      { type: 'doctor', text: '진찰을 좀 하겠습니다. 침대에 비스듬히 누워보세요. 목을 보겠습니다.' },
      { type: 'doctor', text: '배를 살짝 눌러보겠습니다. (Hepato-Jugular Reflux 확인)' },
      { type: 'doctor', text: '등 뒤에서 폐 소리를 듣겠습니다. 숨을 크게 쉬어보세요. (Rale/Crackles 청진)' },
      { type: 'tip', text: '💡 청진 소견: 심부전에서는 폐 하부에서 "찍찍"거리는 수포음(Crackle)이 들립니다.' },
      { type: 'doctor', text: '다리 정강이를 눌러보겠습니다. (Pitting Edema 확인)' },
      { type: 'doctor', text: '살이 푹 들어가서 안 나오네요. 몸에 물이 많이 찼습니다.' },

      { type: 'direction', text: '🎬 [환자 교육 및 마무리: 2분]' },
      { type: 'doctor', text: '어르신, 진찰해보니 심장 기능이 떨어져서 폐에 물이 차고 다리가 붓는 "심부전"이 악화된 상태입니다.' },
      { type: 'patient', text: '입원해야 하나?' },
      { type: 'doctor', text: '산소포화도가 낮아서 입원 치료가 안전할 것 같습니다. 엑스레이 찍고 이뇨제를 써서 물을 좀 빼내야 숨쉬기가 편해지실 겁니다.' },
      { type: 'doctor', text: '그리고 가장 중요한 건, 처방해드린 약을 절대 빼먹으시면 안 됩니다. 약을 안 드셔서 심장에 무리가 온 겁니다.' },
      { type: 'doctor', text: '식사하실 때 소금기도 줄이셔야 하고요. 아시겠죠?' },
      { type: 'patient', text: '알겠네. 고마워.' }
    ],
    clinicalPearls: [
      '**Specific Symptoms:** 호흡곤란 환자에서 **PND(야간 발작성 호흡곤란)**와 **Orthopnea(기좌호흡)**가 있다면 심부전일 확률이 매우 높습니다(High Specificity).',
      '**Physical Findings:** 청진 시 들리는 **S3 Gallop**과 **Coarse Crackles(수포음)**은 체액 저류(Volume Overload)의 강력한 증거입니다.',
      '**Endocrine Context:** **당뇨병성 심근병증(Diabetic Cardiomyopathy)** 환자는 관상동맥 질환이 없어도 심부전이 올 수 있습니다. 또한, TZD 계열(Pioglitazone) 당뇨약은 부종과 심부전을 악화시킬 수 있으니 약력을 꼭 확인하세요.'
    ]
  },
  {
    id: 'hypertension',
    title: '고혈압 상담 (Hypertension)',
    category: 'Prevention / Counseling',
    chiefComplaint: '직장 검진에서 혈압이 높다고 해서 왔어요.',
    vitals: { BP: '152/96', HR: '78', RR: '16', BT: '36.5℃', BMI: '28.5 (비만)' },
    patientScript: {
      profile: '45세 남성, 대기업 부장',
      presentIllness: '특별히 아픈 곳은 없습니다. 머리가 가끔 무거운 것 같긴 한데 스트레스 때문인 줄 알았어요. 지난주 직장 건강검진에서 혈압이 150/96이 나왔고, 재검 받으라고 해서 왔습니다.',
      details: {
        onset: '1주일 전 검진 시 발견 (이전에는 정상이었다고 함)',
        location: '증상 없음 (뒷목 뻐근함 정도)',
        duration: '-',
        character: '무증상',
        aggravating: '-',
        relieving: '-',
        radiation: '-',
        associated: '두통 없음, 시야 흐림 없음, 흉통/호흡곤란 없음',
      },
      pastHistory: '없음. 병원 거의 안 다님.',
      socialHistory: '흡연 1갑/일(20년), 음주 주 4회(소주 1-2병), 회식 잦음, 운동 안 함',
      familyHistory: '어머니 고혈압, 아버지 뇌졸중 병력',
      medication: '없음, 영양제도 안 먹음'
    },
    checklist: [
      { category: 'History (병력청취)', items: [
        { id: 'h1', text: 'History: 과거 혈압 수치 확인', question: '예전에 쟀을 때는 혈압이 괜찮았나요? 건강검진은 언제 마지막으로 하셨나요?', points: 1 },
        { id: 'h2', text: 'Symptoms: 고혈압 합병증 증상', question: '머리가 아프거나 눈이 침침하지는 않나요? 가슴이 두근거리지 않나요?', points: 1 },
        { id: 'h3', text: 'Secondary HTN: 이차성 고혈압 선별', question: '주무실 때 코를 심하게 골거나 숨을 멈추진 않나요? (수면무호흡) 갑자기 체중이 변했나요?', points: 2 },
        { id: 'h4', text: 'Lifestyle: 생활습관 점검', question: '담배는 태우시나요? 술은 일주일에 몇 번 드시나요? 짜게 드시는 편입니까?', points: 1 },
        { id: 'h5', text: 'Medication: 혈압 상승 약물', question: '혹시 관절염 약이나 한약, 스테로이드제 같은 걸 드시고 계신 건 없나요?', points: 1 },
      ]},
      { category: 'Physical Exam (신체진찰)', items: [
        { id: 'p1', text: 'BP: 정확한 혈압 측정', question: '등을 기대고 편안히 앉으세요. 양쪽 팔 혈압을 모두 재보겠습니다.', points: 2 },
        { id: 'p2', text: 'Fundus: 안저 검사', question: '눈 안쪽 혈관에 고혈압 흔적이 있는지 보겠습니다. (안저경 보는 시늉)', points: 1 },
        { id: 'p3', text: 'Abd: 신동맥 잡음 청진', question: '배꼽 주변에 청진기를 대보겠습니다. (이차성 고혈압 확인)', points: 1 },
      ]},
      { category: 'Education (환자교육)', items: [
        { id: 'e1', text: '진단: 고혈압 가능성 및 가정혈압', question: '병원에 오면 긴장해서 오르는 경우도 있으니, 집에서 편안할 때 혈압을 재서 적어오세요.', points: 1 },
        { id: 'e2', text: '합병증: 치료의 중요성', question: '증상이 없어도 혈압을 조절하지 않으면 나중에 뇌졸중이나 심부전이 올 수 있습니다.', points: 2 },
        { id: 'e3', text: '생활요법: 체중감량, 절주, 저염식', question: '체중을 5kg만 빼도 혈압약 한 알 효과가 있습니다. 싱겁게 드시고 술을 줄이셔야 합니다.', points: 2 },
      ]}
    ],
    script: [
      { type: 'direction', text: '🎬 [도입: 1분] 건장한 체격의 남성이 들어와 앉는다.' },
      { type: 'doctor', text: '안녕하세요. 오늘 어떤 일로 오셨습니까?' },
      { type: 'patient', text: '아, 회사 검진에서 혈압이 좀 높다고 병원 가보라고 해서 왔어요.' },
      { type: 'doctor', text: '그렇군요. 혹시 머리가 아프거나 눈이 침침한 증상은 없으셨나요?' },
      { type: 'patient', text: '가끔 뒷목이 뻐근하긴 한데, 별다른 증상은 없어요.' },
      { type: 'tip', text: '💡 무증상 고혈압: 대부분의 고혈압은 무증상(Silent Killer)입니다. 증상이 없어도 치료해야 함을 나중에 꼭 교육해야 합니다.' },
      
      { type: 'direction', text: '🎬 [병력 청취: 4분] 이차성 고혈압 및 심혈관 위험인자 파악.' },
      { type: 'doctor', text: '예전에도 혈압이 높다는 얘기 들으신 적 있나요?' },
      { type: 'patient', text: '아뇨, 작년까진 괜찮았어요.' },
      { type: 'doctor', text: '갑자기 혈압이 올랐다면 혹시 최근에 체중이 늘거나, 코골이가 심해지진 않았나요?' },
      { type: 'tip', text: '💡 Secondary HTN Screening: 갑작스러운 발병은 이차성 원인(비만, 수면무호흡, 알도스테론증 등)을 시사할 수 있습니다.' },
      { type: 'patient', text: '살이 한 5kg 쪘고... 코는 좀 많이 골아요.' },
      { type: 'doctor', text: '가족 중에 고혈압이나 중풍 앓으신 분 계신가요?' },
      { type: 'patient', text: '아버지가 뇌졸중으로 쓰러지셨어요.' },
      { type: 'doctor', text: '알겠습니다. 술, 담배는 하시나요? 운동은요?' },
      { type: 'patient', text: '담배는 한 갑 피우고, 술은 일주일에 네 번 정도 마십니다. 운동은 숨쉬기 운동만...' },
      { type: 'doctor', text: '드시는 약이나 한약, 진통제 같은 건 없나요?' },
      { type: 'patient', text: '없습니다.' },

      { type: 'direction', text: '🎬 [신체 진찰: 3분] 정확한 혈압 측정 및 표적장기 손상 확인.' },
      { type: 'doctor', text: '혈압을 다시 재보겠습니다. 등 기대고 다리 꼬지 마시고 편안히 계세요.' },
      { type: 'doctor', text: '커프를 심장 높이에 맞추겠습니다. (양팔 혈압 측정 시늉)' },
      { type: 'doctor', text: '눈 안쪽 혈관을 좀 보겠습니다. (안저 검사 - 고혈압성 망막병증 확인)' },
      { type: 'doctor', text: '심장과 배 소리를 듣겠습니다. (심비대 및 신동맥 잡음 청진)' },
      { type: 'doctor', text: '다리 부종도 확인하겠습니다. (정강이 눌러보기)' },

      { type: 'direction', text: '🎬 [환자 교육 및 마무리: 2분]' },
      { type: 'doctor', text: '지금 재보니 150/96으로 높습니다. 하지만 병원에 오면 긴장해서 오르는 "백의 고혈압"일 수도 있습니다.' },
      { type: 'doctor', text: '정확한 진단을 위해 댁에서 아침, 저녁으로 혈압을 재서 일주일치 적어오시는 게 좋겠습니다.' },
      { type: 'patient', text: '약은 평생 먹어야 하나요?' },
      { type: 'doctor', text: '당장 약을 드시는 것보다 생활습관 교정이 먼저입니다. 살을 5kg만 빼도 혈압약 한 알 효과가 있습니다. 그리고 아버님 병력이 있으시니 담배는 꼭 끊으셔야 합니다.' },
      { type: 'doctor', text: '2주 뒤에 가정 혈압 적어오신 걸 보고 약물 치료 여부를 결정합시다.' }
    ],
    clinicalPearls: [
      '**Secondary Hypertension (Endocrine Focus):** 젊은 환자나 갑자기 발생한 고혈압에서는 반드시 내분비 원인을 의심하세요.',
      '1. **Primary Aldosteronism:** 저칼륨혈증(Hypokalemia)이 동반된 고혈압.',
      '2. **Cushing Syndrome:** 중심성 비만, 둥근 얼굴(Moon face), 자색 선조.',
      '3. **Pheochromocytoma:** 두통, 발한, 두근거림의 3대 증상(Triad).',
      '**Target Organ Damage:** 뇌(증상), 눈(안저), 심장(LVH), 콩팥(단백뇨) 손상 여부를 확인하는 것이 치료 방침 결정에 중요합니다.'
    ]
  },
  {
    id: 'edema',
    title: '부종 (Edema)',
    category: 'General / Cardio-Renal',
    chiefComplaint: '다리가 자꾸 붓고 몸이 무거워요.',
    vitals: { BP: '140/90', HR: '88', RR: '20', BT: '36.5℃', SpO2: '95%' },
    patientScript: {
      profile: '60세 여성, 주부',
      presentIllness: '한 달 전부터 저녁만 되면 발등이랑 종아리가 퉁퉁 붓습니다. 아침에 일어나면 얼굴도 좀 푸석한 것 같고요. 신발이 꽉 껴서 불편합니다. 조금만 움직여도 숨이 좀 찬 것 같아요.',
      details: {
        onset: '1달 전부터 서서히 시작',
        location: '양측 하지(정강이, 발등), 얼굴(아침)',
        duration: '저녁에 심해짐',
        character: '눌렀을 때 쑥 들어감 (Pitting)',
        aggravating: '오래 서 있거나 짠 음식 먹은 다음 날',
        relieving: '다리를 올리고 자면 아침에 조금 빠짐',
        radiation: '-',
        associated: '호흡곤란(운동 시), 피로감, 소변량 감소 없음, 거품뇨 없음',
      },
      pastHistory: '고혈압(10년), 당뇨(5년 - 경구약)',
      socialHistory: '음주/흡연 안함. 짠 국물 요리 좋아함.',
      familyHistory: '없음',
      medication: '혈압약(CCB 포함), 당뇨약 복용 중'
    },
    checklist: [
      { category: 'History (병력청취)', items: [
        { id: 'h1', text: 'Location: 국소 vs 전신', question: '한쪽 다리만 붓나요, 아니면 양쪽 다 붓나요? 얼굴이나 손도 붓습니까?', points: 1 },
        { id: 'h2', text: 'Timing: 악화 시점', question: '아침에 일어날 때가 심한가요(신장), 아니면 활동하고 난 저녁에 심한가요(심장)?', points: 1 },
        { id: 'h3', text: 'Systemic Sx: 심부전/간/신장 증상', question: '누우면 숨이 차지 않나요? 배가 불러오지는 않나요? 소변에 거품이 많지 않나요?', points: 2 },
        { id: 'h4', text: 'Thyroid: 갑상선 기능 저하 증상', question: '최근에 유난히 추위를 타거나 변비가 생기지 않았나요? 목소리가 쉬지는 않았나요?', points: 1 },
        { id: 'h5', text: 'Medication: 약물 부작용 확인', question: '최근에 바꾼 혈압약이나 진통제(NSAIDs)를 드신 적 있나요?', points: 1 },
      ]},
      { category: 'Physical Exam (신체진찰)', items: [
        { id: 'p1', text: 'Pitting Edema: 함요 부종 확인', question: '정강이 뼈 앞쪽을 꾹 눌러보겠습니다. 들어간 자국이 남는지 볼게요.', points: 2 },
        { id: 'p2', text: 'Jugular Vein: 경정맥 확장', question: '심장 문제로 부은 건지 확인하기 위해 목 혈관을 보겠습니다.', points: 1 },
        { id: 'p3', text: 'Skin: 피부 변화', question: '다리 피부색이 변하거나 열감이 느껴지는 곳은 없나요? (봉소염/DVT 감별)', points: 1 },
      ]},
      { category: 'Education (환자교육)', items: [
        { id: 'e1', text: '진단: 원인 감별 필요성 설명', question: '부종의 원인은 심장, 콩팥, 간, 갑상선 등 다양해서 검사가 필요합니다.', points: 1 },
        { id: 'e2', text: '검사: 혈액검사 및 흉부 X-ray', question: '피검사로 콩팥과 간 기능을 보고, 엑스레이로 심장을 확인하겠습니다.', points: 1 },
        { id: 'e3', text: '약물: 유발 약제 변경 고려', question: '드시고 계신 혈압약(암로디핀 등) 때문에 부을 수도 있어서 약을 바꿔볼 수도 있습니다.', points: 1 },
      ]}
    ],
    script: [
      { type: 'direction', text: '🎬 [도입: 1분] 다리를 약간 절며 들어오는 환자. 다리가 부어 신발이 꽉 껴 보인다.' },
      { type: 'doctor', text: '다리가 많이 불편해 보이시네요. 언제부터 부으셨나요?' },
      { type: 'patient', text: '한 달 정도 됐어요. 저녁만 되면 발이 퉁퉁 부어서 신발이 안 들어가요.' },
      
      { type: 'direction', text: '🎬 [병력 청취: 4분] 전신성 vs 국소성, 원인 장기(심/신/간/내분비) 감별.' },
      { type: 'doctor', text: '양쪽 다리가 다 붓나요, 아니면 한쪽만 붓나요?' },
      { type: 'tip', text: '💡 Unilateral vs Bilateral: 한쪽만 부으면 DVT(혈전)나 염증을, 양쪽 다 부으면 전신 질환(심장/간/신장)을 의심해야 합니다.' },
      { type: 'patient', text: '양쪽 다 그래요. 아침에 일어나면 얼굴도 좀 붓는 것 같고요.' },
      { type: 'doctor', text: '누워 있을 때 숨이 차거나 소변에 거품이 나오진 않나요?' },
      { type: 'patient', text: '숨은 조금 찬 것 같은데... 소변은 괜찮아요.' },
      { type: 'doctor', text: '최근에 유난히 추위를 타거나 변비가 생기진 않았나요? (갑상선)' },
      { type: 'patient', text: '그런 건 없어요.' },
      { type: 'doctor', text: '혹시 최근에 혈압약이나 진통제 드신 거 있나요?' },
      { type: 'patient', text: '혈압약은 10년째 먹고 있는데, 최근에 병원 바꿨더니 약이 좀 달라진 것 같기도 하고...' },
      { type: 'tip', text: '💡 Drug-induced Edema: 암로디핀(CCB)은 부종을 잘 일으키는 대표적인 약물입니다. 약 변경력을 꼭 확인하세요.' },

      { type: 'direction', text: '🎬 [신체 진찰: 3분] Pitting edema 및 전신 상태 확인.' },
      { type: 'doctor', text: '진찰을 해보겠습니다. 정강이 앞쪽을 눌러보겠습니다.' },
      { type: 'tip', text: '💡 Pitting Check: 엄지손가락으로 정강뼈 앞을 10초간 꾹 누른 뒤 뗐을 때 자국이 남는지 확인.' },
      { type: 'doctor', text: '눌렀을 때 쑥 들어가서 잘 안 나오네요(Pitting). 심장이나 콩팥 문제일 수 있습니다.' },
      { type: 'doctor', text: '누워서 목 혈관을 보겠습니다. (경정맥 확장 확인)' },
      { type: 'doctor', text: '배에 물이 찼는지 두드려 보겠습니다. (복수 확인)' },
      { type: 'doctor', text: '폐 소리도 들어보겠습니다. (Rale 청진)' },

      { type: 'direction', text: '🎬 [환자 교육 및 마무리: 2분]' },
      { type: 'doctor', text: '환자분, 부종의 원인은 심장, 콩팥, 간, 갑상선 등 다양해서 피검사와 엑스레이 검사가 필요합니다.' },
      { type: 'doctor', text: '그리고 최근에 바뀐 혈압약 성분(CCB) 때문에 붓는 경우도 흔합니다. 검사 결과에 이상이 없으면 혈압약을 다른 종류로 바꿔보겠습니다.' },
      { type: 'doctor', text: '검사 결과 나올 때까지는 짠 음식을 피하시고, 주무실 때 다리를 베개 위에 올리고 주무세요.' },
      { type: 'patient', text: '네, 알겠습니다.' }
    ],
    clinicalPearls: [
      '**Pitting vs Non-pitting:** 눌렀을 때 쑥 들어가는(Pitting) 부종은 수분 저류(심장/신장/간)가 원인이고, 들어가지 않는(Non-pitting) 부종은 림프부종이나 **갑상선 기능 저하증(Myxedema)**을 시사합니다.',
      '**Drug Induced Edema:** 개원가에서 가장 흔한 부종 원인 중 하나는 약물입니다. **CCB(Calcium Channel Blocker)**, NSAIDs, Steroid, TZD(당뇨약) 복용력을 꼭 확인하세요.',
      '**Unilateral Edema:** 한쪽 다리만 갑자기 붓고 아프다면 **DVT(심부정맥혈전증)** 가능성이 높으므로 응급입니다.'
    ]
  },
  {
    id: 'dyslipidemia',
    title: '이상지질혈증 (Dyslipidemia)',
    category: 'Prevention / Metabolic',
    chiefComplaint: '건강검진에서 콜레스테롤이 높대요.',
    vitals: { BP: '130/80', HR: '72', RR: '16', BT: '36.5℃', BMI: '26 (과체중)' },
    patientScript: {
      profile: '50세 남성, 사무직',
      presentIllness: '증상은 전혀 없습니다. 회사 검진 결과지를 받았는데 총콜레스테롤 240, LDL 160 이라고 약을 먹어야 한다고 적혀 있어서 왔습니다.',
      details: {
        onset: '검진 결과 확인 후 내원',
        location: '무증상',
        duration: '-',
        character: '-',
        aggravating: '-',
        relieving: '-',
        radiation: '-',
        associated: '흉통 없음, 가족 중 뇌졸중 환자 있음',
      },
      pastHistory: '없음',
      socialHistory: '흡연 1갑/일(30년), 음주 주 2회, 삼겹살/곱창 선호, 운동 부족',
      familyHistory: '형님이 50대에 협심증으로 스텐트 넣음',
      medication: '없음'
    },
    checklist: [
      { category: 'History (병력청취)', items: [
        { id: 'h1', text: 'Risk Assessment: 심혈관 위험인자', question: '담배는 피우시나요? 고혈압이나 당뇨가 있다는 말은 안 들어보셨나요?', points: 2 },
        { id: 'h2', text: 'Family Hx: 조기 심질환 가족력', question: '부모님이나 형제분 중에 젊은 나이(남자 55세, 여자 65세 미만)에 뇌졸중이나 심장병 앓은 분 계신가요?', points: 1 },
        { id: 'h3', text: 'Diet/Lifestyle: 생활습관', question: '평소에 기름진 고기나 튀김을 좋아하시나요? 운동은 일주일에 얼마나 하십니까?', points: 1 },
        { id: 'h4', text: 'Secondary Cause: 이차성 원인', question: '최근에 피로감이 심하거나 체중이 늘진 않았나요? (갑상선) 술을 매일 드시나요?', points: 1 },
      ]},
      { category: 'Physical Exam (신체진찰)', items: [
        { id: 'p1', text: 'Anthropometry: 비만도 측정', question: '허리 둘레를 재보고, 비만도가 어느 정도인지 보겠습니다.', points: 1 },
        { id: 'p2', text: 'Xanthoma: 황색종 확인', question: '눈꺼풀 주위나 아킬레스건에 노란 덩어리가 만져지는지 보겠습니다. (가족성 고콜레스테롤혈증)', points: 1 },
        { id: 'p3', text: 'Carotid Bruit: 경동맥 잡음', question: '목 혈관에 찌꺼기가 껴서 소리가 나는지 청진해보겠습니다.', points: 1 },
      ]},
      { category: 'Education (환자교육)', items: [
        { id: 'e1', text: 'Concept: LDL 목표치 설정', question: '나쁜 콜레스테롤(LDL) 수치를 낮춰야 혈관이 막히는 걸 막을 수 있습니다.', points: 1 },
        { id: 'e2', text: 'Tx: 스타틴 치료 안내', question: '식이요법만으로는 한계가 있어 고지혈증 약(스타틴)을 드시는 게 안전합니다.', points: 1 },
        { id: 'e3', text: 'Lifestyle: 금연 및 식이요법', question: '약보다 중요한 게 금연입니다. 동물성 지방 섭취를 줄이고 유산소 운동을 하세요.', points: 2 },
      ]}
    ],
    script: [
      { type: 'direction', text: '🎬 [도입: 1분] 검진 결과지를 손에 든 중년 남성이 들어온다.' },
      { type: 'doctor', text: '안녕하세요. 검진 결과 때문에 오셨군요?' },
      { type: 'patient', text: '네, 콜레스테롤이 높다고 약을 먹으라는데... 저는 아무 증상이 없거든요.' },
      { type: 'doctor', text: '고지혈증은 원래 증상이 없습니다. 수치를 보니 LDL이 160으로 꽤 높으시네요.' },
      
      { type: 'direction', text: '🎬 [병력 청취: 4분] 심혈관 위험도 평가(Risk Stratification).' },
      { type: 'doctor', text: '치료 방침을 정하기 위해 몇 가지 여쭤보겠습니다. 담배 피우시나요?' },
      { type: 'patient', text: '네, 한 갑 정도 피웁니다.' },
      { type: 'doctor', text: '혈압이나 당뇨는 없으신가요?' },
      { type: 'patient', text: '네, 아직은 없어요.' },
      { type: 'doctor', text: '가족분들 중에 젊은 나이에 심장병이나 중풍 앓으신 분 계신가요?' },
      { type: 'patient', text: '형님이 작년에 50대 초반인데 협심증으로 스텐트 시술을 받았어요.' },
      { type: 'tip', text: '💡 Risk Assessment: 흡연과 가족력(Early CHD)은 심혈관 위험도를 높이는 주요 인자입니다. 약물 치료의 근거가 됩니다.' },
      { type: 'doctor', text: '그렇다면 환자분은 고위험군에 속하실 수 있습니다. 식사는 어떻게 하시나요?' },
      { type: 'patient', text: '고기나 튀김을 좋아합니다. 운동은 숨쉬기 운동만...' },
      { type: 'doctor', text: '혹시 갑자기 살이 찌거나 피곤하진 않으세요? (갑상선)' },
      { type: 'patient', text: '그런 건 없어요.' },

      { type: 'direction', text: '🎬 [신체 진찰: 3분] 가족성 고콜레스테롤혈증 징후 확인.' },
      { type: 'doctor', text: '유전적인 소인이 있는지 진찰해보겠습니다. 눈을 감아보세요.' },
      { type: 'doctor', text: '(눈꺼풀 주위 황색종 확인) 아킬레스건도 좀 만져보겠습니다. (두꺼워졌는지 확인)' },
      { type: 'tip', text: '💡 Xanthoma Check: 가족성 고콜레스테롤혈증(FH)을 시사하는 황색종이 있는지 확인하는 척이라도 해야 점수를 받습니다.' },
      { type: 'doctor', text: '목 혈관에 소리가 나는지 들어보겠습니다. (경동맥 잡음 청진)' },
      { type: 'doctor', text: '배 둘레도 한번 재보겠습니다. (복부비만 확인)' },

      { type: 'direction', text: '🎬 [환자 교육 및 마무리: 2분]' },
      { type: 'doctor', text: '환자분은 지금 당장은 괜찮지만, 혈관에 기름때가 끼고 있는 상태입니다. 특히 흡연을 하시고 형님분 병력도 있어서 위험도가 높습니다.' },
      { type: 'patient', text: '약 먹으면 평생 먹어야 하잖아요?' },
      { type: 'doctor', text: '평생 먹는 게 부담되시겠지만, 매일 비타민 먹듯이 혈관 영양제라고 생각하시면 좋습니다. 부작용은 거의 없으니 걱정 마세요.' },
      { type: 'doctor', text: '오늘부터 약을 드시고, 3개월 뒤에 피검사를 다시 해봅시다. 무엇보다 담배는 꼭 끊으셔야 합니다.' }
    ],
    clinicalPearls: [
      '**Risk Stratification:** 이상지질혈증 치료의 핵심은 "수치"가 아니라 **"환자의 위험도"**입니다. 관상동맥질환이 있다면 LDL 목표는 55mg/dL 미만, 당뇨병이 있다면 70mg/dL 미만으로 매우 낮게 잡아야 합니다.',
      '**Secondary Dyslipidemia:** 갑상선 기능 저하증, 신증후군, 담즙 정체 등이 원인일 수 있습니다. 특히 **Endocrinologist라면 갑상선 기능 검사(TFT)**를 놓치지 마세요.',
      '**Statin Education:** 환자들은 "약 한번 먹으면 평생 먹어야 하죠?"라고 거부감을 갖습니다. "평생 먹는 게 아니라, 혈관을 보호하기 위해 매일 비타민처럼 챙기는 겁니다"라고 설명해주세요.'
    ]
  },
  {
    id: 'claudication',
    title: '하지 통증 (Claudication)',
    category: 'Vascular / PAD',
    chiefComplaint: '조금만 걸으면 종아리가 터질 듯이 아파요.',
    vitals: { BP: '135/85', HR: '76', RR: '18', BT: '36.0℃', SpO2: '97%' },
    patientScript: {
      profile: '65세 남성',
      presentIllness: '6개월 전부터 버스 정류장까지(약 200m) 걸어가면 오른쪽 종아리가 땡기고 아파서 쉬어야 합니다. 쉬면 5분 안에 좋아져서 다시 걸을 수 있어요. 허리 디스크인가 싶어서 한의원 다녔는데 효과가 없습니다.',
      details: {
        onset: '6개월 전부터 서서히',
        location: '우측 종아리 (Calf)',
        duration: '보행 시 발생, 휴식 시 호전',
        character: '조이는 듯한 통증, 쥐나는 느낌',
        aggravating: '보행(특히 오르막길, 빨리 걸을 때)',
        relieving: '멈춰 서서 쉬면 호전됨 (자세 변경과 무관)',
        radiation: '-',
        associated: '발이 참(Coldness), 발가락 색깔 변화 없음, 허리 통증 없음',
      },
      pastHistory: '당뇨(20년), 고혈압',
      socialHistory: '흡연 40갑년(현재도 피움)',
      familyHistory: '없음',
      medication: '당뇨약, 혈압약'
    },
    checklist: [
      { category: 'History (병력청취)', items: [
        { id: 'h1', text: 'Pattern: 파행의 특징 (거리, 호전양상)', question: '얼마나 걸으면 아픈가요? 아플 때 멈춰 서 있으면 좋아지나요, 아니면 쪼그려 앉아야 좋아지나요?', points: 2 },
        { id: 'h2', text: 'Risk Factors: 죽상경화증 위험인자', question: '담배는 얼마나 피우셨습니까? 당뇨나 고혈압 관리는 잘 되고 있나요?', points: 1 },
        { id: 'h3', text: 'Ischemia: 중증도 평가 (Rest pain)', question: '가만히 누워있을 때도 발이 아프거나 발가락 상처가 안 낫지는 않나요?', points: 1 },
        { id: 'h4', text: 'DDx: 척추 질환 감별', question: '허리가 아프거나 다리 뒤쪽으로 전기가 통하듯 찌릿하진 않나요?', points: 1 },
      ]},
      { category: 'Physical Exam (신체진찰)', items: [
        { id: 'p1', text: 'Pulse Palpation: 맥박 촉지', question: '발등과 복사뼈 뒤쪽, 오금의 맥박을 만져서 좌우를 비교해보겠습니다.', points: 2 },
        { id: 'p2', text: 'Skin: 피부 소견', question: '발이 찬지 만져보고, 털이 빠져 반들반들한지 보겠습니다.', points: 1 },
        { id: 'p3', text: 'Buerger Test: 하지 거상', question: '누운 상태에서 다리를 들어올렸을 때 발바닥이 창백해지는지 확인합니다.', points: 1 },
      ]},
      { category: 'Education (환자교육)', items: [
        { id: 'e1', text: '진단: 말초동맥질환 의심', question: '다리로 가는 혈관이 좁아져서 피가 안 통하는 상태입니다. 협심증이 다리에 온 것과 같습니다.', points: 1 },
        { id: 'e2', text: '검사: ABI 및 CT', question: '팔과 다리 혈압을 비교하는 검사(ABI)와 혈관 CT를 찍어봐야 합니다.', points: 1 },
        { id: 'e3', text: '치료: 금연 및 운동요법', question: '담배는 무조건 끊으셔야 다리를 절단하는 상황을 막습니다. 아파도 참고 걷는 운동이 중요합니다.', points: 2 },
      ]}
    ],
    script: [
      { type: 'direction', text: '🎬 [도입: 1분] 환자가 다리를 주무르며 진료실에 들어온다.' },
      { type: 'doctor', text: '다리가 많이 아프신가 보네요. 언제 아프신가요?' },
      { type: 'patient', text: '걸으면 종아리가 터질 것 같이 아파요. 버스 정류장까지도 못 가겠어요.' },
      
      { type: 'direction', text: '🎬 [병력 청취: 4분] 혈관성 vs 신경성 파행 감별.' },
      { type: 'doctor', text: '아플 때 가만히 서서 쉬면 좋아지나요, 아니면 허리를 굽히고 앉아야 좋아지나요?' },
      { type: 'tip', text: '💡 Differential Diagnosis: 척추관 협착증은 "자세(허리 굽힘)"에 의해 호전되고, 혈관 질환(PAD)은 "휴식(Stop walking)"만으로 호전됩니다.' },
      { type: 'patient', text: '그냥 서서 쉬면 금방 괜찮아져요.' },
      { type: 'doctor', text: '그렇군요. 담배는 피우시나요? 당뇨는 있으시고요?' },
      { type: 'patient', text: '담배는 40년 피웠고 당뇨도 20년 됐습니다.' },
      { type: 'doctor', text: '혹시 잘 때도 발이 아파서 깨거나 발가락에 상처가 나서 안 낫는 건 없나요?' },
      { type: 'patient', text: '아직 그런 건 없어요.' },
      { type: 'tip', text: '💡 Critical Ischemia: 휴식기 통증(Rest pain)이나 궤양(Ulcer)이 있다면 다리를 절단할 수도 있는 응급 상황입니다.' },

      { type: 'direction', text: '🎬 [신체 진찰: 3분] 맥박 촉지가 핵심.' },
      { type: 'doctor', text: '양말을 좀 벗어주시겠습니까? 발을 좀 보겠습니다.' },
      { type: 'doctor', text: '발등 맥박을 만져보겠습니다. (양측 요골동맥, 족배동맥 촉지)' },
      { type: 'doctor', text: '오른쪽 발이 왼쪽보다 차갑네요. 털도 좀 빠져 있고요.' },
      { type: 'doctor', text: '다리를 한번 들어보겠습니다. (Buerger Test - 거상 시 창백해지는지 확인)' },
      { type: 'doctor', text: '허리나 다리 감각은 괜찮은지 만져보겠습니다. (신경학적 검사)' },

      { type: 'direction', text: '🎬 [환자 교육 및 마무리: 2분]' },
      { type: 'doctor', text: '오른쪽 발등 맥박이 잘 안 잡히고 발이 차갑네요. 다리 혈관이 좁아진 "말초동맥질환"이 의심됩니다. 협심증이 다리에 왔다고 보시면 됩니다.' },
      { type: 'patient', text: '수술해야 하나요?' },
      { type: 'doctor', text: '검사를 해봐야겠지만, 가장 중요한 치료는 "금연"과 "걷기 운동"입니다. 아파도 참고 걸어야 혈관이 튼튼해집니다.' },
      { type: 'doctor', text: '그리고 당뇨가 있으시니 발에 상처 나지 않게 항상 조심하셔야 합니다.' }
    ],
    clinicalPearls: [
      '**PAD vs Spinal Stenosis:** 말초동맥질환(PAD)은 "산소 요구량"과 관련 있으므로 **걷다가 멈춰 서기만 해도(Standing Rest)** 통증이 사라집니다. 반면 척추관협착증은 "자세"와 관련 있으므로 **허리를 굽히거나 쪼그려 앉아야** 좋아집니다.',
      '**Endocrine Context:** 당뇨병 환자는 **Mönckeberg’s arteriosclerosis(혈관 석회화)** 때문에 혈관이 딱딱해서 ABI 수치가 정상(0.9~1.3)보다 오히려 높게(>1.4) 나올 수 있습니다. 이럴 땐 Toe pressure 등을 참고해야 합니다.',
      '**Pulse Check:** 발등동맥(Dorsalis pedis) 맥박만 잘 만져져도 심각한 허혈은 아닐 가능성이 높습니다. 가장 쉽고 중요한 선별검사입니다.'
    ]
  }
];

// --- 컴포넌트: 타이머 ---
const Timer = ({ duration = 600, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (onExpire) onExpire();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, onExpire]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex items-center space-x-2 bg-slate-800 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg shadow-md min-w-[140px] justify-center">
      <Clock size={18} className={isActive ? "animate-pulse text-red-400" : "text-gray-300"} />
      <span className="font-mono text-xl font-bold">{formatTime(timeLeft)}</span>
      <div className="flex space-x-1 ml-2">
        <button onClick={toggleTimer} className="p-1 hover:bg-slate-600 rounded transition-colors" title={isActive ? "Pause" : "Start"}>
          {isActive ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button onClick={resetTimer} className="p-1 hover:bg-slate-600 rounded transition-colors" title="Reset">
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
};

// --- Checklist Group Component (재사용을 위해 분리) ---
const ChecklistGroup = ({ scenario, checkedItems, onToggle, showQuestions = true }) => {
  return (
    <div className="space-y-4">
      {scenario.checklist.map((category, catIdx) => (
        <div key={catIdx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-100 font-bold text-slate-800 flex justify-between items-center">
            <span className="flex items-center text-sm md:text-base">
              {catIdx === 0 && <Mic size={16} className="mr-2 text-blue-500"/>}
              {catIdx === 1 && <Activity size={16} className="mr-2 text-green-500"/>}
              {catIdx === 2 && <FileText size={16} className="mr-2 text-purple-500"/>}
              {category.category}
            </span>
          </div>
          <div className="divide-y divide-slate-50">
            {category.items.map((item) => (
              <div 
                key={item.id} 
                onClick={() => onToggle(item.id)}
                className={`px-4 py-3 cursor-pointer transition-all flex items-start group ${
                  checkedItems[item.id] ? 'bg-teal-50/60' : 'hover:bg-slate-50'
                }`}
              >
                <div className={`mt-0.5 mr-3 w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-all shadow-sm ${
                  checkedItems[item.id] ? 'bg-teal-500 border-teal-500' : 'border-slate-300 bg-white group-hover:border-teal-400'
                }`}>
                  {checkedItems[item.id] && <CheckSquare size={14} className="text-white" />}
                </div>
                <div className="flex-1">
                  <span className={`text-sm md:text-[15px] leading-relaxed block ${checkedItems[item.id] ? 'text-slate-800 font-semibold' : 'text-slate-700'}`}>
                    {item.text}
                  </span>
                  {showQuestions && item.question && (
                    <div className="mt-1 text-xs text-teal-600 font-medium opacity-90">
                      "{item.question}"
                    </div>
                  )}
                </div>
                <div className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    checkedItems[item.id] ? 'bg-teal-200 text-teal-800' : 'bg-slate-100 text-slate-400'
                }`}>
                  {item.points}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// --- 메인 앱 컴포넌트 ---
const CardiologyCPXApp = () => {
  const [currentScenarioId, setCurrentScenarioId] = useState(SCENARIOS[0].id);
  const [checkedItems, setCheckedItems] = useState({});
  const [activeTab, setActiveTab] = useState('simulation'); // Default to Simulation Mode for Practice
  const [mobileSimView, setMobileSimView] = useState('script'); // 'script' or 'checklist'
  
  const currentScenario = SCENARIOS.find(s => s.id === currentScenarioId);

  const handleToggleCheck = (itemId) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const calculateScore = () => {
    let totalPoints = 0;
    let earnedPoints = 0;
    
    currentScenario.checklist.forEach(category => {
      category.items.forEach(item => {
        totalPoints += item.points;
        if (checkedItems[item.id]) {
          earnedPoints += item.points;
        }
      });
    });
    
    return { earned: earnedPoints, total: totalPoints, percentage: Math.round((earnedPoints / totalPoints) * 100) };
  };

  const resetCase = () => {
    if(window.confirm('체크리스트를 초기화 하시겠습니까?')) {
      setCheckedItems({});
    }
  };

  const score = calculateScore();

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-700 to-teal-800 text-white px-4 py-3 shadow-lg flex justify-between items-center z-20">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Activity size={24} className="text-teal-50" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">CPX Master: Cardio-Metabolic</h1>
            <p className="text-xs text-teal-200 hidden md:block">Clinical Performance Examination Simulator</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Timer duration={600} onExpire={() => alert('시험 종료 10분 경과! 마무리 멘트를 하세요.')} />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: Case Selection */}
        <aside className="w-64 bg-white border-r border-slate-200 overflow-y-auto flex-shrink-0 hidden md:block z-10">
          <div className="p-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
              <BookOpen size={14} className="mr-2"/> Clinical Cases
            </h2>
            <div className="space-y-2">
              {SCENARIOS.map(scenario => (
                <button
                  key={scenario.id}
                  onClick={() => {
                    setCurrentScenarioId(scenario.id);
                    setCheckedItems({});
                    setActiveTab('simulation');
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all border flex flex-col group relative ${
                    currentScenarioId === scenario.id 
                      ? 'bg-teal-50 border-teal-500 shadow-md' 
                      : 'bg-white hover:bg-slate-50 border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-bold ${currentScenarioId === scenario.id ? 'text-teal-800' : 'text-slate-700'}`}>
                      {scenario.title}
                    </span>
                    {currentScenarioId === scenario.id && <ChevronRight size={16} className="text-teal-600"/>}
                  </div>
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-tight flex items-center">
                    {scenario.id === 'edema' && <Droplets size={10} className="mr-1"/>}
                    {scenario.category.split('/')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden relative bg-slate-50">
          {/* Mobile Case Selector */}
          <div className="md:hidden p-3 bg-white border-b shadow-sm">
            <select 
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-teal-500 outline-none"
              value={currentScenarioId}
              onChange={(e) => {
                setCurrentScenarioId(e.target.value);
                setCheckedItems({});
                setActiveTab('simulation');
              }}
            >
              {SCENARIOS.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 bg-white px-6 pt-2 sticky top-0 z-10 shadow-sm overflow-x-auto">
            <button
              onClick={() => setActiveTab('simulation')}
              className={`flex items-center space-x-2 px-4 py-3 border-b-[3px] font-medium transition-all whitespace-nowrap ${
                activeTab === 'simulation' 
                  ? 'border-pink-500 text-pink-700 bg-pink-50/50' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Layout size={18} />
              <span>실전 연습 (Practice)</span>
            </button>
            <button
              onClick={() => setActiveTab('doctor')}
              className={`flex items-center space-x-2 px-4 py-3 border-b-[3px] font-medium transition-all whitespace-nowrap ${
                activeTab === 'doctor' 
                  ? 'border-teal-600 text-teal-800' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Stethoscope size={18} />
              <span>의사 평가표 (Doctor)</span>
            </button>
            <button
              onClick={() => setActiveTab('patient')}
              className={`flex items-center space-x-2 px-4 py-3 border-b-[3px] font-medium transition-all whitespace-nowrap ${
                activeTab === 'patient' 
                  ? 'border-indigo-600 text-indigo-800' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <User size={18} />
              <span>SP 대본 (Patient)</span>
            </button>
            <button
              onClick={() => setActiveTab('pearls')}
              className={`flex items-center space-x-2 px-4 py-3 border-b-[3px] font-medium transition-all whitespace-nowrap ${
                activeTab === 'pearls' 
                  ? 'border-amber-500 text-amber-800' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <BookOpen size={18} />
              <span>Clinical Pearls</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
              
              {/* Patient Banner */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 md:p-6 transition-all hover:shadow-md">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">
                      <span>Chief Complaint</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span>{currentScenario.profile && currentScenario.profile.split(',')[0]}</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">"{currentScenario.chiefComplaint}"</h2>
                    <div className="flex flex-wrap gap-2">
                       {Object.entries(currentScenario.vitals).map(([key, value]) => (
                         <div key={key} className="bg-slate-100 px-2.5 py-1 rounded text-xs font-mono font-semibold text-slate-600 border border-slate-200 flex items-center">
                           {key === 'BP' && <Activity size={12} className="mr-1.5 text-red-500"/>}
                           {key === 'HR' && <Heart size={12} className="mr-1.5 text-red-500"/>}
                           {key === 'BT' && <Thermometer size={12} className="mr-1.5 text-orange-500"/>}
                           {key}: <span className="ml-1 text-slate-800">{value}</span>
                         </div>
                       ))}
                    </div>
                  </div>
                  {/* 통합 점수판 (모든 탭에서 보임) */}
                  <div className="bg-teal-50 px-5 py-3 rounded-xl border border-teal-100 flex flex-col items-end min-w-[120px]">
                    <span className="text-xs text-teal-600 font-semibold uppercase">Total Score</span>
                    <div className="text-3xl font-bold text-teal-700 leading-none my-1">{score.percentage}%</div>
                    <div className="text-xs text-teal-600">{score.earned} / {score.total} pts</div>
                  </div>
                </div>
              </div>

              {/* TAB CONTENT: SIMULATION (Updated for Mobile) */}
              {activeTab === 'simulation' && (
                <div className="animate-fadeIn h-full flex flex-col">
                  {/* Mobile View Toggle (Only visible on small screens) */}
                  <div className="md:hidden flex border bg-white rounded-lg p-1 mb-4 shadow-sm shrink-0">
                    <button 
                      onClick={() => setMobileSimView('script')}
                      className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                        mobileSimView === 'script' ? 'bg-pink-100 text-pink-700 shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      📖 대본 (Script)
                    </button>
                    <button 
                      onClick={() => setMobileSimView('checklist')}
                      className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                        mobileSimView === 'checklist' ? 'bg-teal-100 text-teal-700 shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      ✅ 체크리스트
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 h-full">
                    {/* Left Column: Script (Hidden on mobile if checklist selected) */}
                    <div className={`flex-col space-y-4 ${mobileSimView === 'checklist' ? 'hidden md:flex' : 'flex'}`}>
                      <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 shadow-sm flex-shrink-0">
                        <h3 className="font-bold text-pink-800 flex items-center">
                           <MessageSquare size={20} className="mr-2"/> Role-Play Script
                        </h3>
                        <p className="text-xs text-pink-700 mt-1 hidden md:block">
                          왼쪽 대본을 읽으며 연기하고, 오른쪽 체크리스트를 동시에 채점하세요.
                        </p>
                      </div>
                      <div className="bg-white rounded-xl shadow-inner border border-slate-200 p-4 space-y-4 overflow-y-auto max-h-[60vh] md:max-h-[calc(100vh-350px)]">
                        {currentScenario.script ? (
                          currentScenario.script.map((line, index) => {
                            if (line.type === 'direction') {
                              return (
                                <div key={index} className="text-center text-slate-500 italic text-sm my-6 px-4 py-2 bg-slate-50 rounded border border-slate-100">
                                  {line.text}
                                </div>
                              );
                            } else if (line.type === 'tip') {
                              return (
                                <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800 flex items-start mx-4">
                                  <Star size={16} className="mr-2 mt-0.5 flex-shrink-0 text-yellow-500 fill-yellow-500"/>
                                  <span className="font-medium">{line.text}</span>
                                </div>
                              );
                            } else {
                              const isDoctor = line.type === 'doctor';
                              return (
                                <div key={index} className={`flex ${isDoctor ? 'justify-end' : 'justify-start'}`}>
                                  <div className={`max-w-[90%] rounded-2xl px-4 py-2.5 shadow-sm border ${
                                    isDoctor 
                                      ? 'bg-pink-50/50 border-pink-100 text-slate-800 rounded-tr-none' 
                                      : 'bg-white border-slate-200 text-slate-700 rounded-tl-none'
                                  }`}>
                                    <div className={`text-[10px] font-bold mb-1 ${isDoctor ? 'text-pink-600 text-right' : 'text-slate-500'}`}>
                                      {isDoctor ? 'Doctor (Me)' : 'Patient'}
                                    </div>
                                    <div className="leading-relaxed text-sm">
                                      {line.text}
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          })
                        ) : (
                          <div className="text-center py-10 text-slate-400">대본 준비 중...</div>
                        )}
                      </div>
                    </div>

                    {/* Right Column: Checklist (Hidden on mobile if script selected) */}
                    <div className={`flex-col space-y-4 ${mobileSimView === 'script' ? 'hidden md:flex' : 'flex'}`}>
                      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 shadow-sm flex justify-between items-center flex-shrink-0">
                        <h3 className="font-bold text-teal-800 flex items-center">
                           <CheckSquare size={20} className="mr-2"/> Live Checklist
                        </h3>
                        <button onClick={resetCase} className="text-xs flex items-center text-teal-600 hover:text-teal-800 bg-white px-2 py-1 rounded border border-teal-100 shadow-sm">
                          <RefreshCw size={12} className="mr-1"/> Reset
                        </button>
                      </div>
                      <div className="overflow-y-auto max-h-[60vh] md:max-h-[calc(100vh-350px)] pr-1">
                        <ChecklistGroup 
                          scenario={currentScenario} 
                          checkedItems={checkedItems} 
                          onToggle={handleToggleCheck}
                          showQuestions={false} // Compact mode for split view
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: DOCTOR (Detailed Checklist) */}
              {activeTab === 'doctor' && (
                <div className="animate-fadeIn space-y-6">
                  <div className="flex justify-end">
                    <button onClick={resetCase} className="text-sm flex items-center text-slate-400 hover:text-slate-600 transition-colors">
                      <RefreshCw size={14} className="mr-1"/> Reset Checklist
                    </button>
                  </div>
                  <ChecklistGroup 
                    scenario={currentScenario} 
                    checkedItems={checkedItems} 
                    onToggle={handleToggleCheck}
                    showQuestions={true} // Full detailed mode
                  />
                </div>
              )}

              {/* TAB CONTENT: PATIENT */}
              {activeTab === 'patient' && (
                <div className="space-y-6 animate-fadeIn">
                   <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start shadow-sm">
                    <AlertCircle className="text-indigo-600 mt-0.5 mr-3 flex-shrink-0" size={20} />
                    <div className="text-sm text-indigo-800">
                      <p className="font-bold mb-1">Standardized Patient (SP) Guide</p>
                      <p className="opacity-90">응시자의 질문이 있을 때만 아래 정보를 제공하세요. 연기할 때 고통스러운 표정이나 불안한 제스처를 섞어주면 더 좋습니다.</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full">
                      <h3 className="font-bold text-slate-700 mb-4 flex items-center text-lg border-b pb-2">
                        <User size={20} className="mr-2 text-indigo-600"/> Patient Profile
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <span className="text-xs font-bold text-slate-400 uppercase">Who am I?</span>
                          <p className="text-slate-800 font-medium text-lg">{currentScenario.patientScript.profile}</p>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-400 uppercase">History of Present Illness</span>
                          <div className="mt-1 bg-slate-50 p-4 rounded-lg border border-slate-100 text-slate-700 leading-relaxed italic">
                            "{currentScenario.patientScript.presentIllness}"
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full">
                      <h3 className="font-bold text-slate-700 mb-4 flex items-center text-lg border-b pb-2">
                        <FileText size={20} className="mr-2 text-indigo-600"/> Background
                      </h3>
                      <div className="space-y-5 text-sm">
                         <div className="flex items-start">
                           <Pill size={16} className="mr-3 text-slate-400 mt-0.5"/>
                           <div>
                             <span className="block font-bold text-slate-700">Past Medical Hx & Meds</span>
                             <p className="text-slate-600">{currentScenario.patientScript.pastHistory}</p>
                             {currentScenario.patientScript.medication && 
                               <p className="text-indigo-600 mt-1 text-xs bg-indigo-50 inline-block px-2 py-1 rounded">💊 {currentScenario.patientScript.medication}</p>
                             }
                           </div>
                         </div>
                         <div className="flex items-start">
                           <Wine size={16} className="mr-3 text-slate-400 mt-0.5"/>
                           <div>
                             <span className="block font-bold text-slate-700">Social Hx</span>
                             <p className="text-slate-600">{currentScenario.patientScript.socialHistory}</p>
                           </div>
                         </div>
                         <div className="flex items-start">
                           <User size={16} className="mr-3 text-slate-400 mt-0.5"/>
                           <div>
                             <span className="block font-bold text-slate-700">Family Hx</span>
                             <p className="text-slate-600">{currentScenario.patientScript.familyHistory}</p>
                           </div>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-indigo-600 px-6 py-3 text-white font-bold flex items-center">
                      <Mic size={18} className="mr-2"/> Interview Response Guide
                    </div>
                    <div className="p-0">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                          <tr>
                            <th className="px-6 py-3 w-1/3 font-bold border-b">Category</th>
                            <th className="px-6 py-3 font-bold border-b">Your Answer</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {Object.entries(currentScenario.patientScript.details).map(([key, value], idx) => (
                            <tr key={key} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                              <td className="px-6 py-4 font-semibold text-indigo-900 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </td>
                              <td className="px-6 py-4 text-slate-700 leading-relaxed">
                                {value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              
              {/* TAB CONTENT: CLINICAL PEARLS */}
              {activeTab === 'pearls' && (
                <div className="animate-fadeIn space-y-6">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-amber-800 mb-4 flex items-center">
                       <BookOpen size={24} className="mr-2"/> Key Clinical Pearls
                    </h3>
                    <div className="space-y-4">
                      {currentScenario.clinicalPearls ? (
                        currentScenario.clinicalPearls.map((pearl, index) => (
                          <div key={index} className="flex items-start bg-white/60 p-3 rounded-lg border border-amber-100">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center font-bold text-xs mr-3 mt-0.5 shadow-sm">
                              {index + 1}
                            </div>
                            <div className="text-amber-900 font-medium leading-relaxed text-sm md:text-base">
                              {pearl.split('**').map((part, i) => 
                                i % 2 === 1 ? <strong key={i} className="text-amber-950 bg-amber-100/50 px-1 rounded">{part}</strong> : part
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-500 italic">No specific clinical pearls available for this case.</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <h4 className="font-bold text-slate-700 mb-3 flex items-center">
                      <AlertCircle size={18} className="mr-2 text-red-500"/>
                      Endocrinologist's Note
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      모든 순환기 증상(흉통, 두근거림, 실신 등)에서 <b>내분비 질환(갑상선, 당뇨병, 부신 질환)</b>을 감별 진단에 포함시키는 습관은 오진을 줄이는 핵심입니다. 
                      특히 증상이 비전형적인(Atypical) 고령자나 당뇨병 환자에서는 더욱 주의 깊은 문진과 신체 진찰이 요구됩니다.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CardiologyCPXApp;