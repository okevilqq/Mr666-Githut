---
type: meta
domain: inbox
created: 2026-06-17
tags: [meta, inbox]
aliases: ["收件箱", "Inbox"]
---

# 📥 收件箱

> **快速捕获一切想法、链接、引用。每周整理一次，转化为知识笔记或任务。**

---

## 使用说明

1. **捕获**: 任何时候有想法，`Cmd + N` 新建笔记，模板自动填充
2. **暂存**: 不确定归类的信息先放在这里
3. **整理**: 每周五下午花15分钟整理收件箱
   - 可归档 → 移到对应 `知识库/[领域]/`
   - 可行动 → 转为工作日志/日报中的任务
   - 可联结 → 添加到已有笔记的链接
   - 临时 → 保留或删除

---

## 快速入口

```dataview
TABLE 
  file.ctime as "创建时间",
  file.size as "大小"
FROM "知识库/收件箱"
WHERE file.name != "README"
SORT file.ctime DESC
LIMIT 20
```

---

## 关联

- [[🏠 首页]]
- [[🌱 自生长机制]]
