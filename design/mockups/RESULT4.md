# 시안 4단계 결과

기준: [BRIEF.md](../BRIEF.md)의 ‘시안 4단계’. 제작일: 2026-11-07.

스타일 기준은 [C 시안](2p-landscape-c.png), 칸과 공 배치는 [balls.html](../samples/balls.html)의 2-B 설명을 바탕으로 했다. 4인 보드는 [태블릿 도면](../samples/layout-4p-tablet.png)과 [모니터 도면](../samples/layout-4p-monitor.png)의 배치·비율을 기준으로 삼았다.

## 제작 방식

내장 `image_gen`으로 4인 보드·직사각형 홈·착색 저장고·UI와 투명 캡처 효과를 생성·수정하고, 2인 가로·스마트폰 이미지는 기존 시안을 이미지 생성 도구로 편집했다. 4인 화면은 도면의 치수를 보장하도록 생성된 자산을 공통 보드 레이어로 로컬 조립했다. 중앙 차례 표시, 외부 배지의 회전 배치, 테두리의 은은한 음각 방향 표시는 도면 좌표에 맞춰 배치했다.

공통 원목 바탕은 3단계에서 이미지 생성으로 제작한 빈 화이트 오크 보드 자산을 재사용했다. 새 원형 홈을 그려 대체하지 않았으며, 이번에 생성한 둥근 직사각형 홈과 공 전용 저장고를 사용했다.

최종 파일은 모두 요청한 새 이름으로 저장했다. 기존 시안은 덮어쓰지 않았다. Chrome 실행, 텔레그램 등 별도 외부 전송, git 커밋은 하지 않았다.

## 4인 태블릿

파일: [4p-tablet-v2.png](4p-tablet-v2.png) · 2048×1536 PNG.

도면의 긴 둥근 직사각형 칸과 작은 중앙 공간을 그대로 사용했다. 저장고는 나무결이 비치는 플레이어색의 공 전용 홈이며 점수는 외부 배지에만 표시했다.
P1·P2·P3·P4 배지는 각각 0°·−90°·180°·90°로 회전하고, 옆의 작은 쉐브론 3개와 중앙 큰 화살표로 앉은 방향과 현재 차례를 보여준다.

사용 프롬프트·구성: G1의 보드·칸·저장고 + G2의 선명한 배지 자산. 도면 좌표로 조립. 아래 G1~G6에 실제 사용 프롬프트 전문을 기록했다.

## 4인 태블릿 캡처

파일: [4p-tablet-v2-capture.png](4p-tablet-v2-capture.png) · 2048×1536 PNG.

일반 태블릿 시안의 배치 위에 P3의 위쪽 가운데 칸과 P1의 아래쪽 가운데 칸을 잇는 청록 빛줄기를 더했다.
붉게 흔들리는 상대 칸, 이동하는 공과 잔상, +7을 보드 중앙의 같은 경로에 배치했다.

사용 프롬프트·구성: G1, G2, G3, G4. 공통 캡처 보드 레이어를 사용하고 태블릿 배지를 동일하게 배치. 아래 G1~G6에 실제 사용 프롬프트 전문을 기록했다.

## 4인 모니터

파일: [4p-monitor-v2.png](4p-monitor-v2.png) · 1920×1080 PNG.

태블릿과 같은 모양의 보드를 모니터 도면의 1010px 크기로 배치했다. 네 점수 배지는 각 저장고 옆 좌우 빈 공간에 모두 정방향으로 놓았다.
오른쪽 가운데의 최근 기록 패널과 중앙 ▶ P1 표시를 사용하고, 사람 위치 쉐브론은 넣지 않았다.

사용 프롬프트·구성: G1의 공통 보드·칸·저장고 + G2의 배지·최근 기록 패널. 모니터 도면 좌표로 조립. 아래 G1~G6에 실제 사용 프롬프트 전문을 기록했다.

## 4인 모니터 캡처

