# 시안 3단계 결과

기준: [BRIEF.md](../BRIEF.md) 맨 아래 ‘시안 3단계’. 스타일 기준: [C 시안](2p-landscape-c.png). 공 배치 기준: [balls.html](../samples/balls.html)의 2-B.

## 제작 방식

내장 `image_gen`으로 원목 보드, 공이 든 홈, 스마트폰 시안, 캡처 효과와 UI 자산을 생성·편집했다. 모니터와 태블릿의 픽셀 일치를 보장하기 위해 생성된 자산을 로컬에서 공통 레이어로 조립하고, 점수 숫자와 일부 차례 표시는 선명한 글자로 배치했다. 독립적으로 재생성한 보드 두 장을 사용하지 않았다.

플레이어 배치는 P1 아래·오른쪽 아래 저장고(청록), P2 오른쪽·오른쪽 위 저장고(코랄), P3 위·왼쪽 위 저장고(남색), P4 왼쪽·왼쪽 아래 저장고(라임)다.

사용자의 이번 지시에 따라 기존 `4p-monitor.png`와 `4p-tablet.png`를 교체했다. 나머지 이전 시안은 유지했다. Chrome 실행, 텔레그램 등 별도 외부 전송, git 커밋은 하지 않았다.

## P1 차례 · 스마트폰

파일: [phone-p1-turn.png](phone-p1-turn.png) · 1080×2340 PNG.

지금 차례인 P1의 저장고를 아래에 두고 청록 테두리로 강조했다.
상하 저장고 모두 왼쪽 점수·오른쪽 공 칸으로 나누고, 다이내믹 아일랜드와 홈 인디케이터 여백을 남겼다.

사용한 이미지 생성 프롬프트: G2, G8. 점수 12/19를 정방향으로 배치하고, 12칸은 동일한 생성 칸 자산으로 조립. 아래 ‘실제 사용 프롬프트’의 해당 ID에 전문을 기록했다.

## P2 차례 · 스마트폰

파일: [phone-p2-turn.png](phone-p2-turn.png) · 1080×2340 PNG.

P1 화면과 같은 판 상태를 180° 전환한 P2 시점이다. 아래 저장고의 활성 색을 코랄로 바꿨다.
칸은 (행, 열) → (5−행, 1−열)로 옮기고 점수·공 번호는 정방향으로 유지했다. 저장고의 좌우 분할도 읽기 방향에 맞춰 유지했다.

사용한 이미지 생성 프롬프트: G2, G3, G8. P1의 12칸 자산을 역순으로 재배치하고 저장고의 공·점수 소유 위치를 교환. 아래 ‘실제 사용 프롬프트’의 해당 ID에 전문을 기록했다.

## 4인 모니터 · P1 차례

파일: [4p-monitor.png](4p-monitor.png) · 1920×1080 PNG.

공통 정사각형 보드를 중심에 두고, 왼쪽에는 순위·점수, 오른쪽에는 최근 기록을 배치했다.
모든 점수와 UI는 정방향이며, 중앙 ▶ P1 표시와 오른쪽 아래 저장고의 청록 테두리로 현재 차례를 알린다.

사용한 이미지 생성 프롬프트: G1, G5, G7. 공통 보드에 정방향 점수와 중앙 차례 표시를 배치. 아래 ‘실제 사용 프롬프트’의 해당 ID에 전문을 기록했다.

## 4인 모니터 · P1 캡처

파일: [4p-monitor-capture.png](4p-monitor-capture.png) · 1920×1080 PNG.

아래쪽 P1의 가운데 칸과 정면 위쪽 P3의 가운데 칸을 보드 중앙을 통과하는 청록 빛줄기로 연결했다.
P3 칸의 붉은 흔들림, 아래로 이동하는 공과 잔상, +7을 한 장면으로 표현했다.

사용한 이미지 생성 프롬프트: G1, G4, G5, G7. 일반 모니터와 같은 보드 위에 공통 캡처 효과를 배치. 아래 ‘실제 사용 프롬프트’의 해당 ID에 전문을 기록했다.

## 4인 태블릿 · P1 차례

파일: [4p-tablet.png](4p-tablet.png) · 2048×1536 PNG.

