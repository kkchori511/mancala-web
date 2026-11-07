# 시안 2단계 결과

기준: [BRIEF.md](../BRIEF.md)의 ‘시안 2단계’. 제작일: 2026-11-07.

- 제작 방식: 내장 `image_gen` 도구로 생성 및 편집, `sips`로 최종 픽셀 크기 조정.
- 최초 생성마다 [2p-landscape-c.png](2p-landscape-c.png)를 이미지 입력으로 전달해 재질·조명·배경의 스타일 기준으로 사용했다.
- [balls.html](../samples/balls.html)의 `pitB()`와 2-B 설명을 읽고, 큰 가운데 공(1.4배·얇은 흰 테두리), 최대 6개의 주변 공, 틈새의 어두운 아랫층을 프롬프트에 반영했다. HTML을 브라우저로 실행하지 않았다.
- Chrome 실행, 텔레그램 등 별도 외부 전송, git 커밋은 하지 않았다.

## 스마트폰 세로

파일: [phone-portrait.png](phone-portrait.png) — 1080×2340 PNG.

화이트 오크 보드를 2열×6행으로 세워 좁고 긴 스마트폰 화면에 맞췄다.
상대 점수의 회전·밑줄, 아래 저장고 전체를 감싸는 청록 턴 표시와 상하 안전 여백을 함께 보여준다.

### 최초 생성 프롬프트

입력 이미지: C 시안(스타일 기준).

```text
Use case: ui-mockup
Create a polished original Kalah mancala game screen. Input image is STYLE REFERENCE ONLY: match its extremely pale white oak, fine realistic grain, shallow tidy round bowls, bright warm-gray backdrop, minimal soft shadows and glossy pool balls. Redesign the layout as specified below.
Critical NEW ball arrangement, overriding the reference: in each round pit place the HIGHEST number ball in the CENTER, 1.4 TIMES the diameter of the other balls, edged by a THIN WHITE outer ring. Up to SIX smaller balls arranged in an orderly hexagonal ring AROUND that large center ball. No triangular piles; never put largest ball at top of a stack. For counts over seven, only dark small slivers of lower-layer balls peek through gaps below this top seven-ball rosette. This is the 2-B layout from the supplied specification. Some pits may be empty. Show variety of counts 1,3,4,5,7,9,12; no extra count labels.
Balls have white circular number badges with sharp black numerals. Colors 1 yellow,2 blue,3 red,4 purple,5 orange,6 green,7 maroon,8 black,9 pink,10 sky blue. 11–20 repeat these colors with one white horizontal stripe; 21–30 two stripes.
Stores: EVERY store is ONE rounded enclosure containing BOTH a recessed ball chamber (upper 70%) and a score panel (lower 30%). A subtle separator inside. The active store alone has a subtle teal glowing outline which exactly follows the outer enclosure curvature, enclosing BOTH compartments. The score panel NEVER extends beyond the glowing perimeter. Use score 9 with a short underline under the glyph in its own reading orientation to distinguish 6/9; rotate underline WITH score when rotated.
No branding, logos, watermark or explanatory words. No device perspective, no hands, no physical room; straight orthographic overhead screen mockup, full canvas.
Asset: phone-portrait.png, EXACT 1080×2340 portrait (6:13). Smartphone screen without device bezel. A tall vertical two-player board with precisely TWO COLUMNS and SIX ROWS of round playing pits (12 total), one long HORIZONTAL store at TOP and one at BOTTOM. Bottom store belongs to me and is the ONLY glowing teal store; top store score is rotated 180 degrees with its underline rotated along with it. Keep highest-number center balls emphasized. White-oak board centered with comfortable margins. Reserve clear phone safe areas: a small black dynamic-island pill centered near the top, substantial space between it and the board; a thin dark home-indicator bar centered near bottom, substantial clear bottom padding. Stores are broad horizontal rounded rectangles with 70% ball chamber above 30% score strip inside the same enclosure. No text except digits on balls and scores.
```

### 수정 프롬프트 1

