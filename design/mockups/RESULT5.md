# 시안 5단계 결과

기준: [BRIEF.md](../BRIEF.md)의 ‘시안 5단계’. 각각 같은 이름의 v2 PNG를 편집 기준으로 사용했다. 제작일: 2026-11-07.

## 제작·검증 방식

내장 image_gen 도구로 네 시안의 변경안을 만들고, 빈 홈과 개별 당구공 자산을 추가 생성했다. v2 이미지 위에 변경 영역만 조립해, 이미지 생성 과정에서 생길 수 있는 배경·배치 변경을 보존 영역에 반영하지 않았다. 기존 v2 파일은 유지했다.

화살표는 각 변 하나씩 #222222의 가는 긴 선과 분명한 화살촉으로 배치했다. 4인 보드·20개 홈·저장고·배지 좌표는 v2의 도면 좌표를 재사용했다. 최고 번호 공 지름은 칸 폭의 70%, 다른 공은 42%로 조립했다. 태블릿에서는 각각 95.0264px / 57.01584px, 모니터에서는 67.5892px / 40.55352px다. 최고 번호 공에 흰 테두리를 두고 다른 공은 긴 축을 따라 정돈했다.

변경 허용 영역은 화살표가 있는 테두리, 2인의 지정 저장고·회전 점수 밑줄, 4인의 홈·저장고 내부와 배지 강조 영역이다. 네 최종 PNG를 v2와 비교해 이 영역 밖의 픽셀 차이가 모두 0임을 확인했다. 자세한 수치는 [검증 기록](stage5-assets/verification.json), 범위와 공 지름은 [변경 영역 기록](stage5-assets/change-regions.json)에 있다. 해상도도 v2와 같다.

Chrome 실행, 텔레그램 등 별도 외부 전송, git 커밋은 하지 않았다.

## 스마트폰 P1 차례

[phone-p1-turn-v3.png](phone-p1-turn-v3.png) · 1080×2340 PNG.

아래 저장고를 왼쪽 공·오른쪽 점수로 바꿔 위 저장고와 점대칭이 되게 했다.
위 저장고와 12칸 상태, 안전 여백을 유지하고, 화면 각 변에 길고 또렷한 반시계 방향 화살표를 배치했다.

사용 프롬프트: G1. 실제 생성 결과에서 지정된 저장고·공 자산을 사용하고 나머지는 v2 위에 배치했다.

## 2인 가로

[2p-landscape-v3.png](2p-landscape-v3.png) · 1600×900 PNG.

오른쪽 저장고는 위 점수·아래 공으로 바꾸고 기존 청록 활성 틀을 유지했다.
왼쪽 저장고의 회전 점수에는 밑줄을 추가했으며, 여섯 칸을 따라 긴 검정 진행 방향 표시를 넣었다.

사용 프롬프트: G2. 실제 생성 결과에서 지정된 저장고·공 자산을 사용하고 나머지는 v2 위에 배치했다.

## 4인 태블릿

[4p-tablet-v3.png](4p-tablet-v3.png) · 2048×1536 PNG.

도면 배치는 유지하고 공을 칸 폭의 70%·42% 비율로 키워 최고 번호가 먼저 읽히게 했다.
활성 P1의 저장고와 외부 배지가 함께 빛나고, 다른 배지는 약하게 흐려진다. 회전 배지·앉은 방향 쉐브론·중앙 화살표는 기존 위치와 방향을 유지했다.

사용 프롬프트: G3, G5, G6. 실제 생성 결과에서 지정된 저장고·공 자산을 사용하고 나머지는 v2 위에 배치했다.

## 4인 모니터

[4p-monitor-v3.png](4p-monitor-v3.png) · 1920×1080 PNG.

태블릿과 같은 비율로 공을 키우고 P1의 저장고·배지에 활성 표시를 함께 적용했다.
모든 글자는 정방향이며 중앙 차례 표시와 최근 기록 패널을 유지했다. 테두리는 변마다 긴 검정 화살표 하나로 바꿨다.

사용 프롬프트: G4, G5, G6. 실제 생성 결과에서 지정된 저장고·공 자산을 사용하고 나머지는 v2 위에 배치했다.

## 실제 사용 프롬프트

### G1. 스마트폰 편집

입력: phone-p1-turn-v2.png.