모니터와 정확히 같은 크기·배치의 보드를 재사용하고, 주변 이름·점수 배지를 자리별 방향으로 회전했다.
각 저장고 점수도 소유자 방향으로 돌렸으며, 중앙의 큰 청록 화살표는 아래쪽 P1을 가리킨다.

사용한 이미지 생성 프롬프트: G1, G6, G7. 배지·저장고 점수 방향은 P1 0°, P2 −90°, P3 180°, P4 +90°. 아래 ‘실제 사용 프롬프트’의 해당 ID에 전문을 기록했다.

## 4인 태블릿 · P1 캡처

파일: [4p-tablet-capture.png](4p-tablet-capture.png) · 2048×1536 PNG.

모니터 캡처와 같은 보드·빛줄기·이동 중인 공을 같은 픽셀 크기로 사용했다.
태블릿에서는 자리별 회전 배지와 소유자 방향 저장고 점수로 네 사람이 둘러앉은 상황을 보여준다.

사용한 이미지 생성 프롬프트: G1, G4, G6, G7. 모니터 캡처의 공통 보드 장면을 그대로 재사용하고 점수 방향·주변 배지만 변경. 아래 ‘실제 사용 프롬프트’의 해당 ID에 전문을 기록했다.

## 공통 보드와 확인 결과

- 공통 보드 레이어: **880×880px**. 모니터에서는 좌상단 (520, 100), 태블릿에서는 (584, 328)에 배치했다. 보드 자체의 크기와 내부 좌표는 같다.
- 원형 칸: **20개 모두 지름 96px**. 각 변의 칸 중심 좌표는 236, 338, 440, 542, 644로 간격이 102px이며, 같은 생성 칸 자산을 사용했다.
- 저장고: 네 곳 모두 **156×156px** 정사각형. 공 칸과 점수 칸은 같은 둥근 틀 안에 있다.
- 일반 장면의 비교 대상 **710,912픽셀**, 캡처 장면 **740,992픽셀**에서 모니터·태블릿 간 차이 **0픽셀**을 확인했다. 의도적으로 다른 저장고 점수 글자 영역과 일반 장면의 중앙 차례 표시 영역만 비교에서 제외했다. 캡처 효과와 +7은 같은 픽셀을 재사용한다.
- 스마트폰 두 장의 판 상태는 6행×2열 기준 역순 관계다. P1 시점 공 개수: `7,1 / 1,7 / 7,0 / 7,1 / 1,7 / 0,7`. P2 시점: `7,0 / 7,1 / 1,7 / 0,7 / 7,1 / 1,7`.
- 여섯 파일의 PNG 형식·지정 해상도를 확인하고 최종 화면을 시각적으로 검토했다.

재사용 레이어와 검증 기록:

- [일반 공통 보드](stage3-assets/board-common.png)
- [캡처 공통 보드](stage3-assets/board-capture-common.png)
- [좌표·판 상태·픽셀 비교 기록](stage3-assets/verification.json)

공 번호·흰 테두리와 재질은 이미지 생성 결과이며, 1.4배는 생성 프롬프트의 시각적 목표다. 이 문서의 픽셀 일치 검증은 모니터·태블릿 간 공통 보드 재사용에 관한 검증이다.

## 실제 사용 프롬프트

### G1. 4인 공통 보드 원본

C 시안을 재질·조명 스타일 기준 이미지로 사용.