입력 이미지: 해당 시안의 직전 생성·수정본.

```text
Use case: precise-object-edit
Preserve this portrait white-oak Kalah screen exactly: 2 columns x6 rows of pits, upper/lower stores, dark dynamic island and home bar, teal bottom-store enclosure, inverted underlined top score.
Correct only two round pit ball clusters:
- Row TWO from top, RIGHT column: swap the identities of the LARGE orange center5 and SMALL green peripheral6. Final center is LARGE GREEN6 edged white, peripheral ball is SMALL ORANGE5, other small balls 1,2,3,4 unchanged.
- Row FIVE from top, LEFT column: swap identities of LARGE blue center2 and SMALL red peripheral3. Final center LARGE RED3 with white outline, peripheral SMALL BLUE2, yellow1 unchanged.
All other pits remain exactly unchanged. Do not change wood, score, stores, background or layout. 1080x2340 portrait.
```
## 4인 모니터

파일: [4p-monitor.png](4p-monitor.png) — 1920×1080 PNG.

네 변에 각각 5칸을 둔 중앙 보드와 좌측 순위표·우측 숫자 기록 패널로 데스크톱의 넓은 공간을 활용했다.
모든 정보는 정방향으로 읽히며, 중앙 P1 표시와 활성 저장고의 청록 테두리가 현재 차례를 알려준다.

### 최초 생성 프롬프트

입력 이미지: C 시안(스타일 기준).

```text
Use case: ui-mockup
Create a polished original Kalah mancala game screen. Input image is STYLE REFERENCE ONLY: match its extremely pale white oak, fine realistic grain, shallow tidy round bowls, bright warm-gray backdrop, minimal soft shadows and glossy pool balls. Redesign the layout as specified below.
Critical NEW ball arrangement, overriding the reference: in each round pit place the HIGHEST number ball in the CENTER, 1.4 TIMES the diameter of the other balls, edged by a THIN WHITE outer ring. Up to SIX smaller balls arranged in an orderly hexagonal ring AROUND that large center ball. No triangular piles; never put largest ball at top of a stack. For counts over seven, only dark small slivers of lower-layer balls peek through gaps below this top seven-ball rosette. This is the 2-B layout from the supplied specification. Some pits may be empty. Show variety of counts 1,3,4,5,7,9,12; no extra count labels.
Balls have white circular number badges with sharp black numerals. Colors 1 yellow,2 blue,3 red,4 purple,5 orange,6 green,7 maroon,8 black,9 pink,10 sky blue. 11–20 repeat these colors with one white horizontal stripe; 21–30 two stripes.
Stores: EVERY store is ONE rounded enclosure containing BOTH a recessed ball chamber (upper 70%) and a score panel (lower 30%). A subtle separator inside. The active store alone has a subtle teal glowing outline which exactly follows the outer enclosure curvature, enclosing BOTH compartments. The score panel NEVER extends beyond the glowing perimeter. Use score 9 with a short underline under the glyph in its own reading orientation to distinguish 6/9; rotate underline WITH score when rotated.
No branding, logos, watermark or explanatory words. No device perspective, no hands, no physical room; straight orthographic overhead screen mockup, full canvas.
Asset: 4p-monitor.png, EXACT 1920×1080, landscape 16:9. Four-player desktop monitor mode with everyone viewing from the SAME front direction, all digits and P labels UPRIGHT.
Main layout: one SQUARE white-oak board centered in canvas, flanked by two narrow quiet pale UI panels. Board ring contains EXACTLY FIVE round playing pits along EACH of its FOUR edges (20 pits TOTAL), and EXACTLY FOUR rounded rectangular stores in the FOUR CORNERS. Five top pits between top corner stores, five bottom pits between bottom corner stores, five left pits between left corner stores, five right pits between right corner stores. Large empty square center space. No pits in center.
Player colors are muted teal P1, muted burnt orange P2, dusty purple P3, muted lime P4, used as small edge markers and badges, not colorful wood. ONLY bottom-right corner store for current player P1 has teal glow; all four stores internally include chamber and score. In center show a small teal current-turn marker and upright P1.
LEFT panel: compact ranking scoreboard with four rows, colored dot, P1 19, P2 16, P3 12, P4 9. Only P1/P2/P3/P4 and digits permitted. RIGHT panel: recent history expressed ONLY by three small arrow/ball icons with numerals, e.g. 3 → 7, 2 → 5, 1 → 9; no headings or words. All content upright, especially all corner-store scores. Restrained airy app layout.
```

