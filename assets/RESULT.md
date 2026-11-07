# 보드 나무 질감 에셋

기준: [BRIEF.md](../design/BRIEF.md)의 ‘실제 사용 에셋 1: 보드 나무 질감’. 제작일: 2026-11-07.

## 결과

- [oak-tile.jpg](oak-tile.jpg): **1024×1024**, JPEG, **252,965바이트**(약 253KB / 247KiB). 300KB 이하.
- [oak-tile-preview.jpg](oak-tile-preview.jpg): **2048×2048**, 최종 타일을 회전·반전 없이 2×2 반복한 JPEG.
- 아주 밝은 무광 화이트 오크, 가로 방향의 가는 나뭇결, 평균 색상 목표 sRGB **#EADFCD**. 옹이·판재 이음선·얼룩·글자·그림자·비네팅 없이 균일한 재질로 제작했다.

## 생성 및 이음새 처리 방법

1. 내장 `image_gen`으로 조명 정보가 없는 평평한 화이트 오크 재질을 생성했다.
2. 1024×1024로 맞춘 뒤, 맞은편 가장자리의 밝기 차이를 주기 경계 조건의 Poisson 보정(periodic-plus-smooth 분해)으로 줄였다.
3. 각 가장자리 안쪽 32px에 부드러운 대칭 블렌딩을 적용해 좌우·상하 끝 픽셀을 연결했다. 타일을 반사·미러링해 나뭇결을 만들지는 않았다.
4. 전체 평균 RGB를 (234, 223, 205)에 맞췄다. 별도의 광원 그라데이션은 추가하지 않았다.
5. JPEG 품질 96%로 저장해 300,000바이트 이하임을 확인했다. 미리보기는 **저장된 oak-tile.jpg를 다시 디코딩한 이미지**를 네 번 붙여 만들었다.

## 반복 확인 결과

최종 2×2 미리보기 전체와 중앙 교차 경계의 600×600 확대 이미지를 시각적으로 확인했다. 중앙의 수직·수평 경계나 뚜렷한 밝기 단차는 보이지 않았고, 가는 가로 나뭇결이 연속적으로 이어진다.

JPEG 저장 전 좌우·상하 경계의 RGB 평균 절대 차이는 모두 0이었다. 최종 JPEG를 다시 읽어 검사한 채널별 경계 평균 절대 차이는 아래와 같다(0~255 척도).

| 경계 | R | G | B |
|---|---:|---:|---:|
| 좌우 | 0.786 | 0.699 | 0.924 |
| 상하 | 0.655 | 0.579 | 0.821 |

JPEG 압축 뒤에도 경계 차이는 각 채널 1 미만이며, 일반 나뭇결 내부의 인접 픽셀 차이 수준보다 작다. 128×128 블록의 평균 휘도 범위는 약 222.70~225.33으로 큰 조명 그라데이션 없이 고르게 유지된다.

## 사용한 프롬프트

```text
Use case: product-mockup
Asset: production-ready SEAMLESS TILEABLE material texture, 1024x1024 square, very pale WHITE OAK wood, straight flat overhead orthographic view of a single continuous unjointed wood surface. Horizontal fine wood grain runs LEFT TO RIGHT. Warm pale ivory oak base around sRGB #EADFCD, subtle restrained cream and beige grain variations, matte finish, delicate small pores and wispy finegrain. Premium minimal wood matching a lightwhiteoakKalahboard.
CRITICAL SEAMLESS CONSTRAINT: Left edge must continue perfectly into right edge, top edge into bottom edge, no visible stitching at a2x2repeat. No distinctive centralfeature. Grain patterns must wrap naturally through allfour edges.
UNIFORM FLAT ALBEDO COLOR MAP: NO lighting gradient, directional light, baked highlights, shadows, ambient occlusion, vignette, perspective or depth. Even brightness across entiretile. NO knots, stains, dark streaks, cracks, scratches, printed text, logos, borders, tabletop edges, plank joints or board seams. Not a photo of a framedwoodenobject; fill theENTIREcanvas with thepurematerialtexture. Grainquiet andfine, lowcontrast enough for repeatedgameboarduse, no glitter or gloss.
```

Chrome 실행, 텔레그램 등 별도 외부 전송, git 커밋은 하지 않았다.