```text
Use case: ui-mockup
Create a SQUARE orthographic Kalah game BOARD master asset, matching attached reference's extremely pale white oak, shallow round carved bowls, fine real grain, bright warm neutral background, minimal soft shadow, premium minimal style.
Canvas SQUARE. Board is exactly square, fills canvas with 2% margins. Four CORNERS have exactly equal SQUARE recessed STORE enclosures, each internally divided into ball chamber upper70% and blank score strip lower30%. No digits or letters in store score strips, leave clean blank pale wood. Stores same size and radius. No player-color glow anywhere.
TWENTY equal round playing bowls, FIVE on EACH edge, all exactly same size and equal spacing. Broad empty central square.
Very explicit geometry in normalized board coordinates: corner stores occupy x/y2–18% and82–98%; top/bottom five round pit centers x=25,37.5,50,62.5,75% y=10% or90%; left/right centers y=25,37.5,50,62.5,75% x=10% or90%. Every round pit diameter10%. Store width=height16%.
All round pits have identical neat 2-B arrangement of glossy numbered miniature POOL balls: large MAROON7 at EXACT CENTER of each bowl, 1.4x ordinary ball diameter and thin white outer ring, SIX smaller balls around it in an evenly spaced hexagonal ring, 1yellow 2blue 3red 4purple 5orange 6green, white badges black digits, every digit upright. No triangular piles. Corner stores have few small glossy balls naturally arranged in upper chamber only.
Center board space EMPTY, no turn indicator yet. No panels. No text outside ball numbers. No labels, logo, watermark. No perspective angle.
The source is ONLY a material style reference, not layout. This new geometry overrides the source.
```

### G2. P1 스마트폰 원본

C 시안을 스타일 기준 이미지로 사용.

```text
Use case: ui-mockup
Create phone-p1-turn.png portrait1080x2340 game screen, pale white oak from style reference, shallow round recesses minimal shadows bright warm-gray. Board is vertical, TWELVE round pits as TWO columns SIX rows. Top3rows opponentP2, bottom3rows currentP1. Wide horizontal store at top and bottom, each one rounded frame split LEFT RIGHT: LEFT30% blank score area, RIGHT70% recessed ball chamber containing a few numbered glossy pool balls. No top-bottom store division. Both score areas BLANK, to receive crisp upright numerals later. CurrentP1 bottomstore thin subtle TEAL glow exactly following enclosing frame. Topstore no glow. Maintain phone safe areas: black dynamic-island pill and ample topclearance, bottom homeindicator and ample bottomclearance. No words or logos.
All filled roundpits use 2-B ball layout: highest MAROON7 at center,1.4times ordinary ball diameter, thin white outerring; six smaller balls1yellow2blue3red4purple5orange6green in neat hexagon around. Vary a few pits as singleyellow1, three with red3center ring1,2, empty; for over7 dark lowerlayer slivers. All ballnumbers upright. Very clear minimalist luxurious appmockup, straight overhead no device bezel. No P labels, only ballnumerals.
```

### G3. P2 스마트폰 회전 시안

G2 생성본을 편집 대상으로 사용. 최종 칸 상태는 공통 칸 자산으로 다시 배치.

```text
Use case: precise-object-edit
Make phone-p2-turn from this phone-p1-turn mockup, keeping identical wood geometry, camera,12pits and exact ball state, phone safeareas, leftscore rightball storedivision.
Rotate the complete PLAYING STATE by180degrees: top-left pit becomes bottom-right, top-right becomes bottom-left, and viceversa for all6rows; bottomstore's balls2blue3red1yellow move into TOP store rightchamber, topstore's balls4purple5orange6green move into BOTTOM store rightchamber. Both stores retain LEFT score compartment and RIGHT ball chamber, blankscore panels. All poolball numeral badges remain UPRIGHT, not upside down. Bottom active store outline changes fromTEAL to muted CORAL (#CB796E), top no glow. All other structure and bright whiteoak style unchanged. No new lettering. Canvas1080x2340.
```

### G4. 모니터·태블릿 공통 캡처 효과

입력 이미지 없음. 투명 배경으로 생성.

```text
Use case: ui-mockup
Asset: transparent capture-animation overlay for 4p-monitor-capture, to be laid over an existing pale wood square board. TRANSPARENT BACKGROUND, NO BOARD or wood, no frame, no text. Square canvas.
One thin elegant luminous TEAL beam vertically through center, from top pit center at(50%,10%) to bottom pit center(50%,90%). At source/top endpoint a small thin RED ring with doubled jitter arcs suggesting an opponent round pit shaking, ringdiameter10%canvas. At bottom endpoint subtle teal receiving ring same diameter10%. FIVE miniature glossy numbered poolballs (maroon7,purple4,red3,blue2,yellow1) streaming DOWN toward lowerendpoint with short translucent afterimage trails following each ball UPWARDS. Balls small enough to leave most beam visible; dramatic but refined transparent bloom, clean fine particles, no broad colored background. Keep the central route straight through boardmiddle, no diagonal. Highest visual detail, realistic glossy balls white badges blacknums. The overlay must fit without changing the board beneath. Empty transparent corners and sides.
```