### 수정 프롬프트 1

입력 이미지: 해당 시안의 직전 생성·수정본.

```text
Use case: precise-object-edit
Correct this desktop Kalah mockup. Change layout geometry so the central wood board is an EXACT SQUARE, width equals height, centered, with generous top/bottom margin. Landscape final canvas 1920x1080 (16:9). Target board footprint x=540 to1380, y=120 to960, exactly 840x840; left score panel x=160 to440 and right history panel x=1480 to1760. These are composition instructions, NEVER display coordinates or text.
Preserve style, pale white oak, soft light, 4 corner stores with scores inside one outline, and precisely FIVE round pits on each of the four sides (20 total). Keep all pits circular not stretched. Reflow board contents naturally into square footprint; a clear empty central square with small teal P1 turn marker. All labels upright. Preserve scoreboard P1 19, P2 16, P3 12, P4 9; history icon/number rows. Only bottom-right store glows teal.
Also ensure the highest numbered ball in each round pit is the LARGE CENTER ball with a thin white outline, and all smaller surrounding balls have numbers LOWER than that center, at most six surrounding balls. E.g. center 7 ring 1–6; center 6 ring 1–5; center 4 ring 1–3; center 3 ring 1,2. No duplicate number within a pit. Preserve quiet premium minimal UI; no extra text.
```

### 수정 프롬프트 2

입력 이미지: 해당 시안의 직전 생성·수정본.

```text
Use case: precise-object-edit
Preserve this monitor mockup geometry, side panels, wood, stores, scores, P1 center marker and all20 pits. Make ONLY these seven swaps between large CENTER ball and one small surrounding ball. Positions count only round pits along each edge, excluding corner stores.
LEFT edge second pit from TOP: swap large center blue2 with small red3 -> large red3 center, small blue2.
LEFT edge third pit: swap large center purple4 with small green6 -> large green6, small purple4.
LEFT edge fourth pit: swap large center orange5 with small maroon7 -> large maroon7, small orange5.
RIGHT edge first pit fromTOP: swap large center red3 with small purple4 -> large purple4, small red3.
RIGHT edge second pit: swap large center blue2 with small green6 -> large green6, small blue2.
RIGHT edge fifth pit: swap large center blue2 with small purple4 -> large purple4, small blue2.
BOTTOM edge third pit fromLEFT: swap large center orange5 with small green6 -> large green6, small orange5.
All large center balls thin white outline, diameter1.4times smaller balls. No other changes. Landscape1920x1080.
```
## 4인 태블릿

파일: [4p-tablet.png](4p-tablet.png) — 2048×1536 PNG.

책상 가운데 둔 태블릿을 네 사람이 둘러보는 상황을 표현했다. 각 변의 바깥 배지는 그 자리에 앉은 사람에게 맞춰 회전했다.
중앙의 큰 청록 화살표는 아래쪽 P1을 가리키며, 네 모서리의 일체형 저장고와 정돈된 공 배치를 유지한다.

### 최초 생성 프롬프트

입력 이미지: C 시안(스타일 기준).