```text
Use case: precise-object-edit
Edit ONLY the changes listed below in this exact v2 mockup. Preserve camera, canvas composition, pale white oak grain, lighting, background, board outline, pit geometry and positions, all game state/counts/colors/numbers, UI positions and type, and every unlisted detail. This is a restrained iteration of this exact image, not a redesign.
Common change: replace ALL faint short border progress arrows with EXACTLY ONE LONG BLACK (#222222) arrow PER SIDE, FOUR arrows total, thin crisp shaft and unmistakable arrowhead, counterclockwise on screen: BOTTOM pointsRIGHT, RIGHT pointsUP, TOP pointsLEFT, LEFT pointsDOWN. Each arrow spans the entire row of pits on its side. Keep arrows in the WOOD OUTER BORDER MARGIN, not through pits or stores, and remove former short arrows. No extra arrow segments.

Output phone-p1-turn-v3.png,1080x2340portrait. Long rightUP and leftDOWN arrows extend alongside all SIX pitrows; topLEFT and bottomRIGHT span boardwidth in end-border margins. Keep dynamicisland/homeindicator andsafeareas.
ONLY other change: swap compartments INSIDE BOTTOM current-player store so LEFT70% is BALL CHAMBER containing the SAME glossy blue2,red3,yellow1 balls, RIGHT30% is SCORE PANEL with upright19. Keep same enclosing roundedstore shape andTEALglow. TOPstore unchanged: LEFT score12 RIGHTballchamber purple4orange5green6. Two stores now have point-symmetric division. Keep all12roundpits and theirballs exactly unchanged.
```

### G2. 2인 가로 편집

입력: 2p-landscape-v2.png.

```text
Use case: precise-object-edit
Edit ONLY the changes listed below in this exact v2 mockup. Preserve camera, canvas composition, pale white oak grain, lighting, background, board outline, pit geometry and positions, all game state/counts/colors/numbers, UI positions and type, and every unlisted detail. This is a restrained iteration of this exact image, not a redesign.
Common change: replace ALL faint short border progress arrows with EXACTLY ONE LONG BLACK (#222222) arrow PER SIDE, FOUR arrows total, thin crisp shaft and unmistakable arrowhead, counterclockwise on screen: BOTTOM pointsRIGHT, RIGHT pointsUP, TOP pointsLEFT, LEFT pointsDOWN. Each arrow spans the entire row of pits on its side. Keep arrows in the WOOD OUTER BORDER MARGIN, not through pits or stores, and remove former short arrows. No extra arrow segments.

Output2p-landscape-v3.png1600x900. Long topLEFT andbottomRIGHT arrow spans all SIXplayingpits between endstores; vertical arrows use narrow outerboardends.
ONLY other change: swap compartments INSIDE RIGHT current-player store: TOP30% SCORE PANEL showing upright12, BOTTOM70% BALLCHAMBER with exactly SAME existing storeballs, enclosingframe&tealglow preserved. LEFT opponentstore remains TOPballchamber/BOTTOMscorepanel with rotated180degree12; add short6/9-disambiguation UNDERLINE below that rotated score in its own readingorientation (underline rotates180withdigits). Keep everyplayingpit andpoolballunchanged.
```

### G3. 4인 태블릿 편집

입력: 4p-tablet-v2.png.

```text
Use case: precise-object-edit
Edit ONLY the changes listed below in this exact v2 mockup. Preserve camera, canvas composition, pale white oak grain, lighting, background, board outline, pit geometry and positions, all game state/counts/colors/numbers, UI positions and type, and every unlisted detail. This is a restrained iteration of this exact image, not a redesign.
Common change: replace ALL faint short border progress arrows with EXACTLY ONE LONG BLACK (#222222) arrow PER SIDE, FOUR arrows total, thin crisp shaft and unmistakable arrowhead, counterclockwise on screen: BOTTOM pointsRIGHT, RIGHT pointsUP, TOP pointsLEFT, LEFT pointsDOWN. Each arrow spans the entire row of pits on its side. Keep arrows in the WOOD OUTER BORDER MARGIN, not through pits or stores, and remove former short arrows. No extra arrow segments.

Output4p-tablet-v3.png2048x1536. Long arrows alongallFIVEpitsoneachedge. All20roundedrectangularpits,4tintedball-onlystores, small55%centralspace, rotatedexteriorbadges, seatingchevrons andcenterDOWNarrow stayexactlyintheirv2positions.
ONLY otherchanges:
1. ENLARGE balls dramatically INSIDE existingpitboundaries. Each pit's highestMAROON7 at CENTER has DIAMETER70% of pit's SHORTWIDTH (about95pxon135.752pxpitwidth), withthinWHITEouterring. All6otherballs1yellow2blue3red4purple5orange6green have diameter42%shortwidth(about57px). Arrange alongLONGaxis above/belowthecentral7 forverticalpits andleft/rightforhorizontalpits, compactorderlytwocolumns, slightnaturaloverlapallowed, keepallnumberbadgesupright. DoNOT enlargepitstomakeroom. Sameballcounts, noextras.
2. Enlarge STOREballs to correspondingsame scale relativeto pitwidth, keeping theircurrentcounts/numbers andwoodtints. Storeframesarenotlarger.
3. CurrentP1bottomrightSTORE stillglowsTEAL. ALSO make P1exteriorbottomrightSCOREBADGE glowwitha cleanTEALhalo aroundits existingpilloutline. P2,P3,P4 exteriorbadges slightlymuted/dimmed, but legible, samerotations/positions/colors. PreserveP1down/P2right/P3up/P4leftseatingchevrons unchanged. Nootherscenechanges.
```