### G5. 모니터 순위·기록 패널

입력 이미지 없음. 투명 배경으로 생성.

```text
Use case: ui-mockup
Create an isolated transparent UI asset sheet for4p-monitor.png. Two elegant narrow vertical rounded panels SIDE BY SIDE with large transparent gap and transparent margins. Bright warm-gray/offwhite panels, delicate inset border, subtle shadows, premium minimal app style matching white-oak game. No board, no wood, no device.
LEFT PANEL four generous vertically spaced ranking rows: muted TEAL dot then 'P1' and '19'; muted CORAL pinkorange dot then 'P2' and '16'; muted NAVY dot then 'P3' and '12'; muted LIME dot then 'P4' and '9'. Crisp dark upright sansserif digits and P labels. No heading.
RIGHT PANEL three recent-history rows, exact text 'P2 · 3 → +6', 'P4 · 2 → +3', 'P1 · 1 → +5'. Add tiny mutedcolor dot in each row matching player. All upright. No other words, no watermark. Portrait panels each about300pixelswide600high, separated by200pixels, square canvas with plenty transparency. Beautifully legible type.
```

### G6. 태블릿 플레이어 배지·화살표

입력 이미지 없음. 투명 배경으로 생성. 최종 배지는 각각 회전 배치.

```text
Use case: ui-mockup
Create transparent UI ASSET SHEET for4p-tablet and4p-tablet-capture. Transparent background, no board or device. Four separate horizontal pill-shaped player badges stacked vertically with ample transparent gaps, all upright initially so they can be rotated in layout.
Badge1 muted TEAL, exact crisp label 'P1 19'.
Badge2 muted CORAL pinkorange, exact label 'P2 16'.
Badge3 muted NAVY blue, exact label 'P3 12'.
Badge4 muted LIME, exact label 'P4 9'.
Premium pale inset white score area on right of each badge, playerlabel on colored left, dark charcoal digits in scorearea, sansserif crisp. Underline score9 for6/9disambiguation. No other words.
Below fourbadges, a SINGLE LARGE elegant TEAL ARROW pointing DOWN, on transparentbackground. Flat polished luminous accent, no lettering.
Keep badge dimensions exactly equal, wide3.5:1, no shadows outside silhouette beyond subtle softedge. Canvas1024x1536 portrait. Original minimal gameUI. Muted colors: teal#399D96 coral#CB796E navy#3D506D lime#96AD53.
```

### G7. 공통 보드의 빈 원목 바탕

G1 생성본을 편집 대상으로 사용.

```text
Use case: precise-object-edit
Prepare a clean background layer from this generated squarewhiteoak board master. Remove ALL roundpits, cornerstore recesses, balls and internalfeatures, filling them with a continuous uncarved pale-white-oak surface consistent with the central grain. Keep the squareboard's exact outer silhouette, rounded corners, softly beveled edge, palegrain, bright surroundingbackground and overheadlighting unchanged. Result is ONE EMPTY SQUARE pale oak slab on minimal warmgraybackground, no cavities, no balls, no text. This will be assembled with the original generated pit and store assets to guarantee equal sizes and spacing. Squarecanvas.
```

### G8. 스마트폰의 빈 플레이 영역

G2 생성본을 편집 대상으로 사용.

```text
Use case: precise-object-edit
From this phoneP1 whiteoak game image, remove ALL TWELVE ROUND PLAYING PITS and ALL their balls from the tall middle playingfield, filling it with continuous uncarved pale-white-oak grain. Keep exactly unchanged: board outer frame silhouette, upper horizontal store with blankscoreLEFT and ballsRIGHT, bottom horizontal store with blankscoreLEFT ballsRIGHT and TEAL glow, phone dynamicisland and homeindicator, bright background. Only the playingfield between upper andlowerstores becomes plainwoodwith NO roundpits or balls. No other changes. This is an imageassembly backgroundlayer for placing twelve identical generated pitassets. Portrait1080x2340.
```