```text
Use case: ui-mockup
Create a polished original Kalah mancala game screen. Input image is STYLE REFERENCE ONLY: match its extremely pale white oak, fine realistic grain, shallow tidy round bowls, bright warm-gray backdrop, minimal soft shadows and glossy pool balls. Redesign the layout as specified below.
Critical NEW ball arrangement, overriding the reference: in each round pit place the HIGHEST number ball in the CENTER, 1.4 TIMES the diameter of the other balls, edged by a THIN WHITE outer ring. Up to SIX smaller balls arranged in an orderly hexagonal ring AROUND that large center ball. No triangular piles; never put largest ball at top of a stack. For counts over seven, only dark small slivers of lower-layer balls peek through gaps below this top seven-ball rosette. This is the 2-B layout from the supplied specification. Some pits may be empty. Show variety of counts 1,3,4,5,7,9,12; no extra count labels.
Balls have white circular number badges with sharp black numerals. Colors 1 yellow,2 blue,3 red,4 purple,5 orange,6 green,7 maroon,8 black,9 pink,10 sky blue. 11–20 repeat these colors with one white horizontal stripe; 21–30 two stripes.
Stores: EVERY store is ONE rounded enclosure containing BOTH a recessed ball chamber (upper 70%) and a score panel (lower 30%). A subtle separator inside. The active store alone has a subtle teal glowing outline which exactly follows the outer enclosure curvature, enclosing BOTH compartments. The score panel NEVER extends beyond the glowing perimeter. Use score 9 with a short underline under the glyph in its own reading orientation to distinguish 6/9; rotate underline WITH score when rotated.
No branding, logos, watermark or explanatory words. No device perspective, no hands, no physical room; straight orthographic overhead screen mockup, full canvas.
Asset: 4p-tablet.png, EXACT 2048×1536 landscape 4:3. Four people seated on four sides of a shared tabletop tablet.
One centered SQUARE white-oak board, EXACTLY FIVE round playing pits on EACH of its FOUR edges (20 pits TOTAL) and FOUR integrated corner stores. Arrange five top pits between top corner stores, five bottom pits between bottom corner stores, five left pits between left corner stores, five right pits between right corner stores. Clear square center. No sidebars.
OUTSIDE each board edge, one small player name-and-score badge correctly oriented for person seated there: bottom P1 19 at 0° upright; right P2 16 rotated -90° (counterclockwise); top P3 12 rotated 180° upside down; left P4 9 rotated +90° clockwise. Entire badge contents, including score and P label, rotate as one unit. All four badges fit comfortably inside the canvas with margins. Colors teal P1, muted burnt orange P2, dusty purple P3, muted lime P4. Only P1 bottom-right corner store glows teal. Store scores face their associated seated player; underline any 6/9 and rotate underline with numeral.
In empty board center ONE LARGE elegant TEAL ARROW points DOWN toward current player P1 at the bottom edge. No central text. No words besides P1 P2 P3 P4.
```

### 수정 프롬프트 1

입력 이미지: 해당 시안의 직전 생성·수정본.

```text
Use case: precise-object-edit
Edit this shared-tablet Kalah screen. Preserve square white-oak board, exact five round pits per side, four corner stores, pale style, bottom-pointing large teal arrow and all layout.
1. RIGHT orange player badge must be rotated MINUS 90 degrees counterclockwise from an upright horizontal 'P2 16' badge. Thus P2 is at the BOTTOM end of the right badge and 16 is at TOP end; letters face toward the person sitting on the RIGHT. The existing right badge faces wrong way: rotate its contents 180 degrees.
2. LEFT green P4 9 badge remains PLUS90 clockwise: P4 at top end, 9 bottom end, with short underline attached to 9 and rotated with it.
3. TOP purple P3 12 remains upside down 180, BOTTOM teal P1 19 remains upright.
4. Corner store scores match associated player and orientation: bottom-right P1 store score 19 upright and only teal-glowing store; bottom-left P2 store score16 rotated -90; top-right P3 store score12 rotated180; top-left P4 store score9 rotated+90 with underline. Keep each score inside its store's lower score compartment.
5. Each round pit: largest number is the 1.4x LARGE CENTER ball edged white. All surrounding smaller balls have LOWER numbers. Correct any center2 with surrounding3/4/6 etc, and center3 surrounded4, center5 surrounded6, by changing center digit/color to highest number (e.g.7 maroon), preserving hexagonal arrangement.
Do not add any labels or other objects. Canvas 2048x1536 landscape4:3.
```