파일: [4p-monitor-v2-capture.png](4p-monitor-v2-capture.png) · 1920×1080 PNG.

태블릿 캡처와 같은 공통 장면을 모니터 보드 크기로 배치했다.
정방향 배지와 최근 기록 패널을 유지하면서 중앙 청록 빛줄기, 붉은 칸 강조와 공 잔상으로 캡처 순간을 보여준다.

사용 프롬프트·구성: G1, G2, G3, G4. 태블릿과 동일한 캡처 원본을 도면 비율로 축소 배치. 아래 G1~G6에 실제 사용 프롬프트 전문을 기록했다.

## 2인 가로

파일: [2p-landscape-v2.png](2p-landscape-v2.png) · 1600×900 PNG.

기존 C의 화이트 오크 보드와 저장고의 공·점수 일체형 구성을 유지했다.
바깥 나무 테두리에 아래 →, 오른쪽 ↑, 위 ←, 왼쪽 ↓의 얕은 음각 같은 진행 방향 표시를 추가했다.

사용 프롬프트·구성: G5. C 시안을 편집 대상으로 사용한 이미지 생성 결과를 지정 크기로 저장. 아래 G1~G6에 실제 사용 프롬프트 전문을 기록했다.

## 스마트폰 P1 차례

파일: [phone-p1-turn-v2.png](phone-p1-turn-v2.png) · 1080×2340 PNG.

기존 P1 차례의 칸 상태, 왼쪽 점수·오른쪽 공 저장고, 아래 청록 활성 테두리와 상하 안전 여백을 유지했다.
양옆 세로 테두리에 각각 3개의 진행 방향 표시를 넣고 상하 끝에도 조용한 방향 표시를 추가했다.

사용 프롬프트·구성: G6. 기존 phone-p1-turn.png를 편집 대상으로 사용한 이미지 생성 결과를 지정 크기로 저장. 아래 G1~G6에 실제 사용 프롬프트 전문을 기록했다.

## 도면 치수와 검증

도면 이미지와 함께 제공된 [layout-4p.html](../samples/layout-4p.html)의 SVG 생성 코드를 브라우저 없이 로컬에서 평가해 기준 좌표를 추출했다. 내보낸 배치 좌표와 대조해 4인 화면 네 장 모두 일치함을 확인했다(수치 비교 허용 오차 10⁻⁸px).

| 항목 | 태블릿 | 모니터 |
|---|---:|---:|
| 캔버스 | 2048×1536 | 1920×1080 |
| 보드 좌상단 | (314, 58) | (455, 35) |
| 정사각형 보드 한 변 | 1420px | 1010px |
| 테두리 여백 | 49.7px | 35.35px |
| 저장고 한 변 | 269.8px | 191.9px |
| 칸 폭×안쪽 깊이 | 135.752×269.8px | 96.556×191.9px |
| 칸 사이 간격 | 17.04px | 12.12px |
| 중앙 공간 명목 한 변 | 781px (55%) | 555.5px (55%) |
| 중앙 내부 여백 제외 순수 공간 | 746.92px | 531.26px |

- 원형 칸이 아닌 둥근 직사각형 칸이 각 변 5개씩, 총 20개다. 좌우 변에서는 같은 칸을 90° 방향의 비율로 배치했다. 모든 공 번호는 정방향으로 보인다.
- 칸 모서리 곡률은 폭의 22%, 저장고 모서리 곡률은 저장고 한 변의 18%로 도면과 같다.
- 저장고는 공 전용이며 점수 구획이나 저장고 점수 숫자가 없다. 점수는 바깥 P1~P4 배지에만 있다.
- P1 오른쪽 아래(청록), P2 오른쪽 위(코랄), P3 왼쪽 위(남색), P4 왼쪽 아래(라임)로 배치했다.
- 테두리 진행 방향 표시는 각 변 3개씩 총 12개이며, 아래 → / 오른쪽 ↑ / 위 ← / 왼쪽 ↓다. 태블릿의 사람 위치 쉐브론과 구분되는 낮은 대비로 처리했다.
- 일반·캡처 보드 원본은 태블릿 1420px 기준으로 각각 한 장이다. 모니터는 같은 원본을 1010/1420 비율로 배치했다. 서로 다른 캔버스에 요구된 도면 크기를 따르며, 형태·상대 배치·캡처 장면은 공유한다.
- 여섯 파일의 PNG 서명과 지정 픽셀 크기를 확인했고, 최종 4인 화면과 생성된 2인·스마트폰 편집 결과를 시각적으로 검토했다.