### G4. 4인 모니터 편집

입력: 4p-monitor-v2.png.

```text
Use case: precise-object-edit
Edit ONLY the changes listed below in this exact v2 mockup. Preserve camera, canvas composition, pale white oak grain, lighting, background, board outline, pit geometry and positions, all game state/counts/colors/numbers, UI positions and type, and every unlisted detail. This is a restrained iteration of this exact image, not a redesign.
Common change: replace ALL faint short border progress arrows with EXACTLY ONE LONG BLACK (#222222) arrow PER SIDE, FOUR arrows total, thin crisp shaft and unmistakable arrowhead, counterclockwise on screen: BOTTOM pointsRIGHT, RIGHT pointsUP, TOP pointsLEFT, LEFT pointsDOWN. Each arrow spans the entire row of pits on its side. Keep arrows in the WOOD OUTER BORDER MARGIN, not through pits or stores, and remove former short arrows. No extra arrow segments.

Output4p-monitor-v3.png1920x1080. LongarrowsspanallFIVEpitsoneachedge. Preserveexactv2squareboardposition1010pxside, all20roundedrectangularpits96.556x191.9px, fourtintedball-onlycornerstores,55%smallcenter, alluprightexteriorbadges, rightrecenthistorypanelandcenter'▶ P1'.
ONLY otherchanges:
1. ENLARGEballs in existingpits. HighestMAROON7 centerDIAMETER70%pitSHORTWIDTH(about67.6px),thinWHITEouterring. Others1yellow2blue3red4purple5orange6green DIAMETER42%shortwidth(about40.55px), arrangedabove/belowforverticalpits,left/rightforhorizontalpits,compacttwo-columnorder,slightnaturaloverlap,allnumberbadgesUPRIGHT. DoNOTchangepitdimensions, samecounts.
2. EnlargeSTOREballs correspondingly, sameexistingcounts/numbers/colorsandstoretints, sameframes.
3. P1bottomrightSTORE retainsTEALglow; ALSOglowingTEALoutlinearoundP1bottomrightexteriorSCOREBADGE. Otherthreeexteriorbadgesslightlydimmed/mutedbutlegible, allupright. No seatingchevrons inmonitor. Nothingelsechanges.
```

### G5. 공 크기 재배치용 빈 홈

입력: 4단계 공통 보드 이미지. 최종 조립에서는 홈과 저장고 내부의 빈 질감만 사용.

```text
Use case: precise-object-edit
Prepare a clean layer from this exactpaleoakboard. REMOVEALL numberedbilliardballs from ALL20roundedrectangularplayingpits and ALL4tintedcornerstores. Leave only EMPTYcarvedwoodenrecesses. Also remove all faint borderdirectionarrows fillingwithmatchingwoodgrain. Preserveexact1420squareboardgeometry,20rectpitdimensions/positions, fourcornerstoresize&transparentwoodtints, P1bottomrighttealglow, lighting, background, emptycenter andallwoodgrain. No newballs, text, circles, scoresorpanels. This assetwill receive thepreviouslygeneratedbilliardballcrops at exact70%and42%pitwidth, so EMPTYrecessesareessential.
```

### G6. 깨끗한 개별 당구공 자산

입력 이미지 없음. 투명 배경 자산 시트로 생성한 후 각 공을 잘라 지정 지름으로 배치.

```text
Use case: ui-mockup
Generate ONE transparent spriteasset sheet with EIGHT SEPARATE isolated glossy numbered POOL BILLIARD BALLS, arranged in a precise4column x2row grid, generous empty transparentgaparoundeveryball. No touching oroverlap. Allballs same220pixeldiameter, canvas1200x600landscape. Cellcenters top(150,150),(450,150),(750,150),(1050,150), bottom(150,450),(450,450),(750,450),(1050,450). Inreadingorder 1YELLOW,2BLUE,3RED,4PURPLE /5ORANGE,6GREEN,7MAROON,8BLACK. Each sphere has ONE whitecirclenumberbadge centeredatfront with crispBLACKdigit, subtlebrightupperleftspecularhighlight and naturalroundedshading. Straighttopview sphereicons, premiumrealisticglossmatchingpaleoakKalahmockup. Clean silhouettes. NO WHITE STRIPES: these1through8 areSOLIDcolors. No outershadowbeyondsmallsoftambientcontactshadow, no background, noborders, nolabelsoutsideballs, noletters, noextraobjects. One singleimageasset sheet. Needcleantransparentspacebetweenallspritesforcropping.
```