### 수정 프롬프트 2

입력 이미지: 해당 시안의 직전 생성·수정본.

```text
Use case: precise-object-edit
Make ONLY these localized corrections to the latest tablet image, keep every other pixel/composition as close as possible.
A. Left lime OUTSIDE player badge: keep P4 rotated +90° clockwise. Replace its wrong score 16 with 9 rotated +90°, with a short underline rotating with the9. Right orange P2 16 badge is already correct; preserve it. Top upside-down P3 12 and bottom P1 19 are correct; preserve.
B. Enforce highest-number central balls in five pits by changing only LARGE CENTER balls: top edge second pit fromleft large orange5 -> maroon7; left edge third pit fromtop large red3 -> orange5; left edge fourth pit large orange5 -> maroon7; right edge second pit large purple2 -> orange5; right edge third pit large orange5 -> maroon7. All changed center balls retain their large size and thin white outer rim. Surrounding balls stay small and unchanged. Do not change any other pits or stores.
C. Top-right store score12 must be upside down180°, bottom-left store score16 rotated -90°, top-left store score9 rotated +90° with matching underline. Keep bottom-right19 upright.
2048x1536, same style and layout.
```

### 수정 프롬프트 3

입력 이미지: 해당 시안의 직전 생성·수정본.

```text
Use case: precise-object-edit
Change ONLY two LARGE central balls in this exact image; keep their positions, size, white outline. Do not change any peripheral balls or other geometry:
1. The large orange5 located at about x42% y15.5% of the full canvas (TOP horizontal row, SECOND round pit from left, between the maroon7 cluster and empty round pit): change that LARGE CENTER ball to maroon7 with black7 on white badge.
2. The large orange5 located at about x24.3% y40.5% (LEFT vertical row, SECOND round pit from top, cluster with green6 aboveleft): change that LARGE CENTER ball to maroon7 with black7 on white badge.
ONLY these two center5 balls become maroon7 so they exceed all surrounding numbers. Keep every other ball, every score, all rotated P badges, all four stores, teal arrow, wood and framing unchanged.
```

### 수정 프롬프트 4

입력 이미지: 해당 시안의 직전 생성·수정본.

```text
Use case: precise-object-edit
In this tablet game image, recolor and relabel EVERY LARGE CENTRAL ORANGE BALL numbered5 inside the round playing pits as a LARGE MAROON BALL numbered7, with a thin white outer outline. This applies to all such large center5 balls wherever they appear. Keep ALL SMALL peripheral orange5 balls unchanged. This makes the central number greater than surrounding numbers.
Keep everything else absolutely unchanged: twenty circular pits, four corner stores, outside rotated P1/P2/P3/P4 badges and scores, square pale white-oak board, downward teal arrow, current-turn store glow. No new text.
```
## 2인 캡처 순간

파일: [2p-capture.png](2p-capture.png) — 1600×900 PNG.

맞은편 상대 칸에서 내 칸으로 이어지는 청록 빛줄기와 공의 이동 잔상으로 캡처 방향을 표현했다.
붉은 상대 칸의 흔들림과 +5를 순간 효과로 강조하면서 밝고 차분한 C 스타일의 보드가 읽히도록 했다.

### 최초 생성 프롬프트

입력 이미지: C 시안(스타일 기준).

