# 2인용 가로 화면 콘셉트 목업

기준: [BRIEF.md](../BRIEF.md)의 ‘이번에 만들 것’. 제작일: 2026-11-07.
제작 방식: 내장 image_gen 이미지 생성 도구. 생성물을 로컬에서 1600×900 PNG로 크기 조정했다.
Chrome 실행, 텔레그램 등 별도 외부 전송, git 커밋은 하지 않았다.

## A. 내추럴 원목

파일: [2p-landscape-a.png](2p-landscape-a.png)

밝은 오크 한 덩어리를 깎아 만든 듯한 깊고 매끄러운 홈과 무광 오일 마감의 따뜻함을 강조했다.
부드러운 그림자와 차분한 린넨 배경으로 원목 결과 광택 있는 당구공의 대비를 살렸다.

### 사용한 생성 프롬프트

```text
Use case: ui-mockup
Asset type: original premium Kalah mancala web game concept screen, 2 players, landscape 1600×900 PNG, 16:9.
Composition: straight overhead orthographic view, one wide horizontal wooden board centered on a quiet background, generous margins, no perspective tilt. Exactly 6 round recessed playing pits in the top row and exactly 6 in the bottom row. Exactly one tall vertical store at EACH end. Each store is internally divided: upper 70% recessed ball chamber, lower 30% separate score panel. Right store belongs to bottom player; LEFT store belongs to opponent. Subtle teal glow ONLY around the outer perimeter of the RIGHT store, indicating current turn. No glow on any pit or left store.
Balls: glossy miniature numbered POOL BILLIARD BALLS, each with a white circular number badge and black digit. Each pit restarts numbering at 1; exact counts left to right TOP row 4,5,0,7,3,4 and BOTTOM row 2,6,4,1,8,4. Top third pit is EMPTY. Arrange balls naturally overlapping in compact stacks so the highest numbered ball is visible at the upper center of each pile. Ball colors by number: 1 yellow, 2 blue, 3 red, 4 purple, 5 orange, 6 green, 7 maroon, 8 black, 9 pink, 10 sky blue; 11–20 repeat colors with one white horizontal stripe. Store chambers contain small piles of these pool balls. Right score panel shows 12 upright, left score panel shows 12 ROTATED 180 DEGREES for the opponent seated opposite.
Materials: light oak wood board with real visible fine wood grain and carefully carved smooth rounded edges. Pool ball gloss contrasts with wood.
Text: NUMERALS ONLY on balls and score panels. No letters, no headings, no captions, no logo, no watermark, no other UI or decorative objects. Original design, not based on any existing game or brand.
Variant A — NATURAL SOLID OAK: warm light natural oak, a single monolithic slab with round bowls carved directly into the wood, matte oil finish, tactile fine grain, soft diffuse shadows and warm natural light. Muted warm gray linen background. Calm handcrafted luxury. No contrasting inlay.
```

## B. 투톤 상감

파일: [2p-landscape-b.png](2p-landscape-b.png)

밝은 오크 바탕에 짙은 월넛 상감으로 각 칸과 저장고의 경계를 또렷하게 잡았다.
차분한 올리브 펠트와 두 목재의 대비로 고전 보드게임의 묵직하고 정교한 느낌을 표현했다.

### 사용한 생성 프롬프트

```text
Use case: ui-mockup
Asset type: original premium Kalah mancala web game concept screen, 2 players, landscape 1600×900 PNG, 16:9.
Composition: straight overhead orthographic view, one wide horizontal wooden board centered on a quiet background, generous margins, no perspective tilt. Exactly 6 round recessed playing pits in the top row and exactly 6 in the bottom row. Exactly one tall vertical store at EACH end. Each store is internally divided: upper 70% recessed ball chamber, lower 30% separate score panel. Right store belongs to bottom player; LEFT store belongs to opponent. Subtle teal glow ONLY around the outer perimeter of the RIGHT store, indicating current turn. No glow on any pit or left store.
Balls: glossy miniature numbered POOL BILLIARD BALLS, each with a white circular number badge and black digit. Each pit restarts numbering at 1; exact counts left to right TOP row 4,5,0,7,3,4 and BOTTOM row 2,6,4,1,8,4. Top third pit is EMPTY. Arrange balls naturally overlapping in compact stacks so the highest numbered ball is visible at the upper center of each pile. Ball colors by number: 1 yellow, 2 blue, 3 red, 4 purple, 5 orange, 6 green, 7 maroon, 8 black, 9 pink, 10 sky blue; 11–20 repeat colors with one white horizontal stripe. Store chambers contain small piles of these pool balls. Right score panel shows 12 upright, left score panel shows 12 ROTATED 180 DEGREES for the opponent seated opposite.
Materials: light oak wood board with real visible fine wood grain and carefully carved smooth rounded edges. Pool ball gloss contrasts with wood.
Text: NUMERALS ONLY on balls and score panels. No letters, no headings, no captions, no logo, no watermark, no other UI or decorative objects. Original design, not based on any existing game or brand.
Variant B — TWO-TONE INLAY: light golden oak slab with precise dark walnut ring inlay around every round playing pit and dark walnut outlines framing BOTH tall stores including their score-panel dividers. Classic refined board-game craftsmanship, rich wood contrast, softly lit realistic recessed bowls. Quiet deep desaturated olive felt background.
```

### 수정 프롬프트 1

