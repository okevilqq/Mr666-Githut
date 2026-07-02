# Execution Lock

> Machine-readable execution contract. Executor MUST `read_file` this before every SVG page.

## canvas
- viewBox: 0 0 1280 720
- format: PPT 16:9

## mode
- mode: pyramid

## visual_style
- visual_style: soft-rounded

## colors
- bg: #FAFAF5
- secondary_bg: #F0EDE8
- surface: #F5F0EA
- primary: #E67E22
- accent: #1A5276
- secondary_accent: #D4A574
- text: #2C2C2C
- text_secondary: #7F8C8D
- text_tertiary: #A0A0A0
- border: #D4A574
- grid: #E8E3DC
- success: #1E8449
- warning: #C0392B

## typography
- title_family: KaiTi, Georgia, "Microsoft YaHei", serif
- body_family: "Microsoft YaHei", "PingFang SC", Arial, sans-serif
- body: 20
- title: 36
- subtitle: 26
- annotation: 15
- cover_title: 72
- chapter_title: 48
- hero_number: 36

## icons
- library: tabler-filled
- inventory: target, flag, eye, shield, user, palette, message, tag, chart-pie, calculator, megaphone, gauge, building-store, hierarchy, road, database, repeat, arrows-move, broadcast, coin, map-pin, alert-triangle, ban, arrows-exchange, notebook, zoom-scan, books, gavel, archive, arrow-forward, users, building, trending-up, link

## page_rhythm
- P01: anchor
- P02: dense
- P03: breathing
- P04: dense
- P05: dense
- P06: dense
- P07: dense
- P08: dense
- P09: dense
- P10: breathing
- P11: breathing
- P12: dense
- P13: dense
- P14: breathing
- P15: breathing
- P16: dense
- P17: dense
- P18: dense
- P19: dense
- P20: breathing
- P21: anchor
- P22: dense
- P23: dense
- P24: dense
- P25: dense
- P26: dense
- P27: dense
- P28: dense
- P29: breathing
- P30: anchor
- P31: dense
- P32: dense
- P33: dense
- P34: dense
- P35: dense
- P36: dense
- P37: dense
- P38: breathing
- P39: anchor
- P40: dense
- P41: dense
- P42: dense
- P43: dense
- P44: dense
- P45: dense
- P46: breathing
- P47: dense
- P48: dense
- P49: dense
- P50: dense
- P51: dense
- P52: dense
- P53: anchor

## page_charts
- P05: venn_diagram
- P07: vertical_pillars
- P10: icon_grid
- P13: icon_grid
- P19: process_flow
- P22: hub_spoke
- P24: stacked_bar_chart
- P26: gauge_chart
- P28: top_down_tree
- P35: timeline
- P36: donut_chart
- P40: icon_grid
- P42: icon_grid
- P45: consulting_table
- P48: comparison_table

## forbidden
- Mixing icon libraries
- rgba()
- `<style>`, `class`, `<foreignObject>`, `textPath`, `@font-face`, `<animate*>`, `<script>`, `<iframe>`, `<symbol>`+`<use>`
- `<g opacity>` (set opacity on each child element individually)
- HTML named entities in text — write as raw Unicode; XML reserved chars escaped as `&amp; &lt; &gt; &quot; &apos;`