```text
Use case: ui-mockup
Create a polished original Kalah mancala game screen. Input image is STYLE REFERENCE ONLY: match its extremely pale white oak, fine realistic grain, shallow tidy round bowls, bright warm-gray backdrop, minimal soft shadows and glossy pool balls. Redesign the layout as specified below.
Critical NEW ball arrangement, overriding the reference: in each round pit place the HIGHEST number ball in the CENTER, 1.4 TIMES the diameter of the other balls, edged by a THIN WHITE outer ring. Up to SIX smaller balls arranged in an orderly hexagonal ring AROUND that large center ball. No triangular piles; never put largest ball at top of a stack. For counts over seven, only dark small slivers of lower-layer balls peek through gaps below this top seven-ball rosette. This is the 2-B layout from the supplied specification. Some pits may be empty. Show variety of counts 1,3,4,5,7,9,12; no extra count labels.
Balls have white circular number badges with sharp black numerals. Colors 1 yellow,2 blue,3 red,4 purple,5 orange,6 green,7 maroon,8 black,9 pink,10 sky blue. 11–20 repeat these colors with one white horizontal stripe; 21–30 two stripes.
Stores: EVERY store is ONE rounded enclosure containing BOTH a recessed ball chamber (upper 70%) and a score panel (lower 30%). A subtle separator inside. The active store alone has a subtle teal glowing outline which exactly follows the outer enclosure curvature, enclosing BOTH compartments. The score panel NEVER extends beyond the glowing perimeter. Use score 9 with a short underline under the glyph in its own reading orientation to distinguish 6/9; rotate underline WITH score when rotated.
No branding, logos, watermark or explanatory words. No device perspective, no hands, no physical room; straight orthographic overhead screen mockup, full canvas.
Asset: 2p-capture.png, EXACT 1600×900 landscape 16:9. Two-player capture-moment action screen, same horizontal wide board composition as style reference: SIX round pits TOP and SIX BOTTOM, tall vertical store at each end; right store mine glowing teal enclosing both compartments; left store opponent, score 9 and underline rotated together 180°. Right score 19 upright.
Capture animation focal point: the FOURTH pit from LEFT in the bottom row is mine, newly landed single yellow 1 ball in its center. A vivid narrow TEAL LIGHT BEAM connects this pit vertically to the directly opposite FOURTH top-row pit. Opponent pit has a red pulsing rim with slight doubled jitter outline to suggest shaking. Several glossy numbered balls visibly traveling DOWN the teal beam from that opponent pit toward my pit, with restrained semi-transparent motion afterimages showing downward movement. Opponent pit partially emptying. A small '+5' floats beside the beam. Keep effect localized and elegant, legible round pits and fine pale oak remain visible, no screen-wide blur. Other pits use the NEW center-large hexagonal 2-B ball layout. No lettering, only number badges, scores and +5.
```

### 수정 프롬프트 1

입력 이미지: 해당 시안의 직전 생성·수정본.

```text
Use case: precise-object-edit
Preserve this capture-animation screen, wood board, teal connecting beam, downward moving balls and afterimages, red shaking opponent pit, +5, stores and score panels.
Change ONLY two round-pit ball identities to enforce maximum number in center:
TOP ROW SECOND pit from left has large orange center5 but a smaller green6. Swap those identities: center becomes LARGE GREEN6 with thin white outline, peripheral becomes SMALL ORANGE5.
TOP ROW THIRD pit from left has large blue center2 but a small green6. Swap those identities: center becomes LARGE GREEN6 with thin white outline, peripheral becomes SMALL BLUE2.
Do not change any other balls, effects, labels or geometry. 1600x900 landscape.
Also BOTTOM ROW THIRD pit fromleft: swap large orange center5 and small green6, so large center GREEN6 and small peripheral ORANGE5. All three corrected center balls have thin white outer rings.
```

## 확인 및 해석 범위

최종 4개 파일의 PNG 형식과 지정 픽셀 크기를 확인했다. 스마트폰의 2열×6행, 4인용의 네 변 각 5칸·네 모서리 저장고, 모니터의 정방향 패널, 태블릿의 회전 배지와 화살표, 캡처 빛줄기·잔상을 시각적으로 확인했다.

이 파일들은 화면 구성과 시각 효과를 검토하는 생성형 콘셉트 목업이다. 공의 개수·번호·색·줄무늬와 점수의 완전한 수치 일치는 게임 상태 검증 결과가 아니며, 일부 작은 공에는 번호 중복이나 색상 오차가 남아 있다. 중앙 강조 공의 정확한 위치·배율 및 저장고 비율도 구현용 좌표로 정의한 것은 아니다.