B의 최초 생성 이미지를 편집 대상으로 사용해 각 칸의 공 개수와 번호를 수정했다.

```text
Use case: precise-object-edit
Edit this two-tone oak and walnut Kalah game mockup. Preserve the exact board, framing, walnut inlay, olive felt background, lighting, twelve round pits, two divided stores, inverted left score 12, upright right score 12, teal glow only on right store, and all wood textures.
Change ONLY the billiard balls inside the 12 round playing pits to correct their exact quantities, colors and number badges. Every ball must have one visible white circular badge with a black digit, with no hidden extra balls. Within each pit use each number once, starting from 1. Arrange highest numbered ball at TOP CENTER of each compact stack.
Top row from left to right: pit 1 exactly four balls numbered 1,2,3,4 (4 at top center); pit 2 exactly five balls 1,2,3,4,5 (5 at top center); pit 3 empty; pit 4 exactly seven balls 1,2,3,4,5,6,7 (7 at top center); pit 5 exactly three balls 1,2,3 (3 at top center); pit 6 exactly four balls 1,2,3,4 (4 at top center).
Bottom row left to right: exactly two balls 1,2; six balls 1,2,3,4,5,6; four balls 1,2,3,4; one ball 1; eight balls 1,2,3,4,5,6,7,8; four balls 1,2,3,4. Highest number at top center in each pit.
Consistent colors: 1 yellow, 2 blue, 3 red, 4 purple, 5 orange, 6 green, 7 maroon, 8 black. No duplicate numbers or surplus balls. Do not change anything else. Landscape 16:9.
```

### 수정 프롬프트 2

직전 B 수정본에서 아래쪽 다섯 번째 칸의 불필요한 공 하나만 제거했다.

```text
Use case: precise-object-edit
Change ONLY the fifth circular pit from the left in the BOTTOM row (second round pit from the right). There is one surplus purple ball without a number at the upper right of this pit. REMOVE that unnumbered purple ball, leaving exposed wood in that spot. Preserve the eight other numbered balls 1,2,3,4,5,6,7,8 in this pit exactly, including the black 8 at top center. Final total in this pit exactly EIGHT balls, only ONE purple ball which is labeled 4. Preserve absolutely everything else in the image, all other pits, stores, scores, wood, background, teal outline, framing and colors.
```

## C. 모던 미니멀

파일: [2p-landscape-c.png](2p-landscape-c.png)

아주 밝은 화이트 오크와 얕고 정갈한 홈으로 가볍고 깨끗한 앱 화면의 인상을 만들었다.
밝은 회색 배경과 최소한의 그림자로 시각적 무게를 줄이고, 공과 오른쪽 턴 표시가 잘 보이게 했다.

### 사용한 생성 프롬프트

```text
Use case: ui-mockup
Asset type: original premium Kalah mancala web game concept screen, 2 players, landscape 1600×900 PNG, 16:9.
Composition: straight overhead orthographic view, one wide horizontal wooden board centered on a quiet background, generous margins, no perspective tilt. Exactly 6 round recessed playing pits in the top row and exactly 6 in the bottom row. Exactly one tall vertical store at EACH end. Each store is internally divided: upper 70% recessed ball chamber, lower 30% separate score panel. Right store belongs to bottom player; LEFT store belongs to opponent. Subtle teal glow ONLY around the outer perimeter of the RIGHT store, indicating current turn. No glow on any pit or left store.
Balls: glossy miniature numbered POOL BILLIARD BALLS, each with a white circular number badge and black digit. Each pit restarts numbering at 1; exact counts left to right TOP row 4,5,0,7,3,4 and BOTTOM row 2,6,4,1,8,4. Top third pit is EMPTY. Arrange balls naturally overlapping in compact stacks so the highest numbered ball is visible at the upper center of each pile. Ball colors by number: 1 yellow, 2 blue, 3 red, 4 purple, 5 orange, 6 green, 7 maroon, 8 black, 9 pink, 10 sky blue; 11–20 repeat colors with one white horizontal stripe. Store chambers contain small piles of these pool balls. Right score panel shows 12 upright, left score panel shows 12 ROTATED 180 DEGREES for the opponent seated opposite.
Materials: light oak wood board with real visible fine wood grain and carefully carved smooth rounded edges. Pool ball gloss contrasts with wood.
Text: NUMERALS ONLY on balls and score panels. No letters, no headings, no captions, no logo, no watermark, no other UI or decorative objects. Original design, not based on any existing game or brand.
Variant C — MODERN MINIMAL: exceptionally pale white oak, restrained fine real wood grain, shallow precisely carved round recesses, clean thin smooth contours, broad soft even light and minimal shadows. Very light warm-gray solid background. Airy polished contemporary app aesthetic. No dark inlay.
```

## 확인

- 세 파일 모두 1600×900 PNG, 16:9.
- 위·아래 각 6칸, 양 끝 저장고의 공 홈/점수 칸 분할, 오른쪽 저장고의 청록 턴 표시를 확인했다.
- 윗줄 공 개수 4, 5, 0, 7, 3, 4 / 아랫줄 2, 6, 4, 1, 8, 4를 시각적으로 확인했다.
- 상대 점수는 180° 회전되어 있으며, 숫자 외 제목·로고·문자는 없다.
- 콘셉트 검토용 이미지이며 저장고 안 공의 수와 표시 점수 12의 일치는 별도로 구현한 게임 상태를 뜻하지 않는다.