검증 자료:

- [일반 공통 보드](stage4-assets/board-common.png)
- [캡처 공통 보드](stage4-assets/board-capture-common.png)
- [도면 대조·해상도 검증 기록](stage4-assets/verification.json)
- [태블릿 좌표](stage4-assets/4p-tablet-v2-layout.json) · [모니터 좌표](stage4-assets/4p-monitor-v2-layout.json)

## 실제 사용 프롬프트

### G1. 4인 태블릿·공통 보드 원본

입력 1: layout-4p-tablet.png(배치·치수 기준). 입력 2: 2p-landscape-c.png(재질·조명 기준).

```text
Use case: ui-mockup
Stage4 premium Kalah game. Input1 is a STRICT LAYOUT BLUEPRINT: preserve its exact board position, size, proportions, corners, pit rectangles, badges. Input2 is MATERIAL STYLE ONLY: pale whiteoak, fine real grain, shallow carved recesses, minimal shadows, bright warmgray.
CRITICAL: TWENTY ROUNDED RECTANGULAR playing pits, NOT CIRCLES. Each pit aspect1:1.99, longdimension goes INWARD. Five tall narrow pits along top, five tall narrow along bottom, five wide shallow along left, five wide shallow along right. Equal pit dimensions, rotated by90 on sideedges. Small central square only55%boardwidth, exactly as blueprint, NEVER enlargecenter.
Four SQUARE corner stores ONLY contain balls, NO score compartments or dividers, NO digits aside from poolballbadges. Stores softly stain wood with ownercolor, grain visible: bottomrightP1teal, toprightP2coral, topleftP3navy, bottomleftP4lime. ONLY P1cornerstore has samecurvature subtle glowingtealoutline.
Poolball layout in each rectangular pit: center highest MAROON7 is1.4timesordinaryballsize with THIN WHITE outerring. Six smaller balls1yellow2blue3red4purple5orange6green in TWO orderly columns stretched along the long dimension around the center, not a circularhexagon or triangularpile. White badge blackdigits, allballnumbersupright. Stores contain fewbilliardballs. No roundpits anywhere.
At outerwoodborder12 VERY SUBTLE shallow ENGRAVED directionarrows,3perside: bottom→ right↑ top← left↓, faintwarmgray, no boldcolor.
Remove ALL schematic labels from theblueprint: no 저장고, no P1-1 labels, no dimensions, no dashedcentralguide, no center explanatorysentence. Only outsideplayerbadges, actualrecenthistorytext and turnmarker allowed. Playerbadges: P1 19 teal, P2 16 coral, P3 12 navy, P4 9 lime. No logo or watermark.

Asset4p-tablet-v2.png,2048x1536. EXACT blueprintcanvascomposition. Boardx314y58side1420, border49.7, cornersquare269.8, top/bottompitwidth135.752height269.8, sidepitwidth269.8height135.752, gaps17.04. All cornerssamecurvature. Badge positions sameasblueprint: P1rightbottom at(1891,1343), P2righttop(1891,193), P3lefttop(157,193), P4leftbottom(157,1343); rotatebadge P1=0 P2=-90 P3=180 P4=90. Three small chevrons by eachbadge point to seatedplayer: P1down P2right P3up P4left, samepositionsasblueprint. Central large elegant TEAL DOWN arrow pointsP1. No othercentertext, no sidepanels.
```

### G2. 4인 모니터·배지·최근 기록 패널

입력 1: layout-4p-monitor.png(배치·치수 기준). 입력 2: C 시안(스타일 기준). 입력 3: G1 생성본(동일한 보드 재질·칸·저장고 기준).

```text
Use case: ui-mockup
Stage4 premium Kalah game. Input1 is a STRICT LAYOUT BLUEPRINT: preserve its exact board position, size, proportions, corners, pit rectangles, badges. Input2 is MATERIAL STYLE ONLY: pale whiteoak, fine real grain, shallow carved recesses, minimal shadows, bright warmgray.
CRITICAL: TWENTY ROUNDED RECTANGULAR playing pits, NOT CIRCLES. Each pit aspect1:1.99, longdimension goes INWARD. Five tall narrow pits along top, five tall narrow along bottom, five wide shallow along left, five wide shallow along right. Equal pit dimensions, rotated by90 on sideedges. Small central square only55%boardwidth, exactly as blueprint, NEVER enlargecenter.
Four SQUARE corner stores ONLY contain balls, NO score compartments or dividers, NO digits aside from poolballbadges. Stores softly stain wood with ownercolor, grain visible: bottomrightP1teal, toprightP2coral, topleftP3navy, bottomleftP4lime. ONLY P1cornerstore has samecurvature subtle glowingtealoutline.
Poolball layout in each rectangular pit: center highest MAROON7 is1.4timesordinaryballsize with THIN WHITE outerring. Six smaller balls1yellow2blue3red4purple5orange6green in TWO orderly columns stretched along the long dimension around the center, not a circularhexagon or triangularpile. White badge blackdigits, allballnumbersupright. Stores contain fewbilliardballs. No roundpits anywhere.
At outerwoodborder12 VERY SUBTLE shallow ENGRAVED directionarrows,3perside: bottom→ right↑ top← left↓, faintwarmgray, no boldcolor.
Remove ALL schematic labels from theblueprint: no 저장고, no P1-1 labels, no dimensions, no dashedcentralguide, no center explanatorysentence. Only outsideplayerbadges, actualrecenthistorytext and turnmarker allowed. Playerbadges: P1 19 teal, P2 16 coral, P3 12 navy, P4 9 lime. No logo or watermark.

Asset4p-monitor-v2.png,1920x1080. Input1monitorlayout MUST govern exactcomposition. Input3 is approved generated TABLET BOARD MATERIAL/ASSET REFERENCE: SAME roundedrectangularpit geometry, storetints, poolballstyle as input3, scaled to monitorblueprint. Boardx455y35side1010. margin35.35 cornerstores191.9squares, topbottompitwidth96.556height191.9,gaps12.12.
Playerbadges ALLUPRIGHT atblueprintpositions: P3topleft(227.5,130.95), P2topright(1692.5,130.95), P4bottomleft(227.5,949.05), P1bottomright(1692.5,949.05). Nopersondirectionchevrons. No leftscorepanel. Rightmiddle panel exactlyblueprintx1510.5y286.9w364h506.2 with heading '최근 기록', three legible rows 'P2 · 3 → +6', 'P4 · 2 → +3', 'P1 · 1 → +5'. No centralguideletters; center smallroundedteal '▶ P1'. All ballnumbersupright, no storepoints. Keep fourcorners asballonlytintedrecesses.
```

### G3. 태블릿 캡처용 투명 효과 원본

입력 이미지 없음. 투명 배경으로 생성.

```text
Use case: ui-mockup
Asset: transparent P1 capture-animation layer for4p-tablet-v2-capture.png. No board, wood, UI, text, background or digitsoutsideballs. Square transparentcanvas. Layout is a vertical effect joining topP3pit to bottomP1pit across a squareboardmiddle. Source at(50%,13%), destination at(50%,87%).
At source, a thin glowing RED ROUNDED RECTANGLE outline, tall narrowaspect1:2, sizeabout10%x20%canvas, soft doubled jitterarcs indicating shaking opponentpit, NOT a roundring. At destination a verysubtle teal roundedrectangle outline sameaspect. One narrow elegant TEAL LIGHT BEAM joining centers through middle. FIVE small glossy numberedpoolballs7maroon,4purple,3red,2blue,1yellow travel DOWN thebeam, short translucent afterimages extendUPWARDS, softglowfineparticles, leaveplenty transparentnegative space. Sourceanddestination consistentwithtallroundedrectangularKalahpits. No darkopaque cloud, restrainedfinebloom, no arroworwords. This layer will be placed above the identical sharedboard in monitorandtablet.
```

### G4. 모니터·태블릿 공통 캡처 효과 수정

직전 G3 생성본을 편집 대상으로 사용. 투명 배경 유지. 최종 수정 효과를 두 캡처 시안에 함께 사용.

```text
Use case: precise-object-edit
Refine this transparent capture-animation asset for4p-monitor-v2-capture.png, preserving identical verticalsource/destination and numberedmovingballs. Keep transparentbackground and allmajorplacement unchanged. Reduce broad red and cyan fog opacity substantially so wood andballs underneath remainvisible. Keep thin red roundedrectangle1:2atTOP and thin teal roundedrectangle1:2atBOTTOM, fine brighttealbeam, fiveglossyballs7,4,3,2,1 movingDOWN with short faintafterimages extendingUP. Restrainedpolishedglow, cleantransparency, no blackorwhiteopaque backdrop. Remove any illegibledigitsorartifactsinsidetheloweremptyrectangle. No new text. This refined SAME layer will be reused forboth monitorandtabletcapture scenes to preserveidenticalaction.
```

### G5. 2인 가로 진행 방향 표시

입력: 기존 2p-landscape-c.png(편집 대상).

```text
Use case: precise-object-edit
Edit this exact2-playerlandscapeCmockup to create2p-landscape-v2.png,1600x900PNG. Change ONLY by adding VERY SUBTLE shallow ENGRAVED counterclockwise progressdirection arrows on the WOOD OUTER BORDER MARGIN, not insidepits and not betweenballclusters: bottomedge3smallarrows pointingRIGHT, rightend smallarrowpointingUP, topedge3smallarrows pointingLEFT, leftend smallarrowpointingDOWN. Arrows match finewarm-beige grainshade, lowcontrast opacityabout15–20%, thinquiet carvedmarks, barelynoticeable, NOT brightcolored. Keep sourceimage's whiteoak, framing, 12roundpits, billiardballs anddigits, twointegratedstores with ballchamber+scorepanel, invertedleft12, upright right12, rightstoretealglow, background, allpositions exactlyunchanged. No additionaltext ordecorations. No newrectangularpits in2-playerlayout.
```

### G6. 스마트폰 진행 방향 표시

입력: 기존 phone-p1-turn.png(편집 대상).

```text
Use case: precise-object-edit
Createphone-p1-turn-v2.png1080x2340 from this exactphone-p1-turnimage. ONLY addveryquietshallowengravedcounterclockwiseprogressarrows in theWOODOUTERBORDER margin: THREE faintsmallarrows alongRIGHTsidepointingUP, THREE alongLEFTsidepointingDOWN, one onBOTTOMwoodendmarginpointingRIGHT, one onTOPwoodendmarginpointingLEFT. Lowcontrastwarmgraybeige15–20% visualstrength, delicatecarvedlook, notbrightcolor, do not interferewithpitsorstoreframes. PreserveEXACTLYexisting12roundpits2columns6rows andallballstate, allnumbersupright, topstore12leftscore/ballsright, bottomstore19leftscore/ballsright integratedroundedframewithtealoutline. Keepverypaleoakgrain, background, dynamicisland andbottomhomeindicator andsafeareas unchanged. No additionallettersorlabels, noplayernames. Do notchangepitshapeorstorecompartmentlayout.
```


